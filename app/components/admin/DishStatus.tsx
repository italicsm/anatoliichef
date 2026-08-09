type DishStatusProps = {
  isActive: boolean;
  placementCount: number;
};

/**
 * A dish reaches the site only when it is active *and* placed in at least one
 * menu — the same condition getMenuBySlug filters on. Both failures look the
 * same to a visitor, so they look the same here: not published.
 *
 * The dot carries a title and a screen-reader label, because colour alone is
 * not information anyone can rely on.
 */
export default function DishStatus({
  isActive,
  placementCount,
}: DishStatusProps) {
  const isPublished = isActive && placementCount > 0;

  const label = isPublished
    ? "На сайті"
    : isActive
      ? "Не публікується: не входить у жодне меню"
      : "Не публікується: сховано";

  return (
    <span title={label} className="inline-flex items-center">
      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${
          isPublished ? "bg-emerald-500" : "bg-zinc-900"
        }`}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
