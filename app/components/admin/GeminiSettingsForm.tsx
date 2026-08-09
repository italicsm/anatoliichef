"use client";

import { useActionState } from "react";
import {
  saveGeminiSettingsAction,
  type ActionState,
} from "../../admin/(panel)/settings/actions";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { adminFieldStyles, adminLabelStyles } from "./AdminField";

type GeminiSettingsFormProps = {
  isSet: boolean;
  source: "env" | "database" | null;
  model: string;
};

export default function GeminiSettingsForm({
  isSet,
  source,
  model,
}: GeminiSettingsFormProps) {
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    saveGeminiSettingsAction,
    {}
  );

  return (
    <form action={action} className="max-w-xl">
      <p className="text-sm text-zinc-500">
        {isSet
          ? source === "env"
            ? "Ключ заданий змінною оточення — вона має пріоритет над збереженим тут."
            : "Ключ збережений у базі."
          : "Ключ не заданий. Переклад страв не працюватиме."}
      </p>

      <div className="mt-8">
        <label className={adminLabelStyles} htmlFor="gemini-key">
          {isSet ? "Новий ключ" : "Ключ Gemini"}
        </label>
        <input
          id="gemini-key"
          name="apiKey"
          type="password"
          autoComplete="off"
          placeholder={isSet ? "залиште порожнім, щоб не змінювати" : "AIza…"}
          className={`${adminFieldStyles} mt-2`}
        />
        <p className="mt-3 text-xs text-zinc-400">
          Показати збережений ключ неможливо — його можна лише замінити або
          прибрати.
        </p>
      </div>

      <div className="mt-8">
        <label className={adminLabelStyles} htmlFor="gemini-model">
          Модель
        </label>
        <input
          id="gemini-model"
          name="model"
          defaultValue={model}
          className={`${adminFieldStyles} mt-2`}
        />
        <p className="mt-3 text-xs text-zinc-400">
          Якщо перекладач відповідає помилкою 404, назва моделі застаріла —
          змініть її тут.
        </p>
      </div>

      {isSet && source === "database" ? (
        <label className="mt-8 flex items-center gap-3">
          <input
            type="checkbox"
            name="clearKey"
            className="h-4 w-4 accent-zinc-900"
          />
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Прибрати збережений ключ
          </span>
        </label>
      ) : null}

      <div className="mt-10">
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          className="gap-3 text-xs uppercase tracking-[0.2em]"
        >
          {isPending ? <Spinner /> : null}
          {isPending ? "Зберігаємо" : "Зберегти"}
        </Button>

        {state.error ? (
          <p aria-live="polite" className="mt-4 text-sm text-red-700">
            {state.error}
          </p>
        ) : null}

        {state.savedAt && !state.error ? (
          <p aria-live="polite" className="mt-4 text-sm text-emerald-700">
            Збережено.
          </p>
        ) : null}
      </div>
    </form>
  );
}
