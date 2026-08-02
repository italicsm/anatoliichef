type SectionSpacing = "sm" | "md" | "lg";

type SectionProps = {
  children: React.ReactNode;
  id?: string;
  spacing?: SectionSpacing;
  className?: string;
};

const spacingStyles: Record<SectionSpacing, string> = {
  sm: "py-16 md:py-20",
  md: "py-24 md:py-32",
  lg: "py-32 md:py-44",
};

export default function Section({
  children,
  id,
  spacing = "md",
  className = "",
}: SectionProps) {
  return (
    <section id={id} className={`${spacingStyles[spacing]} ${className}`}>
      {children}
    </section>
  );
}
