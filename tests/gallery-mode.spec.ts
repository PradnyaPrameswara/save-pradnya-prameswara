import { expect, test } from "@playwright/test";

test("the reference gallery remains the default and retains all seven originals", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toHaveAttribute("data-gallery-mode", "reference");
  const imgs = page.locator(".portrait img");
  await expect(imgs).toHaveCount(7);
  for (const photo of await imgs.all()) {
    await expect(photo).toHaveAttribute("src", /raw[.]githubusercontent[.]com/);
    await expect(photo).toHaveAttribute("data-fallback-src", /cdn[.]jsdelivr[.]net/);
    await expect(photo).toHaveAttribute("alt", /Walter|Breaking Bad/);
  }
  await expect(page.locator(".reference-note")).toContainText("temporary Walter White");
});
