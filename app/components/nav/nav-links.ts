export const NAV_LINKS = [
  { label: "Network Care", href: "/network-care" },
  { label: "The Lab", href: "/lab" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
]
export const SERVICES_MENU = [
  { label: "Wi-Fi & Networking", href: "/home-networking", description: "Better home Wi-Fi and UniFi installations" },
  { label: "Tech Support", href: "/tech-support", description: "Computer and device help, on-site or remote" },
  { label: "Business Networking", href: "/services", description: "Staff, guest, POS, and device networks" },
  { label: "Websites", href: "/websites", description: "Websites, hosting, and updates" },
]
export const SERVICES_ACTIVE_PATHS = SERVICES_MENU.map((item) => item.href)
