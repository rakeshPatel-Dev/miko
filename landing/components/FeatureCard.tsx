import { Reveal } from "@/components/ui/Reveal";
import { IconTile } from "@/components/ui/IconTile";
import { cx } from "@/lib/cn";
import type { Tone } from "@/lib/landing";

export function FeatureCard({
  icon,
  tone,
  kicker,
  title,
  description,
  visual,
  visualClassName,
  delay = 0,
}: {
  icon: React.ReactNode;
  tone: Tone;
  kicker: string;
  title: string;
  description: string;
  visual: React.ReactNode;
  visualClassName: string;
  delay?: number;
}) {
  return (
    <Reveal
      className="group flex flex-col rounded-3xl border border-line bg-surface p-[30px] pb-[26px] transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(29,41,36,0.1)] max-sm:p-6 max-sm:px-[22px]"
      delay={delay}
    >
      <div className="mb-[26px] flex items-center justify-between">
        <IconTile size="lg" tone={tone}>
          {icon}
        </IconTile>
        <span className="text-xs font-black uppercase tracking-[0.12em] text-muted">{kicker}</span>
      </div>
      <h3 className="font-display text-[28px] font-bold leading-[1.08] tracking-[-0.018em] max-sm:text-2xl">
        {title}
      </h3>
      <p className="mt-[11px] text-base leading-[1.65] text-muted">{description}</p>
      <div className={cx("mt-[26px] rounded-2xl p-5", visualClassName)}>{visual}</div>
    </Reveal>
  );
}
