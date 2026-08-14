import type { NavItem } from "../../lib/navigation";
import BoldOnHover from "../ui/BoldOnHover";
import HashLink from "../ui/HashLink";

type NavProps = {
  items: NavItem[];
  className?: string;
};

export default function Nav({ items, className = "" }: NavProps) {
  return (
    <nav aria-label="Main" className={className}>
      {/* Labels come from the database and from three dictionaries, so their
          width is not ours to predict: «Sobre el chef» is twice «About». A
          label is never broken across lines — the row is sized for the longest
          language instead. */}
      <ul className="flex items-center gap-6">
        {items.map((item) => (
          <li key={item.href}>
            <HashLink
              href={item.href}
              className="group whitespace-nowrap text-sm uppercase tracking-[0.2em] text-zinc-800 transition-colors hover:text-zinc-900"
            >
              <BoldOnHover>{item.label}</BoldOnHover>
            </HashLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
