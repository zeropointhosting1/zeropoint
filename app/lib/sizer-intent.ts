// Lets the chat widget (and anything else) turn a free-text mention of an
// app or hypervisor into a real Sizer deep link with those preselected,
// using the same query-string shape components/sizer/vm-sizing-calculator.tsx
// reads on mount (apps=, hv=). Deliberately has no local imports — Next's
// bundler resolver and Node's native test runner disagree about whether a
// relative import needs a file extension, so the easiest fix is to not
// have one; ids here are kept in sync by hand with lib/workload-catalog.ts
// and lib/hypervisor-catalog.ts, the same pattern lib/deals.ts already
// uses to stay in sync with the Deno Edge Function.
type Alias = { pattern: RegExp; id: string }

const APP_ALIASES: Alias[] = [
  { pattern: /\bhome ?assistant\b|\bhaos\b/i, id: "home-assistant" },
  { pattern: /\bimmich\b/i, id: "immich" },
  { pattern: /\bplex\b/i, id: "plex" },
  { pattern: /\bnextcloud\b/i, id: "nextcloud" },
  { pattern: /\bjellyfin\b/i, id: "jellyfin" },
  { pattern: /\bpi-?hole\b/i, id: "pihole" },
  { pattern: /\bvaultwarden\b|\bbitwarden\b/i, id: "vaultwarden" },
  { pattern: /\bgrafana\b/i, id: "grafana" },
  { pattern: /\bgitea\b/i, id: "gitea" },
  { pattern: /\badguard\b/i, id: "adguard-home" },
  { pattern: /\bpaperless\b/i, id: "paperless-ngx" },
  { pattern: /\buptime ?kuma\b/i, id: "uptime-kuma" },
  { pattern: /\bnginx proxy manager\b|\bnpm\b/i, id: "nginx-proxy-manager" },
  { pattern: /\bsonarr\b|\bradarr\b|\bprowlarr\b|\barr stack\b/i, id: "arr-stack" },
  { pattern: /\bunifi (network|controller)\b/i, id: "unifi-network-application" },
  { pattern: /\btruenas\b/i, id: "truenas-vm" },
  { pattern: /\bfrigate\b/i, id: "frigate" },
]

const HYPERVISOR_ALIASES: Alias[] = [
  { pattern: /\bproxmox\b|\bpve\b/i, id: "proxmox" },
  { pattern: /\besxi\b|\bvmware\b/i, id: "esxi" },
  { pattern: /\btruenas scale\b/i, id: "truenas-scale" },
  { pattern: /\bbare ?metal\b|\bdocker\b/i, id: "none" },
]

export type SizerIntent = { appIds: string[]; hypervisorId: string | null }

export function parseSizerIntent(text: string): SizerIntent | null {
  const appIds = [...new Set(APP_ALIASES.filter((a) => a.pattern.test(text)).map((a) => a.id))]
  const hypervisorMatch = HYPERVISOR_ALIASES.find((h) => h.pattern.test(text))
  if (appIds.length === 0 && !hypervisorMatch) return null
  return { appIds, hypervisorId: hypervisorMatch?.id ?? null }
}

export function sizerUrlFor(intent: SizerIntent): string {
  const params = new URLSearchParams()
  if (intent.appIds.length) params.set("apps", intent.appIds.join(","))
  if (intent.hypervisorId) params.set("hv", intent.hypervisorId)
  const qs = params.toString()
  return qs ? `/sizer?${qs}` : "/sizer"
}
