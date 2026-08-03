const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

/**
 * Prices are stored as integer cents everywhere — floats would drift once
 * the cart starts summing them up.
 */
export function formatPrice(cents: number): string {
  return priceFormatter.format(cents / 100);
}
