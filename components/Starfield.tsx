"use client";

import React, { useMemo, useRef, useEffect } from "react";

/**
 * Starfield.tsx — Multi-tiered parallax starfield for the Hero.
 * Features:
 *  - 3 distinct depth planes (deep, mid, near)
 *  - Interactive mouse parallax with smooth lerp physics
 *  - Twinkling stars with deterministic pseudo-random seeds (no hydration mismatch)
 *  - Hardware-accelerated GPU transforms with zero React re-renders on mousemove
 */

const Starfield: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);

  // Deterministic star generation
  const { deepStars, midStars, nearStars } = useMemo(() => {
    let s = 42;
    const rand = () => {
      s = (s * 16807 + 0) % 2147483647;
      return s / 2147483647;
    };

    const makeLayer = (count: number, minSize: number, maxSize: number) => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: rand() * 100,
        y: rand() * 100,
        size: minSize + rand() * (maxSize - minSize),
        delay: rand() * 6,
        duration: 2.5 + rand() * 3,
        opacity: 0.25 + rand() * 0.6,
        isRed: rand() > 0.82,
      }));
    };

    return {
      deepStars: makeLayer(30, 0.7, 1.2),
      midStars: makeLayer(20, 1.2, 1.8),
      nearStars: makeLayer(12, 1.8, 2.8),
    };
  }, []);

  // Smooth mouse parallax interpolation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouch = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;

    if (prefersReducedMotion || isTouch) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = (e.clientX - cx) / cx; // -1 to 1
      targetY = (e.clientY - cy) / cy; // -1 to 1
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const animate = () => {
      const lerp = 0.05;
      currentX += (targetX - currentX) * lerp;
      currentY += (targetY - currentY) * lerp;

      // Deep layer: shifts ±8px
      if (layer1Ref.current) {
        layer1Ref.current.style.transform = `translate3d(${-currentX * 8}px, ${-currentY * 6}px, 0)`;
      }
      // Mid layer: shifts ±18px
      if (layer2Ref.current) {
        layer2Ref.current.style.transform = `translate3d(${-currentX * 18}px, ${-currentY * 14}px, 0)`;
      }
      // Near layer: shifts ±30px
      if (layer3Ref.current) {
        layer3Ref.current.style.transform = `translate3d(${-currentX * 30}px, ${-currentY * 24}px, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="starfield absolute inset-0 overflow-hidden pointer-events-none select-none"
      style={{ willChange: "transform" }}
      aria-hidden="true"
    >
      {/* ─── Layer 1: Deep Stars (0.2x depth) ─── */}
      <div
        ref={layer1Ref}
        className="star-layer absolute inset-[-5%] w-[110%] h-[110%] will-change-transform"
      >
        {deepStars.map((star) => (
          <div
            key={`d-${star.id}`}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.isRed ? "var(--red-primary)" : "#f5f5f5",
              opacity: star.opacity * 0.7,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ─── Layer 2: Midfield Stars (0.5x depth) ─── */}
      <div
        ref={layer2Ref}
        className="star-layer absolute inset-[-8%] w-[116%] h-[116%] will-change-transform"
      >
        {midStars.map((star) => (
          <div
            key={`m-${star.id}`}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.isRed ? "var(--red-primary)" : "#ffffff",
              opacity: star.opacity * 0.85,
              boxShadow: star.isRed ? "0 0 6px rgba(255,30,30,0.5)" : "none",
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ─── Layer 3: Near Cosmic Particles (1.0x depth) ─── */}
      <div
        ref={layer3Ref}
        className="star-layer absolute inset-[-12%] w-[124%] h-[124%] will-change-transform"
      >
        {nearStars.map((star) => (
          <div
            key={`n-${star.id}`}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.isRed ? "#ff3333" : "#ffffff",
              opacity: star.opacity,
              boxShadow: star.isRed
                ? "0 0 8px rgba(255,30,30,0.8)"
                : "0 0 6px rgba(255,255,255,0.7)",
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Starfield;
