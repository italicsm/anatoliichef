import type { Metadata } from "next";
import Logo from "../../components/ui/Logo";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Вхід — панель керування",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Logo size="sm" />

        <p className="mt-8 text-xs uppercase tracking-[0.25em] text-zinc-500">
          Панель керування
        </p>

        <LoginForm from={from ?? "/admin"} />
      </div>
    </main>
  );
}
