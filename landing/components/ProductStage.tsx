"use client";

import {
  Command,
  Library,
  MessageSquareText,
  MousePointerClick,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useDemo } from "@/components/DemoProvider";
import { PopupPreview } from "@/components/previews/PopupPreview";
import { SettingsPreview } from "@/components/previews/SettingsPreview";
import { ToastPreview } from "@/components/previews/ToastPreview";
import { cx } from "@/lib/cn";
import type { ShowcaseTab } from "@/lib/landing";

const tabs: Array<{ id: ShowcaseTab; label: string; icon: React.ReactNode }> = [
  { id: "popup", label: "Popup", icon: <Library size={15} /> },
  { id: "settings", label: "Settings", icon: <Settings size={15} /> },
  { id: "toast", label: "Page toast", icon: <MessageSquareText size={15} /> },
];

export function ProductStage() {
  const reduceMotion = useReducedMotion();
  const {
    activeTab,
    setActiveTab,
    query,
    setQuery,
    saved,
    saveCurrentPage,
    messages,
    updateMessage,
    saveMessages,
    messagesSaved,
    showToast,
  } = useDemo();

  return (
    <div
      className="relative w-full max-w-[500px] justify-self-center lg:justify-self-end"
      id="product-demo"
    >
      <div className="pointer-events-none absolute -inset-x-10 -bottom-8 -top-10 bg-[radial-gradient(circle_at_50%_45%,rgba(47,122,93,0.14),rgba(47,122,93,0)_68%)]" />

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative z-[2]"
        initial={reduceMotion ? false : { opacity: 0, y: 26 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.12 }}
      >
        <div
          aria-label="Miko product surfaces"
          className="relative z-[4] mx-auto mb-5 flex w-max items-center gap-1 rounded-full border border-line bg-surface/90 p-1.5 shadow-[0_8px_20px_rgba(29,41,36,0.06)] backdrop-blur-[10px] max-sm:w-full"
          role="tablist"
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                aria-selected={active}
                className={cx(
                  "relative rounded-full p-0 text-[13.5px] font-extrabold transition-colors max-sm:flex-1",
                  active ? "text-surface" : "text-muted hover:text-ink",
                )}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                type="button"
              >
                {active && (
                  <motion.span
                    className="absolute inset-0 z-0 rounded-full bg-ink"
                    layoutId="miko-tab-pill"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-[1] inline-flex items-center justify-center gap-2 whitespace-nowrap px-5 py-2.5 max-sm:px-2">
                  {tab.icon} {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mx-auto h-[580px] max-w-[460px] max-[430px]:h-[600px]">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="h-full"
              exit={reduceMotion ? undefined : { opacity: 0, y: -10, scale: 0.99 }}
              initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
              key={activeTab}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {activeTab === "popup" && (
                <PopupPreview
                  onQueryChange={setQuery}
                  onSave={saveCurrentPage}
                  query={query}
                  saved={saved}
                />
              )}
              {activeTab === "settings" && (
                <SettingsPreview
                  messages={messages}
                  onMessageChange={updateMessage}
                  onSaveMessages={saveMessages}
                  saved={messagesSaved}
                />
              )}
              {activeTab === "toast" && <ToastPreview message={messages.saved} onShow={showToast} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="relative z-[2] mt-5 flex items-center justify-center gap-5 text-xs font-bold text-muted max-sm:flex-wrap max-sm:gap-x-4 max-sm:gap-y-2">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="size-4 text-accent" /> Local-first storage
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MousePointerClick className="size-4 text-accent" /> Context menu included
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Command className="size-4 text-accent" /> Keyboard-first
        </span>
      </div>
    </div>
  );
}
