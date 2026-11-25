"use client";

import { CloudletProvider, Toaster, createCloudlet } from "@cloudlet/toast";
import { useState } from "react";
import { ClosingSection } from "@/components/ClosingSection";
import { CustomizeSection } from "@/components/CustomizeSection";
import { DemoProvider } from "@/components/DemoProvider";
import { FeatureSection } from "@/components/FeatureSection";
import { Hero } from "@/components/Hero";
import { PrivacySection } from "@/components/PrivacySection";
import { Ribbon } from "@/components/Ribbon";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { ToastSection } from "@/components/ToastSection";

export default function Home() {
  const [controller] = useState(() => createCloudlet({ autoDismiss: true }));

  return (
    <CloudletProvider controller={controller}>
      <Toaster offsets={{ gutter: { top: 20 } }} position="top-center" theme="dark" />
      <DemoProvider>
        <SiteNav />
        <main>
          <Hero />
          <Ribbon />
          <FeatureSection />
          <CustomizeSection />
          <ToastSection />
          <PrivacySection />
          <ClosingSection />
        </main>
        <SiteFooter />
      </DemoProvider>
    </CloudletProvider>
  );
}
