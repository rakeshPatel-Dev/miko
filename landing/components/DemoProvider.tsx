"use client";

import { useCloudlet } from "@cloudlet/toast";
import { createContext, useContext, useState, type ReactNode } from "react";
import {
  defaultToastMessages,
  type ShowcaseTab,
  type ToastKey,
  type ToastKind,
} from "@/lib/landing";

type DemoContextValue = {
  activeTab: ShowcaseTab;
  setActiveTab: (tab: ShowcaseTab) => void;
  query: string;
  setQuery: (query: string) => void;
  saved: boolean;
  saveCurrentPage: () => void;
  messages: Record<ToastKey, string>;
  updateMessage: (key: ToastKey, value: string) => void;
  messagesSaved: boolean;
  saveMessages: () => void;
  showToast: (message: string, kind?: ToastKind, withUndo?: boolean) => void;
  openSettingsPreview: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>("popup");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(false);
  const [messages, setMessages] = useState(defaultToastMessages);
  const [messagesSaved, setMessagesSaved] = useState(false);
  const cloudlet = useCloudlet();

  function showToast(message: string, kind: ToastKind = "success", withUndo = false) {
    cloudlet.show({
      title: message,
      kind,
      attention: "open",
      duration: withUndo ? 3000 : kind === "info" ? 2000 : 2400,
      ...(withUndo
        ? {
            action: {
              kind: "command" as const,
              label: "Undo",
              run: () => {
                cloudlet.show({
                  title: "Restored in Miko",
                  kind: "success",
                  attention: "open",
                  duration: 2400,
                });
              },
              errorMessage: () => "Could not restore bookmark",
            },
          }
        : {}),
    });
  }

  function saveCurrentPage() {
    setSaved(true);
    showToast(messages.saved);
  }

  function updateMessage(key: ToastKey, value: string) {
    setMessages((current) => ({ ...current, [key]: value }));
    setMessagesSaved(false);
  }

  function saveMessages() {
    setMessagesSaved(true);
    showToast("Toast messages saved");
    window.setTimeout(() => setMessagesSaved(false), 2200);
  }

  function openSettingsPreview() {
    setActiveTab("settings");
    document.getElementById("product-demo")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  return (
    <DemoContext.Provider
      value={{
        activeTab,
        setActiveTab,
        query,
        setQuery,
        saved,
        saveCurrentPage,
        messages,
        updateMessage,
        messagesSaved,
        saveMessages,
        showToast,
        openSettingsPreview,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemo must be used inside DemoProvider");
  }
  return context;
}
