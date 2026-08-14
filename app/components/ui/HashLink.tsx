"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type HashLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
};

/**
 * A link to a section of the current page that works the second time too.
 *
 * The browser treats a click on the address it is already at as a no-op: no
 * navigation, no scroll. So a guest who jumped to Contacts, scrolled back up
 * and pressed Contacts again got nothing at all — the address still said
 * #contact, and nothing had changed for the browser to react to.
 *
 * Taking the click over ourselves removes the question entirely: if the target
 * exists on this page, we scroll to it, every time, whatever the address says.
 * Everything else — a link to another page, a hash for a section that is not
 * here — falls through to the ordinary Link.
 *
 * Smoothness and the offset for the sticky header both come from CSS
 * (`scroll-behavior` and `scroll-padding-top` on <html>), which scrollIntoView
 * honours. They are not repeated here.
 */
export default function HashLink({
  href,
  children,
  className = "",
  onClick,
  "aria-label": ariaLabel,
}: HashLinkProps) {
  const pathname = usePathname();
  const [path, hash] = href.split("#");

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    onClick?.();

    if (!hash) {
      return;
    }

    // A hash on another page is an ordinary navigation.
    if (path && path !== pathname) {
      return;
    }

    const target = document.getElementById(hash);

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView();

    // replaceState rather than pushState: pressing the same menu item five
    // times should not cost five presses of the back button.
    window.history.replaceState(null, "", href);
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}
