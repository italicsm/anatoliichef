"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminError } from "../../../lib/admin/categories";
import {
  addDishPhoto,
  addPlacement,
  createDish,
  deleteDish,
  deleteDishPhoto,
  getDishPhotoUrl,
  makeDishPhotoMain,
  parsePrice,
  removePlacement,
  updateDish,
  updatePlacement,
} from "../../../lib/admin/dishes";
import { readTranslated } from "../../../lib/admin/form-fields";
import { deleteImage, uploadImage } from "../../../lib/admin/storage";

export type ActionState = {
  error?: string;
  /** Set on every successful save so the form can clear or collapse itself. */
  savedAt?: number;
};

function revalidateMenus(): void {
  revalidatePath("/", "layout");
}

function fail(error: unknown): ActionState {
  return {
    error:
      error instanceof AdminError ? error.message : "Не вдалося зберегти зміни.",
  };
}

export async function createDishAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = readTranslated(formData, "title");
  const description = readTranslated(formData, "description");

  if (!title.uk) {
    return { error: "Вкажіть назву страви." };
  }

  let id: string;

  try {
    id = await createDish({ title, description });
    revalidateMenus();
  } catch (error) {
    return fail(error);
  }

  // Straight into the editor, because a dish is useless until it is placed
  // into a menu with a price.
  redirect(`/admin/dishes/${id}`);
}

export async function updateDishAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  const title = readTranslated(formData, "title");
  const description = readTranslated(formData, "description");
  const isActive = formData.get("isActive") === "on";

  if (!title.uk) {
    return { error: "Вкажіть назву страви." };
  }

  try {
    await updateDish(id, { title, description, isActive });
    revalidateMenus();

    return { savedAt: Date.now() };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteDishAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await deleteDish(String(formData.get("id") ?? ""));
    revalidateMenus();
  } catch (error) {
    return fail(error);
  }

  redirect("/admin/dishes");
}

export async function addDishPhotoAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const dishId = String(formData.get("dishId") ?? "");
  const file = formData.get("photo");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Оберіть файл." };
  }

  try {
    const url = await uploadImage(file, `dishes/${dishId}`);

    if (!url) {
      return { error: "Файл не завантажився." };
    }

    await addDishPhoto({ dishId, url, alt: {} });
    revalidateMenus();

    return { savedAt: Date.now() };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteDishPhotoAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");

  try {
    // Read the URL before the row disappears, or the file is orphaned in the
    // bucket with nothing left pointing at it.
    const url = await getDishPhotoUrl(id);

    await deleteDishPhoto(id);
    await deleteImage(url);
    revalidateMenus();

    return { savedAt: Date.now() };
  } catch (error) {
    return fail(error);
  }
}

export async function makeDishPhotoMainAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await makeDishPhotoMain(String(formData.get("id") ?? ""));
    revalidateMenus();

    return { savedAt: Date.now() };
  } catch (error) {
    return fail(error);
  }
}

export async function addPlacementAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const price = parsePrice(String(formData.get("price") ?? ""));

  if (price === null) {
    return { error: "Ціна має бути числом, наприклад 12,50." };
  }

  const portion = String(formData.get("portion") ?? "").trim();

  try {
    await addPlacement({
      dishId: String(formData.get("dishId") ?? ""),
      categoryId: String(formData.get("categoryId") ?? ""),
      price,
      portion: portion || null,
    });
    revalidateMenus();

    return { savedAt: Date.now() };
  } catch (error) {
    return fail(error);
  }
}

export async function updatePlacementAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const price = parsePrice(String(formData.get("price") ?? ""));

  if (price === null) {
    return { error: "Ціна має бути числом, наприклад 12,50." };
  }

  const portion = String(formData.get("portion") ?? "").trim();

  try {
    await updatePlacement(String(formData.get("id") ?? ""), {
      price,
      portion: portion || null,
    });
    revalidateMenus();

    return { savedAt: Date.now() };
  } catch (error) {
    return fail(error);
  }
}

export async function removePlacementAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { error: "Не вдалося визначити, яке розміщення прибрати." };
  }

  try {
    await removePlacement(id);
    revalidateMenus();

    return { savedAt: Date.now() };
  } catch (error) {
    return fail(error);
  }
}
