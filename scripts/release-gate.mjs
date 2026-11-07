import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const imageName = /^[a-zA-Z0-9][a-zA-Z0-9._-]*[.](webp|avif|png|jpg|jpeg)$/i;

export function evaluateReleaseGate({ mode, approval, manifest, isValidFile }) {
  const errors = [];
  if (mode !== "personal") errors.push("Preview deployment requires PUBLIC_IMAGE_MODE=personal.");
  if (approval !== "RIGHTS_CONFIRMED") errors.push("Type RIGHTS_CONFIRMED in the manual workflow approval input.");
  const photos = manifest?.photos;
  if (!Array.isArray(photos) || photos.length !== 7) {
    errors.push("Exactly seven reviewed personal image records are required.");
    return errors;
  }
  const names = new Set();
  for (const [index, photo] of photos.entries()) {
    const label = "Slot " + (index + 1) + ": ";
    if (photo.slot !== index + 1) errors.push(label + "incorrect slot index.");
    if (!imageName.test(photo.filename)) {
      errors.push(label + "unsafe or invalid filename.");
      continue;
    }
    if (names.has(photo.filename)) errors.push(label + "duplicate image filename.");
    names.add(photo.filename);
    if (!Number.isInteger(photo.width) || !Number.isInteger(photo.height) || photo.width < 50 || photo.height < 50)
      errors.push(label + "invalid pixel dimensions.");
    if (typeof photo.alt !== "string" || photo.alt.trim().length < 12 || /^(todo|placeholder)/i.test(photo.alt.trim()))
      errors.push(label + "actual descriptive alt text required.");
    if (!["owned", "licensed", "permission"].includes(photo.rights))
      errors.push(label + "declare an authorized rights category.");
    if (typeof photo.credit !== "string" || photo.credit.trim().length < 3)
      errors.push(label + "source/credit required.");
    if (!isValidFile(photo.filename)) errors.push(label + "image file missing or too small.");
  }
  return errors;
}

function isValidLocalFile(filename) {
  const path = resolve(process.cwd(), "public", "images", "personal", filename);
  return existsSync(path) && statSync(path).isFile() && statSync(path).size > 100;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const manifest = JSON.parse(readFileSync(resolve("src/data/personal-photo-manifest.json"), "utf8"));
  const errors = evaluateReleaseGate({
    mode: process.env.PUBLIC_IMAGE_MODE || "reference",
    approval: process.env.RIGHTS_CONFIRMATION || "",
    manifest,
    isValidFile: isValidLocalFile,
  });
  if (errors.length) {
    console.error("Release blocked:\n" + errors.map(error => "- " + error).join("\n"));
    process.exitCode = 1;
  } else {
    console.info("Personal-image preflight passed. Verify actual permissions and Cloudflare environment approval before deploying.");
  }
}
