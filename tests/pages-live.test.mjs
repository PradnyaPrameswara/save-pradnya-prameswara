import { test } from "node:test";
import { strict as assert } from "node:assert";
import { verifyPagesOnce } from "../scripts/verify-pages-live.mjs";

const sha = "a".repeat(40);
const url = "https://example.github.io/save-pradnya-prameswara/";
const prefix = "/save-pradnya-prameswara";
const html = '<html><head><meta name="preview-build-sha" content="' + sha + '"><meta content="noindex, nofollow"><link href="' + prefix + '/_astro/main.css"></head><body data-gallery-mode="reference"><script src="' + prefix + '/_astro/main.js"></script><p>no real donations or payments; reference image rights are unverified</p></body></html>';

function mockFetch(input) {
  const path = new URL(String(input)).pathname;
  if (path === prefix + "/") return Promise.resolve(new Response(html, { status: 200 }));
  if (path === prefix + "/robots.txt") return Promise.resolve(new Response("User-agent: *\nAllow: /\n"));
  if (path.startsWith(prefix + "/missing-page-")) return Promise.resolve(new Response("Not found", { status: 404 }));
  if ([prefix + "/favicon.svg", prefix + "/_astro/main.css", prefix + "/_astro/main.js"].includes(path))
    return Promise.resolve(new Response("asset", { status: 200 }));
  return Promise.resolve(new Response("missing", { status: 404 }));
}

test("GitHub Pages smoke verifier accepts a deployed, revision-matched project", async () => {
  const report = await verifyPagesOnce(url, sha, mockFetch);
  assert.equal(report.commit, sha);
  assert.equal(report.assetsChecked, 2);
  assert.equal(report.http.notFound, 404);
});

test("stale deployment build SHA is not accepted", async () => {
  await assert.rejects(verifyPagesOnce(url, "b".repeat(40), mockFetch), /does not yet match/);
});

test("unscoped root deployment path is rejected", async () => {
  await assert.rejects(verifyPagesOnce("https://example.github.io/", sha, mockFetch), /repository-scoped/);
});

test("a missing CSS asset fails the live verification", async () => {
  const broken = (input, init) => {
    if (String(input).includes("_astro/main.css")) return Promise.resolve(new Response("missing", { status: 404 }));
    return mockFetch(input, init);
  };
  await assert.rejects(verifyPagesOnce(url, sha, broken), /Broken production asset/);
});

test("an unknown route must report actual HTTP 404", async () => {
  const bad404 = (input, init) => {
    if (String(input).includes("/missing-page-")) return Promise.resolve(new Response("200 fallback", { status: 200 }));
    return mockFetch(input, init);
  };
  await assert.rejects(verifyPagesOnce(url, sha, bad404), /HTTP 404/);
});
