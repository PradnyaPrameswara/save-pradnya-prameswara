import { expect, test } from "@playwright/test";

for (const width of [320, 390, 768, 1440]) {
  test(`all interactive states remain inside the viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/", { waitUntil: "load" });
    const support = page.getByRole("button", { name: /Click Here to Help/ });
    await support.click();
    await expect(support).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("region", { name: "Ways to support Pradnya" })).toBeVisible();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(width + 1);
    await page.getByRole("link", { name: "Visit Pradnya on GitHub" }).focus();
    await page.keyboard.press("Escape");
    await expect(support).toBeFocused();
    await expect(support).toHaveAttribute("aria-expanded", "false");
    expect(errors, "No uncaught client runtime errors").toEqual([]);
  });
}

test("visible page links, semantics and preview guardrails stay valid", async ({ page }) => {
  await page.goto("/");
  const links = page.locator("a[href]");
  for (const link of await links.all()) {
    const href = await link.getAttribute("href");
    expect(href).not.toBe("");
    if (href?.startsWith("#")) {
      const targetId = href.slice(1);
      expect(await page.locator('[id="' + targetId + '"]').count()).toBe(1);
    }
  }
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  await expect(page.locator(".portrait img")).toHaveCount(7);
  await expect(page.locator("body")).toHaveAttribute("data-gallery-mode", "reference");
  await expect(page.getByText(/no real donations or payments/i)).toBeVisible();
  await expect(page.locator("form[action*='payment'], iframe[src*='payment']")).toHaveCount(0);
});
