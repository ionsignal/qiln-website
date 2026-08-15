---
badge: "Now onboarding **Qiln Managed** — read more"
title: "Versioned AI workflow capsules."
subtitle: "Agents get forks, not production."
description: "**Qiln helps teams safely change production AI workflow systems.** Humans and agents make changes in forked branches, run golden tests, inspect capsule diffs, and promote only approved versions."
subscription:
  enable: true
heroProblem:
  eyebrow: "The repository is not the production system."
  title: "A working AI workflow is more than source code."
  description: "Production state spans code, runtimes, models, assets, data, configuration, credential references, and routes. Without one known-good capsule, a change is hard to reproduce, inspect, or reverse."
heroSolution:
  eyebrow: "Give every change a safe path."
  title: "Promote change without risking production."
  description: "Start from a known-good capsule. Humans and agents edit in isolated forks, run golden tests, inspect capsule diffs, and promote only approved versions—with rollback ready."
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
    icon: "BookOpen"
    variant: "secondary"
---
