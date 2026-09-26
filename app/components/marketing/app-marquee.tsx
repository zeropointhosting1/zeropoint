import Image from "next/image"
import { withBasePath } from "@/lib/base-path"

// Logo files live in /public/logos: svgl.app for Microsoft and Google,
// simple-icons for Square, and the bread icon from Toast's own
// public-domain logo on Wikimedia Commons. A pill without a logo falls
// back to a letter badge.
const STACK: { name: string; logo?: string }[] = [
  { name: "UniFi", logo: "ubiquiti" },
  { name: "Cisco", logo: "cisco" },
  { name: "Microsoft 365", logo: "microsoft-365" },
  { name: "Google Workspace", logo: "google-workspace" },
  { name: "Square", logo: "square" },
  { name: "Toast", logo: "toast" },
]

// One copy of STACK renders far narrower than the full-bleed marquee
// container on wide viewports, so two copies alone leave the tail end
// scrolling into empty space before the loop resets. Repeating it enough
// times keeps trailing content on screen at every point in the cycle — the
// keyframe's -20% (1/MARQUEE_COPIES) travels exactly one STACK-width either
// way, so the loop speed is unaffected by the extra copies.
const MARQUEE_COPIES = 5
const MARQUEE_TRACK = Array.from({ length: MARQUEE_COPIES }, () => STACK).flat()

export function AppMarquee({ label = "Apps and equipment we work with" }: { label?: string }) {
  return (
    <div className="relative border-t border-border bg-surface/70 py-6">
      <p className="mx-auto max-w-6xl px-6 font-mono text-xs tracking-[0.12em] text-text-secondary uppercase">{label}</p>
      <div className="relative mt-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max gap-3 animate-marquee">
          {MARQUEE_TRACK.map((item, index) => <StackPill key={index} {...item} duplicate={index >= STACK.length} />)}
        </div>
      </div>
    </div>
  )
}

function StackPill({ name, logo, duplicate }: { name: string; logo?: string; duplicate?: boolean }) {
  return (
    <span aria-hidden={duplicate} className="flex shrink-0 items-center gap-3 rounded-full border border-border bg-surface-raised py-2 pr-4 pl-2 text-sm font-medium text-foreground shadow-[inset_0_1px_0_oklch(1_0_0/6%)]">
      {logo ? <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
        <Image
          src={withBasePath(`/logos/${logo}.svg`)}
          alt={`${name} logo`}
          width={22}
          height={22}
          unoptimized
          className="size-[22px] object-contain"
        />
      </span> : <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">{name.slice(0, 1)}</span>}
      {name}
    </span>
  )
}
