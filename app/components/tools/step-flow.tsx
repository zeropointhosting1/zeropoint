"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type FlowStepId = "sizer" | "deals" | "builds" | "contact"

const STEPS: { id: FlowStepId; label: string; href: string }[] = [
  { id: "sizer", label: "Workloads", href: "/sizer" },
  { id: "deals", label: "Hardware", href: "/deals" },
  { id: "builds", label: "Full build", href: "/deals#starter-builds" },
  { id: "contact", label: "Send a brief", href: "/contact" },
]

// Carries the current page's query string (Sizer's apps/tier/hv, Deals'
// minRam) forward into the next step, so picking a starting point once
// doesn't mean re-entering it at every stage of the flow.
export function ToolFlowSteps({ current }: { current: FlowStepId }) {
  const searchParams = useSearchParams()
  const query = searchParams.toString()

  return (
    <nav aria-label="Tool flow" className="flex flex-wrap items-center gap-1.5">
      {STEPS.map((step, index) => {
        const isCurrent = step.id === current
        const [path, hash] = step.href.split("#")
        const href = query && step.id !== "contact" ? `${path}?${query}${hash ? `#${hash}` : ""}` : step.href
        return (
          <React.Fragment key={step.id}>
            {index > 0 && <ChevronRight className="size-3.5 shrink-0 text-text-tertiary" />}
            <Link
              href={href}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-wider whitespace-nowrap uppercase transition-colors",
                isCurrent ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-text-tertiary hover:text-foreground"
              )}
            >
              <span className={cn("flex size-4 items-center justify-center rounded-full text-[9px]", isCurrent ? "bg-primary text-primary-foreground" : "bg-surface-raised")}>{index + 1}</span>
              {step.label}
            </Link>
          </React.Fragment>
        )
      })}
    </nav>
  )
}
