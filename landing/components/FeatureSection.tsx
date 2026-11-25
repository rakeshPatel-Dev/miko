import {
  Bookmark,
  Check,
  Command,
  Keyboard,
  Library,
  MousePointerClick,
  Pencil,
  Trash2,
} from "lucide-react";
import { FeatureCard } from "@/components/FeatureCard";
import { Keycap } from "@/components/ui/Keycap";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const proofRows = [
  { label: "Quick save", keys: "Alt ⇧ S" },
  { label: "Quick remove", keys: "Alt ⇧ R" },
  { label: "Open Miko", keys: "Alt ⇧ M" },
];

export function FeatureSection() {
  return (
    <section
      className="mx-auto w-[calc(100%-72px)] max-w-[1200px] py-[122px] max-sm:w-[calc(100%-32px)] max-md:py-[86px]"
      id="features"
    >
      <Reveal className="flex items-end justify-between max-[820px]:flex-col max-[820px]:items-start max-[820px]:gap-[18px]">
        <div>
          <Eyebrow>The product</Eyebrow>
          <h2 className="max-w-[720px] font-display text-[clamp(42px,4.7vw,64px)] font-extrabold leading-[1.02] tracking-[-0.028em] max-sm:text-[42px]">
            The popup is small.
            <br />
            The useful parts aren&apos;t.
          </h2>
          <p className="mt-5 max-w-[490px] text-[18px] leading-[1.65] text-muted max-sm:text-base">
            Miko is built around the moments that usually turn into 40 open tabs.
          </p>
        </div>
        <span className="pb-1.5 text-right text-[13px] leading-normal text-muted max-[820px]:text-left">
          The complete loop
          <br />
          <strong className="font-extrabold text-accent-text">capture → find → keep</strong>
        </span>
      </Reveal>

      <div className="mt-14 grid grid-cols-2 gap-[22px] max-[820px]:grid-cols-1 max-sm:mt-[38px]">
        <FeatureCard
          description="Save the current page, remove it, or open your library without reaching for the toolbar."
          icon={<Keyboard size={24} />}
          kicker="Shortcuts"
          title="Three shortcuts, each with a job"
          tone="green"
          visual={
            <div className="flex min-h-[208px] items-center justify-center">
              <div className="w-full overflow-hidden rounded-[11px] border border-line bg-surface shadow-[0_10px_24px_rgba(29,41,36,0.09)]">
                <div className="flex items-center gap-[7px] border-b border-line bg-surface-soft px-[13px] py-2.5 text-[11.5px] font-bold text-muted">
                  <Command size={15} /> Chrome shortcut manager
                </div>
                {proofRows.map((row) => (
                  <div
                    className="flex items-center justify-between border-b border-line px-[13px] py-2.5 text-[13px] last:border-0"
                    key={row.label}
                  >
                    <span>{row.label}</span>
                    <Keycap>{row.keys}</Keycap>
                  </div>
                ))}
              </div>
            </div>
          }
          visualClassName="bg-accent-soft"
        />

        <FeatureCard
          delay={0.06}
          description="Links are grouped into Today, Yesterday, This week, and Earlier. No folder taxonomy to maintain."
          icon={<Library size={24} />}
          kicker="Library"
          title="Automatic order, zero filing"
          tone="blue"
          visual={
            <div className="flex min-h-[208px] flex-col justify-center">
              <div className="relative z-[2] flex w-[86%] -rotate-2 flex-col gap-1 rounded-[10px] border border-[#4b6f89]/15 bg-surface px-[15px] py-[13px] shadow-[0_9px_22px_rgba(75,111,137,0.11)]">
                <span className="text-[11px] font-black text-blue-text">Today</span>
                <strong className="text-[13px] font-extrabold">Designing the edges</strong>
                <small className="text-[11px] text-muted">read.cv · 9:42 AM</small>
              </div>
              <div className="relative z-[1] -mt-[18px] ml-auto flex w-[86%] rotate-2 flex-col gap-1 rounded-[10px] border border-[#4b6f89]/15 bg-surface px-[15px] py-[13px] shadow-[0_9px_22px_rgba(75,111,137,0.11)]">
                <span className="text-[11px] font-black text-blue-text">Yesterday</span>
                <strong className="text-[13px] font-extrabold">A nicer way to think about tabs</strong>
                <small className="text-[11px] text-muted">sive.rs · 4:02 PM</small>
              </div>
            </div>
          }
          visualClassName="bg-blue-soft px-[26px] py-[22px]"
        />

        <FeatureCard
          description="Inline title editing, one-click delete, duplicate detection, and a quick remove toast with an Undo action."
          icon={<Pencil size={24} />}
          kicker="Control"
          title="Edit the title. Delete it. Undo it."
          tone="peach"
          visual={
            <div className="flex min-h-[208px] flex-col items-center justify-center">
              <div className="flex w-full items-center gap-[9px] rounded-[10px] border border-[#efd7cd] bg-surface px-3 py-[11px] shadow-[0_8px_20px_rgba(167,95,73,0.09)]">
                <span className="inline-flex size-[26px] items-center justify-center rounded-[7px] bg-blue-soft text-xs font-black text-blue-text">
                  R
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <b className="truncate text-[13px] font-extrabold">Thoughtful interfaces</b>
                  <small className="text-[11px] text-muted">read.cv</small>
                </span>
                <button aria-label="Edit title" className="p-1 text-muted hover:text-peach-text" type="button">
                  <Pencil size={15} />
                </button>
                <button aria-label="Delete bookmark" className="p-1 text-muted hover:text-peach-text" type="button">
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="mt-3 flex w-full items-center gap-[7px] rounded-[9px] bg-ink px-3 py-2.5 text-xs text-white">
                <Check size={15} /> Removed from Miko
                <button className="ml-1 text-xs font-extrabold text-[#a4d6ba]" type="button">
                  Undo
                </button>
              </div>
            </div>
          }
          visualClassName="bg-peach-soft"
        />

        <FeatureCard
          delay={0.06}
          description="Miko's context menu follows the page. It switches between Save page and Remove from Miko as you browse."
          icon={<MousePointerClick size={24} />}
          kicker="Anywhere"
          title="Right-click when a shortcut is too far away"
          tone="yellow"
          visual={
            <div className="relative flex min-h-[208px] items-center justify-center">
              <div className="w-full overflow-hidden rounded-[11px] border border-[#8f6f1d]/20 bg-surface shadow-[0_10px_24px_rgba(93,72,18,0.13)]">
                <div className="flex items-center gap-[9px] border-b border-line bg-surface-soft px-[13px] py-[11px] text-[11.5px] font-black text-muted">
                  <MousePointerClick size={15} /> Page actions
                </div>
                <div className="flex items-center gap-[9px] border-b border-line px-[13px] py-[11px] text-[13px]">
                  <Bookmark className="text-yellow-text" size={15} /> Save page to Miko
                  <Keycap className="ml-auto">↵</Keycap>
                </div>
                <div className="flex items-center gap-[9px] px-[13px] py-[11px] text-[13px] font-extrabold text-accent-text">
                  <Trash2 className="text-yellow-text" size={15} /> Remove from Miko
                  <Check className="ml-auto text-accent" size={15} />
                </div>
              </div>
              <span className="absolute bottom-4 right-[20%] rotate-[-15deg] text-yellow-text">
                <MousePointerClick size={30} />
              </span>
            </div>
          }
          visualClassName="bg-yellow-soft"
        />
      </div>
    </section>
  );
}
