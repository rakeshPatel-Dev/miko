"use client";

import { Bell, Check, Keyboard, RotateCcw, Settings, ArrowUpRight } from "lucide-react";
import { useDemo } from "@/components/DemoProvider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { cx } from "@/lib/cn";

const messageRows = [
  { key: "saved", label: "New bookmark", dot: "bg-[#83c9a5]" },
  { key: "duplicate", label: "Already saved", dot: "bg-[#e5cc78]" },
  { key: "removed", label: "Removed bookmark", dot: "bg-[#e3a489]" },
] as const;

export function CustomizeSection() {
  const { messages, openSettingsPreview } = useDemo();

  return (
    <Reveal>
      <section
        className="mx-auto grid w-[calc(100%-72px)] max-w-[1200px] grid-cols-[minmax(0,0.98fr)_minmax(0,0.82fr)] items-center gap-[70px] rounded-[26px] bg-dark px-[74px] py-[78px] text-[#f3f7f3] max-md:w-[calc(100%-32px)] max-md:rounded-[18px] max-md:px-6 max-md:py-12 max-lg:grid-cols-1 max-lg:gap-12 max-lg:px-14"
        id="settings"
      >
        <div>
          <Eyebrow light>Customize</Eyebrow>
          <h2 className="max-w-[560px] font-display text-[clamp(42px,4.7vw,64px)] font-extrabold leading-[1.02] tracking-[-0.028em] max-sm:text-[42px]">
            Make the confirmation sound like you.
          </h2>
          <p className="mt-[22px] max-w-[480px] text-[17px] leading-[1.7] text-[#aebfb4]">
            Open Settings from the popup to choose your browser shortcuts and rewrite every message
            Miko shows after an action.
          </p>

          <div className="mt-[30px] flex max-w-[520px] flex-col border-t border-[#dfeae2]/[0.18]">
            {messageRows.map((row) => (
              <span
                className="flex items-center gap-[9px] border-b border-[#dfeae2]/[0.14] py-[13px] text-sm text-[#aebfb4]"
                key={row.key}
              >
                <i className={cx("size-2 rounded-full", row.dot)} />
                {row.label}
                <b className="ml-auto max-w-[240px] truncate font-bold text-[#f3f7f3] max-sm:max-w-[150px]">
                  {messages[row.key]}
                </b>
              </span>
            ))}
          </div>

          <button
            className="mt-7 inline-flex items-center gap-2 text-[15px] font-extrabold text-[#b6e0c6] transition-colors hover:text-white"
            onClick={openSettingsPreview}
            type="button"
          >
            Open the settings preview <ArrowUpRight className="size-[17px]" />
          </button>
        </div>

        <div className="rotate-[1.5deg] overflow-hidden rounded-[18px] border border-[#dfeae2]/[0.13] bg-[#22382c] shadow-[0_24px_44px_rgba(0,0,0,0.18)] max-md:rotate-0">
          <div className="flex items-center justify-between px-[18px] py-4 text-xs font-bold text-[#9fc0ac]">
            <span className="inline-flex items-center gap-[7px]">
              <Settings size={16} /> settings in the popup
            </span>
            <span className="text-[#83c9a5]">local only</span>
          </div>
          <div className="border-y border-[#dfeae2]/[0.15] px-[18px] py-1.5">
            <div className="flex items-center justify-between border-b border-[#dfeae2]/[0.1] py-[18px]">
              <span className="inline-flex items-center gap-[9px] text-sm font-bold text-[#d9eadf]">
                <Keyboard className="text-[#87c9a2]" size={18} /> Keyboard shortcuts
              </span>
              <b className="text-xs font-bold text-[#89be9f]">3 actions</b>
            </div>
            <div className="flex items-center justify-between border-b border-[#dfeae2]/[0.1] py-[18px]">
              <span className="inline-flex items-center gap-[9px] text-sm font-bold text-[#d9eadf]">
                <Bell className="text-[#87c9a2]" size={18} /> Toast messages
              </span>
              <b className="text-xs font-bold text-[#89be9f]">4 editable</b>
            </div>
            <div className="flex items-center justify-between py-[18px]">
              <span className="inline-flex items-center gap-[9px] text-sm font-bold text-[#d9eadf]">
                <RotateCcw className="text-[#87c9a2]" size={18} /> Reset anytime
              </span>
              <b className="text-xs font-bold text-[#89be9f]">one click</b>
            </div>
          </div>
          <div className="flex items-center justify-start gap-2 px-[18px] py-4 text-xs font-bold text-[#9fc0ac]">
            <Check className="text-[#83c9a5]" size={16} /> Saved to your device
          </div>
        </div>
      </section>
    </Reveal>
  );
}
