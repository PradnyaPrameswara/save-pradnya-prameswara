/**
 * No framework hydration needed for transient reference-image failures.
 * Keep the same photograph on a second remote host before showing a visible
 * non-misleading fallback. The failure path never turns a still into a photo
 * of Pradnya or into a real fundraising image.
 */
for (const image of document.querySelectorAll<HTMLImageElement>(
  "img[data-fallback-src]",
)) {
  function handleFailure() {
    if (image.dataset.referenceState === "unavailable") return;

    if (image.dataset.referenceState === "fallback") {
      image.dataset.referenceState = "unavailable";
      image.closest(".portrait")?.classList.add("reference-unavailable");
      image.alt = "Temporary Walter White reference photograph unavailable";
      return;
    }

    const secondaryUrl = image.dataset.fallbackSrc;
    if (!secondaryUrl) return;
    image.dataset.referenceState = "fallback";
    image.src = secondaryUrl;
  }

  image.addEventListener("error", handleFailure);

  // Broken lazy-loaded photos might have failed before this module executed.
  if (image.complete && image.naturalWidth === 0) handleFailure();
}
