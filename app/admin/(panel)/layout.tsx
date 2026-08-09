import type { Metadata } from "next";
import AdminNav from "../../components/admin/AdminNav";
import Container from "../../components/ui/Container";
import Logo from "../../components/ui/Logo";
import { logout } from "../login/actions";

export const metadata: Metadata = {
  title: "Панель керування",
  robots: { index: false, follow: false },
};

/**
 * The shell lives in a route group so it wraps the authenticated screens only.
 * A layout at app/admin would also wrap the login page and show its navigation
 * to someone who has not signed in yet.
 */
export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-zinc-200">
        <Container className="flex flex-wrap items-center justify-between gap-6 py-6">
          <div className="flex flex-wrap items-center gap-8">
            <Logo size="sm" />
            <AdminNav />
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="text-xs uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-zinc-900"
            >
              Вийти
            </button>
          </form>
        </Container>
      </header>

      <main>
        <Container className="py-12">{children}</Container>
      </main>
    </div>
  );
}
