---
enable: true
subtitle: "Questions"
title: "Qiln FAQ"
showCategories: false
list:
  - label: "Questions about Qiln"
    list:
      - active: true
        title: "What is a Qiln capsule?"
        content: |-
          A Qiln capsule is the versioned, deployable state around a working production AI workflow system.

          It can include workflow definitions, models, assets, scripts, services, dependencies, routes, credential references, tests, side-effect policies, snapshots, and rollback metadata.

          A capsule is not just source code, a workflow export, a graph file, a container, or a GPU machine.

      - active: false
        title: "Is Qiln a workflow builder?"
        content: |-
          No.

          Qiln does not replace workflow builders, AI graph editors, model servers, or automation tools.

          Those tools own their editors and execution engines. Qiln provides the safe mutation layer around the larger production system: fork, test, diff, approve, promote, and roll back.

      - active: false
        title: "Does Qiln replace Git?"
        content: |-
          No.

          Git versions source code. Qiln versions the working production AI workflow system around that code.

          That can include models, assets, dependencies, services, routes, credential references, tests, side-effect policy, and rollback metadata. Git and Qiln solve different layers of the change problem.

      - active: false
        title: "What systems fit Qiln?"
        content: |-
          Qiln is for production AI workflow systems where coordinated change and rollback matter.

          A strong fit typically includes connected components such as workflows, models, private assets, scripts, services, routes, storage, dependencies, credentials, tests, and external side effects.

          The key qualification is:

          > Do you have a production AI workflow system that you are afraid to break, move, upgrade, or let an agent modify?

          Private-alpha workflows are evaluated case by case. Qiln's current maintained commercial blueprint is **n8n + ComfyUI**.

      - active: false
        title: "Does Qiln support any AI system?"
        content: |-
          Not automatically.

          Qiln can support interconnected AI workflow systems when their relevant state can be captured as a capsule and they benefit from **Fork → Edit → Test → Diff → Promote → Roll back**.

          Qiln is not trying to become a generic platform for arbitrary applications, disposable environments, or every AI runtime.

      - active: false
        title: "How is Qiln different from GPU clouds?"
        content: |-
          GPU clouds provide compute.

          Qiln protects and safely evolves the working AI workflow system that uses compute.

          A Qiln capsule preserves the relevant workflow state, models, assets, dependencies, routes, tests, and rollback path. Compute attaches when a workflow run requires it.

      - active: false
        title: "How is Qiln different from an agent sandbox?"
        content: |-
          Generic agent sandboxes provide disposable environments for agents.

          Qiln gives humans or agents a controlled fork of the real production workflow system, with relevant assets, dependencies, tests, route behavior, and side-effect policies.

          The goal is not merely to give an agent a machine. The goal is to safely evolve a known-good workflow system without giving the agent direct production access.

      - active: false
        title: "Can agents promote their own changes?"
        content: |-
          No.

          Agents can edit forked branches and produce test results, diffs, and evidence. The agent that authored a change does not promote it.

          Promotion requires an authorized human or separate approval policy to move the production route alias.

          > Agents get forks, not production.

      - active: false
        title: "Can Qiln undo external side effects?"
        content: |-
          Not automatically.

          Qiln can restore capsule state and move a route alias back to a known-good version. It cannot unsend an email, reverse an external webhook, undo a CRM update, or erase a third-party database write after it occurs.

          That is why branch policies can block, log, mock, or approval-gate external calls during testing.

      - active: false
        title: "Do I need my own GPU?"
        content: |-
          No.

          Qiln Managed is for teams that want Qiln operated for them, with compute attached when workflow runs require it.

          Qiln Community and Qiln Appliance are for teams that want to run Qiln on their own GPU hardware.

      - active: false
        title: "What happens during private alpha?"
        content: |-
          Private alpha is concierge-led.

          You bring one revenue-relevant AI workflow system that you are hesitant to change. Qiln helps capture the system as a capsule, create a known-good snapshot, define a golden test, fork a branch, make a meaningful change, inspect the diff and side-effect evidence, then demonstrate promotion and rollback.

          The activation milestone is not simply creating a capsule. It is safely changing a real workflow without editing production directly.

      - active: false
        title: "Is Qiln a generic hosting or PaaS product?"
        content: |-
          No.

          Qiln is for teams that need a controlled change path for a real production AI workflow system.

          If you only need a disposable development machine, a generic staging environment, a hosted application, or cheap GPU-hours, Qiln is probably not the right first fit.
---
