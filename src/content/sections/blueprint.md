---
enable: true
subtitle: "the blueprint"
title: "Stateless Compute. **Persistent Data.**"
yaml: |
  name: papermc-edge
  display_name: PaperMC Edge Server
  image_alias: ubuntu:24.04

  # data wiring
  provisioning:
    volumes:
      - name: world-data
        type: clone
        pool: is-nvme-pool
        source_vault: mc-base-vault
        mount_path: /opt/minecraft/world

    files:
      - path: /opt/minecraft/jvm.env
        content: |
          ION_JVM_ARGS="-Xmx{{ limits.memory }}"

  # incus profile
  instance_template: 
    devices:
      eth0:
        type: nic
        network: incusbr0
        security.mac_filtering: 'true'
callouts:
  - title: "Instant ZFS CoW Clones"
    description: "Bypasses slow container pulls. Provisions a zero-copy clone from a base vault in milliseconds."
    icon: "HardDrive"
    lines: [6, 7, 8, 9, 10, 11, 12, 13]
  - title: "Pre-flight Injection"
    description: "Injects dynamic ledger data into the filesystem before the instance even boots."
    icon: "FileCode2"
    lines: [13, 14, 15, 16, 17]
  - title: "Raw Hypervisor Security"
    description: "Direct access to Incus primitives like MAC filtering, isolated networks, and PCIe passthrough."
    icon: "ShieldCheck"
    lines: [18, 19, 20, 21, 22, 23, 24, 25]
infoBox:
  description: "Qiln dynamically wires ZFS datasets into immutable containers at runtime."
---
