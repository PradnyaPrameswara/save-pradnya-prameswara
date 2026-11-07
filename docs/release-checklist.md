# Production-readiness review

## What the repository now covers

- Static Astro build with a committed `pnpm-lock.yaml`, Node 22 and pnpm 12.14.
- Responsive webpage, vintage custom `404.html`, a correct `robots.txt` for page-level `noindex`, and meaningful page/social descriptions.
- Browser checks for the homepage, 404 document, noindex, robot file, external-link safety, accessible support button, viewport overflow, temporary image presence and graceful image failure.
- Security-related response headers in `public/_headers`. **Only hosts supporting the Cloudflare Pages `_headers` format will use this file**; other hosts need equivalent config.
- GitHub Actions uploads responsive screenshot review artifacts. CI passing is not a guarantee of pixel identity or production hosting behavior.

## Before deploying (manual and required)

1. Resolve the rights to the seven Breaking Bad photographic stills and decorative backgrounds. Existing sources are third-party **temporary** hotlinks; public accessibility does not mean re-use rights. Replace them with owned or appropriately licensed photos before wider/commercial publication.
2. Review the screenshots of 320, 390, 768 and 1440px from the latest CI artifact. Check the original reference by eye. A number of design differences are deliberate because the name and story differ.
3. Confirm the content is a parody with no medical/fundraising claim, no donation processor, no data capture, and working GitHub links.
4. Verify the actual hosting domain and preferred platform. Do not claim a deployed website merely because the static build passed CI.
5. Configure DNS, SSL, and a hosting-specific 404 response. A `dist/404.html` file is generated, but **the host** must serve it with status HTTP 404 for unknown routes. Test the real URL.
6. Run `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm build`, `pnpm check`, `pnpm test:e2e`. Add real-device, responsive screenshot, keyboard and screen-reader checks appropriate to the release.
7. Do not remove the `noindex, nofollow` tag unless the owner expressly decides to index a rights-cleared public parody. `robots.txt` allows crawling specifically so bots can read the `noindex` directive.
8. After the owner specifies the canonical domain and an owned share image, add and validate those exact absolute metadata URLs.

## Optional Cloudflare Pages setup

For a static Astro project: build command `pnpm install --frozen-lockfile && pnpm build`, output directory `dist`, Node runtime `22`, pnpm version `12.14.0` where supported. Connect the repository manually after checking rights and the final PR. Cloudflare Pages will recognize `public/_headers`, but deployment and production verification remain separate tasks. No API tokens, deployment credentials or real payment configuration are included.

## Optional gated deployment workflow

See [manual preview and approved Cloudflare deployment](deployment-preview.md). The default GitHub workflow creates an artifact only. It will not deploy automatically when a PR is merged. The Cloudflare option is deliberately blocked until user photographs, the complete rights manifest, an explicit approval phrase and credentials are supplied, and the `website-preview` environment is configured by the repository owner. CI validates the logical gate via `node --test tests/release-gate.test.mjs`.

## GitHub Pages public visual preview

The [GitHub Pages preview workflow](github-pages-preview.md) builds reference mode with project-scoped Astro assets on every push to `main`, once enabled under Settings → Pages → Source: GitHub Actions. This is publicly accessible and `noindex` does not make it private. It is for visual review only; temporary film stills have unverified rights and must be replaced/cleared before a final public release. The Cloudflare manual `personal`-only release gate remains separate and unchanged.
