// The full portfolio scope — not every project has a dedicated deep case
// study yet. `status` is honest about that: "Documented" links somewhere
// real (the Homelab or Network pages, which already cover it accurately);
// "Planned" means exactly that, and isn't linked anywhere yet.

export type ProjectStatus = "Documented" | "Planned"

export type Project = {
  id: string
  title: string
  description: string
  tags: string[]
  status: ProjectStatus
  href?: string
}

export const PROJECTS: Project[] = [
  {
    id: "home-network",
    title: "ZeroPoint Home Network",
    description:
      "UniFi Cloud Gateway Ultra, a U7 Lite AP, VLAN segmentation across Trusted/IoT/Guest, and the troubleshooting that came with actually running it.",
    tags: ["UniFi", "VLANs", "Firewall"],
    status: "Documented",
    href: "/network",
  },
  {
    id: "proxmox-cluster",
    title: "Proxmox Cluster",
    description:
      "Two HP EliteDesk Mini nodes running a Proxmox cluster — multi-node virtualization, VM deployment, and the Linux administration underneath it.",
    tags: ["Proxmox", "Virtualization", "Linux"],
    status: "Documented",
    href: "/network",
  },
  {
    id: "enterprise-network-lab",
    title: "Enterprise Network Lab",
    description:
      "Cisco switching behind OPNsense, its own routing domain and firewall policy, kept deliberately separate from the home network.",
    tags: ["Cisco", "OPNsense", "Routing"],
    status: "Documented",
    href: "/network",
  },
  {
    id: "zeropoint-website",
    title: "ZeroPoint Public Website",
    description:
      "This site — Next.js, a static export deployed to GitHub Pages, MDX-powered documentation, and a privacy-conscious \"Your Connection\" panel instead of generic analytics.",
    tags: ["Next.js", "MDX", "Privacy"],
    status: "Documented",
    href: "/",
  },
  {
    id: "sso",
    title: "ZeroPoint SSO",
    description:
      "Centralized authentication in front of internal applications — OIDC/OAuth instead of a separate login for every service.",
    tags: ["Authentik", "OIDC", "Identity"],
    status: "Planned",
  },
  {
    id: "remote-access",
    title: "Secure Remote Access",
    description:
      "Tailscale for remote administration, so management interfaces never need to be exposed to the public internet.",
    tags: ["Tailscale", "VPN"],
    status: "Planned",
  },
  {
    id: "internal-dashboard",
    title: "Internal Dashboard",
    description:
      "A Dockerized internal tool for service monitoring and CPU-temperature telemetry across the homelab.",
    tags: ["Docker", "Monitoring"],
    status: "Planned",
  },
  {
    id: "vaultwarden",
    title: "Self-Hosted Vaultwarden",
    description:
      "A self-hosted password manager — the deployment, the Docker setup, and the network access restrictions around it.",
    tags: ["Docker", "Security"],
    status: "Planned",
  },
  {
    id: "siem",
    title: "Network Monitoring / SIEM Experiments",
    description:
      "Wazuh experimentation — log collection, what worked, what didn't, and what a real monitoring setup would need next.",
    tags: ["Wazuh", "Logging"],
    status: "Planned",
  },
  {
    id: "windows-lab",
    title: "Enterprise Windows Lab",
    description: "AD DS, DNS, DHCP, GPO, and domain clients — once it's built.",
    tags: ["Active Directory", "Windows Server"],
    status: "Planned",
  },
]
