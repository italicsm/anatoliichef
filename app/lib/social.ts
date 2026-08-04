import type { SocialName } from "../components/ui/SocialIcon";

export type SocialLink = {
  label: string;
  href: string;
  name: SocialName;
  /** Brand colour revealed on hover; grey until then. */
  hoverClassName: string;
};

/** TODO: replace the placeholders with the chef's real profiles. */
export const socialLinks: SocialLink[] = [
  {
    label: "Telegram",
    href: "https://t.me/anatoliichef",
    name: "telegram",
    hoverClassName: "hover:text-[#229ED9]",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/34600000000",
    name: "whatsapp",
    hoverClassName: "hover:text-[#25D366]",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/anatoliichef",
    name: "instagram",
    hoverClassName: "hover:text-[#E1306C]",
  },
  {
    label: "Facebook",
    href: "https://facebook.com/anatoliichef",
    name: "facebook",
    hoverClassName: "hover:text-[#1877F2]",
  },
];
