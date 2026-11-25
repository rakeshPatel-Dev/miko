import { ArrowUpRight } from "lucide-react";
import { cx } from "@/lib/cn";
import { storeLinks } from "@/lib/landing";

const tones = {
  light: {
    primary: "bg-accent text-white hover:bg-accent-hover",
  },
  dark: {
    primary: "bg-surface text-ink hover:bg-accent-soft hover:text-accent-text",
  },
} as const;

export function StoreButtons({
  className,
  compact = false,
  tone = "light",
}: {
  className?: string;
  compact?: boolean;
  tone?: keyof typeof tones;
}) {
  return (
    <div className={cx("flex flex-wrap items-center gap-2.5 max-sm:flex-col max-sm:items-stretch", className)}>
      <a
        className={cx(
          "inline-flex items-center justify-center gap-2 rounded-full font-extrabold transition-[background-color,color,transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(29,41,36,0.14)]",
          compact ? "px-4 py-2.5 text-[13px]" : "px-6 py-4 text-[15px]",
          tones[tone].primary,
        )}
        href={storeLinks.firefox.href}
        rel="noreferrer"
        target="_blank"
      >
        {storeLinks.firefox.label}
        <ArrowUpRight className={compact ? "size-3.5" : "size-4"} />
      </a>
    </div>
  );
}
