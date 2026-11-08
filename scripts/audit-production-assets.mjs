import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";

const dir = resolve("dist", "_astro");
if (!existsSync(dir)) throw new Error("Build is missing dist/_astro.");
const assets = readdirSync(dir)
  .filter(name => /[.](js|css)$/.test(name))
  .map(name => {
    const path = resolve(dir, name);
    const bytes = readFileSync(path);
    return { name, type: name.endsWith(".js") ? "js" : "css", bytes: statSync(path).size, gzipBytes: gzipSync(bytes).byteLength };
  })
  .sort((a,b) => b.gzipBytes - a.gzipBytes);
if (!assets.some(a => a.type === "css") || !assets.some(a => a.type === "js"))
  throw new Error("Missing bundled CSS or JS; cannot verify Astro/React preview output.");
const report = {
  note: "Generated build-file measurements; not a Lighthouse score, network transfer measure or real-user Core Web Vitals.",
  assetCount: assets.length,
  totalBytes: assets.reduce((sum,a) => sum + a.bytes, 0),
  totalGzipBytes: assets.reduce((sum,a) => sum + a.gzipBytes, 0),
  assets,
};
mkdirSync("browser-review", { recursive: true });
writeFileSync("browser-review/production-asset-audit.json", JSON.stringify(report, null, 2) + "\n");
console.info("Built JS/CSS assets: " + report.assetCount + "; total gzip bytes: " + report.totalGzipBytes);
