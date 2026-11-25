import { ArrowRight } from "lucide-react";
import { cx } from "@/lib/cn";

const tones = {
  success: "bg-accent-soft text-accent",
  info: "bg-yellow-soft text-yellow-text",
  warning: "bg-peach-soft text-peach-text",
};

export function ToastStateButton({
  icon,
  title,
  label,
  tone,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  label: string;
  tone: keyof typeof tones;
  onClick: () => void;
}) {
  return (
    <button
      className="flex w-full items-center gap-[11px] border-b border-line px-2 py-3.5 text-left last:border-0 hover:bg-surface-soft"
      onClick={onClick}
      type="button"
    >
      <span className={cx("inline-flex size-[34px] items-center justify-center rounded-[9px]", tones[tone])}>
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <b className="truncate text-[14.5px] font-extrabold">{title}</b>
        <small className="text-[11.5px] text-muted">{label}</small>
      </span>
      <ArrowRight className="text-[#9aa79f]" size={15} />
    </button>
  );
}
