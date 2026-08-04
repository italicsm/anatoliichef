type BoldOnHoverProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Thickens the label when an ancestor marked `group` is hovered.
 *
 * Bold glyphs are wider than regular ones, so a naive hover:font-semibold
 * pushes everything next to it sideways. The invisible copy reserves the bold
 * width up front, and the visible copy animates inside that fixed box.
 */
export default function BoldOnHover({
  children,
  className = "",
}: BoldOnHoverProps) {
  return (
    <span className={`inline-grid place-items-center ${className}`}>
      <span
        aria-hidden="true"
        className="invisible col-start-1 row-start-1 font-semibold"
      >
        {children}
      </span>

      <span className="col-start-1 row-start-1 transition-[font-weight] duration-200 group-hover:font-semibold">
        {children}
      </span>
    </span>
  );
}
