import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// The project-scoped GitHub Pages URL needs a subpath only in Pages builds.
// Local development and existing Playwright tests intentionally stay at "/".
// Do not enable this for custom-domain deployment without revisiting the base.
const githubPagesBuild = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  ...(githubPagesBuild
    ? {
        site: "https://pradnyaprameswara.github.io",
        base: "/save-pradnya-prameswara",
      }
    : {}),
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
