type BadgeVariant = "neutral" | "outline" | "solid";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantStyles: Record<BadgeVariant, string> = {
  neutral: "bg-zinc-100 text-zinc-700",
  outline: "border border-zinc-300 text-zinc-700",
  solid: "bg-black text-white",
};

export default function Badge({
  children,
  variant = "neutral",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
