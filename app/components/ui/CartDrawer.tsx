"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { groupByMenu } from "../../lib/cart";
import { useCart } from "../../lib/cart-store";
import { getDictionary } from "../../lib/dictionary";
import type { Locale } from "../../lib/locale";
import { formatPrice } from "../../lib/format";
import { t } from "../../lib/i18n";
import { menuTypeLabels } from "../../lib/menu-labels";
import CheckoutForm from "./CheckoutForm";
import CloseButton from "./CloseButton";
import Eyebrow from "./Eyebrow";
import QuantityStepper from "./QuantityStepper";
import Text from "./Text";

type Step = "cart" | "form" | "done";

export default function CartDrawer({ locale }: { locale: Locale }) {
  const { lines, total, isOpen, close, setQuantity, remove, clear } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState<Step>("cart");
  const [orderNumber, setOrderNumber] = useState("");
  const dictionary = getDictionary(locale);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      setStep((current) => (current === "done" ? "cart" : current));
      dialog.showModal();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const groups = groupByMenu(lines);

  return (
    <dialog
      ref={dialogRef}
      onClose={close}
      // A click on the backdrop is dispatched to the dialog element itself;
      // anything inside the panel has a deeper target and is left alone.
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          close();
        }
      }}
      aria-label={dictionary.cart.title}
      className="drawer-dialog fixed inset-y-0 right-0 m-0 h-full max-h-none w-full max-w-none bg-white p-0 backdrop:bg-white/70 sm:w-[28rem]"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-zinc-200 px-8 py-6">
          <Eyebrow className="text-sm">
            {step === "form" ? dictionary.cart.details : dictionary.cart.title}
          </Eyebrow>

          <CloseButton onClick={close} label={dictionary.cart.close} />
        </div>

        {step === "done" ? (
          <div className="flex flex-1 flex-col justify-center px-8 text-center">
            <p className="text-xl text-zinc-900">
              {dictionary.cart.thanksTitle}
            </p>

            <Text muted className="mx-auto mt-4 max-w-xs">
              {dictionary.cart.thanksBody}
            </Text>

            <button
              type="button"
              onClick={close}
              className="mx-auto mt-10 border-b border-zinc-300 pb-1 text-xs uppercase tracking-[0.25em] text-zinc-500 transition-colors hover:border-zinc-900 hover:text-zinc-900"
            >
              {dictionary.cart.close}
            </button>
          </div>
        ) : null}

        {step === "form" ? (
          <div className="flex-1 overflow-hidden">
            <CheckoutForm
              locale={locale}
              onBack={() => setStep("cart")}
              onSuccess={(number) => {
                setOrderNumber(number);
                setStep("done");
              }}
            />
          </div>
        ) : null}

        {step === "cart" ? (
          <>
            <div className="flex-1 overflow-y-auto px-8">
              {groups.length === 0 ? (
                <Text muted className="py-12">
                  {dictionary.cart.empty}
                </Text>
              ) : (
                groups.map((group) => (
                  <section key={group.menuSlug} className="py-8">
                    <h2 className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                      {t(menuTypeLabels[group.menuSlug], locale)}
                    </h2>

                    <ul className="mt-6 space-y-8">
                      {group.lines.map((line) => (
                        <li key={line.placementId} className="flex gap-5">
                          {line.photo ? (
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-50">
                              <Image
                                src={line.photo}
                                alt={t(line.title, locale)}
                                fill
                                sizes="96px"
                                className="object-cover"
                              />
                            </div>
                          ) : null}

                          <div className="min-w-0 flex-1">
                            <p className="text-zinc-900">{t(line.title, locale)}</p>

                            <p className="mt-1 text-sm text-zinc-500">
                              {line.portion ? `${line.portion} · ` : ""}
                              {formatPrice(line.price)}
                            </p>

                            <div className="mt-4 flex items-center justify-between gap-4">
                              <QuantityStepper
                                quantity={line.quantity}
                                onChange={(quantity) =>
                                  setQuantity(line.placementId, quantity)
                                }
                                label={t(line.title, locale)}
                                locale={locale}
                              />

                              <button
                                type="button"
                                onClick={() => remove(line.placementId)}
                                className="text-sm uppercase tracking-[0.15em] text-zinc-400 transition-colors hover:text-zinc-900"
                              >
                                {dictionary.cart.remove}
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))
              )}
            </div>

            <div className="border-t border-zinc-200 px-8 py-6">
              <div className="flex items-baseline justify-between">
                <span className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                  {dictionary.cart.total}
                </span>
                <span className="text-xl text-zinc-900">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setStep("form")}
                disabled={lines.length === 0}
                className="mt-6 w-full rounded-full bg-zinc-700 px-8 py-4 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:bg-zinc-300"
              >
                {dictionary.cart.send}
              </button>

              {lines.length > 0 ? (
                <button
                  type="button"
                  onClick={clear}
                  className="mt-4 w-full text-sm uppercase tracking-[0.15em] text-zinc-400 transition-colors hover:text-zinc-900"
                >
                  {dictionary.cart.clear}
                </button>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </dialog>
  );
}
