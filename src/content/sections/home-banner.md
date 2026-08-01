---
badge: "Now onboarding **Qiln Managed** — read more"
title: "[Versioned AI workflow capsules.|Fork changes before production.|Test changes, inspect diffs.|Promote or roll back safely.]"
subtitle: "Agents get forks, not production."
description: "**Qiln helps teams safely change production AI workflow systems.** Humans and agents make changes in forked branches, run golden tests, inspect capsule diffs, and promote only approved versions."
subscription:
  enable: true
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
    badge: "Persistent"
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
    fork: "Fork"
    edit: "Edit"
    test: "Test"
    diff: "Diff"
    promote: "Promote"
    rollback: "Roll back"
buttons:
  - enable: true
    label: "Read the docs"
    url: "/docs/"
    icon: "docs"
    variant: "secondary"
---
