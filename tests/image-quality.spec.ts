import { expect, test } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const intrinsic = [[402,517],[247,322],[226,301],[220,343],[362,250],[277,302],[193,266]];

test("hero is eager and subsequent photographs remain lazy with honest alt text", async ({ page }) => {
  await page.goto("/");
  const photos = page.locator(".portrait img");
  await expect(photos).toHaveCount(7);
  await expect(photos.first()).toHaveAttribute("loading", "eager");
  await expect(photos.first()).toHaveAttribute("fetchpriority", "high");
  for (const photo of (await photos.all()).slice(1)) {
    await expect(photo).toHaveAttribute("loading", "lazy");
    await expect(photo).toHaveAttribute("decoding", "async");
  }
  await expect(page.locator("body")).toHaveAttribute("data-gallery-mode", "reference");
  await expect(page.locator(".reference-note")).toContainText("rights are unverified");
});

test("secondary host restores the same reference slot after primary failure", async ({ page }) => {
  await page.route(/walter_1[.]jpg$/, async (route) => {
    if (route.request().url().includes("raw.githubusercontent.com")) {
      await route.abort();
      return;
    }
    // Deterministic generated pixels prove the fallback mechanism, not
    // access to, licensing of, or quality of the actual TV photograph.
    await route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="402" height="517"><rect width="402" height="517" fill="#786f30"/></svg>',
    });
  });
  await page.goto("/");
  const hero = page.locator(".hero-portrait img");
  await expect(hero).toHaveAttribute("data-reference-state", "recovered");
  await expect(hero).toHaveJSProperty("naturalWidth", 402);
  await expect(page.locator(".hero-portrait")).not.toHaveClass(/reference-unavailable/);
  await expect(hero).toHaveAttribute("alt", /Walter White smiling/);
});

test("all photo slots record their true upscaling and uncropped rendering", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const photos = page.locator(".portrait img");
  for (const photo of await photos.all()) await photo.scrollIntoViewIfNeeded();
  await expect.poll(() => photos.evaluateAll(images =>
    images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)
  )).toBe(true);
  const audit = await photos.evaluateAll(images => images.map((element, index) => {
    const img = element as HTMLImageElement;
    const style = getComputedStyle(img);
    return {
      slot: index + 1,
      natural: [img.naturalWidth, img.naturalHeight],
      rendered: [img.clientWidth, img.clientHeight],
      upscale: Number((img.clientWidth / img.naturalWidth).toFixed(3)),
      objectFit: style.objectFit,
    };
  }));
  expect(audit).toHaveLength(7);
  for (const [index, item] of audit.entries()) {
    expect(item.natural).toEqual(intrinsic[index]);
    expect(item.objectFit).toBe("contain");
    expect(item.upscale).toBeGreaterThan(0);
    const [width,height] = item.natural;
    const [renderedWidth,renderedHeight] = item.rendered;
    expect(Math.abs(renderedWidth / renderedHeight - width / height)).toBeLessThan(0.04);
  }
  mkdirSync("browser-review", { recursive: true });
  writeFileSync("browser-review/image-quality-audit.json", JSON.stringify(audit, null, 2) + "\n");
});
