import { existsSync, readFileSync, readdirSync } from "node:fs";
import { strict as assert } from "node:assert";
import { resolve } from "node:path";

const base = "/save-pradnya-prameswara";
const dist = resolve("dist");
const home = readFileSync(resolve(dist, "index.html"), "utf8");
const notFound = readFileSync(resolve(dist, "404.html"), "utf8");

assert.ok(existsSync(resolve(dist, "favicon.svg")), "Favicon not generated");
assert.ok(existsSync(resolve(dist, "robots.txt")), "Robots file not generated");
assert.ok(existsSync(resolve(dist, "_astro")), "Astro asset directory missing");
assert.ok(readdirSync(resolve(dist, "_astro")).length > 0, "No Astro CSS/JS artifacts generated");

for (const [name, html] of [["home", home], ["404", notFound]]) {
  assert.ok(html.includes(base + "/favicon.svg"), name + " icon must use repository subpath");
  assert.ok(html.includes('content="noindex, nofollow"'), name + " must stay noindex");
  assert.ok(!/(?:src|href)=["']\/_astro\//.test(html), name + " contains root-relative Astro assets");
  assert.ok(!/(?:src|href)=["']\/favicon.svg/.test(html), name + " contains root-relative favicon");
}

assert.match(notFound, /href="\/save-pradnya-prameswara\/"/, "404 home link must stay in project");
assert.ok(home.includes('data-gallery-mode="reference"'), "Preview must clearly use temporary photo references");
assert.ok(home.includes("no real donations or payments"), "Preview cannot imply real payments");
assert.ok(home.includes("Walter White"), "Preview must disclose temporary reference images");
assert.ok(/(?:src|href)=["']\/save-pradnya-prameswara\/_astro\//.test(home), "Astro assets must be URL-prefixed");

console.info("GitHub Pages project-path build verified: " + base + "/");
