"use client";

import { Bookmark, Check, LockKeyhole, MoreHorizontal, Undo2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { defaultToastMessages, type ToastKind } from "@/lib/landing";
import { PreviewCard } from "./PreviewCard";

export function ToastPreview({
  message,
  onShow,
}: {
  message: string;
  onShow: (message: string, kind?: ToastKind, withUndo?: boolean) => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <PreviewCard className="relative bg-[#f5f8f4]" label="Miko page toast preview">
      <div className="relative flex-1 overflow-hidden px-[22px] pt-[18px] max-sm:px-4">
        <div className="inline-flex max-w-full items-center gap-[7px] rounded-full border border-line bg-surface px-[13px] py-2 text-[12px] text-muted">
          <LockKeyhole className="text-accent" size={12} />
          read.cv / thoughtful interfaces
        </div>

        <div className="px-1.5 py-[26px]">
          <div className="mb-[26px] flex gap-[9px]">
            <span className="block h-[9px] w-[52px] rounded-[5px] bg-[#273d33]" />
            <span className="block h-[9px] w-[30px] rounded-[5px] bg-[#a6b7ad]" />
            <span className="block h-[9px] w-6 rounded-[5px] bg-[#d7e0da]" />
          </div>
          <div className="flex flex-col gap-3">
            <i className="block h-2.5 w-[89%] rounded-md bg-[#dbe5dd]" />
            <i className="block h-2.5 w-[72%] rounded-md bg-[#dbe5dd]" />
            <i className="mt-[18px] block h-2.5 w-[94%] rounded-md bg-[#dbe5dd]" />
            <i className="block h-2.5 w-[57%] rounded-md bg-[#dbe5dd]" />
          </div>
          <div className="mt-[30px] inline-flex items-center gap-[7px] rounded-[9px] bg-accent-soft px-3 py-2.5 text-[12.5px] font-extrabold text-accent-text">
            <Bookmark size={15} /> Saved reading list
          </div>
        </div>

        <AnimatePresence initial={false}>
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute left-5 right-5 top-[196px] z-[2] flex items-center gap-3 rounded-[15px] border border-line bg-surface px-[17px] py-[15px] shadow-[0_18px_36px_rgba(29,41,36,0.16)]"
            exit={reduceMotion ? undefined : { opacity: 0, y: -10, scale: 0.96 }}
            initial={reduceMotion ? false : { opacity: 0, y: -14, scale: 0.94 }}
            key={message}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
          >
            <span className="inline-flex size-[34px] shrink-0 items-center justify-center rounded-[9px] bg-accent-soft text-accent">
              <Check size={15} />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <strong className="truncate text-[14.5px] font-extrabold">{message}</strong>
              <small className="text-[11.5px] text-muted">A real Cloudlet toast, top center</small>
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-[2] flex flex-wrap justify-center gap-1.5 px-5 pb-[22px] pt-[18px]">
        <button
          className="inline-flex items-center gap-[5px] rounded-[9px] border border-line bg-surface px-[11px] py-[9px] text-xs font-extrabold text-muted transition-colors hover:border-accent-ring hover:text-accent-text"
          onClick={() => onShow(defaultToastMessages.saved, "success")}
          type="button"
        >
          <Check size={14} /> Saved
        </button>
        <button
          className="inline-flex items-center gap-[5px] rounded-[9px] border border-line bg-surface px-[11px] py-[9px] text-xs font-extrabold text-muted transition-colors hover:border-accent-ring hover:text-accent-text"
          onClick={() => onShow(defaultToastMessages.duplicate, "info")}
          type="button"
        >
          <MoreHorizontal size={14} /> Duplicate
        </button>
        <button
          className="inline-flex items-center gap-[5px] rounded-[9px] border border-line bg-surface px-[11px] py-[9px] text-xs font-extrabold text-muted transition-colors hover:border-accent-ring hover:text-accent-text"
          onClick={() => onShow(defaultToastMessages.removed, "success", true)}
          type="button"
        >
          <Undo2 size={14} /> Removed + undo
        </button>
      </div>
    </PreviewCard>
  );
}
