"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  checkPassword,
  createSessionToken,
  isAdminConfigured,
} from "../../lib/auth";

export type LoginState = {
  error?: string;
};

export async function login(
  _previous: LoginState,
  formData: FormData
): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return {
      error:
        "Адмінка не налаштована: додайте ADMIN_PASSWORD і ADMIN_SESSION_SECRET у .env.local.",
    };
  }

  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/admin");

  if (!(await checkPassword(password))) {
    return { error: "Невірний пароль." };
  }

  const token = await createSessionToken();

  if (!token) {
    return { error: "Не вдалося створити сесію." };
  }

  const store = await cookies();

  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  // Only internal paths, so a crafted ?from= cannot bounce the admin offsite.
  redirect(from.startsWith("/admin") ? from : "/admin");
}

export async function logout(): Promise<void> {
  const store = await cookies();

  store.delete(SESSION_COOKIE);

  redirect("/admin/login");
}
