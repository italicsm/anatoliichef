type TextSize = "sm" | "md" | "lg";

type TextProps = {
  children: React.ReactNode;
  size?: TextSize;
  muted?: boolean;
  className?: string;
};

const sizeStyles: Record<TextSize, string> = {
  sm: "text-sm leading-6",
  md: "text-base leading-7",
  lg: "text-lg leading-8",
};

export default function Text({
  children,
  size = "md",
  muted = false,
  className = "",
}: TextProps) {
  return (
    <p
      className={`${sizeStyles[size]} ${
        muted ? "text-zinc-500" : "text-zinc-600"
      } ${className}`}
    >
      {children}
    </p>
  );
}
