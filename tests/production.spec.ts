import { expect, test } from "@playwright/test";

test("public landing page has truthful social metadata and remains noindex", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Save Pradnya Prameswara/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Save Pradnya/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary");
  await expect(page.getByText(/no real donations or payments/i)).toBeVisible();
  expect(await page.locator("script[src*='analytics'], script[src*='pixel']").count()).toBe(0);
});

test("404 document offers an accessible retro path back home", async ({ page }) => {
  await page.goto("/404.html");
  await expect(page.getByRole("heading", { name: "404!" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Take me back home!/ })).toHaveAttribute("href", "/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  await page.getByRole("link", { name: /Take me back home!/ }).click();
  await expect(page.getByRole("heading", { name: "Pradnya Prameswara", exact: true })).toBeVisible();
});

test("robots file permits reading the page-level noindex directive", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  const text = await response.text();
  expect(text).toContain("User-agent: *");
  expect(text).toContain("Allow: /");
  expect(text).not.toContain("Disallow: /");
});

test("external profile links are non-payment links and safe to open", async ({ page }) => {
  await page.goto("/");
  const links = page.locator('a[target="_blank"]');
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute("rel", /noopener/);
    await expect(link).toHaveAttribute("rel", /noreferrer/);
  }
  await expect(page.locator("input[type='card'], form[action*='checkout'], form[action*='donate']")).toHaveCount(0);
});
