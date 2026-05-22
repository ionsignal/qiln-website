# Qiln Content Architecture

This directory relies on **Domain-Driven Content Collections** using the Astro v6 Content Layer API (`astro/loaders`).

## Architectural Guidelines

To maintain type safety, layout isolation, and routing integrity, content is strictly separated by its domain.

### 1. `pages` (Generic Top-Level Routes)

- **Use Case:** Flat, generic, marketing or legal pages (e.g., `/privacy-policy`, `/about`).
- **Router:** `src/pages/[slug].astro`
- **Layout:** Standard `Base.astro` with a simple prose wrapper.
- **Rule:** Do NOT use this collection for complex, structured areas of the site.

### 2. `docs` (Technical Documentation)

- **Use Case:** Hierarchical technical manuals and guides.
- **Router:** `src/pages/docs/[...slug].astro`
- **Layout:** `Documentation.astro` (App-like layout with Sidebar, TOC, and Pagination).

### 3. Future Areas (e.g., Workloads, Comparisons)

When introducing complex new areas (e.g., `/workloads/comfyui` or `/vs/competitor`), **do not** put them into the generic `pages` collection. Instead:

1. Create a dedicated collection in `src/content.config.ts` (e.g., `workloads`).
2. Define a strict Zod schema enforcing the required data for that specific domain.
3. Create a dedicated routing folder (e.g., `src/pages/workloads/[slug].astro`).
4. Wrap the content in a specialized layout component designed for that specific user journey.
