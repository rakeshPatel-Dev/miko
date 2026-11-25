"use client";

import { ArrowLeft, Bell, Check, ExternalLink, Keyboard, RotateCcw } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { IconTile } from "@/components/ui/IconTile";
import { Keycap } from "@/components/ui/Keycap";
import { shortcutRows, toastFields, type ToastKey } from "@/lib/landing";
import { PreviewCard } from "./PreviewCard";

export function SettingsPreview({
  messages,
  onMessageChange,
  onSaveMessages,
  saved,
}: {
  messages: Record<ToastKey, string>;
  onMessageChange: (key: ToastKey, value: string) => void;
  onSaveMessages: () => void;
  saved: boolean;
}) {
  return (
    <PreviewCard label="Miko settings preview">
      <header className="flex items-center gap-[11px] border-b border-line px-[22px] py-[18px] max-sm:px-4">
        <IconButton label="Back to saved links">
          <ArrowLeft className="size-[19px]" />
        </IconButton>
        <div className="flex flex-col gap-px">
          <strong className="font-display text-[21px] font-bold leading-[1.1] tracking-[-0.01em]">
            Settings
          </strong>
          <span className="text-[12.5px] leading-tight text-muted">Shortcuts &amp; messages</span>
        </div>
      </header>

      <div className="min-h-0 overflow-y-auto p-[22px] max-sm:px-4">
        <div className="flex items-start gap-3">
          <IconTile size="md">
            <Keyboard size={20} />
          </IconTile>
          <div className="min-w-0">
            <strong className="block text-[15px] font-black">Shortcuts</strong>
            <p className="mt-1 max-w-[320px] text-[12.5px] leading-normal text-muted">
              Your browser owns extension keybinds. Change them in its shortcut manager.
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-[11px] border border-line">
          {shortcutRows.map((row) => (
            <div
              className="flex items-center justify-between border-b border-line px-[13px] py-[11px] last:border-0"
              key={row.label}
            >
              <span className="flex flex-col gap-0.5">
                <strong className="text-[13.5px] font-extrabold">{row.label}</strong>
                <small className="text-[11.5px] text-muted">{row.detail}</small>
              </span>
              <Keycap>{row.shortcut}</Keycap>
            </div>
          ))}
        </div>

        <button
          className="mt-3 flex w-full items-center justify-center gap-[7px] rounded-[10px] bg-accent p-[11px] text-[13px] font-extrabold text-white transition-colors hover:bg-accent-hover"
          type="button"
        >
          <Keyboard size={16} /> Change browser shortcuts <ExternalLink size={14} />
        </button>

        <div className="mt-6 flex items-start gap-3">
          <IconTile size="md">
            <Bell size={20} />
          </IconTile>
          <div className="min-w-0">
            <strong className="block text-[15px] font-black">Toast messages</strong>
            <p className="mt-1 max-w-[320px] text-[12.5px] leading-normal text-muted">
              Personalize what appears on the page after Miko acts.
            </p>
          </div>
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-2.5 max-[430px]:grid-cols-1">
          {toastFields.map((field) => (
            <label className="flex flex-col gap-1" key={field.key}>
              <span className="text-[11px] font-extrabold text-muted">{field.label}</span>
              <input
                className="w-full min-w-0 rounded-lg border border-line bg-surface-soft px-2.5 py-[9px] text-[12.5px] text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-ring"
                maxLength={80}
                onChange={(event) => onMessageChange(field.key, event.target.value)}
                value={messages[field.key]}
              />
            </label>
          ))}
        </div>

        <div className="mt-[13px] flex gap-2">
          <button
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-[9px] p-[11px] text-[13px] font-extrabold text-white transition-colors ${
              saved ? "bg-[#3d966f]" : "bg-accent hover:bg-accent-hover"
            }`}
            onClick={onSaveMessages}
            type="button"
          >
            <Check size={15} /> {saved ? "Messages saved" : "Save messages"}
          </button>
          <button
            aria-label="Reset messages"
            className="inline-flex items-center justify-center rounded-[9px] border border-line bg-surface-soft px-[13px] py-2.5 text-muted transition-colors hover:text-ink"
            type="button"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
    </PreviewCard>
  );
}
