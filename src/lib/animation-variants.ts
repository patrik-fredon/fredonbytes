/**
 * Framer Motion Animation Variants Library
 * Dev-themed, performance-optimized animations
 * Transform & opacity only, respects prefers-reduced-motion
 */

import type { Variant, Transition } from "framer-motion";

// Motion Timing Tokens
export const motionTokens = {
  instant: 100,
  fast: 180,
  normal: 300,
  slow: 500,
  spring: 400,
} as const;

// Easing Functions
export const easings = {
  default: [0.4, 0, 0.2, 1], // cubic-bezier
  spring: [0.34, 1.56, 0.64, 1], // spring effect
  inOut: [0.4, 0, 0.6, 1],
  out: [0, 0, 0.2, 1],
  in: [0.4, 0, 1, 1],
} as const;

// Base transition configs
export const transitions = {
  instant: {
    duration: motionTokens.instant / 1000,
    ease: easings.default,
  },
  fast: {
    duration: motionTokens.fast / 1000,
    ease: easings.default,
  },
  normal: {
    duration: motionTokens.normal / 1000,
    ease: easings.default,
  },
  slow: {
    duration: motionTokens.slow / 1000,
    ease: easings.default,
  },
  spring: {
    duration: motionTokens.spring / 1000,
    ease: easings.spring,
  },
} as const;

// Fade Variants
export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Slide Variants
export const slideUpVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const slideDownVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const slideLeftVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const slideRightVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

// Scale Variants
export const scaleVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// Hover & Press Patterns
export const hoverScale = {
  scale: 1.02,
  transition: transitions.fast,
};

export const hoverLift = {
  y: -4,
  transition: transitions.fast,
};

export const pressScale = {
  scale: 0.98,
  transition: transitions.instant,
};

export const hoverGlow = {
  boxShadow: "0 0 20px rgba(0, 217, 255, 0.5)",
  transition: transitions.fast,
};

// Stagger Container
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// Stagger Children
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Card Hover Effect
export const cardHover = {
  rest: {
    scale: 1,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 0 20px rgba(0, 217, 255, 0.3)",
    transition: transitions.fast,
  },
  tap: {
    scale: 0.98,
    transition: transitions.instant,
  },
};

// Page Transition Variants
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: transitions.fast,
  },
};

// Modal Variants
export const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.fast,
  },
};

export const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// Utility: Create custom variant with reduced motion support
export function createVariant(
  variant: Record<string, Variant>,
  respectReducedMotion = true
): Record<string, Variant> {
  if (!respectReducedMotion) return variant;

  const reducedVariant: Record<string, Variant> = {};

  for (const [key, value] of Object.entries(variant)) {
    if (typeof value === "object" && value !== null) {
      reducedVariant[key] = {
        ...value,
        transition: { duration: 0.01 },
      };
    }
  }

  return reducedVariant;
}

// Utility: Get transition by speed name
export function getTransition(speed: keyof typeof motionTokens): Transition {
  return transitions[speed];
}

// Export all as default for convenience
export default {
  tokens: motionTokens,
  easings,
  transitions,
  fade: fadeVariants,
  fadeIn: fadeInVariants,
  slideUp: slideUpVariants,
  slideDown: slideDownVariants,
  slideLeft: slideLeftVariants,
  slideRight: slideRightVariants,
  scale: scaleVariants,
  hoverScale,
  hoverLift,
  pressScale,
  hoverGlow,
  staggerContainer,
  staggerItem,
  cardHover,
  page: pageVariants,
  modal: modalVariants,
  modalBackdrop: modalBackdropVariants,
  createVariant,
  getTransition,
};
