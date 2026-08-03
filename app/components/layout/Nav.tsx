import Link from "next/link";

type NavItem = {
  label: string;
  href: string;
};

/**
 * Absolute hashes (`/#about`) so the links also work from the menu routes.
 * Gallery is intentionally absent until the section exists.
 */
const navItems: NavItem[] = [
  { label: "About", href: "/#about" },
  { label: "Фуршет", href: "/furshet" },
  { label: "Банкет", href: "/banquet" },
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
              className="group inline-grid place-items-center text-sm uppercase tracking-[0.2em] text-zinc-800 transition-colors hover:text-zinc-900"
            >
              {/* Reserves the bold width so hovering never shifts the row. */}
              <span
                aria-hidden="true"
                className="invisible col-start-1 row-start-1 font-semibold"
              >
                {item.label}
              </span>
              <span className="col-start-1 row-start-1 transition-[font-weight] duration-200 group-hover:font-semibold">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
