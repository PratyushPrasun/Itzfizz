"use client";

import React, { useMemo } from "react";

/**
 * Starfield.tsx — Lightweight parallax starfield.
 * Generates a fixed number of stars as tiny divs with CSS twinkle animation.
 * Kept under 60 elements total. GSAP moves this layer for parallax depth.
 */

interface Star {
  id: number;
  x: number; // % left
  y: number; // % top
  size: number; // px
  delay: number; // animation delay
  duration: number; // twinkle duration
  opacity: number;
}

const STAR_COUNT = 50;

const Starfield: React.FC = () => {
  const stars = useMemo<Star[]>(() => {
    // Seeded pseudo-random for deterministic layout (avoids hydration mismatch)
    const seed = 42;
    let s = seed;
    const rand = () => {
      s = (s * 16807 + 0) % 2147483647;
      return s / 2147483647;
    };

    return Array.from({ length: STAR_COUNT }, (_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size: rand() * 2 + 0.5,
      delay: rand() * 6,
      duration: rand() * 3 + 2,
      opacity: rand() * 0.5 + 0.2,
    }));
  }, []);

  return (
    <div
      className="starfield absolute inset-0 overflow-hidden pointer-events-none"
      style={{ willChange: "transform" }}
      aria-hidden="true"
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.size > 1.5 ? "#ff1e1e" : "#f5f5f5",
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default Starfield;
