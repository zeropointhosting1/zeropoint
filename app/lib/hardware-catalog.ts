import { Router, Waypoints, Wifi } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type HardwareItem = {
  id: string
  role: string
  product: string
  spec: string
  icon: LucideIcon
}

export const HARDWARE: HardwareItem[] = [
  {
    id: "gateway",
    role: "Gateway",
    product: "UniFi Cloud Gateway Ultra",
    spec: "Routing, firewall, and the UniFi OS console",
    icon: Router,
  },
  {
    id: "switch",
    role: "Switch",
    product: "UniFi Flex Mini",
    spec: "Compact managed switch feeding the AP",
    icon: Waypoints,
  },
  {
    id: "ap",
    role: "Access Point",
    product: "UniFi U7 Lite",
    spec: "Broadcasts the Trusted, IoT & Guest SSIDs",
    icon: Wifi,
  },
]
