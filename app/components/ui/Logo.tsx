type LogoSize = "sm" | "md";

type LogoProps = {
  size?: LogoSize;
  className?: string;
};

const sizeStyles: Record<LogoSize, string> = {
  sm: "text-sm tracking-[0.3em]",
  md: "text-base tracking-[0.35em]",
};

/**
 * Text-based placeholder logo.
 * Replace the inner markup with an SVG once the final mark is available —
 * the props and spacing contract stay the same.
 */
export default function Logo({ size = "md", className = "" }: LogoProps) {
  return (
    <span
      className={`font-extralight uppercase text-zinc-900 ${sizeStyles[size]} ${className}`}
    >
      Anatolii Lukianchuk
    </span>
  );
}
