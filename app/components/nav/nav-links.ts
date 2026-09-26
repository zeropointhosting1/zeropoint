import { SHOW_CLIENT_WORK } from "@/lib/site-config"

export const NAV_LINKS = [
  { label: "Pricing", href: "/pricing" },
  ...(SHOW_CLIENT_WORK ? [{ label: "Client Work", href: "/projects" }] : []),
  { label: "The Lab", href: "/lab" },
  { label: "Learn", href: "/docs" },
  { label: "About", href: "/about" },
]

export const SERVICES_MENU = [
  { label: "Business IT & Support", href: "/services", description: "Office networks, Wi-Fi, and monthly support" },
  { label: "Websites", href: "/websites", description: "An add-on for businesses and restaurants" },
  { label: "Home Networking", href: "/home-networking", description: "Wi-Fi in every room, safer smart devices" },
]

export const SERVICES_ACTIVE_PATHS = ["/services", "/home-networking", "/websites"]
