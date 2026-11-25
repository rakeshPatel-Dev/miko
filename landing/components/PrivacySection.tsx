import { ArrowRight, Bookmark, Database, LockKeyhole, ShieldCheck } from "lucide-react";
import { TextLink } from "@/components/ui/Buttons";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const items = [
  { icon: <Database size={22} />, title: "IndexedDB", copy: "bookmarks stay local" },
  { icon: <LockKeyhole size={22} />, title: "No account", copy: "nothing to sign up for" },
  { icon: <ShieldCheck size={22} />, title: "Offline ready", copy: "fast without a backend" },
  { icon: <Bookmark size={22} />, title: "Portable", copy: "your browser, your library" },
];

export function PrivacySection() {
  return (
    <Reveal>
      <section
        className="mx-auto grid w-[calc(100%-72px)] max-w-[1200px] grid-cols-[minmax(0,0.92fr)_minmax(0,0.84fr)] items-center gap-[70px] border-t border-line py-[112px] pb-[124px] max-sm:w-[calc(100%-32px)] max-md:py-20 max-lg:grid-cols-1 max-lg:gap-12"
        id="privacy"
      >
        <div>
          <Eyebrow>Privacy</Eyebrow>
          <h2 className="max-w-[500px] font-display text-[clamp(42px,4.7vw,64px)] font-extrabold leading-[1.02] tracking-[-0.028em] max-sm:text-[42px]">
            Private by construction.
          </h2>
          <p className="mb-7 mt-[22px] max-w-[500px] text-[17px] leading-[1.7] text-muted">
            Miko has no backend and no account system. Bookmarks live in IndexedDB, settings live
            in your browser&apos;s local storage, and your saved links stay on this device.
          </p>
          <TextLink href="#download">
            Keep your links yours <ArrowRight className="size-[17px]" />
          </TextLink>
        </div>

        <div className="grid grid-cols-2 overflow-hidden rounded-[18px] border border-line max-sm:w-full">
          {items.map((item, index) => (
            <div
              className={`flex items-start gap-3 bg-surface px-[22px] py-[26px] max-sm:px-4 max-sm:py-5 ${
                index < 2 ? "border-b border-line" : ""
              } ${index % 2 === 0 ? "border-r border-line" : ""}`}
              key={item.title}
            >
              <span className="mt-0.5 text-accent">{item.icon}</span>
              <span className="flex flex-col gap-[3px]">
                <strong className="text-[15px] font-extrabold">{item.title}</strong>
                <small className="text-[12.5px] text-muted">{item.copy}</small>
              </span>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
