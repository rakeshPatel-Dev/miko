import { cx } from "@/lib/cn";

export function LiveDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "inline-block size-2 shrink-0 rounded-full bg-[#6db994] shadow-[0_0_0_4px_rgba(109,185,148,0.18)]",
        className,
      )}
    />
  );
}
