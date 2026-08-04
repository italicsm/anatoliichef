import { toCartLineDraft } from "../../lib/cart";
import { formatPrice } from "../../lib/format";
import { t } from "../../lib/i18n";
import type { MenuTypeSlug, PlacedDish } from "../../lib/types";
import AddToCartButton from "./AddToCartButton";
import ZoomableImage from "./ZoomableImage";

type DishCardProps = {
  placedDish: PlacedDish;
  menuSlug: MenuTypeSlug;
  className?: string;
};

/**
 * Renders a dish as it appears in one specific menu: the dish supplies the
 * name, description and photos, the placement supplies price and portion.
 *
 * The name sits on the same baseline as the price with a hairline leader
 * between them — the typographic device of a printed restaurant menu, which
 * is what separates this from a product grid.
 */
export default function DishCard({
  placedDish,
  menuSlug,
  className = "",
}: DishCardProps) {
  const { dish, placement } = placedDish;
  const [photo] = dish.photos;

  return (
    <article className={`group flex h-full w-full flex-col ${className}`}>
      {photo ? (
        <ZoomableImage
          src={photo.url}
          alt={t(photo.alt)}
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
          frameClassName="aspect-[4/5] bg-zinc-50"
          className="transform-gpu object-cover object-center saturate-[0.92] transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : null}

      <div className="mt-7 flex flex-1 flex-col">
        <div className="flex items-baseline gap-4">
          <h3 className="text-xl font-light leading-tight tracking-wide text-zinc-900">
            {t(dish.title)}
          </h3>

          <span
            aria-hidden="true"
            className="h-px flex-1 translate-y-[-0.3rem] bg-zinc-200"
          />

          <span className="text-xl font-light tabular-nums text-zinc-900">
            {formatPrice(placement.price)}
          </span>
        </div>

        {placement.portion ? (
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-zinc-400">
            {placement.portion}
          </p>
        ) : null}

        <p className="mt-4 font-serif text-xl leading-8 text-zinc-500">
          {t(dish.description)}
        </p>

        <AddToCartButton
          draft={toCartLineDraft(placedDish, menuSlug)}
          className="mt-6 self-start"
        />
      </div>
    </article>
  );
}
