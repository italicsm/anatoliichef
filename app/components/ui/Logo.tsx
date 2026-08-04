type LogoSize = "sm" | "md";

type LogoProps = {
  size?: LogoSize;
  className?: string;
};

// Script faces sit small inside their em box, so these run larger than the
// equivalent sans setting would.
const sizeStyles: Record<LogoSize, string> = {
  sm: "text-[2.35rem]",
  md: "text-[3.1rem]",
};

/**
 * Signature-style wordmark, family chosen in app/fonts.ts.
 * Replace the inner markup with an SVG once the real hand-drawn logotype is
 * ready — the props and spacing contract stay the same.
 */
export default function Logo({ size = "md", className = "" }: LogoProps) {
  return (
    <span
      className={`font-signature whitespace-nowrap leading-none text-zinc-900 ${sizeStyles[size]} ${className}`}
    >
      Anatolii Lukianchuk
    </span>
  );
}
