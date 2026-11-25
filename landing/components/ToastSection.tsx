"use client";

import { Check, Eye, MessageSquareText, MoreHorizontal, Undo2 } from "lucide-react";
import { useDemo } from "@/components/DemoProvider";
import { ToastStateButton } from "@/components/ToastStateButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { LiveDot } from "@/components/ui/LiveDot";

export function ToastSection() {
  const { messages, showToast } = useDemo();

  return (
    <Reveal>
      <section
        className="mx-auto grid w-[calc(100%-72px)] max-w-[1200px] grid-cols-[minmax(0,0.94fr)_minmax(0,0.86fr)] items-center gap-[70px] py-[126px] max-sm:w-[calc(100%-32px)] max-md:py-[86px] max-lg:grid-cols-1 max-lg:gap-12"
        id="toast-details"
      >
        <div>
          <Eyebrow>Feedback</Eyebrow>
          <h2 className="max-w-[620px] font-display text-[clamp(42px,4.7vw,64px)] font-extrabold leading-[1.02] tracking-[-0.028em] max-sm:text-[42px]">
            Every action gets a little receipt.
          </h2>
          <p className="mt-[22px] max-w-[480px] text-[17px] leading-[1.7] text-muted">
            Save from a shortcut, the popup, or the context menu. Miko confirms what happened right
            on the page without opening another tab.
          </p>
          <div className="mt-9 flex gap-[38px] border-t border-line pt-5 max-sm:gap-[22px]">
            <span className="flex flex-col gap-[3px]">
              <strong className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.01em] text-accent-text">
                2.4s
              </strong>
              <small className="text-xs font-bold text-muted">success toast</small>
            </span>
            <span className="flex flex-col gap-[3px]">
              <strong className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.01em] text-accent-text">
                Undo
              </strong>
              <small className="text-xs font-bold text-muted">on quick remove</small>
            </span>
            <span className="flex flex-col gap-[3px]">
              <strong className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.01em] text-accent-text">
                0
              </strong>
              <small className="text-xs font-bold text-muted">accounts required</small>
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-[18px] border border-line bg-surface shadow-[0_18px_38px_rgba(29,41,36,0.08)]">
          <div className="flex items-center gap-2 border-b border-line bg-surface-soft px-[18px] py-4 text-[13.5px] font-extrabold text-muted">
            <MessageSquareText className="text-accent" size={18} />
            <span>Page toast states</span>
            <span className="ml-auto inline-flex items-center gap-1.5 text-[11.5px] text-accent-text">
              <LiveDot /> live
            </span>
          </div>
          <div className="px-2.5 py-2">
            <ToastStateButton
              icon={<Check size={15} />}
              label="New bookmark"
              onClick={() => showToast(messages.saved, "success")}
              title={messages.saved}
              tone="success"
            />
            <ToastStateButton
              icon={<MoreHorizontal size={15} />}
              label="Duplicate detected"
              onClick={() => showToast(messages.duplicate, "info")}
              title={messages.duplicate}
              tone="info"
            />
            <ToastStateButton
              icon={<Undo2 size={15} />}
              label="Undo available"
              onClick={() => showToast(messages.removed, "success", true)}
              title={messages.removed}
              tone="warning"
            />
          </div>
          <div className="flex items-center gap-[7px] border-t border-line bg-surface-soft px-[18px] py-3.5 text-[11.5px] text-muted">
            <Eye size={15} /> Click a state to fire the real toast above
          </div>
        </div>
      </section>
    </Reveal>
  );
}
