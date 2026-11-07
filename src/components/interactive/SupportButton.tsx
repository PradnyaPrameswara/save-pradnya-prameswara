import { useState } from "react";

/** A playful CTA, not a donation/payment integration. */
export function SupportButton() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="support-widget">
      <button
        type="button"
        className="donation-button"
        aria-expanded={expanded}
        aria-controls="support-explanation"
        onClick={() => setExpanded((value) => !value)}
      >
        <span>Click Here</span>
        <span>to Help!</span>
      </button>
      {expanded && (
        <div id="support-explanation" className="support-explanation" role="region" aria-label="Ways to support Pradnya">
          <strong>No money is being collected!</strong>
          <p>
            This is a Breaking Bad-inspired parody page. You can support the
            developer by visiting the actual GitHub profile instead.
          </p>
          <a
            href="https://github.com/PradnyaPrameswara"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Pradnya on GitHub
          </a>
        </div>
      )}
    </div>
  );
}
