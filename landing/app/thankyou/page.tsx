import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Sparkles } from "lucide-react";
import { MikoAvatar } from "@/components/ui/MikoAvatar";

export const metadata: Metadata = {
  title: "Thanks for your note",
  description: "Thanks for helping shape what Miko becomes.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <main className="relative isolate flex min-h-screen overflow-hidden bg-canvas text-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-44 -z-10 size-[430px] rounded-full border border-accent-ring/70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-64 -right-40 -z-10 size-[560px] rounded-full border border-accent-ring/60"
      />

      <div className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col px-6 pb-7 pt-6 sm:px-9 sm:pt-8">
        <header className="flex items-center justify-between border-b border-line pb-5 sm:pb-6">
          <Link
            aria-label="Miko home"
            className="inline-flex items-center gap-3 font-display text-[25px] font-bold tracking-[-0.01em] transition-colors hover:text-accent sm:text-[28px]"
            href="/"
          >
            <span className="inline-flex size-11 items-center justify-center overflow-hidden rounded-[15px] border border-accent-ring bg-accent-soft sm:size-12">
              <MikoAvatar size={40} />
            </span>
            Miko
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-2 text-xs font-extrabold text-muted sm:text-sm">
            <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
            Feedback received
          </span>
        </header>

        <section className="flex flex-1 items-center justify-center py-14 sm:py-20">
          <div className="w-full max-w-[790px] rounded-[30px] border border-line bg-surface px-6 py-11 text-center sm:rounded-[38px] sm:px-16 sm:py-16">
            <div className="mx-auto inline-flex size-[72px] items-center justify-center rounded-[24px] bg-accent-soft text-accent-text sm:size-20 sm:rounded-[27px]">
              <Check aria-hidden="true" size={38} strokeWidth={3} />
            </div>

            <h1 className="mx-auto mt-8 max-w-[680px] font-display text-[clamp(48px,7vw,82px)] font-extrabold leading-[0.98] tracking-[-0.04em]">
              Thanks for helping Miko grow.
            </h1>
            <p className="mx-auto mt-6 max-w-[590px] text-[18px] leading-[1.6] text-muted sm:text-[21px]">
              Your feature request or feedback is on its way. I&apos;ll read it
              and try to solve it as soon as possible.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-[15px] font-extrabold text-white transition-colors hover:bg-accent-hover"
                href="https://rakeshpatel.me"
                rel="noreferrer"
                target="_blank"
              >
                Visit my portfolio
                <ArrowUpRight aria-hidden="true" size={17} />
              </a>
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line bg-canvas px-6 text-[15px] font-extrabold text-ink transition-colors hover:border-accent-ring hover:text-accent"
                href="/"
              >
                <ArrowLeft aria-hidden="true" size={17} />
                Back to Miko
              </Link>
            </div>

            <div className="mx-auto mt-12 flex max-w-[520px] items-center justify-center gap-2.5 border-t border-line pt-5 text-sm font-bold text-muted">
              <Sparkles aria-hidden="true" className="shrink-0 text-accent" size={17} />
              <span>Thanks for taking the time to make Miko better.</span>
            </div>
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-5 text-[13px] font-bold text-muted">
          <span>Built by Rakesh Patel</span>
          <span>Miko · Save now. Find later.</span>
        </footer>
      </div>
    </main>
  );
}
