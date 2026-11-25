"use client";

import { ButtonLink } from "@/components/ui/Buttons";
import { MikoAvatar } from "@/components/ui/MikoAvatar";
import { Reveal } from "@/components/ui/Reveal";

export function ClosingSection() {
  return (
    <Reveal>
      <section
        className="relative mx-auto flex min-h-[500px] w-[calc(100%-72px)] max-w-[1200px] flex-col items-center overflow-hidden rounded-[26px] bg-accent px-6 py-[76px] text-center text-white max-md:w-[calc(100%-32px)] max-md:rounded-[18px] max-md:py-14"
        id="download"
      >
        <div className="absolute -left-[190px] -top-[220px] size-[480px] rounded-full border border-white/20" />
        <div className="absolute -bottom-[300px] -right-[180px] size-[480px] rounded-full border border-white/20" />
        <div className="absolute left-[17%] top-[76px] h-[110px] w-[230px] rotate-[22deg] rounded-full border border-white/35 max-sm:-left-[22%] max-sm:opacity-70" />
        <div className="absolute bottom-[86px] right-[17%] h-[110px] w-[230px] -rotate-[24deg] rounded-full border border-white/35 max-sm:-right-[22%] max-sm:opacity-70" />

        <div className="z-[1] mb-[26px] inline-flex size-[82px] items-center justify-center overflow-hidden rounded-[19px] bg-surface">
          <MikoAvatar size={72} />
        </div>

        <h2 className="z-[1] max-w-[760px] font-display text-[clamp(46px,5.6vw,74px)] font-extrabold leading-[0.99] tracking-[-0.028em] max-sm:text-[44px]">
          Make &ldquo;I&apos;ll save this&rdquo;
          <br />
          <em className="not-italic text-[#c9efd6]">actually work.</em>
        </h2>
        <p className="z-[1] mb-7 mt-[22px] text-[17px] leading-[1.6] text-[#ddf2e3]">
          Miko is ready whenever the internet gets interesting.
        </p>
        <div className="z-[1]">
          <ButtonLink external href="https://chrome.google.com/webstore" variant="light">
            Add Miko to Chrome
          </ButtonLink>
        </div>
        <span className="z-[1] mt-[17px] text-xs font-bold text-[#c8e8d3]">
          Free to use · local-first · built for curious people
        </span>
      </section>
    </Reveal>
  );
}
