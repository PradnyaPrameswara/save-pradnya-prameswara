# Photo-frame and banner parity refinement

The **Save Walter White** community reconstruction's source CSS defines a **700px main column**, a **50%-width hero**, a padded row of three photos, a **50%-width family photo**, and a padded row of two photos. The previous website used 30%-wide three-photo slots and 45%-wide two-photo slots across the full 700px column, producing visibly different row widths. This update keeps the 700px desktop column but uses a 604px photo-row measure (700px minus 48px on each side), measured slot widths (190/184/190px and 270/270px), and a 350px hero/family image. Individual photo aspect ratios remain intrinsic and the seven original reference sources are unchanged.

The provided GitHub Pages screenshot showed the banner as a generic underlined yellow wordmark on a dark brown slab. The original broadcast screenshot of *Save Walter White* shows an **italic, heavy sans-serif muted gold title**, an **unbroken horizontal pale-gold underline**, and a **warm tan/brown banner**. The CSS now uses a separate underlining pseudo-element rather than the browser's per-glyph `text-decoration`, with the long Pradnya name fitted on one desktop line. The wording, no-donation disclosure, retro green tile, support interaction and pinned external images are unchanged.

Source references:
- [Community recreation (HTML/CSS)](https://github.com/matiasroj0/save-walter-white)
- [Original banner screenshot as documented by Breaking Bad Wiki](https://breakingbad.fandom.com/wiki/SaveWalterWhite.com)

**Limit:** A direct pixel-perfect comparison with the original live page was not available; the source reproduction and original banner screenshot guide proportions, rather than a measured pixel-similarity score. Public image rights are still unverified.

Verify with CI screenshots and `tests/photo-frames.spec.ts` at 320, 390, 768 and 1440px. Do not modify unrelated architecture, image licensing flags, GitHub Pages base handling or personal-photo build gate.
