"use client";

import React from "react";

/**
 * NextSection.tsx — Follow-up section below the hero.
 * Dark theme with red accents, simple fade-up reveal on scroll (handled by parent).
 */

const NextSection: React.FC = () => {
  return (
    <section
      className="next-section relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #050505 0%, #0a0812 50%, #050505 100%)" }}
    >
      {/* Decorative top line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-red-primary/60 to-transparent" />

      <div className="next-section-content max-w-3xl mx-auto text-center" style={{ willChange: "transform, opacity" }}>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-text-light mb-6 tracking-tight">
          Beyond the{" "}
          <span className="text-red-primary" style={{ textShadow: "0 0 30px rgba(255,30,30,0.3)" }}>
            Atmosphere
          </span>
        </h2>
        <p className="text-text-muted text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
          We craft digital experiences that defy gravity. Every pixel, every interaction,
          every moment is engineered to launch your brand into the stratosphere.
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          {[
            {
              title: "Design",
              desc: "Award-winning visual systems that captivate and convert.",
              icon: "◇",
            },
            {
              title: "Develop",
              desc: "Blazing-fast, accessible code built for scale.",
              icon: "⬡",
            },
            {
              title: "Deploy",
              desc: "Seamless launches with zero-downtime infrastructure.",
              icon: "△",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="next-card glass-card p-6 md:p-8 text-left group cursor-default"
              style={{ willChange: "transform, opacity" }}
            >
              <span
                className="text-2xl mb-4 block text-red-primary transition-transform duration-300 group-hover:scale-110"
              >
                {card.icon}
              </span>
              <h3 className="text-lg font-display font-semibold text-text-light mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative bottom glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,30,30,0.08) 0%, transparent 70%)",
        }}
      />
    </section>
  );
};

export default NextSection;
