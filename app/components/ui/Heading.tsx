type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingSize = "sm" | "md" | "lg" | "xl" | "2xl";

type HeadingProps = {
  children: React.ReactNode;
  level?: HeadingLevel;
  size?: HeadingSize;
  className?: string;
};

const sizeStyles: Record<HeadingSize, string> = {
  sm: "text-xl",
  md: "text-2xl md:text-3xl",
  lg: "text-3xl md:text-4xl",
  xl: "text-4xl md:text-5xl",
  "2xl": "text-5xl md:text-6xl",
};

const defaultSizeByLevel: Record<HeadingLevel, HeadingSize> = {
  1: "2xl",
  2: "xl",
  3: "lg",
  4: "md",
  5: "sm",
  6: "sm",
};

export default function Heading({
  children,
  level = 2,
  size,
  className = "",
}: HeadingProps) {
  const Tag = `h${level}` as const;

  return (
    <Tag
      className={`font-extralight tracking-wide text-zinc-900 ${
        sizeStyles[size ?? defaultSizeByLevel[level]]
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
