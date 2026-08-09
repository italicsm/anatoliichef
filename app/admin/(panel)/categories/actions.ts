"use server";

import { revalidatePath } from "next/cache";
import {
  AdminError,
  createCategory,
  deleteCategory,
  getCategoryPhoto,
  moveCategory,
  updateCategory,
} from "../../../lib/admin/categories";
import { deleteImage, uploadImage } from "../../../lib/admin/storage";

export type ActionState = {
  error?: string;
  /** Set on every successful save so the form can close or clear itself. */
  savedAt?: number;
};

/**
 * The public menu pages are cached, so every mutation has to invalidate them —
 * otherwise the chef edits the menu and sees no change on the site.
 */
function revalidateMenus(): void {
  revalidatePath("/", "layout");
}

function readTitle(formData: FormData) {
  const uk = String(formData.get("titleUk") ?? "").trim();
  const en = String(formData.get("titleEn") ?? "").trim();

  return { uk, en: en || uk };
}

function fail(error: unknown): ActionState {
  return {
    error:
      error instanceof AdminError
        ? error.message
        : "Не вдалося зберегти зміни.",
  };
}

export async function createCategoryAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = readTitle(formData);
  const menuTypeId = String(formData.get("menuTypeId") ?? "");

  if (!title.uk) {
    return { error: "Вкажіть назву категорії." };
  }

  try {
    await createCategory({ menuTypeId, title });
    revalidateMenus();

    return { savedAt: Date.now() };
  } catch (error) {
    return fail(error);
  }
}

export async function updateCategoryAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  const title = readTitle(formData);

  if (!title.uk) {
    return { error: "Вкажіть назву категорії." };
  }

  const file = formData.get("photo");
  const shouldRemove = formData.get("removePhoto") === "on";

  try {
    const previousPhoto = await getCategoryPhoto(id);

    const uploaded = await uploadImage(
      file instanceof File ? file : null,
      "categories"
    );

    const photo = uploaded ?? (shouldRemove ? null : undefined);

    await updateCategory(id, { title, photo });

    if (photo !== undefined && previousPhoto) {
      await deleteImage(previousPhoto);
    }

    revalidateMenus();

    return { savedAt: Date.now() };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteCategoryAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await deleteCategory(String(formData.get("id") ?? ""));
    revalidateMenus();

    return { savedAt: Date.now() };
  } catch (error) {
    return fail(error);
  }
}

export async function moveCategoryAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const direction = formData.get("direction") === "up" ? "up" : "down";

  try {
    await moveCategory(id, direction);
    revalidateMenus();
  } catch (error) {
    console.error("[admin] could not reorder categories", error);
  }
}
