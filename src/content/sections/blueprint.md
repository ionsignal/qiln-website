---
enable: true
subtitle: "the blueprint"
title: "Stateless Compute. **Persistent Data.**"
yaml: |
  name: comfyui-gpu-node
  display_name: ComfyUI Inference Node
  image_alias: ubuntu:24.04-cuda

  # data wiring
  provisioning:
    volumes:
      - name: model-vault
        type: clone
        pool: is-nvme-pool
        source_vault: comfy-base-models
        mount_path: /opt/comfyui/models

    files:
      - path: /opt/comfyui/gpu.env
        content: |
          CUDA_VISIBLE_DEVICES="{{ gpu.id }}"

  # incus profile
  instance_template: 
    devices:
      gpu0:
        type: gpu
        pci: "{{ limits.gpu.pci }}"
        nvidia.runtime: 'true'
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
