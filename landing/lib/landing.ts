// Firefox Add-ons listing.
const FIREFOX_STORE_URL = "https://addons.mozilla.org/en-US/firefox/addon/miko/";

export const storeLinks = {
  firefox: {
    label: "Add to Firefox",
    href: FIREFOX_STORE_URL,
  },
} as const;

export type ShowcaseTab = "popup" | "settings" | "toast";
export type ToastKey = "saved" | "duplicate" | "removed" | "notFound";
export type ToastKind = "success" | "info" | "warning" | "error";
export type Tone = "green" | "blue" | "peach" | "yellow";

export type Bookmark = {
  title: string;
  domain: string;
  date: string;
  glyph: string;
  tone: Tone;
};

export const bookmarks: Bookmark[] = [
  { title: "The quiet power of a small tool", domain: "notboring.co", date: "Today · 9:42 AM", glyph: "N", tone: "green" },
  { title: "A field guide to thoughtful interfaces", domain: "read.cv", date: "Today · 8:18 AM", glyph: "R", tone: "blue" },
  { title: "A nicer way to think about tabs", domain: "sive.rs", date: "Yesterday · 4:02 PM", glyph: "S", tone: "peach" },
  { title: "Tiny tools, big feeling", domain: "littlebigthings.fm", date: "18 Nov · 11:26 AM", glyph: "L", tone: "yellow" },
];

export const defaultToastMessages: Record<ToastKey, string> = {
  saved: "Miko tucked it away ✨",
  duplicate: "Already in Miko",
  removed: "Removed from Miko",
  notFound: "Not saved in Miko",
};

export const shortcutRows = [
  { label: "Quick save", shortcut: "Alt + Shift + S", detail: "Save the current page" },
  { label: "Quick remove", shortcut: "Alt + Shift + R", detail: "Remove it, with undo" },
  { label: "Open Miko", shortcut: "Alt + Shift + M", detail: "Open the popup" },
];

export const toastFields: Array<{ key: ToastKey; label: string }> = [
  { key: "saved", label: "New bookmark" },
  { key: "duplicate", label: "Already saved" },
  { key: "removed", label: "Removed bookmark" },
  { key: "notFound", label: "Not saved" },
];

export const toneStyles: Record<Tone, { tile: string; chip: string; dot: string }> = {
  green: { tile: "bg-accent-soft text-accent-text", chip: "bg-accent-soft text-accent-text", dot: "bg-[#83c9a5]" },
  blue: { tile: "bg-blue-soft text-blue-text", chip: "bg-blue-soft text-blue-text", dot: "bg-[#91bde0]" },
  peach: { tile: "bg-peach-soft text-peach-text", chip: "bg-peach-soft text-peach-text", dot: "bg-[#e3a489]" },
  yellow: { tile: "bg-yellow-soft text-yellow-text", chip: "bg-yellow-soft text-yellow-text", dot: "bg-[#e5cc78]" },
};
