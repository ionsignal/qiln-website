---
enable: true
subtitle: "Qiln Blueprints"
title: "A blueprint defines a <strong>versioned AI workflow capsule.</strong>"
yaml: |
  schema_version: 1
  name: ai-workflow-capsule
  display_name: AI Workflow Capsule
  description: Versioned Python and PyTorch workspace with a writable branch and a read-only shared model mount.
  provisioning:
    volumes:
      - name: workspace
        type: clone
        mount_path: /workspace
        shifted: true
        readonly: false
      - name: shared-models
        type: bind
        mount_path: /workspace/models
        shifted: true
        readonly: true
  runtime:
    config:
      security.privileged: 'false'
      nvidia.runtime: 'true'
      boot.autostart: 'false'
  snapshot_capture:
    policy_version: 1
    instance_rootfs:
      mode: rebuildable
    artifact_roots:
      - id: workspace
        volume: workspace
        required: true
    external_mounts:
      - volume: shared-models
        required: true
        dependency:
          kind: model_vault
          logical_id: shared-models
callouts:
  - title: "Writable branch workspace"
    description: "Each branch uses a writable cloned workspace instead of sharing mutable project files."
    icon: "GitFork"
    lines: [7, 8, 9, 10, 11]
  - title: "Read-only model boundary"
    description: "Shared models mount read-only, so a branch can use them without modifying the shared dependency."
    icon: "Database"
    lines: [12, 13, 14, 15, 16]
  - title: "CUDA at the runtime boundary"
    description: "`nvidia.runtime` enables NVIDIA runtime support for CUDA workloads. Keep GPU runtime configuration outside the Python workspace."
    icon: "Gauge"
    lines: [17, 18, 19, 20, 21]
  - title: "Explicit snapshot boundaries"
    description: "Snapshot capture rebuilds the instance root filesystem, records workspace state, and treats shared models as an external immutable dependency."
    icon: "History"
    lines: [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]
infoBox:
  description: "This compact example shows capsule boundaries. Deployment-specific image, storage-pool, seed-volume, network, and route values are configured per environment."
---
