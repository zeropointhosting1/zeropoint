import type { Variants } from "framer-motion";

// Shared entrance variants. Every consumer should read prefers-reduced-motion
// via useReducedMotion() and pass the reduced set below when true.

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};

export const fadeUpReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

// Fires while content is still mostly below the fold (negative bottom
// margin) and after only a sliver is visible, so reveals read as "already
// there" instead of a visible wipe as you scroll down to them.
export const viewportOnce = { once: true, margin: "0px 0px -10% 0px", amount: 0.1 };

export function useVariants(reduced: boolean | null) {
  return reduced ? fadeUpReduced : fadeUp;
}
