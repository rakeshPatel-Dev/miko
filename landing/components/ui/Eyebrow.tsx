import { cx } from "@/lib/cn";

export function Eyebrow({
  children,
  light = false,
  className,
}: {
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cx(
        "mb-[18px] text-xs font-black uppercase tracking-[0.17em]",
        light ? "text-[#93d6b0]" : "text-accent-text",
        className,
      )}
    >
      {children}
    </p>
  );
}
