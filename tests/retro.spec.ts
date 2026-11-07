import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";

const widths = [320, 360, 375, 390, 430, 560, 768, 1024, 1280, 1440];

for (const width of widths) {
  test(`original-inspired layout fits ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Pradnya Prameswara", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Save Pradnya/ })).toBeVisible();
    expect(await page.locator("img[src*='walter_']").count()).toBe(7);
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, `horizontal scroll overflow at ${width}px`).toBeLessThanOrEqual(1);
  });
}

test("support button is honest and does not initiate payment", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /Click Here to Help/ });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("region", { name: "Ways to support Pradnya" })).toBeVisible();
  await expect(page.getByText("No money is being collected!")).toBeVisible();
  await expect(page.getByRole("link", { name: "Visit Pradnya on GitHub" })).toHaveAttribute("href", "https://github.com/PradnyaPrameswara");
});

test("noindex prevents a parody site being mistaken for a real fundraiser", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  await expect(page.getByText(/not a live statistic/i)).toBeVisible();
});

test("captures desktop and mobile screenshots with the original reference photos", async ({ page }) => {
  mkdirSync("browser-review", { recursive: true });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/", { waitUntil: "load" });

    const images = page.locator(".portrait img");
    for (const img of await images.all()) {
      await img.scrollIntoViewIfNeeded();
    }

    const hero = page.locator(".hero-portrait img");
    await expect.poll(() =>
      hero.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0),
      { timeout: 15_000 }
    ).toBe(true);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `browser-review/home-${width}.png`, fullPage: true });
  }
});


test("reference-inspired desktop composition stays narrow and centered", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const bounds = await page.locator(".page-wrap").boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.width).toBeGreaterThanOrEqual(698);
  expect(bounds!.width).toBeLessThanOrEqual(702);
  expect(Math.abs(bounds!.x - (1440 - bounds!.width) / 2)).toBeLessThan(2);
  await expect(page.locator(".site-heading h1")).toHaveCSS("font-family", /Times New Roman/);
  await expect(page.locator(".story-lead")).toHaveCSS("color", "rgb(255, 255, 0)");
  const banner = await page.locator(".retro-banner h2").boundingBox();
  expect(banner).not.toBeNull();
  expect(banner!.height, "banner title must fit on one line at desktop width").toBeLessThan(63);
});

test("reference photos preserve their original uncropped aspect ratios", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const hero = page.locator(".hero-portrait img");
  await expect.poll(() => hero.evaluate((el: HTMLImageElement) => el.complete && el.naturalHeight > 0)).toBe(true);
  const { naturalRatio, renderedRatio } = await hero.evaluate((el: HTMLImageElement) => {
    const border = parseFloat(getComputedStyle(el).borderTopWidth) * 2;
    return { naturalRatio: el.naturalWidth / el.naturalHeight, renderedRatio: (el.clientWidth - border) / (el.clientHeight - border) };
  });
  expect(Math.abs(naturalRatio - renderedRatio)).toBeLessThan(0.04);
});


test("mobile support panel stays usable without clipping at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  const button = page.getByRole("button", { name: /Click Here to Help/ });
  await button.click();
  const panel = page.getByRole("region", { name: "Ways to support Pradnya" });
  await expect(panel).toBeVisible();
  const bounds = await panel.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test("keyboard navigation reaches the skip link and support CTA", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.getByRole("button", { name: /Click Here to Help/ }).focus();
  await expect(page.getByRole("button", { name: /Click Here to Help/ })).toBeFocused();
});

test("reduced-motion preference suppresses button shift", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  const button = page.getByRole("button", { name: /Click Here to Help/ });
  await expect(button).toHaveCSS("transform", "none");
});


test("the seven temporary reference photos stay pinned to one upstream revision", async ({ page }) => {
  await page.goto("/");
  const images = page.locator(".portrait img");
  await expect(images).toHaveCount(7);
  const sources = await images.evaluateAll((elements) =>
    elements.map((image) => ({
      src: (image as HTMLImageElement).getAttribute("src") || "",
      fallback: (image as HTMLImageElement).dataset.fallbackSrc || "",
      alt: (image as HTMLImageElement).alt,
      loading: (image as HTMLImageElement).loading,
    }))
  );
  for (const image of sources) {
    expect(image.src).toContain("508d0aea07fb3dee18f8dda23ee93e6b5e3a2a3f");
    expect(image.fallback).toContain("508d0aea07fb3dee18f8dda23ee93e6b5e3a2a3f");
    expect(image.alt).toMatch(/Walter|Breaking Bad/i);
  }
  await expect(page.locator('link[rel="preload"][as="image"]')).toHaveAttribute("href", /walter_1\.jpg$/);
});

test("failed remote reference images use a visible truthful placeholder", async ({ page }) => {
  await page.route(/walter_1\.jpg(?:\?.*)?$/, (route) => route.abort());
  await page.goto("/");
  const hero = page.locator(".hero-portrait");
  await expect(hero.locator("img")).toHaveAttribute("data-reference-state", "unavailable");
  await expect(hero).toHaveClass(/reference-unavailable/);
  await expect(hero.locator("img")).toHaveAttribute("alt", /unavailable/i);
});

test("reference images do not introduce unrelated tracking or donations", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("form[action*='payment'], iframe[src*='payment']")).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
});

test("logs natural dimensions of the same seven reference photo slots", async ({ page }) => {
  await page.goto("/");
  const images = page.locator(".portrait img");
  for (const image of await images.all()) await image.scrollIntoViewIfNeeded();
  const values = await images.evaluateAll((elements) =>
    elements.map((element, index) => ({
      slot: index + 1,
      naturalWidth: (element as HTMLImageElement).naturalWidth,
      naturalHeight: (element as HTMLImageElement).naturalHeight,
    }))
  );
  console.info("TEMPORARY_REFERENCE_IMAGE_DIMENSIONS", JSON.stringify(values));
  expect(values).toHaveLength(7);
});
