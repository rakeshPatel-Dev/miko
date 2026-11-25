import { ArrowUpRight } from "lucide-react";
import { cx } from "@/lib/cn";

const variants = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  light: "bg-surface text-ink hover:bg-accent-soft hover:text-accent-text",
};

export function ButtonLink({
  children,
  href,
  variant = "primary",
  external = false,
  className,
}: {
  children: React.ReactNode;
  href: string;
  variant?: keyof typeof variants;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      className={cx(
        "inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-4 text-[15px] font-extrabold transition-[background-color,color,transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(29,41,36,0.14)]",
        variants[variant],
        className,
      )}
      href={href}
      {...(external ? { rel: "noreferrer", target: "_blank" } : {})}
    >
      {children}
      {external && <ArrowUpRight className="size-4" />}
    </a>
  );
}

export function TextLink({
  children,
  href,
  className,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
}) {
  const classes = cx(
    "inline-flex items-center gap-2 text-[15px] font-extrabold transition-colors hover:text-accent",
    className,
  );

  if (href) {
    return (
      <a className={classes} href={href}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} onClick={onClick} type="button">
      {children}
    </button>
  );
}
