import { MikoAvatar } from "@/components/ui/MikoAvatar";

export function SiteFooter() {
  return (
    <footer className="mx-auto grid w-[calc(100%-72px)] max-w-[1200px] grid-cols-3 items-center py-8 pb-9 text-[12.5px] font-bold text-muted max-sm:w-[calc(100%-32px)] max-sm:grid-cols-1 max-sm:items-start max-sm:gap-3.5 max-sm:pb-6">
      <a className="inline-flex w-max items-center gap-2 text-xl font-bold text-ink" href="#top">
        <span className="inline-flex size-[34px] items-center justify-center overflow-hidden rounded-xl border border-accent-ring bg-accent-soft">
          <MikoAvatar size={29} />
        </span>
        <span className="font-display">Miko</span>
      </a>
      <span className="text-center max-sm:text-left">Save now. Find later. No friction.</span>
      <span className="text-right max-sm:text-left">Made for curious internet people.</span>
    </footer>
  );
}
