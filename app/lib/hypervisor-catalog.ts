export type Hypervisor = {
  id: string
  name: string
  description: string
  overhead: { cpu: number; ramGb: number; storageGb: number }
  sourceLabel: string
  sourceUrl: string
  sourceFact: string
  methodology: string
}

// The host layer is provisioned once, on top of every workload's own
// allocation — not per app. "None" is the baseline this whole page already
// assumes elsewhere: apps running directly on a Linux host or in Docker.
export const HYPERVISORS: Hypervisor[] = [
  {
    id: "none",
    name: "Bare metal / Docker",
    description: "Apps run directly on a Linux host, no virtualization layer.",
    overhead: { cpu: 0, ramGb: 0, storageGb: 0 },
    sourceLabel: "",
    sourceUrl: "",
    sourceFact: "There's no separate host to provision — the workload totals above are what you'd buy.",
    methodology: "Zero overhead by definition; every other figure on this page already assumes this baseline.",
  },
  {
    id: "proxmox",
    name: "Proxmox VE",
    description: "KVM/LXC hypervisor with a web UI, popular for homelabs.",
    overhead: { cpu: 1, ramGb: 2, storageGb: 32 },
    sourceLabel: "Proxmox VE system requirements",
    sourceUrl: "https://pve.proxmox.com/wiki/System_Requirements",
    sourceFact: "Proxmox's official minimum is 1 GB RAM for the host, plus additional RAM needed for guests.",
    methodology: "We reserve 2 GB RAM (the documented minimum plus margin for the web UI and cluster services), 1 vCPU, and 32 GB for the boot/OS disk.",
  },
  {
    id: "esxi",
    name: "VMware ESXi",
    description: "Bare-metal type-1 hypervisor from Broadcom.",
    overhead: { cpu: 1, ramGb: 8, storageGb: 32 },
    sourceLabel: "ESXi 8.0 hardware requirements",
    sourceUrl: "https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/esx-installation-and-setup/installing-and-setting-up-esxi-install/esxi-requirements-install/esxi-hardware-requirements-install.html",
    sourceFact: "ESXi 8.0 requires a minimum of 8 GB of physical RAM, at least two CPU cores, and a 32 GB boot disk.",
    methodology: "We reserve the documented minimums directly for the hypervisor layer, on top of whatever you allocate to guest VMs.",
  },
  {
    id: "truenas-scale",
    name: "TrueNAS SCALE",
    description: "Storage-first OS with a built-in KVM hypervisor for apps and VMs.",
    overhead: { cpu: 2, ramGb: 8, storageGb: 20 },
    sourceLabel: "TrueNAS SCALE hardware guide",
    sourceUrl: "https://www.truenas.com/docs/scale/gettingstarted/tnhardwareguide/",
    sourceFact: "TrueNAS SCALE's official minimum is 8 GB memory and a 20 GB SSD boot device.",
    methodology: "We reserve the documented 8 GB RAM floor and 20 GB boot device, plus 2 vCPU for the storage stack and middleware, before any guest VMs or apps.",
  },
]
