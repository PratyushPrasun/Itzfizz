/**
 * Animation configuration constants.
 * Tweak these to adjust timing, easing, scroll behavior, and rocket path.
 */

/* ─── Easing presets ─── */
export const EASE = {
  /** Headline letter reveal */
  letterReveal: "expo.out",
  /** Rocket entry on load */
  rocketEntry: "power3.out",
  /** Stats count-up */
  statsReveal: "power2.out",
  /** Scroll-driven scrub ease (applied via scrub value) */
  scrub: "power1.inOut",
} as const;

/* ─── Intro timeline durations (seconds) ─── */
export const INTRO = {
  /** Delay before anything starts */
  initialDelay: 0.3,
  /** Background glow fade-in */
  glowFadeIn: 0.6,
  /** Per-letter stagger interval */
  letterStagger: 0.04,
  /** Letter animation duration */
  letterDuration: 0.8,
  /** Rocket rise-in duration */
  rocketRise: 1.0,
  /** Flame ignite duration */
  flameIgnite: 0.4,
  /** Stats per-card stagger */
  statsStagger: 0.15,
  /** Stats animation duration */
  statsDuration: 0.6,
  /** Stat number count-up duration */
  countUpDuration: 1.2,
  /** Total intro should feel ~2-2.5s */
} as const;

/* ─── Scroll-linked (scrub) config ─── */
export const SCROLL = {
  /** Scrub smoothness (1 = smooth, 0 = instant, higher = more lag) */
  scrubValue: 1,
  /** Pin spacer length in vh units (how far to scroll while pinned) */
  pinSpacerVh: 250,
  /** Mobile pin spacer (shorter on small screens) */
  pinSpacerVhMobile: 180,
} as const;

/* ─── Rocket path keyframes (percentages of scroll progress) ─── */
export const ROCKET_PATH = {
  desktop: {
    /** Starting position (% of viewport) */
    startX: 50, // center
    startY: 60,
    /** Mid-path waypoint */
    midX: 45,
    midY: 35,
    /** Exit position */
    endX: 38,
    endY: -30,
    /** Rotation range (degrees) — tilts toward travel direction */
    startRotation: 0,
    midRotation: -8,
    endRotation: -15,
    /** Scale range */
    startScale: 1,
    midScale: 1.15,
    endScale: 0.7,
  },
  mobile: {
    startX: 50,
    startY: 55,
    midX: 50,
    midY: 30,
    endX: 50,
    endY: -35,
    startRotation: 0,
    midRotation: -5,
    endRotation: -10,
    startScale: 0.75,
    midScale: 0.9,
    endScale: 0.5,
  },
} as const;

/* ─── Flame / glow intensity across scroll progress ─── */
export const FLAME = {
  /** Minimum flame scale at rest */
  minScale: 1,
  /** Maximum flame scale at full scroll */
  maxScale: 1.8,
  /** Glow opacity range */
  minGlowOpacity: 0.3,
  maxGlowOpacity: 0.85,
  /** Flicker loop duration (GSAP yoyo) */
  flickerDuration: 0.15,
} as const;

/* ─── Parallax speed multipliers (1 = normal scroll speed) ─── */
export const PARALLAX = {
  starfield: 0.3,
  headline: 0.6,
  stats: 0.8,
  backgroundGlow: 0.2,
} as const;

/* ─── Physical Interaction Parameters ─── */
export const PHYSICS = {
  cardTiltMaxDeg: 10,
  magneticRadiusPx: 75,
  magneticStrength: 0.3,
  rocketGimbalMaxDeg: 5.5,
  rocketGimbalShiftPx: 22,
} as const;

/* ─── Colors (mirrors CSS vars, for use in GSAP tweens) ─── */
export const COLORS = {
  redPrimary: "#ff1e1e",
  redDeep: "#b30000",
  redGlow: "rgba(255, 30, 30, 0.45)",
  white: "#f5f5f5",
  muted: "#8a8a93",
} as const;

