# GitHub Pages visual preview

## Preview URL

[https://pradnyaprameswara.github.io/save-pradnya-prameswara/](https://pradnyaprameswara.github.io/save-pradnya-prameswara/)

**This URL is a planned site address, not proof of a completed deployment.** Confirm the Actions run reaches a successful `Deploy public preview` step and that the URL returns a real rendered page before announcing it as live.

## One-time repository setup

GitHub → **Settings → Pages** → **Build and deployment → Source: GitHub Actions**. GitHub's source selection must be made by a repository administrator. After this is selected, the checked-in `.github/workflows/github-pages.yml` publishes on changes to `main` and can also be run from Actions → **Publish retro preview to GitHub Pages** → Run workflow.

The job builds Astro with `GITHUB_PAGES=true`, `PUBLIC_IMAGE_MODE=reference` and the repository's required `/save-pradnya-prameswara` base. Existing local dev, standard CI, Playwright and the manually gated Cloudflare personal-photo workflow remain unchanged. No domain, external deployment secret or paid provider is required.

## What this exposes

GitHub Pages makes this project preview **publicly accessible** even with `noindex, nofollow`. The seven Walter White photographs, tile and bows are still **remote, third-party, rights-unverified** references, displayed only for direct visual review of a clearly labeled fan parody. These materials must not be mistaken for photographs of Pradnya or an authorized fundraising campaign. Remove or replace them with materials you can publish before treating this as a final release.

The help button does not collect donations. The visitor count is decorative. External links remain attributed to the original inspiration and GitHub profile.

## Verify the live preview

1. Confirm the GitHub Pages workflow's build and deploy jobs finish successfully.
2. Open the Pages URL on mobile and desktop; the green background, heading, seven photos, yellow ribbons, CSS/JS and help button should render.
3. Open DevTools Network and confirm bundled assets are loaded from `/save-pradnya-prameswara/_astro/`, not `/_astro/`; the icon resolves from the project subpath.
4. Verify page meta `noindex, nofollow`, the fan-parody disclaimer, and zero real payment integration.
5. Check `/save-pradnya-prameswara/404.html` and its home link. Github Pages `404.html` support is host-managed.
6. If the workflow says Pages is not enabled, enable **Settings → Pages → Source: GitHub Actions** and rerun; the GitHub connector may not change repository Pages settings.

Do not confuse this public reference gallery with the separately gated `PUBLIC_IMAGE_MODE=personal` deployment, which still requires seven authorized owner-supplied images.
