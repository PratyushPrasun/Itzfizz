"use client";

import React, { useRef, useEffect } from "react";

/**
 * Stats.tsx — Impact stats with glassmorphism cards.
 * Number count-up is handled by the parent animation hook (useHeroAnimation).
 * Each card gets a unique data-stat-index for GSAP targeting.
 */

interface Stat {
  value: number;
  suffix: string; // e.g. "%" or "+"
  label: string;
}

const STATS: Stat[] = [
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 150, suffix: "+", label: "Projects Delivered" },
  { value: 45, suffix: "%", label: "Faster Load Times" },
  { value: 24, suffix: "/7", label: "Dedicated Support" },
];

const Stats: React.FC = () => {
  return (
    <div className="stats-container grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl mx-auto px-4">
      {STATS.map((stat, index) => (
        <div
          key={stat.label}
          className="stat-card glass-card flex flex-col items-center justify-center p-5 md:p-6"
          data-stat-index={index}
          style={{ willChange: "transform, opacity" }}
        >
          <span className="stat-number text-3xl md:text-4xl font-bold text-red-primary font-display tabular-nums">
            0{stat.suffix}
          </span>
          <span className="stat-label text-xs md:text-sm text-text-muted mt-2 text-center tracking-wide uppercase">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export { STATS };
export default Stats;
