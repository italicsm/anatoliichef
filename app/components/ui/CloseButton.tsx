type CloseButtonProps = {
  onClick: () => void;
  /** Accessible name — the glyph carries no text. */
  label: string;
  className?: string;
};

/**
 * The cross every panel closes with: menu, cart, enlarged photo.
 *
 * Hairline stroke to match the burger it replaces, in a 40px box so the target
 * stays comfortable on a phone while the mark itself stays small.
 */
export default function CloseButton({
  onClick,
  label,
  className = "",
}: CloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`-mr-2 flex h-10 w-10 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-900 ${className}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
      >
        <path d="M1 1l16 16M17 1L1 17" />
      </svg>
    </button>
  );
}
