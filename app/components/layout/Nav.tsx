import Link from "next/link";
import { navItems } from "../../lib/navigation";
import BoldOnHover from "../ui/BoldOnHover";

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
