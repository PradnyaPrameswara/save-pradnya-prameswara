# Personal photos without changing the reference design

The default mode remains `PUBLIC_IMAGE_MODE=reference`, showing the same seven Walter White stills temporarily for local visual comparison. Those images and the external star tile/ribbons have **no confirmed reuse permission**.

To prepare an authorized personal version:

1. Decide which seven photos you have the right to use, and whether committing them to a public GitHub repository is appropriate.
2. Add them under `public/images/personal/`. WebP or AVIF is preferred; PNG/JPEG are also supported.
3. Update each slot in `src/data/personal-photo-manifest.json` with the true filename, actual pixel width/height, an accurate image-specific alt description, `rights` (`owned`, `licensed`, or `permission`), and a truthful photographer/source `credit`.
4. Set `PUBLIC_IMAGE_MODE=personal` for a **local** build. In PowerShell: `$env:PUBLIC_IMAGE_MODE='personal'; pnpm build`. On Bash: `PUBLIC_IMAGE_MODE=personal pnpm build`. The build deliberately fails until all seven complete records and files exist.
5. Compare screenshots at 320, 390, 768, 1440. The slots remain in the original order, but actual photo ratios come from the manifest. The reference stars and bows are disabled in personal mode; CSS gradient stars remain.
6. Do not deploy without reviewing rights, consent, content and the final preview. The payment/donation flow is still intentionally nonfunctional.

This PR does not introduce any photos of Pradnya or claim ownership of the temporary reference photos. Default screenshots retain the original user-requested images.
