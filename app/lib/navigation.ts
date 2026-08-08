export type NavItem = {
  label: string;
  href: string;
};

/**
 * One source for the desktop row and the mobile panel — two copies of this
 * list would drift the first time a link is added.
 *
 * Absolute hashes (`/#about`) so the links also work from the menu routes.
 * Gallery is intentionally absent until the section exists.
 */
export const navItems: NavItem[] = [
  { label: "Фуршет", href: "/furshet" },
  { label: "Банкет", href: "/banquet" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];
