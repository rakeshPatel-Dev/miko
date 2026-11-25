import { cx } from "@/lib/cn";

export function IconButton({
  label,
  children,
  className,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      className={cx(
        "inline-flex items-center justify-center rounded-[9px] p-2 text-muted transition-colors hover:bg-surface-soft hover:text-ink",
        className,
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
