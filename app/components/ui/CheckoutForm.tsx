"use client";

import { useRef, useState } from "react";
import { useCart } from "../../lib/cart-store";
import { getDictionary } from "../../lib/dictionary";
import type { Locale } from "../../lib/locale";
import type { ValidationError } from "../../lib/order";
import Spinner from "./Spinner";

type CheckoutFormProps = {
  locale: Locale;
  /** Omit to hide the back link — the booking dialog has a cross instead. */
  onBack?: () => void;
  onSuccess: (orderNumber: string) => void;
  /**
   * "booking" sends the same contact details with no dishes, for a guest who
   * has not opened the menu. Same endpoint, same validation, same inbox.
   */
  kind?: "order" | "booking";
  submitLabel?: string;
};

const fieldStyles =
  "w-full border-b border-zinc-300 bg-transparent py-2 text-zinc-900 outline-none transition-colors placeholder:text-zinc-300 focus:border-zinc-900";

const labelStyles = "text-xs uppercase tracking-[0.25em] text-zinc-500";

export default function CheckoutForm({
  locale,
  onBack,
  onSuccess,
  kind = "order",
  submitLabel,
}: CheckoutFormProps) {
  const { lines, clear } = useCart();
  const dictionary = getDictionary(locale);
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  // State updates are asynchronous, so a fast double click can slip past the
  // disabled attribute. The ref closes that window synchronously; the request
  // id makes the server reject a duplicate that still gets through.
  const isSubmitting = useRef(false);
  const requestId = useRef<string>("");

  if (!requestId.current) {
    requestId.current =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting.current) {
      return;
    }

    isSubmitting.current = true;
    setIsPending(true);
    setErrors([]);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          requestId: requestId.current,
          contact: {
            name: formData.get("name"),
            phone: formData.get("phone"),
            eventDate: formData.get("eventDate"),
            guests: formData.get("guests"),
            comment: formData.get("comment"),
          },
          // Only ids and quantities travel: the server prices the order.
          items:
            kind === "booking"
              ? []
              : lines.map((line) => ({
                  placementId: line.placementId,
                  quantity: line.quantity,
                })),
        }),
      });

      if (!response.ok) {
        const payload: unknown = await response.json().catch(() => null);
        const received =
          payload && typeof payload === "object" && "errors" in payload
            ? (payload as { errors: ValidationError[] }).errors
            : null;

        setErrors(
          received ?? [
            { field: "form", message: dictionary.checkout.unknownError },
          ]
        );

        // The attempt failed, so the guest must be able to try again.
        isSubmitting.current = false;

        return;
      }

      const payload: unknown = await response.json().catch(() => null);
      const orderNumber =
        payload && typeof payload === "object" && "number" in payload
          ? String((payload as { number: unknown }).number)
          : "";

      // A booking never touched the cart, so emptying it would throw away a
      // selection the guest may still be working on.
      if (kind === "order") {
        clear();
      }

      onSuccess(orderNumber);
    } catch {
      setErrors([
        { field: "form", message: dictionary.checkout.networkError },
      ]);
      isSubmitting.current = false;
    } finally {
      setIsPending(false);
    }
  }

  // The cart drawer and the booking dialog are both mounted at all times, so
  // a constant id would exist twice in the document and every label would
  // point at whichever field came first.
  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <div className="flex-1 space-y-7 overflow-y-auto px-8 py-8">
        <div>
          <label htmlFor={`${kind}-name`} className={labelStyles}>
            {dictionary.checkout.name}
          </label>
          <input
            id={`${kind}-name`}
            name="name"
            required
            autoComplete="name"
            className={`${fieldStyles} mt-2`}
          />
        </div>

        <div>
          <label htmlFor={`${kind}-phone`} className={labelStyles}>
            {dictionary.checkout.phone}
          </label>
          <input
            id={`${kind}-phone`}
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={`${fieldStyles} mt-2`}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor={`${kind}-date`} className={labelStyles}>
              {dictionary.checkout.date}
            </label>
            <input
              id={`${kind}-date`}
              name="eventDate"
              type="date"
              className={`${fieldStyles} mt-2`}
            />
          </div>

          <div>
            <label htmlFor={`${kind}-guests`} className={labelStyles}>
              {dictionary.checkout.guests}
            </label>
            <input
              id={`${kind}-guests`}
              name="guests"
              inputMode="numeric"
              className={`${fieldStyles} mt-2`}
            />
          </div>
        </div>

        <div>
          <label htmlFor={`${kind}-comment`} className={labelStyles}>
            {dictionary.checkout.comment}
          </label>
          <textarea
            id={`${kind}-comment`}
            name="comment"
            rows={3}
            className={`${fieldStyles} mt-2 resize-none`}
          />
        </div>

        {errors.length > 0 ? (
          <ul aria-live="polite" className="space-y-1">
            {errors.map((error) => (
              <li key={`${error.field}-${error.message}`} className="text-sm text-red-700">
                {error.message}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="border-t border-zinc-200 px-8 py-6">
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="flex w-full items-center justify-center gap-3 rounded-full bg-zinc-700 px-8 py-4 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          {isPending ? <Spinner /> : null}
          {isPending
            ? dictionary.checkout.sending
            : submitLabel ?? dictionary.checkout.submit}
        </button>

        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="mt-4 w-full text-sm uppercase tracking-[0.15em] text-zinc-400 transition-colors hover:text-zinc-900"
          >
            {dictionary.checkout.back}
          </button>
        ) : null}
      </div>
    </form>
  );
}
