---
title: "Introducing Qiln: Agents get forks, not production"
description: "We’re building a versioned runtime for creative AI workflow capsules, starting with the system around a working ComfyUI setup."
pubDate: "2026-08-01"
updatedDate: "2026-09-27"
image: "../../assets/images/blog/agents-get-forks-not-production/hero.png"
categories:
  - "Announcements"
  - "Engineering"
author: "admin"
draft: false
---

If you run a creative AI workflow that delivers client work, produces assets, or supports a product, you may recognize this rule:

### **Do not touch this machine.**

The models are in the right folders. The custom plugins work with the installed dependencies. The GPU environment finally behaves. Someone knows which configuration files matter and which updates to avoid.

Then you need to move the setup, upgrade a dependency, hand it to a teammate, or let an agent modify it.

The workflow still works. But changing the system around it feels risky.

> We’re building **Qiln: a versioned runtime for creative AI workflow capsules.**

The current prototype focuses on a concrete foundation: create a ComfyUI capsule, make its storage boundaries explicit, and control its runtime, preview, and branch-scoped SSH access. The aim is to let teams change these systems without editing a known good version directly.

This is an early development preview, not a full safe-change workflow.

## The workflow file isn’t the whole system

Consider a setup that generates video in ComfyUI and uses another tool to edit the result.

The graph describes generation. But the working process also depends on which plugins are installed, their prerequisites, where models are stored, where inputs arrive, and where generated clips land.

The editing step may depend on those same paths, assets, and configuration.

That’s the part we’re making explicit.

### Configuration is the wiring between the tools

A list of installed applications is not enough. The important questions are:

- Which parts must remain compatible?
- Which files are private, shared, or writable?
- How do inputs and outputs move between steps?
- What must be preserved to recreate the useful system?

ComfyUI is just the starting point. The capsule boundary can also include video or audio editing tools, scripts, and custom services if they’re part of the same working system.

Not every combination works today. The design focuses on the real system people depend on, not just a single application's export.

## The capsule is the product

A capsule is the deployable, versioned state around a working creative AI workflow system.

The intended boundary includes the parts that must evolve together: workflow definitions, application state and source, configuration, dependency and model references, assets, runtime requirements, and the tests needed to evaluate changes.

In the current ComfyUI prototype, we start by separating the major storage responsibilities:

| Part                       | Purpose                                                   |
| -------------------------- | --------------------------------------------------------- |
| Application storage        | The application and its associated files                  |
| Writable data              | Working data and configuration                            |
| Private model storage      | Models kept separate from the shared library              |
| Shared model vault         | Models attached read-only                                 |
| Input and output locations | Explicit places for source material and generated results |

This layout is easier to inspect, but it doesn’t guarantee you can restore every dependency, credential, or external service.

Qiln isn’t a workflow editor replacement or a cheap hosted ComfyUI GPU. Compute is there to support the capsule, not as the main product. GPU leasing and sharing to capsules is currently planned; however, GPUs are currently pinned per capsule.

## What we can show today

The current demo is intentionally narrow.

### Create the capsule

Create a ComfyUI capsule and its root branch, with separated application storage, writable data, private models, a shared read-only model vault, and fresh output storage.

### Bring it online

Start the runtime, follow the operation progress, and open ComfyUI through a verified preview route. The preview is access to the editable branch; it is not a promoted production release.

### Connect to the branch

Use the generated SSH configuration to access the branch, inspect the workspace, and check GPU visibility with `nvidia-smi`.

### Stop it and withdraw access

A successful stop operation revokes branch SSH access, confirms relay closure, withdraws previews, and verifies that the runtime is offline.

That is the current proof we want to make visible:

**Runtime and access follow the branch lifecycle, rather than being managed as unrelated machine-level details.**

This is just the foundation for controlled changes. It doesn’t yet cover safe upgrades or production rollback.

## The change path we’re building toward

Once the system boundary is explicit, the next goal is to make changes reviewable and reversible.

The intended transaction is:

```text
Create capsule
→ preserve a known-good snapshot
→ fork capsule branch
→ human or agent edit
→ inspect capsule diff
→ run branch tests
→ approve
→ promote
→ rollback to a known-good if needed
```

A golden test would use known inputs and explicit acceptance conditions. For a generative workflow, those conditions might include valid output structure, expected metadata, quality checks, or human review; not necessarily identical output bytes.

The distinction matters: starting successfully is not the same as producing acceptable work.

**Forks are currently unavailable. Diffs, golden-test execution, promotion, rollback, and agent APIs are not ready to demonstrate.**

This is the direction we’re building toward, not a finished capability.

## Agents get forks, not production

This is the principle behind the intended agent workflow.

An agent should make changes in a forked capsule branch, with scoped credentials and explicit limits on external actions. Production secrets should not be exposed to that branch. The agent that writes a change should not also authorize its promotion.

These are requirements we’re working on, not guarantees in the current prototype.

Reversibility also has boundaries. Restoring a runtime cannot unsend an email, retract every published asset, or undo an arbitrary external database write.

Branch testing therefore needs deliberate policies for external effects: block them, mock them, log them, or require approval where appropriate. Logging an action does not make it reversible.

The goal is to contain impact and give a practical way back to known-good. This doesn’t mean agents can safely make arbitrary changes.

## Building in the open

Qiln’s source is available under Apache 2.0 with no CLA on [GitHub](https://github.com/ionsignal/qiln).

This is pre-release software for trusted teams and controlled alpha environments. It’s not ready for production or hostile public multi-tenancy.

The development config, `qiln-orchestrator-dev`, runs services together and embeds the Worker. This isn’t a production privilege boundary.

There’s still a lot of engineering between running a single capsule branch and safely promoting a changed version. The prototype is just a starting point: explicit storage boundaries, managed runtime lifecycle, and access tied to a branch.

The goal is a full change path: fork a capsule branch, inspect the diff, test it, and promote an approved version, with a practical way back to known-good.

You can track our progress and explore the code at [github.com/ionsignal/qiln](https://github.com/ionsignal/qiln).
