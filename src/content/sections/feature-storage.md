---
enable: true
title: "Agents get forks, <span class='block'>**not production.**</span>"
subtitle: "Agent-safe branches"
description: >-
  Humans and agents work in forked capsule branches instead of editing production. Each branch follows a controlled path: edit the workflow system, run golden tests, inspect the capsule diff, and promote an approved version.
features:
  - "Use scoped credentials and keep production secret references out of branches."
  - "Block, log, mock, or approval-gate external calls during tests to enforce a side-effect policy."
  - "Require human or separate-policy approval to promote. Rollback restores capsule state and route aliases, not completed external calls."
image: "../../assets/images/feature-storage.png"
---
