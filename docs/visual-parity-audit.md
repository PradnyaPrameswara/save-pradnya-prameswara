# Visual parity audit — Save Pradnya Prameswara

Reference: [Save Walter White](https://www.savewalterwhite.com/) and the [public community reconstruction screenshot](https://github.com/matiasroj0/save-walter-white/blob/508d0aea07fb3dee18f8dda23ee93e6b5e3a2a3f/images/web-screenshot.png). The community reconstruction is **not** guaranteed to be an exact capture of the live original. Do not report a pixel-similarity percentage without matched screenshots and an actual comparison.

| Area | Grounded reference | Current implementation | Parity status |
|---|---|---|---|
| Page | Narrow centered single column (~700px) | CSS max 700px | Geometric invariant tested |
| Background | Bright green patterned tile | Same temporary pinned tile, fallback procedural dots | Same tile when reachable |
| Typography | Large white serif header, yellow Comic-like body | Times-style heading, yellow Comic Sans/Comic Neue fallback | Font availability varies by OS |
| Photo order | Hero, 3-photo row, family, 2-photo row | Same 7 temporarily linked Walter stills | Order/source verified; natural ratio preserved |
| Appeal | Yellow copy, ribbon decoration, beige banner, red button | Same broad visual structure, CSS recreation | Not pixel-identical to original raster graphics |
| Content | Character-specific fundraiser | Clearly identified developer parody, no donations | **Intentionally different**; affects vertical page geometry |
| Counter | Retro meter | Decorative 000001 and disclosure | No false live metric |
| Footer | Compact old-school links | Contact, tribute attribution, reference link | Different wording intentionally |

## Reproducible evidence

Run `pnpm install --frozen-lockfile && pnpm build && pnpm test:e2e`. The CI **retro-visual-review** artifact contains responsive full-page screenshots at 320, 390, 768 and 1440px. The `tests/visual-audit.spec.ts` suite also writes machine-readable `visual-audit-*.json` for each width, recording bounding boxes, computed colors/fonts, image ratios, CTA visibility and horizontal overflow. The JSON is browser evidence, **not** a score or a claim of pixel-perfect parity.

For visual review, open the external screenshot above beside the CI screenshot at 1440px (and view our mobile captures separately; the original site is primarily a fixed desktop composition). Check photo order/size, heading wrapping, banner geometry, green tile, paragraph rhythm, and button. Where the source text is different, compare individual regions rather than total page heights. Record genuine differences before changing CSS; avoid arbitrary rewrites.

## Remaining blockers

- We have not validated pixel-level equality against a fresh screenshot of the original live URL.
- The reference photos/decoration remain third-party material without verified reuse rights.
- No production deployment or permission to publish those assets is implied by these tests.
