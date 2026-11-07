import { expect, test } from "@playwright/test";

test("retro photo frames use source-inspired individual slot widths on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const expectedWidths = [350, 190, 184, 190, 350, 270, 270];
  for (const [index, width] of expectedWidths.entries()) {
    const figure = page.locator(`.portrait--${index + 1}`);
    const bounds = await figure.boundingBox();
    expect(bounds, `slot ${index + 1} must render`).not.toBeNull();
    expect(bounds!.width, `photo slot ${index + 1}`).toBeGreaterThanOrEqual(width - 2);
    expect(bounds!.width, `photo slot ${index + 1}`).toBeLessThanOrEqual(width + 2);
    await expect(figure).toHaveCSS("border-top-color", "rgb(121, 46, 87)");
    await expect(figure.locator("img")).toHaveCSS("border-top-width", "0px");
    await expect(figure.locator("img")).toHaveCSS("object-fit", "contain");
  }
  const title = page.locator(".retro-banner h2");
  await expect(title).toHaveCSS("font-style", "italic");
  await expect(title).toHaveCSS("font-family", /Arial/);
  await expect(title).toHaveCSS("color", "rgb(197, 188, 97)");
  await expect(title).toHaveCSS("text-decoration-line", "none");
  const wordmark = page.locator(".retro-banner__wordmark");
  await expect(wordmark).toHaveCount(1);
  const underline = await wordmark.evaluate(el => {
    const style = getComputedStyle(el, "::after");
    const rect = el.getBoundingClientRect();
    return { content: style.content, height: style.height, background: style.backgroundColor, wordmarkWidth: rect.width };
  });
  expect(underline.content).toBe('""');
  expect(underline.height).toBe("4px");
  expect(underline.background).toBe("rgb(200, 193, 110)");
  expect(underline.wordmarkWidth).toBeGreaterThan(510);
  expect(underline.wordmarkWidth).toBeLessThan(700);
  const banner = await title.boundingBox();
  expect(banner!.height).toBeLessThan(63);
});

for (const width of [320, 390, 768, 1440]) {
  test(`photo frames and banner remain inside ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const boxes = await page.locator(".portrait, .retro-banner, .retro-banner__wordmark").evaluateAll(elements =>
      elements.map(el => {
        const rect = el.getBoundingClientRect();
        return { left: rect.left, right: rect.right, width: rect.width };
      })
    );
    for (const [index, box] of boxes.entries()) {
      expect(box.left, `element ${index} left at ${width}px`).toBeGreaterThanOrEqual(-1);
      expect(box.right, `element ${index} right at ${width}px`).toBeLessThanOrEqual(width + 1);
      expect(box.width).toBeGreaterThan(0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await expect(page.getByText(/no real donations or payments/i)).toBeVisible();
  });
}
