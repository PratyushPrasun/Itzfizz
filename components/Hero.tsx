"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Rocket from "./Rocket";
import Stats from "./Stats";
import Starfield from "./Starfield";
import { useHeroAnimation } from "@/hooks/useHeroAnimation";

/**
 * Hero.tsx — The scroll-driven hero section.
 *
 * Layout layers (back to front):
 *  1. Background glow (radial gradient div) — now with mouse-follow
 *  2. Starfield (parallax)
 *  3. Rocket (centered, between text layers)
 *  4. Headline (split letters with hover effects)
 *  5. Stats (glassmorphism cards with tilt)
 *  6. Scroll hint (magnetic hover)
 *  7. Cursor glow (subtle mouse follower)
 */

const HEADLINE_TEXT = "WELCOME ITZFIZZ";

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const bgGlowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  // Boot all GSAP animations
  useHeroAnimation(heroRef);

  // Mouse-follow effect for background glow + cursor glow
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouchDevice = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;

    if (prefersReducedMotion || isTouchDevice) return;

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Smooth cursor follower with lerp
    const animate = () => {
      const lerp = 0.08;
      currentPos.current.x +=
        (mousePos.current.x - currentPos.current.x) * lerp;
      currentPos.current.y +=
        (mousePos.current.y - currentPos.current.y) * lerp;

      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.transform = `translate(${currentPos.current.x - 150}px, ${currentPos.current.y - 150}px)`;
      }

      // Subtle parallax on background glow based on mouse position
      if (bgGlowRef.current && heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = (mousePos.current.x - centerX) / centerX;
        const deltaY = (mousePos.current.y - centerY) / centerY;
        bgGlowRef.current.style.transform = `translate(calc(-50% + ${deltaX * 20}px), calc(-50% + ${deltaY * 15}px))`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    // Activate cursor glow after a brief delay
    const timer = setTimeout(() => {
      if (cursorGlowRef.current) {
        cursorGlowRef.current.classList.add("active");
      }
    }, 1500);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timer);
    };
  }, [handleMouseMove]);

  // Track mouse position on cards for cursor-responsive gradient
  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    target.style.setProperty("--mouse-x", `${x}%`);
    target.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  // Split headline into individually-animatable letters
  const headlineLetters = HEADLINE_TEXT.split("").map((char, i) => (
    <span
      key={i}
      className="hero-letter inline-block"
      aria-hidden="true"
      style={{ willChange: "transform, opacity, filter" }}
    >
      {char === " " ? "\u00A0\u00A0" : char}
    </span>
  ));

  return (
    <section
      ref={heroRef}
      className="hero-section relative w-full overflow-hidden flex flex-col items-center justify-center"
      style={{ height: "100svh" }}
    >
      {/* ─── Layer 0: Cursor glow follower ─── */}
      <div ref={cursorGlowRef} className="cursor-glow" />

      {/* ─── Layer 1: Background glow ─── */}
      <div
        ref={bgGlowRef}
        className="hero-bg-glow absolute pointer-events-none"
        style={{
          width: "clamp(400px, 60vw, 900px)",
          height: "clamp(400px, 60vw, 900px)",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(ellipse at center, rgba(255,30,30,0.18) 0%, rgba(179,0,0,0.06) 40%, transparent 70%)",
          borderRadius: "50%",
          willChange: "transform, opacity",
          transition: "transform 0.1s linear",
        }}
      />

      {/* ─── Layer 2: Starfield ─── */}
      <Starfield />

      {/* ─── Layer 3: Rocket (centered, behind text) ─── */}
      <div
        className="rocket-container absolute z-10 pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          willChange: "transform, opacity",
        }}
      >
        <Rocket />
      </div>

      {/* ─── Layer 4: Headline ─── */}
      <div className="relative z-20 flex flex-col items-center gap-10 md:gap-14 w-full px-4">
        <h1
          className="hero-headline font-display text-center leading-none select-none"
          aria-label="Welcome Itzfizz"
          style={{
            fontSize: "clamp(1.8rem, 5vw, 4.5rem)",
            letterSpacing: "0.25em",
            fontWeight: 700,
            textShadow: "0 0 40px rgba(255,30,30,0.15)",
            willChange: "transform, opacity",
          }}
        >
          {headlineLetters}
        </h1>

        {/* ─── Layer 5: Stats ─── */}
        <Stats onCardMouseMove={handleCardMouseMove} />
      </div>

      {/* ─── Layer 6: Scroll hint ─── */}
      <div
        className="scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        style={{ willChange: "opacity" }}
      >
        {/* Animated mouse icon */}
        <div className="scroll-hint-anim flex flex-col items-center">
          <svg
            width="20"
            height="32"
            viewBox="0 0 20 32"
            fill="none"
            className="text-red-primary"
            aria-hidden="true"
          >
            <rect
              x="1"
              y="1"
              width="18"
              height="30"
              rx="9"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="10" cy="10" r="2" fill="currentColor">
              <animate
                attributeName="cy"
                values="10;18;10"
                dur="1.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
          <span className="text-text-muted text-xs tracking-widest uppercase mt-2">
            Scroll
          </span>
        </div>
      </div>

      {/* ─── Film grain + Vignette (applied globally but scoped here visually) ─── */}
    </section>
  );
};

export default Hero;
