"use client";

import { useActionState, useEffect, useRef } from "react";
import type { ActionState } from "../../admin/(panel)/categories/actions";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import ImageField from "./ImageField";

type CategoryFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
  /** Hidden values the action needs: menuTypeId when creating, id when editing. */
  hidden?: Record<string, string>;
  defaults?: { titleUk: string; titleEn: string };
  /** Only the edit form carries a cover; the create form stays a single line. */
  photoUrl?: string | null;
  withPhoto?: boolean;
  /** Editing closes the form; creating clears it for the next entry. */
  onSaved?: () => void;
  clearOnSave?: boolean;
};

const fieldStyles =
  "w-full border-b border-zinc-300 bg-transparent py-2 text-zinc-900 outline-none transition-colors placeholder:text-zinc-300 focus:border-zinc-900";

const labelStyles = "text-xs uppercase tracking-[0.25em] text-zinc-500";

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

  // savedAt carries a timestamp rather than a boolean so two saves in a row
  // still produce a change the effect can react to.
  useEffect(() => {
    if (!state.savedAt) {
      return;
    }

    if (clearOnSave) {
      formRef.current?.reset();
    }

    onSaved?.();
  }, [state.savedAt, clearOnSave, onSaved]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid gap-6 md:grid-cols-3 md:items-end"
    >
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      <div>
        <label className={labelStyles} htmlFor={`title-uk-${submitLabel}`}>
          Назва
        </label>
        <input
          id={`title-uk-${submitLabel}`}
          name="titleUk"
          required
          defaultValue={defaults?.titleUk}
          placeholder="Холодні закуски"
          className={`${fieldStyles} mt-2`}
        />
      </div>

      <div>
        <label className={labelStyles} htmlFor={`title-en-${submitLabel}`}>
          Назва англійською
        </label>
        <input
          id={`title-en-${submitLabel}`}
          name="titleEn"
          defaultValue={defaults?.titleEn}
          placeholder="Cold appetizers"
          className={`${fieldStyles} mt-2`}
        />
      </div>

      <div>
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          className="w-full gap-3 text-xs uppercase tracking-[0.2em]"
        >
          {isPending ? <Spinner /> : null}
          {submitLabel}
        </Button>
      </div>

      {withPhoto ? (
        <div className="md:col-span-3">
          <ImageField
            label="Фото категорії"
            name="photo"
            currentUrl={photoUrl}
            removeName="removePhoto"
            hint="Зберігається в базі. На сайті поки не показується — скажіть, і я виведу його заголовком категорії."
          />
        </div>
      ) : null}

      {state.error ? (
        <p aria-live="polite" className="text-sm text-red-700 md:col-span-3">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
