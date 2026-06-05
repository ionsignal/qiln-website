---
enable: true
subtitle: "workspace blueprints"
title: "Blueprints for **persistent AI workspaces.**"
yaml: |
  name: comfyui-workspace
  display_name: Persistent ComfyUI Workspace
  image_alias: ubuntu:24.04-cuda

  apps:
    - name: comfyui
      route: https://{{ workspace.slug }}.qiln.com
      command: /opt/comfyui/start.sh
    - name: vscode
      route: https://{{ workspace.slug }}-code.qiln.com

  gpu:
    primary: reserved
    burst: true

  volumes:
    - name: model-vault
      type: private_vault
      mount_path: /opt/comfyui/models
    - name: outputs
      type: persistent_folder
      mount_path: /opt/comfyui/output
    - name: custom-nodes
      type: persistent_folder
      mount_path: /opt/comfyui/custom_nodes

  snapshots:
    before_updates: true
    retain: last_10

  endpoints:
    - name: workflow-api
      app: fastapi-wrapper
      route: https://{{ workspace.slug }}-api.qiln.com
callouts:
  - title: "Workspace, not pod"
    description: "ComfyUI and VS Code get stable routes inside one durable workspace instead of another throwaway GPU session."
    icon: "Monitor"
    lines: [5, 6, 7, 8, 9, 10]
  - title: "Reserved primary GPU"
    description: "The workspace has primary GPU capacity reserved by plan, with burst capacity available when the pool has room."
    icon: "Gauge"
    lines: [12, 13, 14]
  - title: "Real folders and rollback"
    description: "Models, outputs, and custom nodes mount as persistent folders with snapshots before risky updates."
    icon: "HardDrive"
    lines: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 27, 28, 29]
  - title: "Path to endpoints"
    description: "When a visual workflow becomes useful, wrap it behind a stable API route instead of rebuilding somewhere else."
    icon: "Route"
    lines: [31, 32, 33, 34]
infoBox:
  description: "A Qiln blueprint describes the workspace a user opens — apps, folders, GPU capacity, routes, snapshots, and endpoint paths."
---
