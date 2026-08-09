"use server";

import { revalidatePath } from "next/cache";
import { AdminError } from "../../../lib/admin/categories";
import {
  readContentBlock,
  writeContentBlock,
} from "../../../lib/admin/site-content";
import { deleteImage, uploadImage } from "../../../lib/admin/storage";

export type ActionState = {
  error?: string;
  savedAt?: number;
};

function readTranslated(formData: FormData, field: string) {
  const uk = String(formData.get(`${field}Uk`) ?? "").trim();
  const en = String(formData.get(`${field}En`) ?? "").trim();

  return { uk, en: en || uk };
}

function fail(error: unknown): ActionState {
  return {
    error:
      error instanceof AdminError ? error.message : "Не вдалося зберегти зміни.",
  };
}

export async function saveAboutAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const heading = readTranslated(formData, "heading");

  if (!heading.uk && !heading.en) {
    return { error: "Вкажіть заголовок." };
  }

  const file = formData.get("photo");
  const shouldRemove = formData.get("removePhoto") === "on";

  try {
    const current = await readContentBlock("about");
    const previousPhoto =
      typeof current.photo === "string" ? current.photo : null;

    const uploaded = await uploadImage(
      file instanceof File ? file : null,
      "content"
    );

    const patch: Record<string, unknown> = {
      heading,
      body: readTranslated(formData, "body"),
      specialities: readTranslated(formData, "specialities"),
      quote: readTranslated(formData, "quote"),
    };

    if (uploaded) {
      patch.photo = uploaded;
    } else if (shouldRemove) {
      patch.photo = null;
    }

    await writeContentBlock("about", patch);

    if ((uploaded || shouldRemove) && previousPhoto) {
      await deleteImage(previousPhoto);
    }

    revalidatePath("/", "layout");

    return { savedAt: Date.now() };
  } catch (error) {
    return fail(error);
  }
}

export async function saveContactAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!phone || !email) {
    return { error: "Телефон і пошта обов'язкові." };
  }

  try {
    await writeContentBlock("contact", {
      heading: readTranslated(formData, "heading"),
      body: readTranslated(formData, "body"),
      availability: readTranslated(formData, "availability"),
      location: readTranslated(formData, "location"),
      phone,
      email,
      telegram: String(formData.get("telegram") ?? "").trim(),
      whatsapp: String(formData.get("whatsapp") ?? "").trim(),
      instagram: String(formData.get("instagram") ?? "").trim(),
      facebook: String(formData.get("facebook") ?? "").trim(),
    });

    revalidatePath("/", "layout");

    return { savedAt: Date.now() };
  } catch (error) {
    return fail(error);
  }
}
