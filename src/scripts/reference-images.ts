/**
 * Reference-only source failover; no browser polling or React hydration.
 * Both remote URLs point to the SAME temporary, rights-unverified photo.
 * Successful recovery remains distinguishable from a permanently missing
 * image, without replacing a broken photo with misleading unrelated art.
 */
for (const image of document.querySelectorAll<HTMLImageElement>(
  "img[data-fallback-src]",
)) {
  function unavailable() {
    image.dataset.referenceState = "unavailable";
    image.closest(".portrait")?.classList.add("reference-unavailable");
    image.alt = "Temporary Walter White reference photograph unavailable";
  }

  function handleFailure() {
    const state = image.dataset.referenceState;
    if (state === "unavailable") return;
    if (state === "fallback" || state === "recovered") {
      unavailable();
      return;
    }

    const secondaryUrl = image.dataset.fallbackSrc;
    if (!secondaryUrl) {
      unavailable();
      return;
    }
    image.dataset.referenceState = "fallback";
    image.src = secondaryUrl;
  }

  image.addEventListener("error", handleFailure);
  image.addEventListener("load", () => {
    if (image.dataset.referenceState === "fallback") {
      image.dataset.referenceState = "recovered";
    }
  });

  // A failed eager request may complete before this script executes.
  if (image.complete && image.naturalWidth === 0) handleFailure();
}
