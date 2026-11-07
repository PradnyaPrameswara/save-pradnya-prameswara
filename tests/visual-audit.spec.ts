import { expect, test } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const widths = [320, 390, 768, 1440] as const;

for (const width of widths) {
  test(`records retro visual geometry and typography at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/", { waitUntil: "load" });

    const report = await page.evaluate(() => {
      const find = (selector: string) => {
        const element = document.querySelector<HTMLElement>(selector);
        if (!element) throw new Error(`Missing visual region: ${selector}`);
        const box = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return {
          x: Math.round(box.x * 100) / 100,
          y: Math.round((box.y + window.scrollY) * 100) / 100,
          width: Math.round(box.width * 100) / 100,
          height: Math.round(box.height * 100) / 100,
          color: style.color,
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
        };
      };
      const photos = Array.from(document.querySelectorAll<HTMLImageElement>(".portrait img"));
      return {
        viewport: { width: innerWidth, height: innerHeight },
        page: find(".page-wrap"),
        title: find(".site-heading h1"),
        subtitle: find(".site-subtitle"),
        hero: find(".hero-portrait"),
        threePhotos: find(".photo-strip-three"),
        familyPhoto: find(".family-portrait"),
        story: find(".intro-story"),
        twoPhotos: find(".photo-strip-two"),
        appeal: find(".appeal"),
        banner: find(".retro-banner"),
        action: find(".donation-button"),
        meter: find(".counter-panel"),
        footer: find(".site-footer"),
        backgroundColor: getComputedStyle(document.body).backgroundColor,
        photos: photos.map((photo, index) => ({
          slot: index + 1,
          naturalRatio: photo.naturalHeight ? photo.naturalWidth / photo.naturalHeight : null,
          cssFit: getComputedStyle(photo).objectFit,
          widthHint: photo.getAttribute("width"),
          heightHint: photo.getAttribute("height"),
        })),
        horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    expect(report.page.width).toBeLessThanOrEqual(701);
    expect(report.page.x).toBeGreaterThanOrEqual(0);
    expect(report.backgroundColor).toBe("rgb(27, 161, 26)");
    expect(report.photos).toHaveLength(7);
    expect(report.photos.every((photo) => photo.cssFit === "contain")).toBe(true);
    expect(report.title.color).toBe("rgb(255, 255, 255)");
    expect(report.subtitle.color).toBe("rgb(255, 255, 0)");
    expect(report.horizontalOverflow).toBeLessThanOrEqual(1);
    expect(report.banner.y).toBeGreaterThan(report.appeal.y);
    expect(report.action.y).toBeGreaterThan(report.banner.y);
    expect(report.meter.y).toBeGreaterThan(report.action.y);

    mkdirSync("browser-review", { recursive: true });
    writeFileSync(`browser-review/visual-audit-${width}.json`, JSON.stringify(report, null, 2) + "\n");
  });
}
