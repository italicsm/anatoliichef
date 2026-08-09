import { socialLinks } from "../../lib/social";
import SocialIcon, { type SocialName } from "./SocialIcon";

type SocialLinksProps = {
  size?: "sm" | "md";
  className?: string;
  /** Overrides the built-in defaults; empty values drop the icon entirely. */
  links?: Partial<Record<SocialName, string>>;
};

const iconSizes = {
  sm: "h-5 w-5",
  md: "h-6 w-6",
} as const;

const gaps = {
  sm: "gap-6",
  md: "gap-8",
} as const;

export default function SocialLinks({
  size = "md",
  className = "",
  links,
}: SocialLinksProps) {
  // A network the chef cleared in the panel should disappear, not link to an
  // empty page — hence filtering rather than falling back to a default.
  const entries = socialLinks
    .map((link) => ({
      ...link,
      href: links ? (links[link.name] ?? "") : link.href,
    }))
    .filter((link) => link.href.trim().length > 0);

  if (entries.length === 0) {
    return null;
  }

  return (
    <ul className={`flex flex-wrap items-center ${gaps[size]} ${className}`}>
      {entries.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block text-zinc-500 transition-colors duration-300 ${link.hoverClassName}`}
          >
            <SocialIcon name={link.name} className={iconSizes[size]} />
            <span className="sr-only">{link.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
