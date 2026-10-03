"use client";

import React, { useEffect } from "react";
import Hero from "@/components/Hero";
import NextSection from "@/components/NextSection";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Home page — composes Hero + NextSection.
 * Initializes Lenis smooth scroll and syncs it with GSAP's ticker.
 */
export default function Home() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });

    // Sync Lenis with GSAP ticker for ScrollTrigger compatibility
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="relative">
      <Hero />
      <NextSection />
    </main>
  );
}
