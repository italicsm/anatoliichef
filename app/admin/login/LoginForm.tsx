"use client";

import { useActionState } from "react";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { login, type LoginState } from "./actions";

type LoginFormProps = {
  from: string;
};

export default function LoginForm({ from }: LoginFormProps) {
  const [state, action, isPending] = useActionState<LoginState, FormData>(
    login,
    {}
  );

  return (
    <form action={action} className="mt-10">
      <input type="hidden" name="from" value={from} />

      <label
        htmlFor="admin-password"
        className="text-xs uppercase tracking-[0.25em] text-zinc-500"
      >
        Пароль
      </label>

      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
        className="mt-2 w-full border-b border-zinc-300 bg-transparent py-2 text-zinc-900 outline-none transition-colors focus:border-zinc-900"
      />

      {state.error ? (
        <p aria-live="polite" className="mt-4 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <Button
        type="submit"
        size="sm"
        disabled={isPending}
        className="mt-8 w-full gap-3 text-sm uppercase tracking-[0.2em]"
      >
        {isPending ? <Spinner /> : null}
        {isPending ? "Вхід" : "Увійти"}
      </Button>
    </form>
  );
}
