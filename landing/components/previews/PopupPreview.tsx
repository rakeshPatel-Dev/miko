"use client";

import {
  Check,
  CircleHelp,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { Keycap } from "@/components/ui/Keycap";
import { MikoAvatar } from "@/components/ui/MikoAvatar";
import { cx } from "@/lib/cn";
import { bookmarks, toneStyles, type Bookmark } from "@/lib/landing";
import { PreviewCard } from "./PreviewCard";

function BookmarkRow({ bookmark }: { bookmark: Bookmark }) {
  return (
    <div className="group flex min-w-0 items-start gap-[11px] rounded-[11px] p-2.5 transition-colors hover:bg-surface-soft">
      <span
        className={cx(
          "mt-px flex size-7 shrink-0 items-center justify-center rounded-lg text-[13px] font-black",
          toneStyles[bookmark.tone].chip,
        )}
      >
        {bookmark.glyph}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <strong className="truncate text-[14.5px] font-extrabold leading-[1.3]">
          {bookmark.title}
        </strong>
        <small className="truncate text-[11.5px] leading-[1.3] text-muted">
          {bookmark.domain}
          <i className="px-0.5 not-italic text-[#9db5a7]">·</i>
          {bookmark.date}
        </small>
      </span>
      <span className="flex gap-px opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
        <button
          aria-label={`Edit ${bookmark.title}`}
          className="inline-flex rounded-md p-[5px] text-muted transition-colors hover:bg-line hover:text-ink"
          type="button"
        >
          <Pencil size={14} />
        </button>
        <button
          aria-label={`Delete ${bookmark.title}`}
          className="inline-flex rounded-md p-[5px] text-muted transition-colors hover:bg-line hover:text-ink"
          type="button"
        >
          <Trash2 size={14} />
        </button>
      </span>
    </div>
  );
}

function BookmarkGroup({ label, items }: { label: string; items: Bookmark[] }) {
  return (
    <section aria-label={label} className="mt-3.5 first:mt-0">
      <h3 className="px-2.5 py-1.5 text-[11px] font-black uppercase tracking-[0.11em] text-muted">
        {label}
      </h3>
      <div className="flex flex-col gap-0.5">
        {items.map((bookmark) => (
          <BookmarkRow bookmark={bookmark} key={bookmark.title} />
        ))}
      </div>
    </section>
  );
}

export function PopupPreview({
  query,
  onQueryChange,
  saved,
  onSave,
}: {
  query: string;
  onQueryChange: (query: string) => void;
  saved: boolean;
  onSave: () => void;
}) {
  const reduceMotion = useReducedMotion();

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return bookmarks;
    return bookmarks.filter((bookmark) =>
      `${bookmark.title} ${bookmark.domain}`.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  return (
    <PreviewCard label="Miko popup preview">
      <header className="flex items-center justify-between border-b border-line px-[22px] py-[18px] max-sm:px-4">
        <div className="flex items-center gap-[11px]">
          <MikoAvatar size={38} />
          <div className="flex flex-col gap-px">
            <strong className="font-display text-[21px] font-bold leading-[1.1] tracking-[-0.01em]">
              Miko
            </strong>
            <span className="text-[12.5px] leading-tight text-muted">Your saved links</span>
          </div>
        </div>
        <div className="flex items-center gap-[3px]">
          <span
            className="mr-1 rounded-[9px] bg-accent-soft px-[11px] py-2 text-[12.5px] font-black text-accent-text"
            title="24 saved bookmarks"
          >
            24
          </span>
          <IconButton label="Help and feedback">
            <CircleHelp className="size-[18px]" />
          </IconButton>
          <IconButton label="Open settings">
            <Settings className="size-[18px]" />
          </IconButton>
        </div>
      </header>

      <div className="px-[22px] pb-3 pt-4 max-sm:px-4">
        <label className="flex items-center gap-[9px] rounded-[11px] border border-transparent bg-surface-soft px-3 py-[11px] text-muted transition-[background-color,border-color,box-shadow] focus-within:border-accent focus-within:bg-surface focus-within:ring-[3px] focus-within:ring-accent-ring/70">
          <Search className="size-[17px]" />
          <input
            aria-label="Search your saved links"
            className="w-full min-w-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-[#94a49b]"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search your links"
            value={query}
          />
          <Keycap className="bg-surface">⌘ K</Keycap>
        </label>
        <motion.button
          className={cx(
            "mt-2.5 flex w-full items-center justify-center gap-2 rounded-[11px] px-3.5 py-3 text-[15px] font-extrabold text-white transition-colors",
            saved ? "bg-[#3d966f]" : "bg-accent hover:bg-accent-hover",
          )}
          onClick={onSave}
          type="button"
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        >
          {saved ? <Check size={17} /> : <Plus size={17} />}
          {saved ? "Saved to Miko" : "Save current page"}
        </motion.button>
      </div>

      <div aria-live="polite" className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 pt-1">
        {filtered.length > 0 ? (
          <>
            <BookmarkGroup items={filtered.slice(0, 2)} label="Today" />
            {filtered.length > 2 && <BookmarkGroup items={filtered.slice(2, 3)} label="Yesterday" />}
            {filtered.length > 3 && <BookmarkGroup items={filtered.slice(3)} label="Earlier" />}
          </>
        ) : (
          <div className="flex h-[290px] flex-col items-center justify-center gap-2 text-center text-muted">
            <Search size={26} />
            <strong className="text-[15px] font-extrabold text-ink">No links found</strong>
            <span className="text-[13px]">Try a different search term.</span>
          </div>
        )}
      </div>

      <footer className="flex items-center justify-center gap-[5px] border-t border-line px-4 py-3 text-[12.5px] text-muted">
        24 saved links <span>·</span>
        <Keycap size="sm">Alt + Shift + S</Keycap> to save
      </footer>
    </PreviewCard>
  );
}
