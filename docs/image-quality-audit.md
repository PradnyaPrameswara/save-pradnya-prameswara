# Image-quality and resilience audit (PR #13)

The current seven Walter White stills are the same temporarily hotlinked reference images, pinned to an immutable community-reconstruction commit. No higher-resolution or local copies have been introduced; public availability of a photograph is **not** permission to redistribute or enhance it.

## Confirmed dimensions and constraints

Chromium in the established CI recorded these actual source pixel dimensions (slot order): 402×517, 247×322, 226×301, 220×343, 362×250, 277×302, 193×266. Desktop slots are 350, 190/184/190, 350, 270/270 CSS pixels including their frames. Therefore, some images — especially the final 193px-wide photo inside a 270px frame — are inevitably enlarged and can look soft on higher-density displays. Upscaling them via CSS or artificially claiming higher resolution will not restore source detail. `tests/image-quality.spec.ts` exports the **measured rendered/source scale factors** to the CI screenshot artifact for targeted review.

## Improvements

- The first photo explicitly uses `loading="eager"` and high fetch priority; the other six remain lazy and asynchronously decoded, so below-the-fold images do not block first paint.
- Source and fallback stay tied to the same original reference photograph. A successful CDN retry now records `data-reference-state="recovered"` rather than an ambiguous in-progress state; both hosts failing still yields a truthful visible placeholder.
- Image natural ratios, CSS `object-fit: contain`, descriptive alt text and explicit pixel dimensions are checked. The test uses synthetic pixels for failover verification; **no copyrighted image is committed**.

## Remaining work for a final release

Use seven owner-supplied/rights-cleared images of adequate native resolution with `PUBLIC_IMAGE_MODE=personal`, update actual dimensions and source credit in `src/data/personal-photo-manifest.json`, and compare their framing at 320, 390, 768 and 1440px. A photo with fewer source pixels than its rendering size may remain blurry on high-DPI devices. The existing external photographic references and decorative artwork have no verified re-use license.
