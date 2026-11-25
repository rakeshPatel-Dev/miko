"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ProductStage } from "@/components/ProductStage";
import { ButtonLink, TextLink } from "@/components/ui/Buttons";
import { LiveDot } from "@/components/ui/LiveDot";
import { Check, LockKeyhole } from "lucide-react";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 110, damping: 18 },
  },
};

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="mx-auto grid w-[calc(100%-72px)] max-w-[1200px] grid-cols-1 items-center gap-12 py-14 pb-[92px] max-sm:w-[calc(100%-32px)] lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-14 lg:py-[74px]"
      id="top"
    >
      <motion.div
        animate="show"
        className="mx-auto max-w-[620px] text-center lg:mx-0 lg:text-left"
        initial={reduceMotion ? false : "hidden"}
        variants={container}
      >
        <motion.p
          className="mb-[22px] flex items-center justify-center gap-[9px] text-[13px] font-extrabold uppercase tracking-[0.01em] text-accent-text lg:justify-start"
          variants={item}
        >
          <LiveDot /> A tiny, local-first bookmark companion
        </motion.p>

        <motion.h1
          className="font-display text-[clamp(52px,5.7vw,84px)] font-extrabold leading-[0.99] tracking-[-0.028em] max-sm:text-[clamp(44px,12vw,62px)]"
          variants={item}
        >
          Save the internet you actually want to{" "}
          <span className="relative inline-block text-accent">
            come back to.
            <svg
              aria-hidden="true"
              className="absolute -bottom-[0.16em] left-0 h-[0.24em] w-full overflow-visible opacity-60"
              fill="none"
              viewBox="0 0 320 20"
            >
              <motion.path
                animate={{ pathLength: 1 }}
                d="M5 13C62 5 130 4 188 9C240 13 283 12 315 6"
                initial={reduceMotion ? false : { pathLength: 0 }}
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="6"
                transition={{ duration: 0.9, delay: 0.55, ease: "easeOut" }}
              />
            </svg>
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-[25px] max-w-[520px] text-[18.5px] leading-[1.7] text-muted max-sm:mx-auto max-sm:text-[17px] lg:mx-0"
          variants={item}
        >
          One shortcut captures the page. Miko keeps the title, URL, favicon, and date, then
          gets out of your way until you need it.
        </motion.p>

        <motion.div
          className="mt-[34px] flex flex-wrap items-center justify-center gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-[18px] lg:justify-start"
          variants={item}
        >
          <ButtonLink href="#download">Add Miko to Chrome</ButtonLink>
          <TextLink href="#product-demo">
            Try the real UI <ArrowRight className="size-[17px]" />
          </TextLink>
        </motion.div>

        <motion.div
          className="mt-[42px] flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-line pt-5 max-sm:gap-x-4 max-sm:gap-y-2.5 lg:justify-start"
          variants={item}
        >
          <span className="inline-flex items-center gap-[7px] text-[13px] font-bold text-muted">
            <Check className="size-4 text-accent-text" /> No account
          </span>
          <span className="inline-flex items-center gap-[7px] text-[13px] font-bold text-muted">
            <LockKeyhole className="size-4 text-accent-text" /> Stored on-device
          </span>
          <span className="inline-flex items-center gap-[7px] text-[13px] font-bold text-muted">
            <Sparkles className="size-4 text-accent-text" /> Keyboard-first
          </span>
        </motion.div>
      </motion.div>

      <ProductStage />
    </section>
  );
}
