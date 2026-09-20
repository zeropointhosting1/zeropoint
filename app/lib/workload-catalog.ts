export type UsageProfile = "starter" | "recommended" | "heavy"

export type WorkloadRequirement = {
  cpu: number
  ramGb: number
  storageGb: number
  label: string
}

export type Workload = {
  id: string
  name: string
  category: string
  description: string
  requirements: Record<UsageProfile, WorkloadRequirement>
  storageNote: string
  sourceLabel: string
  sourceUrl: string
  sourceFact: string
  methodology: string
  updatedAt: string
}

export const PROFILE_LABELS: Record<UsageProfile, { label: string; description: string }> = {
  starter: { label: "Starter", description: "Small deployment or evaluation" },
  recommended: { label: "Recommended", description: "Comfortable everyday use" },
  heavy: { label: "Heavy", description: "Larger libraries or higher concurrency" },
}

// Official requirements rarely map neatly to VM allocations. Every entry
// therefore separates the source fact from ZeroPoint's planning judgment.
// Storage values cover the VM/app itself; user media and backups are extra.
export const WORKLOADS: Workload[] = [
  {
    id: "home-assistant",
    name: "Home Assistant OS",
    category: "Automation",
    description: "Home automation with Supervisor, integrations, and add-ons.",
    requirements: {
      starter: { cpu: 2, ramGb: 2, storageGb: 32, label: "Basic automations" },
      recommended: { cpu: 2, ramGb: 4, storageGb: 64, label: "Typical home" },
      heavy: { cpu: 4, ramGb: 8, storageGb: 128, label: "Many add-ons" },
    },
    storageNote: "Includes room for history and add-ons; camera recordings need separate capacity.",
    sourceLabel: "Home Assistant VM installation guide",
    sourceUrl: "https://www.home-assistant.io/installation/windows",
    sourceFact: "The official KVM example assigns 2 vCPUs and 4 GB RAM.",
    methodology: "Starter and heavy tiers bracket the official 2-vCPU/4-GB example for lighter and add-on-heavy installations.",
    updatedAt: "2026-09-19",
  },
  {
    id: "immich",
    name: "Immich",
    category: "Photos",
    description: "Self-hosted photo and video backup with search and machine learning.",
    requirements: {
      starter: { cpu: 2, ramGb: 6, storageGb: 50, label: "Minimum supported" },
      recommended: { cpu: 4, ramGb: 8, storageGb: 100, label: "Smooth uploads" },
      heavy: { cpu: 8, ramGb: 16, storageGb: 200, label: "Large imports" },
    },
    storageNote: "Excludes originals. Immich says thumbnails and transcodes can add roughly 10–20% to the library.",
    sourceLabel: "Immich hardware requirements",
    sourceUrl: "https://docs.immich.app/install/requirements/",
    sourceFact: "Immich publishes a 2-core/6-GB minimum and recommends 4 cores/8 GB RAM.",
    methodology: "Starter and recommended match the official values; heavy adds headroom for large imports and machine-learning jobs.",
    updatedAt: "2026-09-19",
  },
  {
    id: "plex",
    name: "Plex Media Server",
    category: "Media",
    description: "Personal media streaming with optional real-time transcoding.",
    requirements: {
      starter: { cpu: 2, ramGb: 2, storageGb: 30, label: "Direct play" },
      recommended: { cpu: 4, ramGb: 4, storageGb: 50, label: "One transcode" },
      heavy: { cpu: 8, ramGb: 8, storageGb: 100, label: "Multiple transcodes" },
    },
    storageNote: "Excludes the media library. Transcoding can consume gigabytes of temporary disk space.",
    sourceLabel: "Plex server requirements",
    sourceUrl: "https://support.plex.tv/articles/200375666-plex-media-server-requirements/",
    sourceFact: "Plex says 4 GB RAM is typically sufficient; CPU demand depends heavily on simultaneous transcoding.",
    methodology: "CPU tiers are planning allocations, not CPU-model guarantees. Hardware transcoding can materially change the requirement.",
    updatedAt: "2026-09-19",
  },
  {
    id: "nextcloud",
    name: "Nextcloud",
    category: "Cloud",
    description: "File sync, sharing, calendars, contacts, and collaborative apps.",
    requirements: {
      starter: { cpu: 2, ramGb: 2, storageGb: 40, label: "Personal use" },
      recommended: { cpu: 4, ramGb: 4, storageGb: 80, label: "Family use" },
      heavy: { cpu: 6, ramGb: 8, storageGb: 150, label: "Apps and users" },
    },
    storageNote: "Excludes synced files, previews, versions, trash retention, and backups.",
    sourceLabel: "Nextcloud system requirements",
    sourceUrl: "https://docs.nextcloud.com/server/stable/admin_manual/installation/system_requirements.html",
    sourceFact: "Nextcloud documents at least 128 MB RAM per process and recommends 512 MB per process.",
    methodology: "VM allocations are conservative ZeroPoint baselines because total usage varies with users, apps, files, and activity.",
    updatedAt: "2026-09-19",
  },
  {
    id: "jellyfin",
    name: "Jellyfin",
    category: "Media",
    description: "Free, open-source media streaming with optional hardware transcoding.",
    requirements: {
      starter: { cpu: 2, ramGb: 4, storageGb: 50, label: "Direct play, headless" },
      recommended: { cpu: 4, ramGb: 8, storageGb: 100, label: "Average deployment" },
      heavy: { cpu: 8, ramGb: 16, storageGb: 200, label: "Multiple transcodes" },
    },
    storageNote: "Excludes the media library. Covers the OS, app, and transcoding cache only.",
    sourceLabel: "Jellyfin hardware selection guide",
    sourceUrl: "https://jellyfin.org/docs/general/administration/hardware-selection/",
    sourceFact: "Jellyfin recommends at least 8 GB RAM for the average deployment; a headless Linux server may need only 4 GB.",
    methodology: "Starter matches the documented headless-Linux floor; recommended matches the official average-deployment figure; heavy adds room for concurrent transcodes.",
    updatedAt: "2026-09-19",
  },
  {
    id: "pihole",
    name: "Pi-hole",
    category: "Networking",
    description: "Network-wide DNS ad and tracker blocking.",
    requirements: {
      starter: { cpu: 1, ramGb: 1, storageGb: 8, label: "Single household" },
      recommended: { cpu: 1, ramGb: 2, storageGb: 16, label: "Longer query log" },
      heavy: { cpu: 2, ramGb: 4, storageGb: 32, label: "Multiple networks" },
    },
    storageNote: "Excludes long-term log export. Pi-hole itself stays small; the buffer covers the VM's OS.",
    sourceLabel: "Pi-hole prerequisites",
    sourceUrl: "https://docs.pi-hole.net/main/prerequisites/",
    sourceFact: "Pi-hole's official prerequisites list 512 MB RAM and at least 2 GB free disk space (4 GB recommended).",
    methodology: "RAM is rounded up from the documented 512 MB minimum to a whole-GB VM allocation; Pi-hole itself needs little CPU at any tier.",
    updatedAt: "2026-09-19",
  },
  {
    id: "vaultwarden",
    name: "Vaultwarden",
    category: "Security",
    description: "Lightweight, Bitwarden-compatible self-hosted password manager.",
    requirements: {
      starter: { cpu: 1, ramGb: 1, storageGb: 8, label: "Personal use" },
      recommended: { cpu: 2, ramGb: 1, storageGb: 16, label: "Family or small team" },
      heavy: { cpu: 2, ramGb: 2, storageGb: 32, label: "Many users or orgs" },
    },
    storageNote: "Covers the app and database; scales mainly with attachments and Sends, not user count.",
    sourceLabel: "Vaultwarden hardware requirements discussion",
    sourceUrl: "https://vaultwarden.discourse.group/t/hardware-requirements/3273",
    sourceFact: "A Vaultwarden maintainer recommends 2 vCPUs and 1 GB of memory as a practical baseline for a functional deployment.",
    methodology: "Starter trims to 1 vCPU since Vaultwarden is single-binary and idles under 500 MB RAM; heavy adds RAM headroom, not CPU, since load stays I/O-light.",
    updatedAt: "2026-09-19",
  },
  {
    id: "grafana",
    name: "Grafana",
    category: "Monitoring",
    description: "Dashboards and alerting for metrics, logs, and traces.",
    requirements: {
      starter: { cpu: 1, ramGb: 1, storageGb: 8, label: "Evaluation" },
      recommended: { cpu: 2, ramGb: 2, storageGb: 16, label: "Several dashboards" },
      heavy: { cpu: 4, ramGb: 4, storageGb: 32, label: "Many users or alerts" },
    },
    storageNote: "Covers the Grafana server only, not the metrics/log databases (Prometheus, Loki, etc.) feeding it.",
    sourceLabel: "Grafana installation requirements",
    sourceUrl: "https://grafana.com/docs/grafana/latest/setup-grafana/installation/",
    sourceFact: "Grafana's official minimum is 512 MB memory and 1 CPU core, described as a floor for evaluation, not production.",
    methodology: "Starter rounds the documented floor up to a whole GB; recommended and heavy scale with concurrent users, data sources, and alert-rule evaluation frequency.",
    updatedAt: "2026-09-19",
  },
  {
    id: "gitea",
    name: "Gitea",
    category: "Development",
    description: "Self-hosted Git service with issues, PRs, and CI integration.",
    requirements: {
      starter: { cpu: 1, ramGb: 1, storageGb: 8, label: "Personal repos" },
      recommended: { cpu: 2, ramGb: 1, storageGb: 20, label: "Small team" },
      heavy: { cpu: 4, ramGb: 2, storageGb: 50, label: "Larger org" },
    },
    storageNote: "Excludes CI runners and large Git LFS objects, which need separate capacity.",
    sourceLabel: "Gitea documentation",
    sourceUrl: "https://docs.gitea.com/",
    sourceFact: "Gitea's own docs state 2 CPU cores and 1 GB RAM is typically sufficient for small teams and projects.",
    methodology: "Recommended matches the official small-team figure directly; starter and heavy scale CPU with repository and CI activity while RAM stays flat.",
    updatedAt: "2026-09-19",
  },
]
