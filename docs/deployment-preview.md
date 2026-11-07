# Manual build and release preview (PR #9)

This repository is **not** automatically deployed on pushes, merges or PRs. The workflow `.github/workflows/manual-preview.yml` uses only `workflow_dispatch` and offers two deliberately different operations.

## 1. Review package — safe default

After merging the PRs, open **GitHub → Actions → Manual preview package or approved Cloudflare deployment → Run workflow → package-only**. It builds `dist/` in the temporary **reference mode** and uploads an artifact, but does not publish to a website. The historical Walter White images remain temporary third-party hotlinks; the package is **not** permission to publicly host those images.

## 2. Cloudflare Pages preview — blocked until authorized

Before choosing `deploy-preview`, prepare a rights-checked **personal** gallery: seven genuine authorized photographs in `public/images/personal` with a fully completed `src/data/personal-photo-manifest.json`. The build fails for missing or incomplete photos, and the deploy preflight rejects reference mode, blank approval, unverified rights, unsafe paths and undersized files. A manifest declaration alone is **not legal proof of permission**; the owner must verify the source/consent.

Configure the repository settings for **Environment: `website-preview`** with required reviewers, to require explicit manual approval. Set secret `CLOUDFLARE_API_TOKEN` (scoped minimally for Pages edit) and `CLOUDFLARE_ACCOUNT_ID`; set repository variable `CF_PAGES_PROJECT` to a pre-created Cloudflare Pages project. Verify the Pages project's production branch is **not** any `retro-review-*` branch and disable other automatic Git integrations if required.

Then manually run `deploy-preview` and type exactly `RIGHTS_CONFIRMED`. The workflow generates a uniquely named, nonproduction branch deployment using [Cloudflare's Wrangler action](https://github.com/cloudflare/wrangler-action) and tests the **returned actual HTTPS URL** for: HTTP 200 homepage, personal gallery mode, noindex, no-donation notice, security headers, readable robots.txt and a genuine HTTP 404 for unknown routes. If any check fails, the workflow fails and the preview must not be promoted.

**No Cloudflare account, project, token, domain or deployment is configured by this PR.** This workflow does not promote a preview to production, change DNS or remove noindex. Since this repository is public, avoid committing personal photographs that are not suitable for public access; decide on an authorized asset-hosting approach before publishing them.

## Production release (not included)

Only after visual sign-off, permission evidence, working preview URL, hosting selection, real-device QA, accessibility review and explicit approval should a separate production release be considered. Domain, canonical/OG image URL and indexing remain undecided; do not guess them. The deployment should never collect payments or impersonate a medical charity.
