import { cx } from "@/lib/cn";

export function Keycap({
  children,
  size = "md",
  className,
}: {
  children: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <kbd
      className={cx(
        "inline-flex items-center whitespace-nowrap rounded-md border border-line bg-surface-soft font-body font-extrabold leading-none text-muted",
        size === "sm" ? "px-[5px] py-1 text-[9.5px]" : "px-[7px] py-[5px] text-[11px]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
