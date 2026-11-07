import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

export async function checkDeployment(deploymentUrl, fetcher = fetch) {
  const base = new URL(deploymentUrl);
  if (base.protocol !== "https:") throw new Error("Deployment preview must use HTTPS.");
  const root = await fetcher(new URL("/", base));
  const home = await root.text();
  if (root.status !== 200) throw new Error("Homepage returned HTTP " + root.status);
  if (!home.includes('data-gallery-mode="personal"')) throw new Error("Deployed HTML is not in the approved personal-image mode.");
  if (!home.includes('name="robots" content="noindex, nofollow"')) throw new Error("Preview must retain noindex.");
  if (!home.includes("no real donations or payments")) throw new Error("Parody/no-donation disclosure missing.");
  if (home.includes("raw.githubusercontent.com/matiasroj0/save-walter-white")) throw new Error("External reference photo host leaked into personal preview.");
  const security = root.headers.get("x-content-type-options");
  if (security !== "nosniff") throw new Error("Missing expected Cloudflare Pages security header.");
  const robot = await fetcher(new URL("/robots.txt", base));
  if (robot.status !== 200 || !(await robot.text()).includes("Allow: /")) throw new Error("robots.txt failed.");
  const notFound = await fetcher(new URL("/retro-preview-check-missing-" + Date.now(), base));
  if (notFound.status !== 404) throw new Error("Unknown route must return HTTP 404; got " + notFound.status);
  return { origin: base.origin, homepage: root.status, robots: robot.status, unknownRoute: notFound.status };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const url = process.env.DEPLOYMENT_URL || process.argv[2];
  if (!url) throw new Error("Provide the exact preview deployment URL.");
  console.info(JSON.stringify(await checkDeployment(url), null, 2));
}
