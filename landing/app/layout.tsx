import type { Metadata } from "next";
import "@cloudlet/toast/styles.css";
import "./globals.css";
import "./miko-toast.css";

export const metadata: Metadata = {
  title: "Miko - Save the good stuff",
  description:
    "A tiny, playful bookmark companion for saving the good stuff from the internet.",
  appleWebApp: {
    title: "Miko",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-canvas font-body text-ink antialiased">{children}</body>
    </html>
  );
}
