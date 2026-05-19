---
enable: true
subtitle: "FAQ"
title: "Questions We **Actually** Get"
showCategories: true
list:
  - label: "The Project"
    list:
      - active: true
        title: "What exactly is Qiln?"
        content: |
          **Qiln** (pronounced *kiln*) is an open-source orchestration engine that turns bare-metal GPU servers into managed, multi-tenant workspaces.

          You define your application as a single YAML blueprint — Qiln handles container isolation, GPU passthrough, ZFS storage, network routing, and HTTPS termination.

          It's built for teams running their own hardware who want a declarative workflow without the operational weight of Kubernetes.
      - active: false
        title: "Is Qiln open source? What's the license?"
        content: |
          Yes. Qiln will be released under the **Apache 2.0 license** with no contributor license agreement (CLA) required. Our public GitHub repository will go live alongside our first tagged release.

          We chose Apache 2.0 specifically because it permits commercial use, redistribution, and modification without imposing copyleft requirements on downstream projects.
      - active: false
        title: "Who is building Qiln?"
        content: |
          Qiln is built by a small team of infrastructure engineers who got tired of choosing between "Kubernetes complexity" and "manual Docker scripts" for GPU workloads. We use Qiln daily to run AI inference, creative pipelines, and stateful services on our own hardware.

          The project emerged from real operational needs, not a roadmap deck. Every feature exists because we needed it ourselves.
      - active: false
        title: "How does Qiln compare to Kubernetes, Docker Compose, or Proxmox?"
        content: |
          Qiln sits in a gap none of these tools fill cleanly:

          - **Kubernetes** is excellent at scale but adds significant operational overhead, weak GPU device handling, and complex stateful storage (CSI) for single-node or small-cluster GPU deployments.
          - **Docker Compose** has no concept of GPU pools, ZFS-backed storage, per-tenant isolation, or declarative provisioning.
          - **Proxmox** gives you VMs and containers, but no managed workspace abstraction — you build the orchestration layer yourself.

          Qiln is purpose-built for the intersection of GPU-aware, stateful, multi-tenant workloads on owned hardware.

  - label: "Architecture & Compatibility"
    list:
      - active: true
        title: "Do I need Kubernetes to run Qiln?"
        content: |
          **No.** Qiln is built directly on [Incus](https://linuxcontainers.org/incus/) system containers, which run natively on the Linux kernel without any control plane overhead.

          There is no etcd, no kube-apiserver, no kubelet, no CNI configuration. You install Incus, point Qiln at it, and provision workloads via the web UI or YAML blueprints.
      - active: false
        title: "What operating systems are supported?"
        content: |
          Linux only. **Ubuntu 24.04 LTS** is our reference platform — it's what we develop, test, and run Qiln on daily.

          Other modern distributions with kernel 6.x+, ZFS support, and Incus packages (Debian 13, Arch, Fedora) should work, but they're community-tested rather than officially supported. If you successfully deploy on a non-reference distro, we'd love to hear about it on Discord.
      - active: false
        title: "Which GPUs work with Qiln?"
        content: |
          **NVIDIA GPUs with the proprietary driver stack**, mapped into containers via PCIe passthrough. We've tested extensively on RTX A4000 hardware, and the architecture works for any NVIDIA card supported by the NVIDIA Container Toolkit.

          AMD GPUs (ROCm) and Intel Arc are not currently supported. Hardware-level vGPU partitioning (MIG) is on our roadmap but not yet implemented — today, GPUs are passed through to a single container at a time.
      - active: false
        title: "Can Qiln run on a single machine?"
        content: |
          Yes — single-node deployment is the **primary deployment model** today. Qiln is designed to make a single GPU server feel like a private cloud.

          Multi-node clustering is on the roadmap (Incus supports it natively), but we're prioritizing depth on single-node features first. If you have a multi-node use case in mind, mention it when you join the waitlist.
      - active: false
        title: "What's the storage backend?"
        content: |
          **ZFS is required** — not optional. Qiln depends on ZFS copy-on-write semantics to make storage provisioning fast and space-efficient. When five users each spin up a 30GB AI model environment, ZFS CoW clones mean they collectively consume ~30GB on disk, not 150GB.

          We use ZFS for snapshots, dataset-level isolation, and instant volume cloning. LVM, Btrfs, and ext4 are not supported.
      - active: false
        title: "What's the minimum hardware to get started?"
        content: |
          For a useful development or homelab deployment:

          - **CPU:** x86_64, 8+ cores recommended
          - **RAM:** 32GB minimum, 64GB+ for AI inference
          - **Storage:** Dedicated NVMe or SSD for the ZFS pool (separate from the OS disk)
          - **GPU:** NVIDIA card with proprietary driver support
          - **Network:** Single NIC works; bonded interfaces supported for redundancy

          You can run Qiln on a beefy workstation, a rack-mounted server, or anything in between.

  - label: "Production Readiness"
    list:
      - active: true
        title: "Is Qiln production-ready?"
        content: |
          **Qiln is in active development, and we're being deliberate about what we promise.** Here's the honest breakdown:

          **What works today:**
          - Container provisioning with declarative YAML blueprints
          - GPU passthrough with bare-metal performance
          - ZFS-backed storage vaults with copy-on-write clones
          - Real-time telemetry, logs, and the admin UI shown above
          - Automated rollback on failed provisioning

          **What's still being built:**
          - Multi-node clustering
          - Comprehensive automated backups
          - GPU hot-plug (dynamic attach/release while a vessel is offline)
          - Full observability (Prometheus/OTel integration)
          - Hardened authentication for public-facing deployments

          If you're running a homelab, a research GPU server, or an internal team cluster where you can tolerate occasional rough edges in exchange for hands-on access to the maintainers, you're exactly who we're building for. If you need enterprise SLAs today, we're not there yet — but we will be.
      - active: false
        title: "What's the multi-tenancy security model?"
        content: |
          Qiln uses **unprivileged Incus system containers** with strict UID/GID mapping, ZFS dataset-level isolation, and network segmentation per tenant. This provides strong isolation for trusted multi-tenancy — teams, labs, internal organizations, or known users.

          We do not currently recommend Qiln for **untrusted public multi-tenancy** (e.g., hosting arbitrary code from anonymous internet users). System containers share the host kernel, so a kernel zero-day could theoretically allow tenant escape. For trusted environments, this risk is acceptable and matches the security posture of platforms like Proxmox or LXD.
      - active: false
        title: "How do backups work?"
        content: |
          Today, Qiln exposes **ZFS snapshots** for vault-level point-in-time recovery — snapshots are instant and space-efficient thanks to ZFS CoW. You can take, list, and restore snapshots from the admin UI.

          What's coming: scheduled snapshot policies, off-host replication to remote ZFS pools or object storage, and automated lifecycle policies for archival. If backup tooling is a hard requirement for your evaluation, let us know what you need.
      - active: false
        title: "What happens if I hit a bug or need help?"
        content: |
          Our **Discord community** is the primary support channel today. The maintainers are active there and respond directly to issues, questions, and feature requests.

          When the GitHub repo goes public, structured bug reports and feature requests will move to GitHub Issues. We do not offer paid enterprise support today, though that may change as the project matures.
      - active: false
        title: "Can I migrate off Qiln if I stop using it?"
        content: |
          **Yes — and this is a deliberate design principle.** Qiln doesn't introduce proprietary formats or lock-in:

          - Your data lives in standard **ZFS datasets** you can read, mount, and migrate independently.
          - Your containers are standard **Incus instances** that can be managed directly with `incus` CLI commands.
          - Your blueprints are plain **YAML files** you fully own.

          If you decided to stop using Qiln tomorrow, your running workloads would keep running, and you could continue managing them with vanilla Incus tooling. We think you'll stick around — but the exit door is always open.

  - label: "Early Access & Partnership"
    list:
      - active: true
        title: "What does the design partner program look like?"
        content: |
          We're working closely with a **small, curated group of design partners** as we approach our first public release. Design partners receive:

          - Direct Discord/Slack access to the maintainers
          - Influence on roadmap prioritization
          - Priority blueprint development for your specific workloads
          - Early access to features before public release
          - Architecture review sessions for your deployment

          We're particularly interested in partners running **AI inference workloads** (vLLM, SGLang, ComfyUI), **creative production pipelines** (image/video generation), or **research environments** (Jupyter, PyTorch, dataset-heavy workflows) at small-to-mid scale.

          If that sounds like your team, [join the waitlist](#waitlist) and mention *"design partner"* in the form — we'll reach out within a few days.
      - active: false
        title: "How do I get early access?"
        content: |
          Two ways to get involved before the public release:

          1. **[Join the waitlist](#waitlist)** to be notified when we open broader access and to receive periodic development updates.
          2. **[Join our Discord](#discord)** to lurk, ask questions, see what we're working on, and engage directly with the team.

          We do not require either commitment — joining one doesn't sign you up for the other. Lurkers welcome.
      - active: false
        title: "Can I contribute to development?"
        content: |
          Even before the GitHub repository goes public, there are meaningful ways to contribute:

          - **Workload blueprints** — if you have expertise with a specific application (a particular AI framework, a niche service), we'd love your help authoring and testing blueprints.
          - **Documentation review** — fresh eyes on installation guides and architecture docs catch the assumptions we've stopped seeing.
          - **Bug reports & design feedback** — actively reporting friction in the UI or unexpected behavior in the orchestrator is hugely valuable.

          Discord is the entry point for all of the above.
      - active: false
        title: "When will Qiln be publicly available?"
        content: |
          We're targeting our first public release alongside the GPU hot-plug feature, comprehensive blueprint coverage for our four primary workload types, and a one-command installer that automates the host setup.

          Rather than committing to a specific calendar date and missing it, we'd rather tie the release to **shipping the features that make Qiln genuinely usable by strangers**. Waitlist subscribers will get a heads-up at least two weeks before public launch.
      - active: false
        title: "Will there be a hosted or managed version?"
        content: |
          **Not currently planned.** Qiln is a self-hosted, open-source product, and that's the model we're committed to.

          If a hosted offering ever happens, it would be a separate product layered *on top of* the open-source core — never a replacement for it, and never with features held back from the OSS release. The core engine will always be Apache 2.0 and fully self-hostable.
---
