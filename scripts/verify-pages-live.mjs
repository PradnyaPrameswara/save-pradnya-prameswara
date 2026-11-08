import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const projectPath = "/save-pradnya-prameswara/";

/**
 * Astro 7 can inline its loader and expose external JS as
 * component-url / renderer-url attributes on <astro-island>.
 * Both those references and standard src/href are genuine assets.
 */
export function collectAstroAssetPaths(html) {
  const pattern = /(?:src|href|component-url|renderer-url|before-hydration-url)="(\/save-pradnya-prameswara\/_astro\/[^"]+)"/g;
  return [...new Set(Array.from(html.matchAll(pattern), match => match[1]))];
}


function requireCondition(value, explanation) {
  if (!value) throw new Error(explanation);
}

async function read(fetcher, url) {
  const result = await fetcher(url, { cache: "no-store", redirect: "follow" });
  return { status: result.status, body: await result.text() };
}

export async function verifyPagesOnce(url, expectedBuildSha, fetcher = fetch) {
  const base = new URL(url);
  requireCondition(base.protocol === "https:", "GitHub Pages must use HTTPS.");
  requireCondition(base.pathname === projectPath, "Expected repository-scoped Pages URL ending " + projectPath);
  requireCondition(/^[0-9a-f]{40}$/.test(expectedBuildSha), "Expected full 40-character Git commit SHA.");
  const mainUrl = new URL(base.href);
  mainUrl.searchParams.set("verify-build", expectedBuildSha);
  const home = await read(fetcher, mainUrl);
  requireCondition(home.status === 200, "Homepage HTTP " + home.status);
  requireCondition(home.body.includes('name="preview-build-sha" content="' + expectedBuildSha + '"'),
    "Live GitHub Pages HTML does not yet match expected deployed commit.");
  requireCondition(home.body.includes('content="noindex, nofollow"'), "Preview must stay noindex.");
  requireCondition(home.body.includes('data-gallery-mode="reference"'), "Unexpected gallery mode on preview.");
  requireCondition(home.body.includes("no real donations or payments"), "Parody/no-donation notice missing.");
  requireCondition(home.body.includes("rights are unverified"), "Reference image rights disclosure missing.");

  const assets = collectAstroAssetPaths(home.body);
  requireCondition(assets.some(asset => asset.endsWith(".js")), "No subpath-prefixed JavaScript file found.");
  requireCondition(assets.some(asset => asset.endsWith(".css")), "No subpath-prefixed CSS file found.");
  for (const asset of assets.slice(0, 8)) {
    const response = await fetcher(new URL(asset, base.origin));
    requireCondition(response.status === 200, "Broken production asset " + asset + " (HTTP " + response.status + ")");
  }
  const icon = await fetcher(new URL(projectPath + "favicon.svg", base.origin));
  requireCondition(icon.status === 200, "Project favicon failed (HTTP " + icon.status + ")");
  const robots = await read(fetcher, new URL(projectPath + "robots.txt", base.origin));
  requireCondition(robots.status === 200 && robots.body.includes("Allow: /"), "Project robots.txt unavailable.");
  const missing = await fetcher(new URL(projectPath + "missing-page-visual-smoke-" + expectedBuildSha, base.origin));
  requireCondition(missing.status === 404, "Unknown project route must return HTTP 404 (got " + missing.status + ")");
  return { preview: base.href, commit: expectedBuildSha, assetsChecked: Math.min(assets.length, 8), http: { home: 200, favicon: 200, robots: 200, notFound: 404 } };
}

export async function verifyPagesWithRetry(url, sha, fetcher = fetch, { attempts = 8, retryDelayMs = 5000 } = {}) {
  let lastError;
  for (let count = 1; count <= attempts; count++) {
    try {
      return await verifyPagesOnce(url, sha, fetcher);
    } catch (error) {
      lastError = error;
      console.warn("Pages verification attempt " + count + "/" + attempts + ": " + String(error));
      if (count < attempts) await new Promise(resolve => setTimeout(resolve, retryDelayMs));
    }
  }
  throw lastError;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const url = process.env.DEPLOYED_PAGES_URL;
  const sha = process.env.EXPECTED_BUILD_SHA;
  if (!url || !sha) throw new Error("GitHub Pages URL and expected deployed commit SHA are required.");
  console.info(JSON.stringify(await verifyPagesWithRetry(url, sha), null, 2));
}
