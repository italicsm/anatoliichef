"use server";

import { revalidatePath } from "next/cache";
import { AdminError } from "../../../lib/admin/categories";
import {
  deleteOrder,
  isOrderStatus,
  setOrderStatus,
} from "../../../lib/admin/orders";

export type ActionState = {
  error?: string;
  savedAt?: number;
};

export async function setOrderStatusAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!isOrderStatus(status)) {
    return { error: "Невідомий статус." };
  }

  try {
    await setOrderStatus(id, status);
    revalidatePath("/admin/orders");

    return { savedAt: Date.now() };
  } catch (error) {
    return {
      error:
        error instanceof AdminError
          ? error.message
          : "Не вдалося змінити статус.",
    };
  }
}

export async function deleteOrderAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { error: "Не вдалося визначити, яке замовлення видалити." };
  }

  try {
    await deleteOrder(id);
    revalidatePath("/admin/orders");

    return { savedAt: Date.now() };
  } catch (error) {
    return {
      error:
        error instanceof AdminError
          ? error.message
          : "Не вдалося видалити замовлення.",
    };
  }
}
