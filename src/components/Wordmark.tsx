interface WordmarkProps {
  className?: string;
}

/**
 * TechX wordmark.
 *
 * The name is split so the X can take the accent colour without extra markup in
 * every place it appears. The registered mark is decorative, so it stays out of
 * the accessible name; the text "TechX" is what gets read.
 */
export function Wordmark({ className = '' }: WordmarkProps) {
  return (
    <span className={`wordmark ${className}`.trim()}>
      <span className="wordmark__tech">Tech</span>
      <span className="wordmark__x">X</span>
      <span className="wordmark__reg" aria-hidden="true">
        ®
      </span>
    </span>
  );
}

/** The TechX intersection mark, drawn as a real vector icon. */
export function XMark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`xmark ${className}`.trim()}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}
