// Curated snapshot of the lab, updated by hand — not live-polled. The public
// site has no connectivity to Proxmox/UniFi/OPNsense, so this is deliberately
// static content rather than a dashboard hitting real infrastructure APIs.
// Service names are sanitized (generic role, not the real hostname/app) so
// this page doesn't hand out a map of internal attack surface.
//
// LAST_UPDATED is the single source for every "As of {date}" label on the
// site — update it whenever this file's numbers are refreshed by hand.
export const LAST_UPDATED = "2026-09-22"

export type HypervisorNode = {
  id: string
  name: string
  hardware: string
  status: "Online" | "Offline"
  cores: number
  cpuPct: number
  ramUsedGb: number
  ramTotalGb: number
  diskUsedGb: number
  diskTotalGb: number
  uptime: string
  guests: { running: number; total: number }
}

export const NODES: HypervisorNode[] = [
  {
    id: "pve01",
    name: "pve01",
    hardware: "HP EliteDesk Mini",
    status: "Online",
    cores: 6,
    cpuPct: 1,
    ramUsedGb: 3.4,
    ramTotalGb: 7.5,
    diskUsedGb: 7.1,
    diskTotalGb: 93.9,
    uptime: "1d 4h",
    guests: { running: 1, total: 2 },
  },
  {
    id: "pve02",
    name: "pve02",
    hardware: "HP EliteDesk Mini",
    status: "Online",
    cores: 6,
    cpuPct: 2,
    ramUsedGb: 6.0,
    ramTotalGb: 15.4,
    diskUsedGb: 7.0,
    diskTotalGb: 93.9,
    uptime: "2d 11h",
    guests: { running: 2, total: 2 },
  },
]

export type Service = {
  id: string
  label: string
  role: string
  type: "VM" | "LXC"
  node: string
  status: "Running" | "Stopped"
  uptime: string | null
}

export const SERVICES: Service[] = [
  {
    id: "internal-dashboard",
    label: "Internal Dashboard",
    role: "Monitoring",
    type: "VM",
    node: "pve01",
    status: "Running",
    uptime: "1d 1h",
  },
  {
    id: "password-manager",
    label: "Password Manager",
    role: "Credential Vault",
    type: "VM",
    node: "pve01",
    status: "Stopped",
    uptime: null,
  },
  {
    id: "mesh-vpn",
    label: "Mesh VPN",
    role: "Remote Access",
    type: "VM",
    node: "pve02",
    status: "Running",
    uptime: "1d 23h",
  },
  {
    id: "identity-sso",
    label: "Identity & SSO",
    role: "Authentication",
    type: "VM",
    node: "pve02",
    status: "Running",
    uptime: "1d 23h",
  },
]

export type VlanTone = "success" | "warning" | "muted"

export type VlanSegment = {
  id: string
  label: string
  vlanId: number
  wired: number
  wifi: number
  tone: VlanTone
  description: string
}

// The actual home network path — separate hardware, a separate network, from
// the Cisco lab. ISP account/modem details intentionally omitted; nothing
// here is a private IP, MAC, or credential.
export type ChainNode = { id: string; label: string }

export const HOME_CHAIN: ChainNode[] = [
  { id: "isp", label: "AT&T" },
  { id: "gateway", label: "Cloud Gateway" },
  { id: "switch", label: "Flex Mini" },
  { id: "ap", label: "Access Point" },
]

export const VLANS: VlanSegment[] = [
  {
    id: "trusted",
    label: "Trusted",
    vlanId: 1,
    wired: 6,
    wifi: 3,
    tone: "success",
    description: "Core devices — full access to internal services.",
  },
  {
    id: "iot",
    label: "IoT",
    vlanId: 20,
    wired: 0,
    wifi: 7,
    tone: "warning",
    description: "Smart-home devices, isolated from trusted traffic.",
  },
  {
    id: "guest",
    label: "Guest",
    vlanId: 30,
    wired: 0,
    wifi: 0,
    tone: "muted",
    description: "Internet-only, walled off from every other segment.",
  },
]

export const HOMELAB_STATS = {
  nodes: NODES.length,
  services: SERVICES.length,
  vlans: VLANS.length,
  clients: VLANS.reduce((sum, v) => sum + v.wired + v.wifi, 0),
}
