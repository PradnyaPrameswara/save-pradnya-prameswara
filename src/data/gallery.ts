import { existsSync } from "node:fs";
import { resolve } from "node:path";
import personal from "./personal-photo-manifest.json";
import { reference } from "./reference";

export type GalleryPhoto = { src: string; fallback?: string; alt: string; width: number; height: number };

const referenceAlts = [
  "Temporary reference photo of Walter White smiling, not a photo of Pradnya",
  "Temporary Breaking Bad reference photo of Walter White and his son",
  "Temporary Breaking Bad reference photo of Walter and a baby",
  "Temporary Breaking Bad reference photo of Walter with a family member",
  "Temporary Breaking Bad family reference photo",
  "Temporary photo of Walter White and Skyler from Breaking Bad",
  "Temporary photo portrait of Walter White from Breaking Bad",
];
const referenceDimensions: number[][] = [[402,517],[247,322],[226,301],[220,343],[362,250],[277,302],[193,266]];
const mode = import.meta.env.PUBLIC_IMAGE_MODE || "reference";
if (mode !== "reference" && mode !== "personal")
  throw new Error("PUBLIC_IMAGE_MODE must be 'reference' or 'personal'.");
export const galleryMode: "reference" | "personal" = mode;

function validatePersonalPhotos() {
  const errors: string[] = [];
  if (personal.photos.length !== 7) errors.push("Exactly seven photo slots are required.");
  const filenames = new Set<string>();
  for (const [index, photo] of personal.photos.entries()) {
    const label = "Slot " + (index + 1) + ": ";
    if (photo.slot !== index + 1) errors.push(label + "slots must be 1–7, in order.");
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*[.](webp|avif|png|jpg|jpeg)$/i.test(photo.filename)) {
      errors.push(label + "filename must be a simple image basename.");
      continue;
    }
    if (filenames.has(photo.filename)) errors.push(label + "duplicate filename.");
    filenames.add(photo.filename);
    if (!Number.isInteger(photo.width) || !Number.isInteger(photo.height) || photo.width < 50 || photo.height < 50)
      errors.push(label + "provide actual image pixel dimensions.");
    if (photo.alt.trim().length < 12 || /^(todo|placeholder)/i.test(photo.alt.trim()))
      errors.push(label + "provide a description of the actual photograph.");
    if (!["owned", "licensed", "permission"].includes(photo.rights))
      errors.push(label + "declare owned, licensed or permission rights.");
    if (photo.credit.trim().length < 3) errors.push(label + "provide a truthful source/credit.");
    if (!existsSync(resolve(process.cwd(), "public", "images", "personal", photo.filename)))
      errors.push(label + "missing local photo file " + photo.filename);
  }
  if (errors.length)
    throw new Error("Personal image mode requires seven rights-checked files.\n" + errors.join("\n"));
}
if (galleryMode === "personal") validatePersonalPhotos();

export const gallery: GalleryPhoto[] = galleryMode === "reference"
  ? referenceAlts.map((alt, index) => ({
      src: reference.photo(index + 1),
      fallback: reference.fallbackPhoto(index + 1),
      alt,
      width: referenceDimensions[index][0],
      height: referenceDimensions[index][1],
    }))
  : personal.photos.map(photo => ({
      src: "/images/personal/" + photo.filename,
      alt: photo.alt,
      width: photo.width,
      height: photo.height,
    }));

export const galleryDecorationStyle = galleryMode === "reference"
  ? "--reference-tile:url('" + reference.tile + "');--reference-bow-left:url('" + reference.bowLeft + "');--reference-bow-right:url('" + reference.bowRight + "')"
  : "--reference-tile:none;--reference-bow-left:none;--reference-bow-right:none";
