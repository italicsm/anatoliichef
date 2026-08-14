"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { ActionState } from "../../admin/(panel)/categories/actions";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import AdminField from "./AdminField";
import ImageField from "./ImageField";
import TranslateButton from "./TranslateButton";

type CategoryFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
  /** Hidden values the action needs: menuTypeId when creating, id when editing. */
  hidden?: Record<string, string>;
  defaults?: { titleUk: string; titleEn: string; titleEs: string };
  /** Only the edit form carries a cover; the create form stays compact. */
  photoUrl?: string | null;
  withPhoto?: boolean;
  /** Editing closes the form; creating clears it for the next entry. */
  onSaved?: () => void;
  clearOnSave?: boolean;
};

export default function CategoryForm({
  action,
  submitLabel,
  hidden = {},
  defaults,
  photoUrl,
  withPhoto = false,
  onSaved,
  clearOnSave = false,
}: CategoryFormProps) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    action,
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);

  const [titleUk, setTitleUk] = useState(defaults?.titleUk ?? "");
  const [titleEn, setTitleEn] = useState(defaults?.titleEn ?? "");
  const [titleEs, setTitleEs] = useState(defaults?.titleEs ?? "");

  // savedAt carries a timestamp rather than a boolean so two saves in a row
  // still produce a change the effect can react to.
  useEffect(() => {
    if (!state.savedAt) {
      return;
    }

    if (clearOnSave) {
      formRef.current?.reset();
      setTitleUk("");
      setTitleEn("");
      setTitleEs("");
    }

    onSaved?.();
  }, [state.savedAt, clearOnSave, onSaved]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-6">
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      <div className="grid gap-6 md:grid-cols-3">
        <AdminField
          label="Назва"
          name="titleUk"
          required
          value={titleUk}
          onChange={setTitleUk}
          placeholder="Холодні закуски"
        />

        <AdminField
          label="Назва англійською"
          name="titleEn"
          value={titleEn}
          onChange={setTitleEn}
          placeholder="Cold appetizers"
        />

        <AdminField
          label="Назва іспанською"
          name="titleEs"
          value={titleEs}
          onChange={setTitleEs}
          placeholder="Entrantes fríos"
        />
      </div>

      {withPhoto ? (
        <ImageField
          label="Фото категорії"
          name="photo"
          currentUrl={photoUrl}
          removeName="removePhoto"
          hint="Зберігається в базі. На сайті поки не показується."
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-6">
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          className="gap-3 text-xs uppercase tracking-[0.2em]"
        >
          {isPending ? <Spinner /> : null}
          {submitLabel}
        </Button>

        <TranslateButton
          context="a section heading on a restaurant menu, for example «Холодні закуски»"
          source={{ title: titleUk }}
          onTranslated={({ en, es }) => {
            setTitleEn(en.title ?? "");
            setTitleEs(es.title ?? "");
          }}
        />
      </div>

      {state.error ? (
        <p aria-live="polite" className="text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
