import { expect, test } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

test("support details close with Escape and restore focus without effects", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: /Click Here to Help/ });
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("link", { name: "Visit Pradnya on GitHub" }).focus();
  await page.keyboard.press("Escape");
  await expect(button).toBeFocused();
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("region", { name: "Ways to support Pradnya" })).toHaveCount(0);
});

test("high-contrast visitors receive readable text surfaces", async ({ page }) => {
  await page.emulateMedia({ contrast: "more" });
  await page.goto("/");
  await expect(page.locator(".intro-story")).toHaveCSS("background-color", "rgba(0, 0, 0, 0.8)");
  await expect(page.locator(".long-story")).toHaveCSS("border-top-width", "2px");
});

for (const width of [390, 1440]) {
  test(`records reproducible lab layout shift and paint observations at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => {
      const state = { cls: 0, lcpMs: null as number | null };
      (window as Window & { __retroVitals?: typeof state }).__retroVitals = state;
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const shift = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
            if (!shift.hadRecentInput) state.cls += shift.value ?? 0;
          }
        }).observe({ type: "layout-shift", buffered: true });
      } catch {
        // Unsupported browser: document the missing metric, don't invent it.
      }
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) state.lcpMs = entry.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
      } catch {
        // Unsupported browser: leave LCP null.
      }
    });

    await page.goto("/", { waitUntil: "load" });
    await page.locator(".hero-portrait img").scrollIntoViewIfNeeded();
    await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    const data = await page.evaluate(() => {
      const state = (window as Window & { __retroVitals?: { cls: number; lcpMs: number | null } }).__retroVitals;
      return {
        viewport: innerWidth,
        cls: state?.cls ?? null,
        lcpMs: state?.lcpMs ?? null,
        firstPartyScripts: performance.getEntriesByType("resource").filter((entry) =>
          entry.name.startsWith(location.origin) && entry.name.includes(".js")
        ).length,
        totalResourcesObserved: performance.getEntriesByType("resource").length,
        imageCount: document.querySelectorAll(".portrait img").length,
      };
    });
    expect(data.imageCount).toBe(7);
    expect(data.cls === null || (Number.isFinite(data.cls) && data.cls >= 0)).toBe(true);
    expect(data.lcpMs === null || (Number.isFinite(data.lcpMs) && data.lcpMs >= 0)).toBe(true);
    mkdirSync("browser-review", { recursive: true });
    writeFileSync(`browser-review/lab-vitals-${width}.json`, JSON.stringify(data, null, 2) + "\n");
  });
}
