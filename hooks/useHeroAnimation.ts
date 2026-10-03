"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  EASE,
  INTRO,
  SCROLL,
  ROCKET_PATH,
  FLAME,
  PARALLAX,
} from "@/config/animation";
import { STATS } from "@/components/Stats";

gsap.registerPlugin(ScrollTrigger);

/**
 * useHeroAnimation — orchestrates the entire hero section animation.
 *
 * Phase 1: Intro timeline (plays once on load)
 *   - Background glow fades in
 *   - Headline letters staggered reveal (fade + translateY + blur-to-sharp)
 *   - Rocket rises into view, flame ignites
 *   - Stats animate in with count-up
 *
 * Phase 2: Scroll-driven (scrub: 1)
 *   - Hero section is pinned
 *   - Rocket launches along a curved path (bottom→top)
 *   - Flame size & glow intensity increase
 *   - Smoke trail elongates
 *   - Parallax on headline, stats, starfield, glow
 *   - At end of pin, rocket exits viewport, pin releases
 *
 * Phase 3: Next section reveal
 *   - Heading slides up with opacity
 *   - Description fades in with slight delay
 *   - Cards stagger in with per-card distinct easing
 *   - Decorative line animates in
 *
 * @param heroRef — ref to the hero container element
 */
export function useHeroAnimation(
  heroRef: React.RefObject<HTMLElement | null>
) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    if (!heroRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const hero = heroRef.current!;

      /* ═══════════════════════════════════════════
       *  ELEMENT REFERENCES
       * ═══════════════════════════════════════════ */
      const bgGlow = hero.querySelector(".hero-bg-glow") as HTMLElement;
      const letters = hero.querySelectorAll(".hero-letter");
      const rocketWrapper = hero.querySelector(
        ".rocket-container"
      ) as HTMLElement;
      const rocketGlow = hero.querySelector(".rocket-glow") as HTMLElement;
      const flameGroup = hero.querySelector(".flame-group") as SVGGElement;
      const flameOuter = hero.querySelector(".flame-outer") as SVGPathElement;
      const flameMid = hero.querySelector(".flame-mid") as SVGPathElement;
      const flameCore = hero.querySelector(".flame-core") as SVGPathElement;
      const sparks = hero.querySelectorAll(".spark");
      const smokeTrail = hero.querySelector(".smoke-trail") as SVGGElement;
      const statCards = hero.querySelectorAll(".stat-card");
      const statNumbers = hero.querySelectorAll(".stat-number");
      const starfield = hero.querySelector(".starfield") as HTMLElement;
      const statsContainer = hero.querySelector(
        ".stats-container"
      ) as HTMLElement;
      const scrollHint = hero.querySelector(".scroll-hint") as HTMLElement;

      /* ═══════════════════════════════════════════
       *  REDUCED MOTION: simple fallback
       * ═══════════════════════════════════════════ */
      if (prefersReducedMotion) {
        // Just show everything immediately, no pinning
        gsap.set([bgGlow, rocketWrapper, statsContainer, scrollHint], {
          opacity: 1,
        });
        gsap.set(letters, { opacity: 1, y: 0 });
        statCards.forEach((card, i) => {
          const el = statNumbers[i];
          if (el) el.textContent = `${STATS[i].value}${STATS[i].suffix}`;
        });
        gsap.set(statCards, { opacity: 1, y: 0 });

        // Simple fade-in for next section
        ScrollTrigger.create({
          trigger: ".next-section",
          start: "top 80%",
          onEnter: () => {
            gsap.to(".next-section-content", {
              opacity: 1,
              y: 0,
              duration: 0.6,
            });
          },
        });
        gsap.set(".next-section-content", { opacity: 0, y: 30 });
        return;
      }

      /* ═══════════════════════════════════════════
       *  INITIAL STATES (gsap.set with force3D)
       * ═══════════════════════════════════════════ */
      gsap.set(bgGlow, { opacity: 0, scale: 0.8, force3D: true });
      gsap.set(letters, {
        opacity: 0,
        y: 40,
        filter: "blur(8px)",
        force3D: true,
      });
      gsap.set(rocketWrapper, {
        opacity: 0,
        y: 60,
        scale: 0.85,
        force3D: true,
      });
      gsap.set(rocketGlow, { opacity: 0, scale: 0.6, force3D: true });
      gsap.set(flameGroup, { scaleY: 0.2, opacity: 0, force3D: true });
      gsap.set(sparks, { opacity: 0, y: 0, force3D: true });
      gsap.set(smokeTrail, { scaleY: 0.3, opacity: 0, force3D: true });
      gsap.set(statCards, { opacity: 0, y: 30, force3D: true });
      gsap.set(scrollHint, { opacity: 0, force3D: true });

      /* ═══════════════════════════════════════════
       *  PHASE 1: INTRO TIMELINE
       * ═══════════════════════════════════════════ */
      const introTL = gsap.timeline({
        delay: INTRO.initialDelay,
        defaults: { ease: EASE.letterReveal },
      });

      // 1. Background glow fades in
      introTL.to(bgGlow, {
        opacity: 1,
        scale: 1,
        duration: INTRO.glowFadeIn,
        ease: "power2.out",
      });

      // 2. Headline letters staggered reveal
      introTL.to(
        letters,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: INTRO.letterDuration,
          stagger: INTRO.letterStagger,
          ease: EASE.letterReveal,
        },
        "-=0.3"
      );

      // 3. Rocket rises into view
      introTL.to(
        rocketWrapper,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: INTRO.rocketRise,
          ease: EASE.rocketEntry,
        },
        "-=0.6"
      );

      // 3b. Rocket glow appears
      introTL.to(
        rocketGlow,
        {
          opacity: 0.6,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.5"
      );

      // 4. Flame ignites (quick flare then settle)
      introTL.to(
        flameGroup,
        {
          scaleY: 1.3,
          opacity: 1,
          duration: INTRO.flameIgnite * 0.5,
          ease: "power3.out",
        },
        "-=0.3"
      );
      introTL.to(flameGroup, {
        scaleY: 1,
        duration: INTRO.flameIgnite * 0.5,
        ease: "power2.inOut",
      });

      // 4b. Smoke trail appears
      introTL.to(
        smokeTrail,
        {
          scaleY: 1,
          opacity: 0.4,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3"
      );

      // 5. Stats animate in with count-up
      introTL.to(
        statCards,
        {
          opacity: 1,
          y: 0,
          duration: INTRO.statsDuration,
          stagger: INTRO.statsStagger,
          ease: EASE.statsReveal,
        },
        "-=0.4"
      );

      // 5b. Number count-up
      statNumbers.forEach((el, i) => {
        const target = { val: 0 };
        introTL.to(
          target,
          {
            val: STATS[i].value,
            duration: INTRO.countUpDuration,
            ease: "power2.out",
            onUpdate: () => {
              (el as HTMLElement).textContent = `${Math.round(target.val)}${STATS[i].suffix}`;
            },
          },
          `-=${INTRO.statsDuration + INTRO.statsStagger * (statNumbers.length - 1) - INTRO.statsStagger * i}`
        );
      });

      // 6. Scroll hint
      introTL.to(
        scrollHint,
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3"
      );

      /* ═══════════════════════════════════════════
       *  FLAME FLICKER LOOP (continuous, not scroll-linked)
       * ═══════════════════════════════════════════ */
      gsap.to(flameOuter, {
        scaleX: 0.92,
        scaleY: 1.06,
        duration: FLAME.flickerDuration,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "center top",
      });
      gsap.to(flameMid, {
        scaleX: 1.06,
        scaleY: 0.94,
        duration: FLAME.flickerDuration * 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.05,
        transformOrigin: "center top",
      });
      gsap.to(flameCore, {
        scaleX: 0.95,
        scaleY: 1.08,
        duration: FLAME.flickerDuration * 0.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.08,
        transformOrigin: "center top",
      });

      // Spark embers float down
      sparks.forEach((spark, i) => {
        gsap.to(spark, {
          y: 15 + i * 4,
          opacity: 0,
          duration: 0.8 + i * 0.15,
          repeat: -1,
          ease: "power1.out",
          delay: i * 0.12,
        });
      });

      /* ═══════════════════════════════════════════
       *  PHASE 2: SCROLL-DRIVEN ANIMATION
       *  Uses gsap.matchMedia for responsive paths
       * ═══════════════════════════════════════════ */
      const mm = gsap.matchMedia();

      // Desktop (>= 768px)
      mm.add("(min-width: 768px)", () => {
        const path = ROCKET_PATH.desktop;
        const pinSpacer = SCROLL.pinSpacerVh;

        const scrollTL = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: `+=${pinSpacer}vh`,
            pin: true,
            scrub: SCROLL.scrubValue,
            anticipatePin: 1,
          },
        });

        // Rocket launch path (0% → 100% scroll progress)
        scrollTL
          // 0–50%: rocket moves to mid position
          .to(
            rocketWrapper,
            {
              xPercent: path.midX - path.startX,
              yPercent: -(path.startY - path.midY) * 2,
              scale: path.midScale,
              rotation: path.midRotation,
              ease: "power1.inOut",
              duration: 0.5,
            },
            0
          )
          // 50–100%: rocket exits viewport
          .to(
            rocketWrapper,
            {
              xPercent: path.endX - path.startX,
              yPercent: -(path.startY - path.endY) * 2.5,
              scale: path.endScale,
              rotation: path.endRotation,
              ease: "power2.in",
              duration: 0.5,
            },
            0.5
          );

        // Flame intensity increases
        scrollTL.to(
          flameGroup,
          {
            scaleY: FLAME.maxScale,
            scaleX: 1.2,
            duration: 1,
            ease: "none",
          },
          0
        );

        // Rocket glow intensifies
        scrollTL.to(
          rocketGlow,
          {
            opacity: FLAME.maxGlowOpacity,
            scale: 1.5,
            duration: 1,
            ease: "none",
          },
          0
        );

        // Smoke trail elongates
        scrollTL.to(
          smokeTrail,
          {
            scaleY: 3,
            opacity: 0.6,
            duration: 1,
            ease: "none",
          },
          0
        );

        // Parallax: starfield moves slower
        scrollTL.to(
          starfield,
          {
            yPercent: -20 * PARALLAX.starfield,
            duration: 1,
            ease: "none",
          },
          0
        );

        // Parallax: headline moves at its own speed and fades
        scrollTL.to(
          ".hero-headline",
          {
            yPercent: -60,
            opacity: 0,
            letterSpacing: "0.5em",
            duration: 0.6,
            ease: "none",
          },
          0
        );

        // Parallax: stats slide down and fade
        scrollTL.to(
          statsContainer,
          {
            yPercent: 40,
            opacity: 0,
            duration: 0.5,
            ease: "none",
          },
          0
        );

        // Background glow shifts
        scrollTL.to(
          bgGlow,
          {
            yPercent: -30,
            scale: 1.4,
            opacity: 0.8,
            duration: 1,
            ease: "none",
          },
          0
        );

        // Scroll hint fades early
        scrollTL.to(
          scrollHint,
          {
            opacity: 0,
            duration: 0.15,
            ease: "none",
          },
          0
        );
      });

      // Mobile (< 768px)
      mm.add("(max-width: 767px)", () => {
        const path = ROCKET_PATH.mobile;
        const pinSpacer = SCROLL.pinSpacerVhMobile;

        const scrollTL = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: `+=${pinSpacer}vh`,
            pin: true,
            scrub: SCROLL.scrubValue,
            anticipatePin: 1,
          },
        });

        scrollTL
          .to(
            rocketWrapper,
            {
              yPercent: -(path.startY - path.midY) * 2.5,
              scale: path.midScale,
              rotation: path.midRotation,
              ease: "power1.inOut",
              duration: 0.5,
            },
            0
          )
          .to(
            rocketWrapper,
            {
              yPercent: -(path.startY - path.endY) * 3,
              scale: path.endScale,
              rotation: path.endRotation,
              ease: "power2.in",
              duration: 0.5,
            },
            0.5
          );

        scrollTL.to(
          flameGroup,
          {
            scaleY: FLAME.maxScale,
            scaleX: 1.15,
            duration: 1,
            ease: "none",
          },
          0
        );
        scrollTL.to(
          rocketGlow,
          {
            opacity: FLAME.maxGlowOpacity,
            scale: 1.3,
            duration: 1,
            ease: "none",
          },
          0
        );
        scrollTL.to(
          smokeTrail,
          { scaleY: 2.5, opacity: 0.5, duration: 1, ease: "none" },
          0
        );
        scrollTL.to(
          starfield,
          { yPercent: -15, duration: 1, ease: "none" },
          0
        );
        scrollTL.to(
          ".hero-headline",
          { yPercent: -50, opacity: 0, duration: 0.5, ease: "none" },
          0
        );
        scrollTL.to(
          statsContainer,
          { yPercent: 30, opacity: 0, duration: 0.4, ease: "none" },
          0
        );
        scrollTL.to(
          bgGlow,
          {
            yPercent: -20,
            scale: 1.3,
            opacity: 0.7,
            duration: 1,
            ease: "none",
          },
          0
        );
        scrollTL.to(
          scrollHint,
          { opacity: 0, duration: 0.1, ease: "none" },
          0
        );
      });

      /* ═══════════════════════════════════════════
       *  PHASE 3: NEXT SECTION — Enhanced reveal
       * ═══════════════════════════════════════════ */
      const nextContent = document.querySelector(
        ".next-section-content"
      ) as HTMLElement;
      const nextCards = document.querySelectorAll(".next-card");
      const nextHeading = document.querySelector(
        ".next-section-content h2"
      ) as HTMLElement;
      const nextDesc = document.querySelector(
        ".next-section-desc"
      ) as HTMLElement;
      const sectionLine = document.querySelector(
        ".section-line"
      ) as HTMLElement;

      // Set initial states
      gsap.set(nextContent, { opacity: 0, y: 60, force3D: true });
      gsap.set(nextCards, { opacity: 0, y: 40, force3D: true });

      // Heading and description separate initial states
      if (nextHeading) {
        gsap.set(nextHeading, { opacity: 0, y: 30, force3D: true });
      }
      if (nextDesc) {
        gsap.set(nextDesc, { opacity: 0, y: 25, force3D: true });
      }

      ScrollTrigger.create({
        trigger: ".next-section",
        start: "top 75%",
        once: true,
        onEnter: () => {
          // Reveal the section line
          if (sectionLine) {
            sectionLine.classList.add("revealed");
          }

          // Main content container fades in
          gsap.to(nextContent, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
          });

          // Heading reveals with a slight lift
          if (nextHeading) {
            gsap.to(nextHeading, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: 0.15,
              ease: "power3.out",
            });
          }

          // Description fades in slightly after heading
          if (nextDesc) {
            gsap.to(nextDesc, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: 0.3,
              ease: "power2.out",
            });
          }

          // Cards stagger in with distinct easing
          gsap.to(nextCards, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: {
              each: 0.15,
              from: "start",
            },
            delay: 0.4,
            ease: "power3.out",
          });
        },
      });

      /* ═══════════════════════════════════════════
       *  NEXT SECTION: Parallax subtle movement on scroll
       * ═══════════════════════════════════════════ */
      ScrollTrigger.create({
        trigger: ".next-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
        onUpdate: (self) => {
          const progress = self.progress;
          // Subtle upward float for cards as user scrolls through section
          nextCards.forEach((card, i) => {
            gsap.set(card, {
              y: (1 - progress) * (8 + i * 3),
              force3D: true,
            });
          });
        },
      });

      /* ═══════════════════════════════════════════
       *  REFRESH after fonts load
       * ═══════════════════════════════════════════ */
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    }, heroRef);

    ctxRef.current = ctx;

    return () => {
      ctx.revert(); // Kills all triggers and tweens cleanly
    };
  }, [heroRef]);
}
