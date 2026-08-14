import Link from "next/link";
import HashLink from "./HashLink";

type ButtonSize = "sm" | "md";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  size?: ButtonSize;
  className?: string;
  /** Runs on click in both forms — a link still needs it to dismiss a panel. */
  onClick?: () => void;
  /** Ignored when href is set, since a link cannot submit a form. */
  type?: "button" | "submit";
  disabled?: boolean;
};

const baseStyles =
  "inline-flex items-center justify-center rounded-full bg-zinc-700 text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:bg-zinc-300";

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-7 py-3",
  md: "px-10 py-4",
};

export default function Button({
  children,
  href,
  size = "md",
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const styles = `${baseStyles} ${sizeStyles[size]} ${className}`;

  if (href) {
    // A link to a section of the current page needs the click taken over, or
    // pressing it twice does nothing the second time. See HashLink.
    const Component = href.includes("#") ? HashLink : Link;

    return (
      <Component href={href} className={styles} onClick={onClick}>
        {children}
      </Component>
    );
  }

  return (
    <button
      type={type}
      className={styles}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
