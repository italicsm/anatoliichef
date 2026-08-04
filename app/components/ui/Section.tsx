type SectionSpacing = "sm" | "md" | "lg";

type SectionProps = {
  children: React.ReactNode;
  id?: string;
  spacing?: SectionSpacing;
  className?: string;
};

const spacingStyles: Record<SectionSpacing, string> = {
  sm: "py-12 md:py-14",
  md: "py-16 md:py-20",
  lg: "py-20 md:py-28",
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
