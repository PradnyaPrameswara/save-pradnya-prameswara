import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";

const widths = [375, 390, 430, 768, 1280, 1440];

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
  for (const width of [390, 1440]) {
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
