---
title: "Introducing Qiln: Stop rebuilding GPU pods"
description: "Persistent AI workspaces for ComfyUI and GPU-backed creation apps."
pubDate: 2026-06-02
image: "../../assets/images/logo.svg"
categories: ["Announcements", "Engineering"]
author: "admin"
draft: false
---

# Introducing Qiln: Stop rebuilding GPU pods

Disposable GPU pods are fine for disposable jobs.

They are a bad home for serious ComfyUI and GPU-backed creation workflows.

At first, renting a GPU for an hour feels simple. Then the workflow accumulates state: private checkpoints, LoRAs, VAEs, ControlNets, custom nodes, workflow JSON, output folders, wrapper APIs, automation scripts, and paths that everything depends on.

At that point, the job is no longer:

> Rent a GPU for an hour.

The job is:

> Open your AI workspace and keep building.

That is why we are building **Qiln**.

Qiln is a persistent visual-first AI workspace for ComfyUI and GPU-backed creation apps. It gives you a stable remote AI creation machine with real folders, private model vaults, custom nodes, VS Code, snapshots, HTTPS routes, API endpoints, and reserved high-VRAM GPU capacity — without pod churn or Kubernetes.

ComfyUI is the beachhead.

The broader product is a workspace layer for GPU-backed creative and AI development environments.

---

## The problem with disposable GPU work

Today, builders and artists usually get pushed toward one of two defaults.

You can rent raw GPU instances and spend time rebuilding environments, moving models, fixing paths, exposing ports, reinstalling custom nodes, and worrying about credits while you test.

Or you can build your own platform with Kubernetes, Docker scripts, storage mounts, reverse proxies, GPU drivers, identity, backups, queues, and custom orchestration.

Both can be valid.

Neither is the right default for a founder, artist, studio, lab, or small team that just wants a stable AI workspace.

AI work should not disappear every time the machine changes.

You should be able to open ComfyUI, edit custom nodes in VS Code, drop models into real folders, wire up n8n or FastAPI, test workflows, publish early endpoints, inspect outputs, take a snapshot, and keep going.

That is the workspace Qiln is built around.

---

## What a Qiln workspace contains

Qiln is not just a rented GPU terminal.

It is the persistent workspace around the GPU.

A Qiln workspace can include:

- ComfyUI
- VS Code / code-server
- JupyterLab
- n8n
- FastAPI workflow wrappers
- vLLM
- Ollama
- Open WebUI
- private model vaults
- dataset vaults
- output folders
- custom nodes
- snapshots
- stable HTTPS routes
- API endpoints
- GPU lease primitives

Your files stay in place.

Your models stay organized.

Your routes stay stable.

Your workspace stays there.

---

## Before production, beside production

Qiln is the answer before you need a platform team.

But it is not something you should have to throw away once one of your workflows goes live.

Production deployment and creative iteration are different jobs.

If a workflow eventually graduates to Kubernetes, Modal, Slurm, a custom queue, a dedicated API service, or some other production system, that is fine. Qiln is still where the next version gets built.

Qiln is where you can:

- revise the ComfyUI graph
- test a new checkpoint or LoRA
- update custom nodes
- compare outputs
- edit a FastAPI wrapper
- run a private model service
- inspect files directly
- snapshot before risky changes
- rebuild the next version without breaking the current one

Production systems should become boring.

Creative AI work is not boring yet.

Qiln is the persistent workspace for the messy loop: build, modify, test, break, recover, and improve.

---

## Qiln is not a fleet scheduler

Qiln is not, and is not trying to become, a general-purpose fleet scheduler.

Slurm, Kubernetes, Run:ai, batch queues, and serverless GPU platforms exist for that job. They make sense when you need to saturate large GPU fleets, schedule thousands of jobs, operate formal production clusters, or support a dedicated platform team.

That is not the job Qiln is taking.

Qiln’s job is to make the AI workspace durable.

It is for the point where your workflow depends on models, paths, custom nodes, outputs, source files, routes, and recovery points. It is for the studio, founder, lab, internal team, or serious builder who needs a stable place to create and operate GPU-backed workflows without becoming a cloud infrastructure team.

Use the right scheduler when you need a scheduler.

Use Qiln when you need the workspace where the work keeps evolving.

---

## What makes Qiln different

### Real folders and model vaults

ComfyUI workflows depend on files.

Checkpoints, LoRAs, VAEs, ControlNets, datasets, inputs, outputs, configs, and custom nodes are not incidental. They are part of the work.

Qiln is built around persistent storage and real folders, not disposable instance disks.

Private and shared model vaults help reduce duplicated model chaos across users, workspaces, and machines. Instead of re-uploading the same large files into temporary pods, you can keep models where the workspace expects them to be.

---

### Snapshots before risky changes

Custom node updates break things.

Python dependencies drift.

Working environments become fragile.

Qiln uses ZFS-backed snapshots so users and admins can create recovery points before risky changes.

Upgrade a custom node. Test a workflow. Change the environment. If it breaks, you have a path back.

Snapshots are not just an infrastructure feature. They are permission to experiment without destroying a working setup.

---

### Companion apps through blueprints

ComfyUI is only the start.

Serious workflows usually need tools around the visual canvas:

- VS Code for editing custom nodes and wrappers
- JupyterLab for experiments
- n8n for automation
- FastAPI for workflow APIs
- vLLM or Ollama for model services
- Open WebUI for private chat interfaces

Qiln uses blueprints to make these apps repeatable and workspace-native.

The point is not to run arbitrary software for its own sake.

The point is to keep the tools that support the workflow close to the workflow.

---

### Stable HTTPS routes and endpoints

No more random exposed ports or temporary URLs.

Qiln provisions stable HTTPS routes for workspace apps and APIs, such as:

```txt
comfy.yourspace.qiln.app
code.yourspace.qiln.app
api.yourspace.qiln.app
n8n.yourspace.qiln.app
```

That matters when you are building with other people, testing integrations, or turning a visual workflow into something another system can call.

ComfyUI can remain a workspace.

A wrapper API can become an endpoint.

The route can stay stable while the workflow evolves behind it.

---

### Reserved GPU capacity without pod churn

Qiln is not trying to win a race to the cheapest possible GPU-hour.

Raw GPU clouds are useful when the job is temporary, spiky, or disposable.

Qiln is for the cases where persistence matters: private models, custom nodes, stable routes, repeatable workflows, team access, snapshots, and reserved high-VRAM capacity.

You are not just renting a GPU.

You are keeping a working AI environment alive.

---

## Three ways to run Qiln

Qiln has one product thesis:

> Open your AI workspace and keep building.

There are three ways to use it, depending on where your hardware lives.

### Qiln Managed

Hosted persistent AI workspaces run by IonSignal.

This is for founders, artists, studios, and teams that want reserved high-VRAM GPU capacity without operating the infrastructure themselves.

Qiln Managed provides persistent ComfyUI workspaces, private model vaults, companion apps, snapshots, HTTPS routes, and managed GPU-backed workspace capacity.

### Qiln Community

Self-managed, open-source Qiln for people who own GPU hardware.

Qiln Community is the Apache 2.0, no-CLA core for turning your own GPU server into managed AI workspaces without Kubernetes.

It is single-node first, NVIDIA-first, and currently pre-release alpha until the public `v0.1.0` is ready.

### Qiln Appliance

Qiln installed and managed on customer-owned hardware.

This is for studios, labs, research groups, and organizations that want private AI workspaces on their own GPUs, servers, racks, or datacenter infrastructure.

Appliance deployments can include custom blueprints, identity integration, backup planning, monitoring, updates, and support.

---

## Single-node first

Qiln is starting with one serious GPU server.

That is deliberate.

If Qiln cannot make one serious GPU server feel great, multi-node will only multiply the complexity.

The first public alpha is focused on the fundamentals:

- persistent ComfyUI workspaces
- isolated user environments
- private and shared vaults
- snapshots
- stable routes
- GPU lease primitives
- curated blueprints
- admin visibility
- NVIDIA-first GPU support

Under the hood, Qiln uses Incus, ZFS, Caddy, NATS, Postgres, Fastify, tRPC, and Vue 3.

Those are the ingredients.

The product is the workspace.

---

# Who we want to talk to

We are looking for people with real GPU workflow pain.

You may be a fit if you are:

- a founder building a ComfyUI-backed product
- a commercial AI artist or video creator
- a studio or agency standardizing ComfyUI workflows
- an internal AI team replacing unmanaged GPU cloud usage
- a small lab or research group with GPU hardware
- a serious homelabber sharing one powerful GPU server
- a team with private models, custom nodes, and workflows that need to persist

You are probably not the first fit if you only need the cheapest possible GPU-hour for occasional disposable jobs.

That is okay.

Disposable infrastructure is fine for disposable work.

Qiln is built for the point where the work stops being disposable.

---

## Configure a workspace

During alpha, we are keeping capacity and onboarding intentionally limited.

If you are rebuilding RunPod instances, fighting custom node drift, duplicating model folders, exposing random ports, or trying to turn ComfyUI workflows into real APIs, we want to hear from you.

Tell us what you are running today:

- your current ComfyUI setup
- your model and storage needs
- your custom nodes
- your GPU requirements
- your companion apps
- your team shape
- whether you want managed hosting, self-managed Qiln, or an appliance deployment

We will help map that into a persistent Qiln workspace.

<p>
  <a href="/configure"><strong>Configure a Workspace</strong></a>
  ·
  <a href="/discord">Join the Discord</a>
</p>

Stop rebuilding GPU pods.

Open your AI workspace and keep building.

_Qiln is developed by IonSignal, Inc._
