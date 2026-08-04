import { socialLinks } from "../../lib/social";
import SocialIcon from "./SocialIcon";

type SocialLinksProps = {
  size?: "sm" | "md";
  className?: string;
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
}: SocialLinksProps) {
  return (
    <ul className={`flex flex-wrap items-center ${gaps[size]} ${className}`}>
      {socialLinks.map((link) => (
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
