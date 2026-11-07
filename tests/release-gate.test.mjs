import { test } from "node:test";
import { strict as assert } from "node:assert";
import { evaluateReleaseGate } from "../scripts/release-gate.mjs";

const valid = { photos: Array.from({ length: 7 }, (_, i) => ({
  slot: i + 1,
  filename: "photo-" + (i + 1) + ".webp",
  width: 480,
  height: 640,
  alt: "Owner supplied photograph for gallery position " + (i + 1),
  rights: "owned",
  credit: "Photographer with publication permission",
})) };
const ready = { mode: "personal", approval: "RIGHTS_CONFIRMED", manifest: valid, isValidFile: () => true };

test("a complete authorized personal preview manifest clears the logical gate", () => {
  assert.deepEqual(evaluateReleaseGate(ready), []);
});

test("reference photographs are never authorized for deployment by an approval phrase", () => {
  assert.ok(evaluateReleaseGate({ ...ready, mode: "reference" }).some(s => s.includes("personal")));
});

test("missing explicit approval prevents a deploy", () => {
  assert.ok(evaluateReleaseGate({ ...ready, approval: "" }).some(s => s.includes("RIGHTS_CONFIRMED")));
});

test("pending image rights or missing photos block the deploy", () => {
  const broken = { photos: valid.photos.map(x => ({ ...x })) };
  broken.photos[2].rights = "pending";
  assert.ok(evaluateReleaseGate({ ...ready, manifest: broken, isValidFile: () => false }).length >= 7);
});

test("a traversal filename cannot pass the gate", () => {
  const broken = { photos: valid.photos.map(x => ({ ...x })) };
  broken.photos[0].filename = "../photo.webp";
  assert.ok(evaluateReleaseGate({ ...ready, manifest: broken }).some(s => s.includes("unsafe")));
});
