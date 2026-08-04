import Link from "next/link";
import BoldOnHover from "../ui/BoldOnHover";

type NavItem = {
  label: string;
  href: string;
};

/**
 * Absolute hashes (`/#about`) so the links also work from the menu routes.
 * Gallery is intentionally absent until the section exists.
 */
const navItems: NavItem[] = [
  { label: "Фуршет", href: "/furshet" },
  { label: "Банкет", href: "/banquet" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

type NavProps = {
  className?: string;
};

export default function Nav({ className = "" }: NavProps) {
  return (
    <nav aria-label="Main" className={className}>
      <ul className="flex items-center gap-10">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group text-sm uppercase tracking-[0.2em] text-zinc-800 transition-colors hover:text-zinc-900"
            >
              <BoldOnHover>{item.label}</BoldOnHover>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
