import { ChevronDown, ExternalLink } from "lucide-react";
import { MikoAvatar } from "@/components/ui/MikoAvatar";
import { StoreButtons } from "@/components/ui/StoreButtons";

const links = [
  { href: "#features", label: "Product", chevron: true },
  { href: "#settings", label: "Customize", chevron: true },
  { href: "#privacy", label: "Privacy", chevron: false },
];

export function SiteNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="mx-auto grid min-h-[86px] w-[calc(100%-72px)] max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center border-b border-line max-sm:min-h-[72px] max-sm:w-[calc(100%-32px)]"
    >
      <a
        aria-label="Miko home"
        className="inline-flex w-max items-center gap-[11px] font-display text-[26px] font-bold tracking-[-0.01em] max-sm:text-[22px]"
        href="#top"
      >
        <span className="inline-flex size-[42px] items-center justify-center overflow-hidden rounded-[14px] border border-accent-ring bg-accent-soft max-sm:size-9 max-sm:rounded-xl">
          <MikoAvatar size={36} />
        </span>
        <span>Miko</span>
      </a>

      <div className="flex gap-[34px] text-[15px] font-bold max-md:hidden">
        {links.map((link) => (
          <a className="inline-flex items-center gap-1.5 transition-colors hover:text-accent" href={link.href} key={link.label}>
            {link.label}
            {link.chevron && <ChevronDown size={15} />}
          </a>
        ))}
      </div>

      <div className="flex items-center justify-self-end gap-[22px] max-sm:gap-2.5">
        <a
          className="inline-flex items-center gap-1.5 text-sm font-bold text-muted transition-colors hover:text-accent max-sm:hidden"
          href="https://github.com/rakeshPatel-Dev/miko"
          rel="noreferrer"
          target="_blank"
        >
          GitHub <ExternalLink size={14} />
        </a>
        <StoreButtons compact />
      </div>
    </nav>
  );
}
