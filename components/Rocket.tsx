"use client";

import React from "react";

/**
 * Rocket.tsx — Layered inline SVG rocket with 3D-style shading.
 * 
 * Structure (bottom to top):
 *  1. Outer red glow (radial gradient div, not animated filter)
 *  2. Exhaust flame group (stacked shapes, animated by GSAP)
 *  3. Smoke trail (elongated on scroll)
 *  4. Body with metallic gradient + red accent stripes
 *  5. Nose cone
 *  6. Three fins with gradient fill
 *  7. Porthole window with red inner glow
 *  8. Nozzle
 *  9. Rim-light edge highlight
 * 10. Spark embers (small circles, animated by GSAP)
 */

const Rocket: React.FC = () => {
  return (
    <div className="rocket-wrapper relative" style={{ width: "220px", height: "420px" }}>
      {/* Pre-rendered red glow behind rocket — static radial gradient, opacity animated */}
      <div
        className="rocket-glow absolute pointer-events-none"
        style={{
          width: "400px",
          height: "500px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -40%)",
          background:
            "radial-gradient(ellipse at center, rgba(255,30,30,0.35) 0%, rgba(255,30,30,0.08) 40%, transparent 70%)",
          borderRadius: "50%",
          willChange: "transform, opacity",
        }}
      />

      <svg
        viewBox="0 0 220 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full"
        aria-hidden="true"
        role="img"
      >
        <defs>
          {/* Body metallic gradient — dark gunmetal with subtle warm reflection */}
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1a1a22" />
            <stop offset="25%" stopColor="#2a2a35" />
            <stop offset="50%" stopColor="#3a3a48" />
            <stop offset="70%" stopColor="#2a2a35" />
            <stop offset="100%" stopColor="#141418" />
          </linearGradient>

          {/* Nose cone gradient */}
          <linearGradient id="noseGrad" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#ff1e1e" />
            <stop offset="40%" stopColor="#cc1515" />
            <stop offset="100%" stopColor="#2a2a35" />
          </linearGradient>

          {/* Fin gradient */}
          <linearGradient id="finGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2a35" />
            <stop offset="50%" stopColor="#1a1a22" />
            <stop offset="100%" stopColor="#b30000" />
          </linearGradient>

          {/* Flame gradients */}
          <linearGradient id="flameOuter" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#ff1e1e" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#ff6600" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="flameMiddle" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#ff6600" />
            <stop offset="50%" stopColor="#ffaa00" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="flameCore" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#ffe0a0" />
            <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
          </linearGradient>

          {/* Porthole glow */}
          <radialGradient id="portholeGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#ff1e1e" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#ff1e1e" stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Rim light */}
          <linearGradient id="rimLight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="85%" stopColor="transparent" />
            <stop offset="95%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.25)" />
          </linearGradient>

          {/* Smoke trail gradient */}
          <linearGradient id="smokeGrad" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#8a8a93" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8a8a93" stopOpacity="0" />
          </linearGradient>

          {/* Nozzle gradient */}
          <linearGradient id="nozzleGrad" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#2a2a35" />
            <stop offset="100%" stopColor="#141418" />
          </linearGradient>
        </defs>

        {/* ═══ SMOKE TRAIL ═══ */}
        <g className="smoke-trail" style={{ willChange: "transform, opacity" }}>
          <ellipse cx="110" cy="395" rx="18" ry="40" fill="url(#smokeGrad)" opacity="0.4" />
        </g>

        {/* ═══ EXHAUST FLAME GROUP ═══ */}
        <g
          className="flame-group"
          style={{ transformOrigin: "110px 330px", willChange: "transform, opacity" }}
        >
          {/* Outer flame */}
          <path
            d="M90 330 Q95 370 110 400 Q125 370 130 330 Z"
            fill="url(#flameOuter)"
            className="flame-outer"
          />
          {/* Middle flame */}
          <path
            d="M96 330 Q100 360 110 385 Q120 360 124 330 Z"
            fill="url(#flameMiddle)"
            className="flame-mid"
          />
          {/* Core flame (brightest) */}
          <path
            d="M102 330 Q106 355 110 372 Q114 355 118 330 Z"
            fill="url(#flameCore)"
            className="flame-core"
          />
        </g>

        {/* ═══ SPARK EMBERS ═══ */}
        <g className="sparks" style={{ willChange: "transform, opacity" }}>
          <circle className="spark" cx="100" cy="370" r="1.5" fill="#ff6600" opacity="0.8" />
          <circle className="spark" cx="118" cy="375" r="1.2" fill="#ffaa00" opacity="0.7" />
          <circle className="spark" cx="105" cy="382" r="1" fill="#ff1e1e" opacity="0.6" />
          <circle className="spark" cx="115" cy="388" r="1.3" fill="#ff6600" opacity="0.5" />
          <circle className="spark" cx="108" cy="365" r="0.8" fill="#ffffff" opacity="0.9" />
          <circle className="spark" cx="112" cy="378" r="1.1" fill="#ffaa00" opacity="0.6" />
        </g>

        {/* ═══ LEFT FIN ═══ */}
        <path
          d="M72 290 L55 340 L82 320 Z"
          fill="url(#finGrad)"
          stroke="#ff1e1e"
          strokeWidth="0.5"
          strokeOpacity="0.3"
        />

        {/* ═══ RIGHT FIN ═══ */}
        <path
          d="M148 290 L165 340 L138 320 Z"
          fill="url(#finGrad)"
          stroke="#ff1e1e"
          strokeWidth="0.5"
          strokeOpacity="0.3"
        />

        {/* ═══ CENTER FIN (smaller, behind) ═══ */}
        <path
          d="M110 285 L110 345 L120 320 Z"
          fill="#1a1a22"
          opacity="0.5"
        />

        {/* ═══ NOZZLE ═══ */}
        <path
          d="M92 320 L88 335 L132 335 L128 320 Z"
          fill="url(#nozzleGrad)"
          stroke="#ff1e1e"
          strokeWidth="0.5"
          strokeOpacity="0.2"
        />

        {/* ═══ BODY ═══ */}
        <path
          d="M82 120 
             Q82 105 85 95 
             L110 30 
             L135 95 
             Q138 105 138 120 
             L138 320 
             L82 320 
             Z"
          fill="url(#bodyGrad)"
        />

        {/* ═══ RED ACCENT STRIPES ═══ */}
        <rect x="82" y="140" width="56" height="3" rx="1.5" fill="#ff1e1e" opacity="0.6" />
        <rect x="82" y="280" width="56" height="3" rx="1.5" fill="#ff1e1e" opacity="0.6" />
        <rect x="82" y="300" width="56" height="2" rx="1" fill="#b30000" opacity="0.4" />

        {/* ═══ BODY VERTICAL RED LINE (accent) ═══ */}
        <rect x="108" y="100" width="4" height="220" rx="2" fill="#ff1e1e" opacity="0.08" />

        {/* ═══ NOSE CONE ═══ */}
        <path
          d="M110 30 Q100 60 85 95 L135 95 Q120 60 110 30 Z"
          fill="url(#noseGrad)"
        />

        {/* ═══ PORTHOLE WINDOW ═══ */}
        <circle cx="110" cy="185" r="16" fill="#0a0a12" stroke="#3a3a48" strokeWidth="2" />
        <circle cx="110" cy="185" r="14" fill="url(#portholeGlow)" />
        {/* Window highlight */}
        <ellipse cx="106" cy="180" rx="5" ry="4" fill="rgba(255,255,255,0.08)" />

        {/* ═══ RIM LIGHT (right edge highlight) ═══ */}
        <path
          d="M135 95 Q138 105 138 120 L138 320 L136 320 L136 120 Q136 106 133 96 Z"
          fill="rgba(255,255,255,0.12)"
        />

        {/* ═══ LEFT EDGE SHADOW ═══ */}
        <path
          d="M85 95 Q82 105 82 120 L82 320 L84 320 L84 120 Q84 106 87 96 Z"
          fill="rgba(0,0,0,0.3)"
        />
      </svg>
    </div>
  );
};

export default Rocket;
