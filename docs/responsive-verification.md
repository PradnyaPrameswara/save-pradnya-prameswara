# Responsive verification

The source site was designed for a narrow desktop column. This tribute retains that composition while allowing the seven photo slots, long story, decorative ribbons, vintage banner, support button and footer to fit narrow screens.

The browser suite checks widths **320, 360, 375, 390, 430, 560, 768, 1024, 1280 and 1440px** without horizontal overflow. At 320px it also checks that the support explanation remains within the viewport. Screenshots are captured at 320, 390, 768 and 1440px and uploaded as the `retro-visual-review` artifact.

The original justified text is retained on larger viewports; on small screens it is left-aligned to prevent huge spaces between words. Decorative ribbons remain but are pulled away from headings, while small image borders shrink to protect picture content. No additional React hydration, UI toolkit widgets, Radix imports or useEffect are introduced.
