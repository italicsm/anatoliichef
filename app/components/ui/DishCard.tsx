import { toCartLineDraft } from "../../lib/cart";
import { formatPrice } from "../../lib/format";
import { getDictionary } from "../../lib/dictionary";
import { t } from "../../lib/i18n";
import type { Locale } from "../../lib/locale";
import type { MenuTypeSlug, PlacedDish } from "../../lib/types";
import AddToCartButton from "./AddToCartButton";
import ZoomableImage from "./ZoomableImage";

type DishCardProps = {
  placedDish: PlacedDish;
  menuSlug: MenuTypeSlug;
  locale: Locale;
  className?: string;
};

/**
 * Renders a dish as it appears in one specific menu: the dish supplies the
 * name, description and photos, the placement supplies price and portion.
 *
 * Two layouts, one markup tree.
 *
 * From md up it is a card: a tall photo, then the name on the same baseline as
 * the price with a hairline leader between them — the typographic device of a
 * printed restaurant menu, which is what separates this from a product grid.
 *
 * Below md the cards would become one screen each, so the same pieces become a
 * list row: a square thumbnail on the left, name and price on one line beside
 * it, the description underneath across the full width. The leader disappears
 * because there is no room left for it to draw.
 */
export default function DishCard({
  placedDish,
  menuSlug,
  locale,
  className = "",
}: DishCardProps) {
  const dictionary = getDictionary(locale);
  const { dish, placement } = placedDish;
  const [photo] = dish.photos;
  const draft = toCartLineDraft(placedDish, menuSlug);

  return (
    <article className={`group flex h-full w-full flex-col ${className}`}>
      <div className="flex items-start gap-5 md:block">
        {photo ? (
          // The width lives on the wrapper: ZoomableImage fills whatever box it
          // is given, so the two layouts never fight over the same class.
          <div className="w-24 shrink-0 md:w-full">
            <ZoomableImage
              src={photo.url}
              alt={t(photo.alt, locale)}
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 96px"
              frameClassName="aspect-square bg-zinc-50 md:aspect-[4/5]"
              enlargeLabel={dictionary.dish.enlarge}
              closeLabel={dictionary.cart.close}
              className="transform-gpu object-cover object-center saturate-[0.92] transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
        ) : null}

        <div className="min-w-0 flex-1 md:mt-7">
          <div className="flex items-baseline gap-4">
            <h3 className="min-w-0 flex-1 text-xl font-light leading-tight tracking-wide text-zinc-900 md:flex-none">
              {t(dish.title, locale)}
            </h3>

            <span
              aria-hidden="true"
              className="hidden h-px flex-1 translate-y-[-0.3rem] bg-zinc-200 md:block"
            />

            <span className="text-xl font-light tabular-nums text-zinc-900">
              {formatPrice(placement.price)}
            </span>
          </div>

          {/*
            One button, one position, both layouts: the square + sits at the
            right end of the portion line. Which is also why this row survives
            when there is no portion — the button still needs its line.
          */}
          <div className="mt-2 flex items-center gap-4">
            {placement.portion ? (
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                {placement.portion}
              </p>
            ) : null}

            <div className="ml-auto">
              <AddToCartButton draft={draft} locale={locale} />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 font-serif text-xl leading-8 text-zinc-500 md:mt-4">
        {t(dish.description, locale)}
      </p>
    </article>
  );
}
