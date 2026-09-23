"use client"

import { MotionConfig } from "framer-motion"

// Many scroll-reveal components animate opacity/transform directly without
// checking useReducedMotion() themselves. reducedMotion="user" makes
// framer-motion snap those straight to their end state whenever the OS
// prefers-reduced-motion setting is on, without touching every call site.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
