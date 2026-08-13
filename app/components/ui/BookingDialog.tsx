"use client";

import { useRef, useState } from "react";
import { getDictionary } from "../../lib/dictionary";
import type { Locale } from "../../lib/locale";
import Button from "./Button";
import CheckoutForm from "./CheckoutForm";
import CloseButton from "./CloseButton";
import Eyebrow from "./Eyebrow";
import Text from "./Text";

/**
 * The Contact section asks for a dinner without going through the menu.
 *
 * It is the checkout form in booking mode: same fields, same endpoint, same
 * inbox, minus the dishes. Guests who arrive ready to talk rather than ready to
 * order were otherwise met by a button that did nothing.
 */
export default function BookingDialog({ locale }: { locale: Locale }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isSent, setIsSent] = useState(false);
  const dictionary = getDictionary(locale);

  function open() {
    setIsSent(false);
    dialogRef.current?.showModal();
  }

  return (
    <>
      <Button onClick={open} className="text-sm uppercase tracking-[0.2em]">
        {dictionary.contact.reserve}
      </Button>

      <dialog
        ref={dialogRef}
        // Same as the cart: a click on the backdrop is dispatched to the dialog
        // element itself, while anything inside the panel has a deeper target
        // and is left alone. Two panels that look alike must close alike.
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            dialogRef.current?.close();
          }
        }}
        aria-label={dictionary.booking.title}
        className="drawer-dialog fixed inset-y-0 right-0 m-0 h-full max-h-none w-full max-w-none bg-white p-0 backdrop:bg-white/70 sm:w-[28rem]"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200 px-8 py-6">
            <Eyebrow className="text-sm">{dictionary.booking.title}</Eyebrow>

            <CloseButton
              onClick={() => dialogRef.current?.close()}
              label={dictionary.booking.close}
            />
          </div>

          {isSent ? (
            <div className="flex flex-1 flex-col justify-center px-8 text-center">
              <p className="text-xl text-zinc-900">
                {dictionary.booking.thanksTitle}
              </p>

              <Text muted className="mx-auto mt-4 max-w-xs">
                {dictionary.booking.thanksBody}
              </Text>

              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="mx-auto mt-10 border-b border-zinc-300 pb-1 text-xs uppercase tracking-[0.25em] text-zinc-500 transition-colors hover:border-zinc-900 hover:text-zinc-900"
              >
                {dictionary.booking.close}
              </button>
            </div>
          ) : (
            <div className="flex flex-1 flex-col overflow-hidden">
              <p className="border-b border-zinc-100 px-8 py-6 text-sm leading-relaxed text-zinc-500">
                {dictionary.booking.intro}
              </p>

              <div className="flex-1 overflow-hidden">
                <CheckoutForm
                  locale={locale}
                  kind="booking"
                  submitLabel={dictionary.booking.submit}
                  onSuccess={() => setIsSent(true)}
                />
              </div>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
