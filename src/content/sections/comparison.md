---
enable: true
subtitle: "how we compare"
title: "Own Your GPUs. **Drop the Rent.**"
tabs:
  - id: "rented-clouds"
    label: "vs. Rented Clouds"
    tagline: "RunPod, Vast.ai, Lambda — you're renting compute you could own."
    mobileCompetitor: "runpod"
    competitors:
      - id: "runpod"
        name: "RunPod Secure"
        highlight: false
      - id: "vast"
        name: "Vast.ai"
        highlight: false
      - id: "lambda"
        name: "Lambda"
        highlight: false
      - id: "qiln"
        name: "Qiln"
        highlight: true
    rows:
      - label: "Pricing"
        cells:
          runpod: "Per-second"
          vast: "Spot bidding"
          lambda: "Hourly"
          qiln: "**$0 software** + hardware"
      - label: "8× GPU Cost (Annu.)"
        isPrice: true
        cells:
          runpod: "~$27.3k"
          vast: "~$10.5k–17.5k"
          lambda: "~$56k"
          qiln: "~$12k"
      - label: "Data Privacy"
        cells:
          runpod: "[none] Cloud"
          vast: "[none] Random hosts"
          lambda: "[none] Cloud"
          qiln: "[native] Local / Private"
      - label: "Idle Cost"
        cells:
          runpod: "Storage billed"
          vast: "Instance destroyed"
          lambda: "Instance destroyed"
          qiln: "[native] $0 (Your metal)"
      - label: "Multi-Tenancy"
        cells:
          runpod: "[none] 1 user/pod"
          vast: "[none] Single user"
          lambda: "[none] Single user"
          qiln: "[native] Isolated containers"
      - label: "Storage Arch."
        cells:
          runpod: "Network vols"
          vast: "Ephemeral local"
          lambda: "Cloud storage"
          qiln: "[native] ZFS + local NVMe"
      - label: "Instant Model Cloning"
        cells:
          runpod: "[none] Not supported"
          vast: "[none] Not supported"
          lambda: "[none] Not supported"
          qiln: "[native] ZFS CoW"
      - label: "GPU Pool / Hot-plug"
        cells:
          runpod: "[none] Fixed per-pod"
          vast: "[none] Fixed"
          lambda: "[none] Fixed"
          qiln: "[roadmap] Dynamic leasing"
      - label: "Open Source"
        cells:
          runpod: "[none] Proprietary"
          vast: "[none] Proprietary"
          lambda: "[none] Proprietary"
          qiln: "[native] Apache 2.0"
      - label: "Best For"
        isBestFor: true
        cells:
          runpod: "Production inference"
          vast: "Budget experiments"
          lambda: "Managed clusters"
          qiln: "24/7 bare-metal workloads"
    footnotes:
      - "Prices verified June 2025 from public rate cards. GPU cloud pricing fluctuates."
      - "RunPod Community 8× pricing assumes 8 separate A4000 pods (no co-location guarantee)."
      - "Qiln self-hosted assumes 8× used RTX A4000 ($700/ea), a $4k chassis, and $150/mo power."

  - id: "managed-apps"
    label: "vs. Managed Apps"
    tagline: "RunDiffusion gives you one app. Qiln gives you a platform."
    mobileCompetitor: "rundiffusion"
    competitors:
      - id: "rundiffusion"
        name: "RunDiffusion"
        highlight: false

      - id: "replicate"
        name: "Replicate"
        highlight: false
      - id: "modal"
        name: "Modal"
        highlight: false
      - id: "qiln"
        name: "Qiln"
        highlight: true
    rows:
      - label: "Supported Apps"
        cells:
          rundiffusion: "SD / AI Image"
          replicate: "Pre-built APIs"
          modal: "Custom Python"
          qiln: "[native] Any container"
      - label: "Pricing"
        cells:
          rundiffusion: "Per-session"
          replicate: "Per-prediction"
          modal: "Per-second"
          qiln: "**$0 software** + hardware"
      - label: "Team Cost (5 Users)"
        isPrice: true
        cells:
          rundiffusion: "~$7.5k–14.5k/yr"
          replicate: "usage cost"
          modal: "usage cost"
          qiln: "**~$2k/yr** (after 1st year)"
      - label: "Custom Extensions"
        cells:
          rundiffusion: "[possible] Restricted"
          replicate: "[none] Fixed API"
          modal: "[native] Full control"
          qiln: "[native] Root access"
      - label: "Model Storage"
        cells:
          rundiffusion: "Pay/GB or re-download"
          replicate: "Platform managed"
          modal: "Billed separately"
          qiln: "[native] Shared ZFS vaults"
      - label: "Multi-User"
        cells:
          rundiffusion: "[none] Solo sessions"
          replicate: "[possible] Team API keys"
          modal: "[possible] Team accounts"
          qiln: "[native] Shared GPU pool"
      - label: "Mixed Workloads"
        cells:
          rundiffusion: "[none] SD only"
          replicate: "[possible] AI only"
          modal: "[native] Arbitrary"
          qiln: "[native] Any workload"
      - label: "Data Privacy"
        cells:
          rundiffusion: "[none] Cloud"
          replicate: "[none] Cloud"
          modal: "[none] Cloud"
          qiln: "[native] Local / Private"
      - label: "Best For"
        isBestFor: true
        cells:
          rundiffusion: "Solo artists"
          replicate: "API integrators"
          modal: "ML engineers"
          qiln: "Small teams"
    footnotes:
      - "RunDiffusion pricing based on published session rates of $0.50–2.00/hr depending on GPU tier."
      - "Qiln annual cost amortized across all apps and users sharing the same hardware."

  - id: "self-hosted"
    label: "vs. Self-Hosted"
    tagline: "You own the metal. You don't need Kubernetes."
    mobileCompetitor: "kubernetes"
    competitors:
      - id: "kubernetes"
        name: "Kubernetes"
        highlight: false
      - id: "docker"
        name: "Docker"
        highlight: false
      - id: "proxmox"
        name: "Proxmox"
        highlight: false
      - id: "nomad"
        name: "Nomad"
        highlight: false
      - id: "dstack"
        name: "dstack"
        highlight: false
      - id: "qiln"
        name: "Qiln"
        highlight: true
    rows:
      - label: "Setup & Learning"
        cells:
          kubernetes: "Weeks to master"
          docker: "Hours (no scaling)"
          proxmox: "Days (VM model)"
          nomad: "Days to weeks"
          dstack: "Hours"
          qiln: "[native] ~30 mins"
      - label: "Control Plane"
        cells:
          kubernetes: "Heavy (etcd, API, etc.)"
          docker: "Docker daemon"
          proxmox: "Web UI + API"
          nomad: "Nomad + Consul"
          dstack: "Python + Cloud auth"
          qiln: "[native] Zero (Incus/Caddy)"
      - label: "GPU Primitive"
        cells:
          kubernetes: "[possible] Brittle plugins"
          docker: "[possible] Manual flags"
          proxmox: "[possible] PCIe passthrough"
          nomad: "[possible] Limited plugins"
          dstack: "[native] Cloud-focused"
          qiln: "[native] Pool-aware passthrough"
      - label: "GPU Hot-plug"
        cells:
          kubernetes: "[none] Static"
          docker: "[none] Manual"
          proxmox: "[none] Fixed VMs"
          nomad: "[possible] No hot-plug"
          dstack: "[possible] Cloud allocation"
          qiln: "[roadmap] Attach/release"
      - label: "Multi-Tenancy"
        cells:
          kubernetes: "[possible] Complex RBAC"
          docker: "[none] No isolation"
          proxmox: "[possible] Manual VMs"
          nomad: "[possible] ACLs"
          dstack: "[possible] Projects"
          qiln: "[native] ZFS + UID mapping"
      - label: "Declarative Config"
        cells:
          kubernetes: "[possible] Complex YAML"
          docker: "[possible] docker-compose"
          proxmox: "[none] GUI-driven"
          nomad: "[native] HCL"
          dstack: "[native] YAML"
          qiln: "[native] ~30-line YAML"
      - label: "Storage & Snapshots"
        cells:
          kubernetes: "[possible] Complex CSI"
          docker: "[none] Bind mounts"
          proxmox: "[possible] ZFS available"
          nomad: "[none] Host vols"
          dstack: "[none] Cloud vols"
          qiln: "[native] ZFS Built-in"
      - label: "Single-Node Ready"
        cells:
          kubernetes: "[possible] Wasteful"
          docker: "[native] Single-host only"
          proxmox: "[native] VM-focused"
          nomad: "[possible] Cluster-focused"
          dstack: "[possible] Cloud-first"
          qiln: "[native] Primary model"
      - label: "HTTPS / Routing"
        cells:
          kubernetes: "[possible] Manual Ingress"
          docker: "[none] Reverse proxy"
          proxmox: "[none] None"
          nomad: "[possible] Traefik"
          dstack: "[native] Gateway"
          qiln: "[native] Auto-TLS (Caddy)"
      - label: "Best For"
        isBestFor: true
        cells:
          kubernetes: "Enterprise platform teams"
          docker: "Quick local prototyping"
          proxmox: "Traditional IT homelabs"
          nomad: "HashiCorp shops"
          dstack: "Multi-cloud ML teams"
          qiln: "GPU owners escaping K8s tax"
    footnotes:
      - "Kubernetes setup estimates assume a team unfamiliar with K8s provisioning GPU workloads with persistent storage for the first time."
      - "Qiln's ~30-minute setup assumes Ubuntu 24.04 with ZFS and NVIDIA drivers pre-installed."
---
