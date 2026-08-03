import Link from "next/link";

type ButtonSize = "sm" | "md";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  size?: ButtonSize;
  className?: string;
};

const baseStyles =
  "inline-flex items-center justify-center rounded-full bg-black text-white transition hover:bg-zinc-800";

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-7 py-3",
  md: "px-10 py-4",
};

export default function Button({
  children,
  href,
  size = "md",
  className = "",
}: ButtonProps) {
  const styles = `${baseStyles} ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={styles}>
      {children}
    </button>
  );
}
