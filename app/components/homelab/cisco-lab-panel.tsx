import { NetworkTeaserDiagram } from "@/components/marketing/network-teaser-diagram"

// The lab hangs off a dedicated link from the home UniFi switch, but OPNsense
// draws the real boundary — its own routing domain and firewall policy, not
// a segment of the home VLANs, and not trusted by them.
export function CiscoLabPanel({ animated }: { animated: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-raised p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.2em] text-text-tertiary uppercase">
          OPNsense · Cisco Switch
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-text-tertiary uppercase">
          <span className="size-1.5 rounded-full bg-text-tertiary" />
          Its own routing domain
        </span>
      </div>
      <div className="mt-4">
        <NetworkTeaserDiagram animated={animated} />
      </div>
    </div>
  )
}
