---
badge: "Now onboarding **Qiln Managed** — read more"
title: "Versioned AI workflow capsules."
subtitle: "Agents get forks, not production."
description: "**Qiln helps teams safely change production AI workflow systems.** Humans and agents make changes in forked branches, run golden tests, inspect capsule diffs, and promote only approved versions."
subscription:
  enable: true
heroProblem:
  eyebrow: "Why a repository isn't enough."
  title: "A code repository can't version a complete production AI workflow."
  description: "A working AI workflow also depends on models, files, configuration, routes, credential references, and controlled external actions."
  workflowLabel: "Production AI Workflow"
  artifacts:
    - label: "Workflow logic + services"
      icon: "Workflow"
    - label: "Models + private assets"
      icon: "Database"
    - label: "Inputs, outputs + persistent files"
      icon: "Folder"
    - label: "Configuration + dependencies"
      icon: "Settings2"
    - label: "Routes + schemas"
      icon: "Route"
    - label: "Credential references"
      icon: "KeyRound"
    - label: "Test / release evidence"
      icon: "ClipboardCheck"
    - label: "External actions / side-effect policy"
      icon: "ShieldAlert"
  changeRequest:
    label: "Change requested"
    items:
      - "Model swap"
      - "New input or output"
      - "Dependency update"
      - "CUDA drivers"
  questions:
    - "Reproduce?"
    - "Inspect?"
    - "Roll back?"
  pathWarning: "A direct change can leave the working system hard to reproduce, inspect, or reverse."
heroSolution:
  eyebrow: "The Qiln Capsule"
  title: "A capsule is the versioned, runnable state around a working AI workflow."
  description: "It preserves the relevant system state needed to run, test, review, and safely change a known-good production version."
  capsule:
    label: "Known-Good Capsule"
    version: "Version v42"
    groups:
      - label: "Workflow logic + services"
        icon: "Workflow"
      - label: "Dependencies, models, assets + files"
        icon: "Package"
      - label: "Routes, schemas + credential references"
        icon: "Route"
      - label: "Tests, snapshots + release evidence"
        icon: "ClipboardCheck"
  route:
    label: "Production route alias"
    mapping: "/generate → v42"
    status: "Live known-good version"
heroDiagram:
  annotations:
    humansAgents:
      title: "Humans + agents"
      description: "edit forked branches only"
    branchPolicy:
      title: "Branch policy"
      items:
        - "Scoped credentials"
        - "No production secret references"
        - "Side effects controlled"
  knownGood:
    title: "Known-good capsule"
    items:
      - "Workflows + app services"
      - "Models + private assets"
      - "Dependencies + routes"
      - |-
        Snapshots + rollback
        metadata
    runtime:
      label: "Runtime: on demand"
      description: "Start / stop when needed"
  fork:
    label: "Fork"
  forkedBranch:
    title: "Forked capsule branch"
    isolationDescription: "Edit in isolation"
    candidateDescription: "candidate version"
    runtimeStatus: "Runtime: running"
  goldenTest:
    title: "Golden test evidence"
  capsuleDiff:
    title: "Capsule diff side-effect log"
  promote:
    label: "Promote"
  productionRoute:
    title: "Production route alias"
    routeAliasDescription: "→ approved"
    versionDescription: "capsule version"
  rollback:
    title: "Roll back"
    availabilityDescription: "available if needed"
    routeAliasDescription: "move route alias"
    destinationDescription: "to known-good capsule"
  processRail:
    ariaLabel: "Capsule change process"
    steps:
      - label: "Fork"
        icon: "GitFork"
        accent: "action"
      - label: "Edit"
        icon: "PencilLine"
        accent: "neutral"
      - label: "Test"
        icon: "FlaskConical"
        accent: "neutral"
      - label: "Diff"
        icon: "FileDiff"
        accent: "neutral"
      - label: "Promote"
        icon: "ShieldCheck"
        accent: "action"
      - label: "Roll back"
        icon: "RotateCcw"
        accent: "neutral"
buttons:
  - enable: true
    label: "Read the docs"
    url: "/docs/"
    icon: "docs"
    variant: "secondary"
---
