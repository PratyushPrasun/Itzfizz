"use client";

import React, { useRef, useCallback } from "react";
import { PHYSICS } from "@/config/animation";

/**
 * Stats.tsx — Impact stats with 3D physical tilt & specular sheen.
 * Number count-up is orchestrated by useHeroAnimation.
 * Each card features:
 *  - Real-time 3D coordinate tilt with spring return
 *  - Cursor-following specular glare highlight
 *  - Stereoscopic internal depth (number floats out in 3D)
 */

interface Stat {
  value: number;
  suffix: string;
  label: string;
  tag: string;
}

const STATS: Stat[] = [
  { value: 98, suffix: "%", label: "Client Satisfaction", tag: "01 // SAT" },
  { value: 150, suffix: "+", label: "Projects Delivered", tag: "02 // OPS" },
  { value: 45, suffix: "%", label: "Faster Load Times", tag: "03 // VEL" },
  { value: 24, suffix: "/7", label: "Dedicated Support", tag: "04 // UPT" },
];

interface StatsProps {
  onCardMouseMove?: (e: React.MouseEvent<HTMLElement>) => void;
}

const Stats: React.FC<StatsProps> = ({ onCardMouseMove }) => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, index: number) => {
      const card = cardRefs.current[index];
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x / rect.width) * 2 - 1; // -1 to 1
      const normY = (y / rect.height) * 2 - 1; // -1 to 1

      const rotX = -normY * PHYSICS.cardTiltMaxDeg;
      const rotY = normX * PHYSICS.cardTiltMaxDeg;

      card.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
      card.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
      card.style.setProperty("--glare-opacity", "0.22");

      card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(
        2
      )}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(10px) scale3d(1.03, 1.03, 1.03)`;

      if (onCardMouseMove) onCardMouseMove(e);
    },
    [onCardMouseMove]
  );

  const handleMouseLeave = useCallback((index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;

    card.style.setProperty("--glare-opacity", "0");
    card.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)";
  }, []);

  return (
    <div className="stats-container grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl mx-auto px-4 perspective-container">
      {STATS.map((stat, index) => (
        <div
          key={stat.label}
          ref={(el) => {
            cardRefs.current[index] = el;
          }}
          className="stat-card glass-card relative flex flex-col items-center justify-center p-5 md:p-6 cursor-default transition-transform duration-300 ease-out select-none"
          data-stat-index={index}
          style={{
            willChange: "transform, opacity",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={(e) => handleMouseMove(e, index)}
          onMouseLeave={() => handleMouseLeave(index)}
        >
          {/* Subtle aerospace index tag */}
          <span
            className="text-[9px] font-mono tracking-widest text-text-muted/50 self-start mb-2 uppercase"
            style={{ transform: "translateZ(6px)" }}
          >
            {stat.tag}
          </span>

          {/* Primary Metric Number (floats out in 3D space) */}
          <span
            className="stat-number text-3xl md:text-4xl font-bold text-red-primary font-display tabular-nums tracking-tight"
            style={{
              transform: "translateZ(26px)",
              textShadow: "0 0 25px rgba(255,30,30,0.35)",
            }}
          >
            0{stat.suffix}
          </span>

          {/* Metric Label */}
          <span
            className="stat-label text-xs md:text-sm text-text-muted mt-2 text-center tracking-wide uppercase font-sans"
            style={{ transform: "translateZ(14px)" }}
          >
            {stat.label}
          </span>

          {/* Dynamic Specular Glare Reflection */}
          <div
            className="card-glare pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
            style={{
              background:
                "radial-gradient(circle 200px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.15), transparent 70%)",
              opacity: "var(--glare-opacity, 0)",
            }}
          />
        </div>
      ))}
    </div>
  );
};

export { STATS };
export default Stats;
