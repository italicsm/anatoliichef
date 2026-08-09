"use client";

import { useState } from "react";
import { translateFieldsAction } from "../../admin/(panel)/translate-actions";
import type { TranslationValues } from "../../lib/admin/translate";
import Spinner from "../ui/Spinner";

type TranslateButtonProps = {
  /** Describes the text for the model: "a dish on the menu", "a category". */
  context: string;
  /** Ukrainian source, keyed by whatever names the form uses. */
  source: TranslationValues;
  onTranslated: (values: { en: TranslationValues; es: TranslationValues }) => void;
  className?: string;
};

/**
 * Translating and saving are two separate decisions, so this is a plain button
 * rather than something that runs on submit: press it, read what came back,
 * fix what is wrong, then save. It always overwrites — a button labelled
 * "translate" that silently skips filled fields would be a worse surprise than
 * an edit the chef can undo by not saving.
 */
export default function TranslateButton({
  context,
  source,
  onTranslated,
  className = "",
}: TranslateButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneAt, setDoneAt] = useState<number | null>(null);

  async function handleClick() {
    if (!Object.values(source).some((value) => value.trim())) {
      setError("Спершу заповніть текст українською.");
      setDoneAt(null);

      return;
    }

    setIsPending(true);
    setError(null);
    setDoneAt(null);

    try {
      const result = await translateFieldsAction({ context, fields: source });

      if (!result.ok) {
        setError(result.error);

        return;
      }

      onTranslated({ en: result.en, es: result.es });
      setDoneAt(Date.now());
    } catch {
      setError("Перекладач недоступний.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="button"
          onClick={handleClick}
          disabled={isPending}
          className="inline-flex items-center gap-3 border border-zinc-300 px-6 py-3 text-xs uppercase tracking-[0.2em] text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-40"
        >
          {isPending ? <Spinner /> : null}
          {isPending ? "Перекладаємо" : "Переклад АІ"}
        </button>

        {error ? (
          <p aria-live="polite" className="text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {doneAt && !error ? (
          <p aria-live="polite" className="text-sm text-emerald-700">
            Перекладено. Перевірте й збережіть.
          </p>
        ) : null}

        {!error && !doneAt ? (
          <p className="text-xs text-zinc-400">
            Перезапише англійську та іспанську з української. Збережеться лише
            після кнопки «Зберегти».
          </p>
        ) : null}
      </div>
    </div>
  );
}
