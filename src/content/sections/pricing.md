---
enable: true
title: "Qiln Pricing"
metaTitle: "Pricing | Qiln"
description: "Persistent visual-first AI workspaces on bare-metal GPUs, with reserved GPU access and optional burst capacity."
pricingPlans:
  - name: "Workspace 48"
    price: "$499"
    period: "/ month"
    description: "For early founders, developers, and artists building custom AI workflows."
    highlight: false
    features:
      - "Dedicated **48GB Blackwell** GPU slice"
      - "**8 vCPU / 48GB RAM** envelope"
      - "**1TB** private local vault storage"
      - "Persistent ComfyUI GUI & VS Code"
      - "Burst access up to **2 GPUs**"
      - "Multiple HTTPS routes for APIs"
      - "Best-effort early access support"
    button:
      enable: true
      label: "Request Access"
      url: "/#early-testers"
      variant: "secondary"

  - name: "Workspace 96"
    price: "$999"
    period: "/ month"
    description: "For users who need a full RTX PRO 6000-class workspace with maximum VRAM."
    highlight: true
    features:
      - "Dedicated **96GB RTX PRO 6000** GPU"
      - "**16 vCPU / 96GB RAM** envelope"
      - "**1TB** private local NVMe vault storage"
      - "Persistent ComfyUI GUI & VS Code"
      - "Burst access up to **4 GPUs**"
      - "Personal APIs, automation, and batch tools"
      - "Priority support for workspace issues"
    button:
      enable: true
      label: "Claim Your Workspace"
      url: "/#early-testers"
      variant: "primary"

  - name: "Custom Reserved"
    price: "Custom"
    period: "pricing"
    description: "For teams that need larger workspaces, multiple GPUs, or stronger isolation."
    highlight: false
    features:
      - "Multiple RTX PRO 6000-class GPUs"
      - "Larger CPU/RAM/storage allocations"
      - "Custom ComfyUI, vLLM, or Ollama blueprints"
      - "Custom queue and concurrency policies"
      - "Reserved burst capacity available"
      - "Custom snapshot and backup retention"
      - "Priority support and onboarding"
    button:
      enable: true
      label: "Talk to Us"
      url: "mailto:hello@qiln.com"
      variant: "secondary"
---
