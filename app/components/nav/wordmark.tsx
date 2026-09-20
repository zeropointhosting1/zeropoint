"use client"

import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

// Recreated from the ZeroPoint logo mark: a shield outline split
// cyan/foreground down the middle, a crosshair ring inside, and an indigo
// center dot. Self-contained "use client" so it can gate its own ambient
// pulse on prefers-reduced-motion regardless of where it's rendered.
export function Wordmark({ className }: { className?: string }) {
  const reduced = useReducedMotion()

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-300 ease-out group-hover:rotate-[12deg]"
      >
        {/* Shield outline, split left (accent) / right (foreground) */}
        <path
          d="M50,6 L16,25 L16,58 Q16,74 50,94"
          stroke="var(--primary)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M50,6 L84,25 L84,58 Q84,74 50,94"
          stroke="currentColor"
          strokeOpacity="0.3"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Crosshair ring */}
        <circle cx="50" cy="50" r="17" stroke="var(--primary)" strokeWidth="3.5" />
        <path d="M50,14 V31" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M50,69 V86" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M19,50 H33" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M67,50 H81" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" />

        {/* Center dot — the one place the logo's second accent color shows up */}
        <circle cx="50" cy="50" r="6.5" fill="var(--mark-dot)">
          {!reduced && (
            <animate
              attributeName="opacity"
              values="1;0.55;1"
              dur="2.4s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      </svg>
      <span className="font-sans text-sm font-semibold tracking-wide">
        ZERO<span className="text-primary">POINT</span>
      </span>
    </span>
  )
}
