"use server";

import { revalidatePath } from "next/cache";
import { AdminError } from "../../../lib/admin/categories";
import {
  getMenuTypePhoto,
  updateMenuType,
} from "../../../lib/admin/menu-types";
import { readTranslated } from "../../../lib/admin/form-fields";
import { deleteImage, uploadImage } from "../../../lib/admin/storage";

export type ActionState = {
  error?: string;
  savedAt?: number;
};

export async function updateMenuTypeAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  const title = readTranslated(formData, "title");
  const description = readTranslated(formData, "description");

  if (!title.uk) {
    return { error: "Вкажіть назву меню." };
  }

  const file = formData.get("photo");
  const shouldRemove = formData.get("removePhoto") === "on";

  try {
    const previousPhoto = await getMenuTypePhoto(id);

    // Upload first: if it fails, the row keeps its old photo instead of losing
    // the reference to a file that was never replaced.
    const uploaded = await uploadImage(
      file instanceof File ? file : null,
      "menus"
    );

    const photo = uploaded ?? (shouldRemove ? null : undefined);

    await updateMenuType(id, { title, description, photo });

    if (photo !== undefined && previousPhoto) {
      await deleteImage(previousPhoto);
    }

    revalidatePath("/", "layout");

    return { savedAt: Date.now() };
  } catch (error) {
    return {
      error:
        error instanceof AdminError
          ? error.message
          : "Не вдалося зберегти зміни.",
    };
  }
}
