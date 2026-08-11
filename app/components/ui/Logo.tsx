type LogoSize = "sm" | "md" | "responsive";

type LogoProps = {
  size?: LogoSize;
  className?: string;
};

// Script faces sit small inside their em box, so these run larger than the
// equivalent sans setting would.
//
// "responsive" exists so the header can change size with one element instead of
// rendering both sizes and hiding one. Two elements meant two logotypes in the
// markup at all times, and a single display class going astray showed both.
const sizeStyles: Record<LogoSize, string> = {
  sm: "text-[2.35rem]",
  md: "text-[3.1rem]",
  responsive: "text-[2.35rem] xl:text-[3.1rem]",
};

/**
 * Signature-style wordmark, family chosen in app/fonts.ts.
 * Replace the inner markup with an SVG once the real hand-drawn logotype is
 * ready — the props and spacing contract stay the same.
 */
export default function Logo({ size = "md", className = "" }: LogoProps) {
  return (
    <span
      // The script face carries tall ascenders, so its box sits lower than the
      // ink. The em-relative nudge lifts it back onto the optical baseline of
      // the row and scales with whatever size is used.
      className={`inline-block -translate-y-[0.12em] font-signature whitespace-nowrap leading-none text-zinc-900 ${sizeStyles[size]} ${className}`}
    >
      Anatolii Lukianchuk
    </span>
  );
}
