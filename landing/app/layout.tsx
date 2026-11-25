import type { Metadata, Viewport } from "next";
import "@cloudlet/toast/styles.css";
import "./globals.css";
import "./miko-toast.css";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

const title = `${siteName}: Save the good stuff`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "Miko",
    "bookmark manager",
    "bookmark extension",
    "Firefox extension",
    "local-first",
    "keyboard shortcuts",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title,
    description: siteDescription,
  },
  twitter: {
    card: "summary",
    title,
    description: siteDescription,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    title: siteName,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f5ee",
  colorScheme: "light",
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
