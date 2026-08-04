type TextSize = "sm" | "md" | "lg";

type TextProps = {
  children: React.ReactNode;
  size?: TextSize;
  muted?: boolean;
  className?: string;
};

// Cormorant runs small for its point size, so every step is one notch up
// from the equivalent sans setting.
const sizeStyles: Record<TextSize, string> = {
  sm: "text-xl leading-8",
  md: "text-2xl leading-9",
  lg: "text-3xl leading-10",
};

export default function Text({
  children,
  size = "md",
  muted = false,
  className = "",
}: TextProps) {
  return (
    <p
      className={`font-serif ${sizeStyles[size]} ${
        muted ? "text-zinc-500" : "text-zinc-600"
      } ${className}`}
    >
      {children}
    </p>
  );
}
