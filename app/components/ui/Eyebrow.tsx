type EyebrowProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Small caps label that sits above a heading.
 */
export default function Eyebrow({ children, className = "" }: EyebrowProps) {
  return (
    <p
      className={`text-base uppercase tracking-[0.5em] text-zinc-500 ${className}`}
    >
      {children}
    </p>
  );
}
