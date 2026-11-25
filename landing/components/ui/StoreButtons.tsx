import { ArrowUpRight } from "lucide-react";
import { cx } from "@/lib/cn";
import { storeLinks } from "@/lib/landing";

const tones = {
  light: {
    primary: "bg-accent text-white hover:bg-accent-hover",
    secondary: "border border-ink/15 text-muted",
  },
  dark: {
    primary: "bg-surface text-ink hover:bg-accent-soft hover:text-accent-text",
    secondary: "border border-white/35 text-[#ddf2e3]",
  },
} as const;

export function StoreButtons({
  className,
  compact = false,
  hideSecondaryOnMobile = false,
  tone = "light",
}: {
  className?: string;
  compact?: boolean;
  hideSecondaryOnMobile?: boolean;
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
      <span
        aria-disabled="true"
        className={cx(
          "inline-flex cursor-default items-center justify-center rounded-full font-extrabold",
          compact ? "px-4 py-2.5 text-[13px]" : "px-6 py-4 text-[15px]",
          tones[tone].secondary,
          hideSecondaryOnMobile && "max-sm:hidden",
        )}
      >
        {storeLinks.chrome.label}
      </span>
    </div>
  );
}
