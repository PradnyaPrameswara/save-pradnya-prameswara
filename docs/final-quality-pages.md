# Final quality and GitHub Pages verification (PR #14)

The core user-facing goal is a stable retro visual tribute, not a payment application. PR #14 adds concrete regression checks for the **existing** website instead of broad refactoring.

## Checks performed automatically

- Playwright tests at 320, 390, 768 and 1440px open/close the help panel, check Escape/focus recovery, overflow, and uncaught runtime errors. They also check internal anchor destinations, photo count, noindex and the absence of a real donation mechanism.
- After the GitHub Pages production-subpath build, CI records actual bundled JavaScript/CSS bytes and gzip estimates in `browser-review/production-asset-audit.json`. This is a static transfer-size proxy, **not** a network waterfall or a Lighthouse performance score.
- The public GitHub Pages deployment workflow emits `<meta name="preview-build-sha">` with the **actual commit SHA** and only reports success after its smoke test checks the returned HTTPS URL, current commit, page meta/disclaimers, representative CSS/JS/favicon HTTP 200 responses, `robots.txt`, and a genuine 404 for a nonexistent project path. It retries briefly if GitHub's CDN is propagating.
- Pure Node tests validate the live-verification logic without making GitHub Pages network requests in a PR CI job.

## Lighthouse audit (manual, reproducible)

Run **Actions → Manual Lighthouse browser audit → Run workflow** on the merged repository. It runs pinned Lighthouse CLI 13.6.0 under headless Chrome on the **local production build** and uploads HTML + JSON reports. It is intentionally separate from the fast default CI and cannot be described as executed unless that GitHub Actions job actually runs successfully. Lighthouse scores depend on CI hardware, browser, external font/photo hosts and network variability; they are not real-user metrics.

## Checks still requiring direct review

- Real-device and assistive-technology testing, including screen readers.
- Reviewing CI screenshots against the actual live Save Walter White site; a percentage similarity has not been measured.
- Rightful ownership or permission for seven film photos and decorative assets: the publicly hosted reference preview retains the `noindex` notice but is **not private**.
- After merging PRs #12–#14, inspect the GitHub Pages deploy job's smoke result before calling the new commit live. The site should continue to refuse real donations.
