import { expect, test } from "@playwright/test";

test("desktop photo rows retain their intentional centered reference geometry", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const geometry = await page.evaluate(() => {
    const rect = (selector: string) => {
      const box = document.querySelector(selector)!.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, right: box.right };
    };
    return {
      page: rect(".page-wrap"),
      three: rect(".photo-strip-three"),
      two: rect(".photo-strip-two"),
      firstLower: rect(".portrait--6"),
      lastLower: rect(".portrait--7"),
      topSlots: [2,3,4].map(index => rect(".portrait--" + index)),
      title: rect(".retro-banner h2"),
      wordmark: rect(".retro-banner__wordmark"),
    };
  });
  const center = (box: {x: number; width: number}) => box.x + box.width / 2;
  expect(Math.abs(center(geometry.page) - center(geometry.three))).toBeLessThan(1);
  expect(Math.abs(center(geometry.page) - center(geometry.two))).toBeLessThan(1);
  expect(geometry.two.width).toBeGreaterThanOrEqual(603);
  expect(geometry.two.width).toBeLessThanOrEqual(605);
  expect(geometry.three.width).toBeGreaterThanOrEqual(603);
  expect(geometry.three.width).toBeLessThanOrEqual(605);
  expect(geometry.firstLower.width).toBeGreaterThanOrEqual(269);
  expect(geometry.firstLower.width).toBeLessThanOrEqual(271);
  expect(geometry.lastLower.width).toBeGreaterThanOrEqual(269);
  expect(geometry.lastLower.width).toBeLessThanOrEqual(271);
  expect(geometry.firstLower.x).toBeGreaterThanOrEqual(geometry.two.x);
  expect(geometry.lastLower.right).toBeLessThanOrEqual(geometry.two.right + 1);
  expect(Math.abs(geometry.topSlots[0].y - geometry.topSlots[1].y)).toBeLessThan(1);
  expect(Math.abs(geometry.topSlots[1].y - geometry.topSlots[2].y)).toBeLessThan(1);
  expect(geometry.wordmark.width).toBeLessThanOrEqual(geometry.page.width);
  await expect(page.locator(".retro-banner__wordmark")).toHaveCSS("overflow-wrap", "anywhere");
  await expect(page.locator(".retro-banner h2")).toHaveCSS("text-wrap", "balance");
});

for (const width of [320, 390, 768, 1440]) {
  test(`gold underline and both framed photo rows remain inside ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const data = await page.evaluate(() => {
      const selectors = [".photo-strip-three", ".photo-strip-two", ".retro-banner__wordmark"];
      return selectors.map(selector => {
        const element = document.querySelector(selector)!;
        const rect = element.getBoundingClientRect();
        const pseudo = selector.includes("wordmark") ? getComputedStyle(element, "::after") : null;
        return { selector, x: rect.x, right: rect.right, width: rect.width, underline: pseudo?.height };
      });
    });
    for (const part of data) {
      expect(part.x, part.selector).toBeGreaterThanOrEqual(-1);
      expect(part.right, part.selector).toBeLessThanOrEqual(width + 1);
      expect(part.width).toBeGreaterThan(0);
    }
    expect(data[2].underline).toBe("4px");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
}
