// The full topology across both networks — this is the "centerpiece" view;
// /homelab covers the same ground in inventory form. Every description below
// is a real fact already established elsewhere on this site (hardware model,
// VLAN structure, node roles) — nothing here is invented.

export type NetTone = "primary" | "success" | "warning" | "muted"

export type NetNode = {
  id: string
  label: string
  sublabel: string
  x: number
  y: number
  size: number
  tone: NetTone
  description: string
}

export type NetEdge = {
  id: string
  from: string
  to: string
  tone?: NetTone
}

export const NET_NODES: NetNode[] = [
  {
    id: "internet",
    label: "Internet",
    sublabel: "ISP",
    x: 60,
    y: 240,
    size: 9,
    tone: "primary",
    description: "The WAN link everything else on both networks depends on.",
  },
  {
    id: "gateway",
    label: "UniFi Gateway",
    sublabel: "Cloud Gateway Ultra",
    x: 230,
    y: 240,
    size: 9,
    tone: "primary",
    description:
      "Routing, firewall, and the UniFi OS console for the whole home network — the first hop past the ISP.",
  },
  {
    id: "switching",
    label: "UniFi Switching",
    sublabel: "Flex Mini",
    x: 400,
    y: 240,
    size: 8,
    tone: "primary",
    description:
      "The physical hub. Every home segment and the lab's dedicated uplink all pass through this one switch.",
  },
  {
    id: "proxmox",
    label: "Proxmox Cluster",
    sublabel: "2× HP EliteDesk Mini",
    x: 620,
    y: 100,
    size: 8,
    tone: "success",
    description:
      "Two HP EliteDesk Mini nodes (pve01, pve02) running a Proxmox cluster — VMs for internal services like SSO, remote access, and monitoring.",
  },
  {
    id: "ap",
    label: "Wireless AP",
    sublabel: "UniFi U7 Lite",
    x: 620,
    y: 240,
    size: 8,
    tone: "warning",
    description: "Broadcasts the Trusted, IoT, and Guest SSIDs — each mapped to its own VLAN.",
  },
  {
    id: "lab-network",
    label: "Lab Network",
    sublabel: "Dedicated uplink",
    x: 620,
    y: 380,
    size: 8,
    tone: "muted",
    description:
      "A dedicated VLAN off the switch, uplinked to the Cisco lab — one link, one direction of trust. The home VLANs never route into it.",
  },
  {
    id: "opnsense",
    label: "OPNsense",
    sublabel: "Lab firewall",
    x: 800,
    y: 380,
    size: 8,
    tone: "muted",
    description:
      "The Cisco lab's own firewall and router. This is where the real boundary lives — its own routing domain, independent of the home gateway.",
  },
  {
    id: "cisco",
    label: "Cisco Switch",
    sublabel: "Enterprise lab",
    x: 960,
    y: 380,
    size: 8,
    tone: "muted",
    description:
      "Serves the lab's Windows and Linux clients — segmented, routed, and firewalled independently of the home network.",
  },
]

export const NET_EDGES: NetEdge[] = [
  { id: "e-internet-gateway", from: "internet", to: "gateway" },
  { id: "e-gateway-switching", from: "gateway", to: "switching" },
  { id: "e-switching-proxmox", from: "switching", to: "proxmox", tone: "success" },
  { id: "e-switching-ap", from: "switching", to: "ap", tone: "warning" },
  { id: "e-switching-lab", from: "switching", to: "lab-network", tone: "muted" },
  { id: "e-lab-opnsense", from: "lab-network", to: "opnsense", tone: "muted" },
  { id: "e-opnsense-cisco", from: "opnsense", to: "cisco", tone: "muted" },
]

export const NET_VIEWBOX = "0 0 1020 480"
