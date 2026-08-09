"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "../../admin/(panel)/content/actions";
import type { Translated } from "../../lib/i18n";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import AdminField from "./AdminField";
import TranslateButton from "./TranslateButton";

export type ContentField = {
  /** Base form name: the inputs become nameUk, nameEn, nameEs. */
  name: string;
  label: string;
  multiline?: boolean;
  value: Translated;
};

type ContentFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  /** Describes the block for the translator. */
  context: string;
  fields: ContentField[];
  /** Everything that is not translated: photo, phone, links. */
  children?: React.ReactNode;
};

const LABEL_SUFFIX = {
  uk: "",
  en: " англійською",
  es: " іспанською",
} as const;

/** Matches what readTranslated expects on the server: titleUk, titleEn, titleEs. */
const NAME_SUFFIX = { uk: "Uk", en: "En", es: "Es" } as const;

type Language = keyof typeof LABEL_SUFFIX;

const LANGUAGES: Language[] = ["uk", "en", "es"];

/** State key: one flat record beats three states per field. */
function keyOf(name: string, language: Language): string {
  return `${name}.${language}`;
}

/**
 * Shared shell for the About and Contact blocks: every translatable field is
 * shown in all three languages side by side, so a gap is visible rather than
 * hidden behind a language switch. One button translates the whole block —
 * these texts reference each other, and translating them together keeps the
 * tone consistent.
 */
export default function ContentForm({
  action,
  context,
  fields,
  children,
}: ContentFormProps) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    action,
    {}
  );

  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};

    for (const field of fields) {
      for (const language of LANGUAGES) {
        initial[keyOf(field.name, language)] = field.value[language] ?? "";
      }
    }

    return initial;
  });

  const set = (name: string, language: Language, value: string) =>
    setValues((current) => ({ ...current, [keyOf(name, language)]: value }));

  return (
    <form action={formAction} className="grid gap-10">
      <TranslateButton
        context={context}
        source={Object.fromEntries(
          fields.map((field) => [field.name, values[keyOf(field.name, "uk")]])
        )}
        onTranslated={({ en, es }) =>
          setValues((current) => {
            const next = { ...current };

            for (const field of fields) {
              next[keyOf(field.name, "en")] = en[field.name] ?? "";
              next[keyOf(field.name, "es")] = es[field.name] ?? "";
            }

            return next;
          })
        }
      />

      {fields.map((field) => (
        <div key={field.name} className="grid gap-6 md:grid-cols-3">
          {LANGUAGES.map((language) => (
            <AdminField
              key={language}
              label={`${field.label}${LABEL_SUFFIX[language]}`}
              name={`${field.name}${NAME_SUFFIX[language]}`}
              multiline={field.multiline}
              value={values[keyOf(field.name, language)]}
              onChange={(value) => set(field.name, language, value)}
            />
          ))}
        </div>
      ))}

      {children ? <div className="grid gap-8 md:grid-cols-2">{children}</div> : null}

      <div>
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
