import { cx } from "@/lib/cn";
import { toneStyles, type Tone } from "@/lib/landing";

const sizes = {
  sm: "size-[34px] rounded-[10px]",
  md: "size-10 rounded-[11px]",
  lg: "size-[52px] rounded-[15px]",
};

export function IconTile({
  children,
  tone = "green",
  size = "md",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center justify-center",
        sizes[size],
        toneStyles[tone].tile,
        className,
      )}
    >
      {children}
    </span>
  );
}
