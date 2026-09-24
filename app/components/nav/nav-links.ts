// Flat top-level links. "Services" is a separate dropdown (SERVICES_MENU
// below) rendered alongside these in the nav — kept apart because it needs
// its own trigger/content markup, not a plain <Link>.
export const NAV_LINKS = [
  { label: "Work", href: "/projects" },
  { label: "Learn", href: "/docs" },
  { label: "Tools", href: "/tools" },
  { label: "About", href: "/about" },
]

export const SERVICES_MENU = [
  { label: "Home Networking", href: "/home-networking", description: "Wi-Fi, IoT and camera separation" },
  { label: "Small Business", href: "/services", description: "Office networks, guest Wi-Fi, backups" },
  { label: "Websites & Dashboards", href: "/websites", description: "Restaurant and small-business sites" },
  { label: "Homelab", href: "/lab", description: "Proxmox, self-hosting, planning tools" },
]

// Paths that should count as "Services" being the active nav item, since
// its own pages (and the utility pages that hang off Homelab) aren't
// literally under /services.
export const SERVICES_ACTIVE_PATHS = ["/services", "/home-networking", "/websites", "/lab", "/network", "/community", "/deals", "/sizer"]
