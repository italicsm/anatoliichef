export type SocialName = "telegram" | "whatsapp" | "instagram" | "facebook";

type SocialIconProps = {
  name: SocialName;
  className?: string;
};

/**
 * Hand-drawn glyphs rather than an icon package: four shapes do not justify a
 * dependency. They inherit currentColor, so colour is decided by the link.
 */
const paths: Record<SocialName, string> = {
  telegram:
    "M22 3 1.8 10.9c-.6.2-.6 1 0 1.2l4.9 1.6 1.9 5.7c.2.5.8.6 1.1.2l2.6-2.6 4.9 3.6c.4.3 1 .1 1.1-.4L23 3.8c.1-.6-.4-1-1-.8zM8.6 13.4l9.6-6-7.8 7.1c-.2.2-.3.4-.3.6l-.3 2.4-1.2-4.1z",
  whatsapp:
    "M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.2 14.8l-.4-.2-2.4.6.6-2.3-.2-.4A8 8 0 0 1 12 4zM8.8 7.4c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.8 4.3 3.8 2 .8 2.4.7 2.9.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3l-1.6-.8c-.2-.1-.4-.1-.6.1l-.6.9c-.1.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.3-1.6-1.4-1.9-.1-.2 0-.4.1-.5l.5-.6c.1-.2.1-.3.2-.5 0-.2 0-.4-.1-.5l-.7-1.6c-.2-.4-.4-.4-.6-.4z",
  instagram:
    "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm5.5-3.6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z",
  facebook:
    "M13.5 21.9V13h3l.5-3.5h-3.5V7.3c0-1 .3-1.7 1.7-1.7h1.9V2.5c-.3 0-1.5-.1-2.7-.1-2.7 0-4.6 1.7-4.6 4.7v2.4H6.8V13h3v8.9h3.7z",
};

export default function SocialIcon({ name, className = "" }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={`h-6 w-6 ${className}`}
    >
      <path d={paths[name]} />
    </svg>
  );
}
