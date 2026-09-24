export type UsageProfile = "starter" | "recommended" | "heavy"

export type WorkloadRequirement = {
  cpu: number
  ramGb: number
  storageGb: number
  // Portion of storageGb above that's actually a growing cache/recording
  // buffer (transcode cache, ML thumbnails, camera recordings) rather than
  // a true system-disk need. The Sizer adds this to the Data Storage total
  // (alongside the user's photo/media inputs) instead of the System disk
  // total — that reclassification, not a change in the underlying figure,
  // is most of what brought the old "927 GB system disk" for a 5-app
  // Heavy selection down to something realistic. Omitted/0 where there's
  // no such buffer (most apps).
  dataPortionGb?: number
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
  // True for light, single-process apps that run well as an unprivileged
  // Proxmox LXC container instead of a full VM (no separate guest kernel).
  // Only set where ZeroPoint has actually run it that way.
  lxcCapable?: boolean
  // Needs an accelerator (Coral TPU / Hailo / GPU) to be practical —
  // surfaces the "no accelerator" compatibility warning when selected.
  needsAccelerator?: boolean
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
      starter: { cpu: 2, ramGb: 6, storageGb: 20, dataPortionGb: 30, label: "Minimum supported" },
      recommended: { cpu: 4, ramGb: 8, storageGb: 30, dataPortionGb: 70, label: "Smooth uploads" },
      heavy: { cpu: 8, ramGb: 12, storageGb: 40, dataPortionGb: 110, label: "Large imports" },
    },
    storageNote: "Excludes originals. Thumbnails, ML model cache, and transcodes (the storage-heavy part) are counted under Data storage below, not system disk.",
    sourceLabel: "Immich hardware requirements",
    sourceUrl: "https://docs.immich.app/install/requirements/",
    sourceFact: "Immich publishes a 2-core/6-GB minimum and recommends 4 cores/8 GB RAM — it doesn't publish a heavy/large-library figure.",
    methodology: "Starter and recommended RAM match the official values directly. Heavy RAM (12 GB) was trimmed from an earlier, unsourced 16 GB — still a ZeroPoint buffer for large imports and ML jobs, re-checked against the official 8 GB recommended baseline rather than invented headroom.",
    updatedAt: "2026-09-23",
  },
  {
    id: "plex",
    name: "Plex Media Server",
    category: "Media",
    description: "Personal media streaming with optional real-time transcoding.",
    requirements: {
      starter: { cpu: 2, ramGb: 2, storageGb: 15, dataPortionGb: 15, label: "Direct play" },
      recommended: { cpu: 4, ramGb: 4, storageGb: 20, dataPortionGb: 30, label: "One transcode" },
      heavy: { cpu: 8, ramGb: 8, storageGb: 30, dataPortionGb: 70, label: "Multiple transcodes" },
    },
    storageNote: "Excludes the media library. Transcode cache (the storage-heavy part) is counted under Data storage below, not system disk.",
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
      starter: { cpu: 2, ramGb: 4, storageGb: 15, dataPortionGb: 35, label: "Direct play, headless" },
      recommended: { cpu: 4, ramGb: 8, storageGb: 20, dataPortionGb: 80, label: "Average deployment" },
      heavy: { cpu: 8, ramGb: 12, storageGb: 30, dataPortionGb: 90, label: "Multiple transcodes" },
    },
    storageNote: "Excludes the media library. Transcode cache (the storage-heavy part) is counted under Data storage below, not system disk.",
    sourceLabel: "Jellyfin hardware selection guide",
    sourceUrl: "https://jellyfin.org/docs/general/administration/hardware-selection/",
    sourceFact: "Jellyfin recommends at least 8 GB RAM for the average deployment; a headless Linux server may need only 4 GB — it doesn't publish a heavy/multi-transcode figure.",
    methodology: "Starter matches the documented headless-Linux floor; recommended matches the official average-deployment figure directly. Heavy RAM (12 GB) was trimmed from an earlier, unsourced 16 GB — re-checked against the 8 GB official baseline rather than invented headroom.",
    updatedAt: "2026-09-23",
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
    lxcCapable: true,
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
    lxcCapable: true,
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
    lxcCapable: true,
  },
  {
    id: "adguard-home",
    name: "AdGuard Home",
    category: "Networking",
    description: "Network-wide DNS ad and tracker blocking with encrypted upstream DNS.",
    requirements: {
      starter: { cpu: 1, ramGb: 1, storageGb: 8, label: "Single household" },
      recommended: { cpu: 1, ramGb: 2, storageGb: 16, label: "Longer query log" },
      heavy: { cpu: 2, ramGb: 4, storageGb: 32, label: "Multiple networks" },
    },
    storageNote: "Excludes long-term log export. AdGuard Home itself stays small; the buffer covers the VM's OS.",
    sourceLabel: "AdGuard Home (official repository)",
    sourceUrl: "https://github.com/AdguardTeam/AdGuardHome",
    sourceFact: "AdGuard Home doesn't publish a universal RAM/CPU minimum — usage scales with client count and filter-list size, and community deployments commonly run it well under 512 MB RAM on a single core.",
    methodology: "ZeroPoint assumption, not an official figure: mirrors Pi-hole's VM sizing since the two do the same job at a similar footprint, rounded to a whole-GB VM allocation.",
    updatedAt: "2026-09-23",
    lxcCapable: true,
  },
  {
    id: "paperless-ngx",
    name: "Paperless-ngx",
    category: "Documents",
    description: "Scans, OCRs, and indexes documents so paper stops piling up.",
    requirements: {
      starter: { cpu: 2, ramGb: 2, storageGb: 20, label: "Light use" },
      recommended: { cpu: 2, ramGb: 4, storageGb: 50, label: "Regular scanning" },
      heavy: { cpu: 4, ramGb: 6, storageGb: 120, label: "Heavy OCR + Tika/Gotenberg" },
    },
    storageNote: "Covers the app, database, and processed documents at a moderate volume; large archives need more.",
    sourceLabel: "Paperless-ngx FAQ",
    sourceUrl: "https://docs.paperless-ngx.com/faq/",
    sourceFact: "Paperless-ngx's own FAQ says the web server alone needs roughly 300 MB, but the full stack — driven mainly by OCR processing — typically needs about 2 GB RAM minimum and 4 GB recommended.",
    methodology: "Starter and recommended follow the documented 2 GB / 4 GB figures directly; heavy adds room for the optional Tika/Gotenberg Office-document pipeline and larger OCR batches.",
    updatedAt: "2026-09-23",
  },
  {
    id: "uptime-kuma",
    name: "Uptime Kuma",
    category: "Monitoring",
    description: "Self-hosted uptime monitoring with status pages and alerts.",
    requirements: {
      starter: { cpu: 1, ramGb: 1, storageGb: 8, label: "A handful of monitors" },
      recommended: { cpu: 1, ramGb: 1, storageGb: 16, label: "Dozens of monitors" },
      heavy: { cpu: 2, ramGb: 2, storageGb: 32, label: "100+ monitors" },
    },
    storageNote: "Covers the app and its SQLite database; scales with monitor count and check-history retention.",
    sourceLabel: "Uptime Kuma (official repository)",
    sourceUrl: "https://github.com/louislam/uptime-kuma",
    sourceFact: "Uptime Kuma's docs note requirements vary by monitor count rather than a fixed minimum; community reports put ~100 active monitors at roughly 200 MB RAM and under 5% of one core.",
    methodology: "Rounded up from the commonly reported ~512 MB practical floor to a whole-GB VM allocation; heavy adds headroom for a much larger monitor count.",
    updatedAt: "2026-09-23",
    lxcCapable: true,
  },
  {
    id: "nginx-proxy-manager",
    name: "Nginx Proxy Manager",
    category: "Networking",
    description: "Reverse proxy with a web UI and automatic Let's Encrypt certificates.",
    requirements: {
      starter: { cpu: 1, ramGb: 1, storageGb: 8, label: "A few proxy hosts" },
      recommended: { cpu: 1, ramGb: 2, storageGb: 16, label: "Typical homelab use" },
      heavy: { cpu: 2, ramGb: 2, storageGb: 24, label: "Many hosts / high traffic" },
    },
    storageNote: "Excludes anything it proxies to — this covers the app, its database, and certificates only.",
    sourceLabel: "Nginx Proxy Manager",
    sourceUrl: "https://nginxproxymanager.com/",
    sourceFact: "Nginx Proxy Manager doesn't publish an official RAM/CPU minimum; community deployment guides commonly cite 1 GB RAM as workable with 2 GB recommended for more proxy hosts.",
    methodology: "ZeroPoint assumption based on common community guidance, not a published spec — rounded to whole-GB VM allocations.",
    updatedAt: "2026-09-23",
    lxcCapable: true,
  },
  {
    id: "arr-stack",
    name: "Sonarr / Radarr / Prowlarr",
    category: "Media",
    description: "Automated media library management, indexing, and downloads (the *arr stack).",
    requirements: {
      starter: { cpu: 2, ramGb: 2, storageGb: 20, label: "One or two apps" },
      recommended: { cpu: 2, ramGb: 4, storageGb: 40, label: "Full stack, moderate library" },
      heavy: { cpu: 4, ramGb: 6, storageGb: 60, label: "Large library, frequent imports" },
    },
    storageNote: "Excludes the media library itself — covers the apps, databases, and metadata only.",
    sourceLabel: "Servarr wiki",
    sourceUrl: "https://wiki.servarr.com/",
    sourceFact: "None of Sonarr, Radarr, or Prowlarr publish an official minimum; third-party deployment guides commonly land around 2 GB RAM for the combined stack, 4 GB for smoother operation.",
    methodology: "ZeroPoint estimate for running all three together — no official per-app figures exist, so this isn't sourced the way the rest of this table is.",
    updatedAt: "2026-09-23",
  },
  {
    id: "unifi-network-application",
    name: "UniFi Network Application",
    category: "Networking",
    description: "The standalone UniFi controller for adopting and managing UniFi hardware.",
    requirements: {
      starter: { cpu: 1, ramGb: 2, storageGb: 10, label: "Small site" },
      recommended: { cpu: 2, ramGb: 2, storageGb: 20, label: "Typical home or office site" },
      heavy: { cpu: 2, ramGb: 4, storageGb: 40, label: "Larger site, longer history" },
    },
    storageNote: "Grows with device count and how long historical stats and events are retained.",
    sourceLabel: "UniFi download and install",
    sourceUrl: "https://ui.com/download/unifi",
    sourceFact: "Ubiquiti's documented minimum for the standalone Network Application is 2 GB RAM, an x86-64 CPU, and 10 GB free storage (20 GB+ preferred).",
    methodology: "Starter and recommended follow the documented 2 GB RAM / 10–20 GB storage minimum directly; heavy adds headroom for a larger site with more devices and longer retention.",
    updatedAt: "2026-09-23",
  },
  {
    id: "truenas-vm",
    name: "TrueNAS (as a guest VM)",
    category: "Storage",
    description: "ZFS-backed NAS storage, running as a guest rather than the bare-metal host.",
    requirements: {
      starter: { cpu: 2, ramGb: 8, storageGb: 32, label: "Basic operation, few drives" },
      recommended: { cpu: 4, ramGb: 16, storageGb: 64, label: "More drives, apps, caching" },
      heavy: { cpu: 6, ramGb: 32, storageGb: 128, label: "Many drives, heavy caching" },
    },
    storageNote: "Covers the TrueNAS VM's own boot disk only, not the storage pool — pool capacity comes from the drives you pass through to it.",
    sourceLabel: "TrueNAS hardware guide",
    sourceUrl: "https://www.truenas.com/docs/scale/gettingstarted/tnhardwareguide/",
    sourceFact: "TrueNAS's official hardware guide recommends at least 8 GB RAM for basic operation with up to 8 drives, adding roughly 1 GB per additional drive.",
    methodology: "Starter follows the documented 8 GB floor directly; recommended and heavy scale RAM and CPU for more drives, apps, and read caching, assuming TrueNAS runs as a guest with drives passed through — not as the bare-metal host.",
    updatedAt: "2026-09-23",
  },
  {
    id: "frigate",
    name: "Frigate NVR",
    category: "Cameras",
    description: "Real-time object detection for security cameras, built for use with an accelerator.",
    requirements: {
      starter: { cpu: 4, ramGb: 4, storageGb: 8, dataPortionGb: 92, label: "1-2 cameras, with an accelerator" },
      recommended: { cpu: 4, ramGb: 8, storageGb: 10, dataPortionGb: 290, label: "~4 cameras, 14-day retention" },
      heavy: { cpu: 8, ramGb: 16, storageGb: 12, dataPortionGb: 588, label: "~8 cameras, 14-day retention" },
    },
    storageNote: "Almost all of this is recordings, not the app itself — counted under Data storage below (not system disk) since retention, not install size, drives it. These figures assume 1080p cameras and 14 days of storage.",
    sourceLabel: "Frigate hardware documentation",
    sourceUrl: "https://docs.frigate.video/frigate/hardware",
    sourceFact: "Frigate's docs list 4 GB RAM as the basic minimum with a dedicated accelerator, and roughly 4 vCPU / 8 GB RAM / 3 TB storage for a 4-camera, 1080p, 14-day-retention reference deployment.",
    methodology: "Starter follows the documented minimum; recommended matches the official 4-camera reference deployment; heavy scales toward the official 8-camera tier. All tiers assume a Coral TPU, Hailo, or GPU accelerator — CPU-only detection needs significantly more compute than shown here.",
    updatedAt: "2026-09-23",
    needsAccelerator: true,
  },
]

export type SizerPreset = { id: string; label: string; description: string; appIds: string[] }

// Starting points, not final answers — every one still runs through the
// same sourced math and can be adjusted afterward.
export const SIZER_PRESETS: SizerPreset[] = [
  { id: "media-server", label: "Media server", description: "Plex plus the *arr stack to manage it.", appIds: ["plex", "arr-stack"] },
  { id: "photo-privacy", label: "Photo backup + privacy", description: "Immich for photos, Vaultwarden for passwords.", appIds: ["immich", "vaultwarden"] },
  { id: "smart-home-cameras", label: "Smart home + cameras", description: "Home Assistant paired with Frigate NVR.", appIds: ["home-assistant", "frigate"] },
  { id: "learning-lab", label: "Learning lab", description: "A handful of light apps to practice on.", appIds: ["pihole", "gitea", "uptime-kuma"] },
]
