type DividerSpacing = "none" | "sm" | "md" | "lg";

type DividerProps = {
  spacing?: DividerSpacing;
  className?: string;
};

const spacingStyles: Record<DividerSpacing, string> = {
  none: "my-0",
  sm: "my-8",
  md: "my-12",
  lg: "my-20",
};

export default function Divider({
  spacing = "md",
  className = "",
}: DividerProps) {
  return (
    <hr
      className={`border-0 border-t border-zinc-200 ${spacingStyles[spacing]} ${className}`}
    />
  );
}
