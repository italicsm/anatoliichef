import { getDictionary } from "../../lib/dictionary";
import type { Locale } from "../../lib/locale";
import Container from "../ui/Container";
import Divider from "../ui/Divider";
import Logo from "../ui/Logo";

export default function Footer({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);

  return (
    <footer>
      <Container>
        <Divider spacing="none" />

        <div className="flex flex-wrap items-center justify-between gap-6 py-10">
          <Logo size="sm" />

          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
            {dictionary.footer.role} · {dictionary.footer.city} · © 2026
          </p>
        </div>
      </Container>
    </footer>
  );
}
