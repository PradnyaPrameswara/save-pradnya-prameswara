# Save Pradnya Prameswara

An intentionally old-fashioned, green-and-yellow, single-page parody website based on the look and structure of the fictional **Save Walter White** fundraising website from *Breaking Bad*. This is an independent fan-style homage, **not a real fundraiser**.

## Technology

- **Astro 7** for static document rendering, semantic content, and routing
- **TypeScript** for project data and the interactive island
- **React 19** for the small interactive support button only
- **Tailwind CSS 4** installed for project styling, with intentional custom CSS to reproduce the original early-2000s look
- **shadcn/ui** CLI configured (`base-vega`) for future accessible components, but modern design-system widgets are deliberately not used on this retro-style page
- **pnpm 12.14** and Node.js 22+

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Quality checks:

```sh
pnpm check
pnpm typecheck
pnpm build
pnpm test:e2e
```

## Reference images and permissions

The initial seven image references are the same photos associated with the *Save Walter White* layout. They are hotlinked temporarily from an immutable commit of the public [matiasroj0/save-walter-white](https://github.com/matiasroj0/save-walter-white) community reconstruction rather than copied into this repository. If the original host fails, the browser retries the **same image** through jsDelivr; if both fail, an explicit unavailable-image placeholder appears. The repeating background tile and ribbon decorations also come from there. They are **not** photographs of Pradnya. They may be copyrighted film/TV stills; public accessibility does not establish redistribution rights. Replace these references with permitted photos before any broader public/commercial release. Remote images require network connectivity and might disappear.

The content of this project is original parody copy, not the original show's fundraising story. The historical visual structure and styling are intentionally similar, but no misleading medical claims, live donation endpoint, fictitious payment totals, tracking scripts, or real visitor analytics are present. The counter is decorative and labeled as such.

## Scope

One responsive landing page. Visual fidelity is prioritized over modern UI trends: narrow centered page, green tiled sparkle background, yellow Comic-Sans-style copy, seven reference photos, red embossed CTA, brown banner, dark counter and vintage footer. No backend or payment integration; the button reveals a truthful support message with a GitHub link. This project is independent of AMC and the television series.

## Release status and hosting

This repository deliberately does **not** auto-deploy. Before a public release, follow [the release checklist](docs/release-checklist.md) and clear rights for any third-party film photos or decorative assets. Even after hosting, keep the clearly labeled parody content and no-payment behavior.

A custom `404.html`, `robots.txt`, and optional Cloudflare Pages `_headers` are included. The page continues to use `noindex, nofollow` until a conscious publication decision is made. When the user picks a real domain, add a validated absolute canonical/OG image URL rather than inventing one.
