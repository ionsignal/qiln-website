---
title: "Pitch Deck"
description: "Qiln helps teams safely change production AI workflow systems with versioned capsules, isolated forks, golden tests, capsule diffs, approvals, promotion, and rollback."
variants:
  explainer:
    slides:
      - title
      - problem
      - solution
      - product
  vc:
    slides:
      - title
      - problem
      - solution
      - product
      - beachhead
      - evidence
      - raise
slides:
  title:
    eyebrow: "Introduction."
    title: "Agents get forks, not production."
    subtitle: "Safe changes for production AI workflows."
    diagram:
      label: "Qiln release model"
      description: "A known-good capsule branches to the live production route and an isolated human or agent fork."
    footer: "© 2026 IonSignal, Inc. All rights reserved."
  problem:
    eyebrow: "The repository is not the production system."
    title: "Teams cannot safely change what they cannot recreate."
    subtitle: "AI workflow state spans many artifacts outside a code repository. When those parts are not captured as one known-good version, teams cannot reliably reproduce, test, inspect, or roll back a change."
    diagram:
      label: "The production-state gap"
      description: "A model or asset update, new input or output, dependency upgrade, or agent-authored edit begins with a repository or workflow export containing only code and partial configuration. The actual working production state is distributed across models, assets, files, runtimes, routes, credential references, test evidence, and external side-effect policies. Without that complete state, teams cannot reproduce the workflow, test safely, see what changed, or confidently roll back."
    footer: "© 2026 IonSignal, Inc. All rights reserved."
  solution:
    eyebrow: "Version the whole working system."
    title: "A capsule is the versioned, runnable state around a working AI workflow."
    subtitle: "It preserves the relevant system state needed to run, test, review, and safely change a production AI workflow."
    diagram:
      label: "Qiln capsule and production route diagram"
      description: "A known-good versioned capsule contains workflow services, dependencies, models, assets, files, routes, schemas, credential references, tests, snapshots, and release evidence, with the production route alias pointing to the live known-good version."
    footer: "© 2026 IonSignal, Inc. All rights reserved."
  product:
    eyebrow: "Give every change a safe path."
    title: "A known-good capsule gives every change a safe path."
    subtitle: "Agents get forks, not production."
    diagram:
      label: "Safe production change path"
      description: "A human or agent forks a known-good capsule, edits and tests the isolated branch, inspects the capsule diff, passes an approval gate, and promotes a new version to the production route with rollback available."
    footer: "© 2026 IonSignal, Inc. All rights reserved."
  beachhead:
    eyebrow: "Start where unsafe change costs money."
    title: "Land where unsafe change costs money."
    subtitle: "Paid migration → Managed capsule → More workflows"
    diagram:
      label: "Beachhead customer and concierge migration diagram"
      description: "Qiln targets commercial AI builders whose workflows make money or run operations, span multiple system resources, and cannot afford unsafe change. Concierge migration establishes a known-good capsule, repeatable test, first safe change, and verified rollback."
    footer: "© 2026 IonSignal, Inc. All rights reserved."
  evidence:
    eyebrow: "Validate the safe-change transaction."
    title: "Early Validation"
    subtitle: "Measured by completed safe changes—not signups."
    diagram:
      label: "Early design partner evidence"
      description: "Qiln has two early design partners, Mowie and GitHits, bringing revenue-relevant AI workflows into Qiln."
    footer: "© 2026 IonSignal, Inc. All rights reserved."
  raise:
    eyebrow: "Scale safe change for production AI workflows."
    title: "Raising $1.5M Pre-Seed"
    subtitle: "To make safe AI workflow change repeatable. In 18 months, we will prove:"
    diagram:
      label: "Pre-seed proof milestones"
      description: "The eighteen-month milestones are thirty paid production capsules, one thousand completed safe change transactions, and commercial evidence across migration, activation, renewal, and expansion."
    footer: "© 2026 IonSignal, Inc. All rights reserved."
---
