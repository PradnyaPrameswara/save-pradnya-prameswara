# Performance and accessibility review

This audit does not assert field Core Web Vitals scores or Lighthouse scores without corresponding evidence. Playwright runs lab-only Chromium observations at **390px and 1440px** and publishes `lab-vitals-*.json` alongside screenshots. Observed CLS/LCP values vary with network, cold cache, font availability and CI machine; do not present them as real-user measurements.

## Applied improvements
- The single React support island keeps `client:load` for reliable interaction, but Escape closes the explanation and restores button focus without `useEffect`.
- High-contrast preferences get a dark reading surface under yellow/white text; the default original-inspired green visual does not change.
- Personal-image mode skips unnecessary remote reference image preconnects; the default reference mode retains them.
- Browser tests check keyboard dismissal, focus recovery, high-contrast styles, and collect lab resource/paint/shift observations.

## Release review still required
- Actual browser/device and assistive-technology checks, particularly Narrator/VoiceOver announcements and touchscreen gesture use, are not established by Playwright alone.
- Lighthouse and real-user CWV should be measured on an authorized, stable deployed preview with a known host and network; do not invent performance scores.
- Third-party still-photo rights and a production domain remain independent release blockers.
