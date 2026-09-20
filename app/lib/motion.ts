import type { Variants } from "framer-motion";

// Shared entrance variants. Every consumer should read prefers-reduced-motion
// via useReducedMotion() and pass the reduced set below when true.

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const fadeUpReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

export const viewportOnce = { once: true, margin: "-80px" };

export function useVariants(reduced: boolean | null) {
  return reduced ? fadeUpReduced : fadeUp;
}
