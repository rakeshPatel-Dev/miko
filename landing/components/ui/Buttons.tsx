import { cx } from "@/lib/cn";

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
