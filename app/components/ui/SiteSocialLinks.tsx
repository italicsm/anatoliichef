import { getContactContent } from "../../lib/site-content";
import SocialLinks from "./SocialLinks";

type SiteSocialLinksProps = {
  size?: "sm" | "md";
  className?: string;
};

/**
 * Server wrapper that reads the links the chef entered in the panel, so every
 * place on the site shows the same set. Client components cannot fetch, so
 * they receive the same values as props instead — see (site)/layout.tsx.
 */
export default async function SiteSocialLinks({
  size = "md",
  className = "",
}: SiteSocialLinksProps) {
  const content = await getContactContent();

  return (
    <SocialLinks
      size={size}
      className={className}
      links={{
        telegram: content.telegram,
        whatsapp: content.whatsapp,
        instagram: content.instagram,
        facebook: content.facebook,
      }}
    />
  );
}
