# Qiln Website

Marketing, documentation, and blog website for **Qiln** — Persistent visual-first AI workspaces for ComfyUI, private model vaults, and reserved high-VRAM GPUs.

## Tech Stack

- **Framework:** [Astro 6](https://astro.build/) (Static Site Generation)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI & Interactivity:** [Preline UI](https://preline.co/) (Vanilla JS plugins) & Motion
- **Content:** MDX with strictly typed Astro Content Collections
- **Configuration:** TOML-driven site settings

## Prerequisites

- **Node.js:** `>= 22.12.0`
- **npm:** `>= 9.6.7`

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

   _This automatically watches `src/config/config.toml` and starts the Astro dev server at `http://localhost:4321`._

## Configuration & Content

- **Site Settings:** Edit `src/config/config.toml` to update global settings, navigation, SEO, and social links.
- **Content:** All pages, blog posts, and documentation live in `src/content/`.

## Cutting a Release

Releases are automated using npm's built-in versioning lifecycle. Ensure your working directory is clean (all changes committed), then run:

```bash
npm version patch
npm version minor
npm version major
```

**What this does automatically:**

1. Runs `npm run typecheck` to ensure there are no build errors.
2. Bumps the version in `package.json`.
3. Creates a Git commit and tag (e.g., `v0.5.8`).
4. Builds the site and packs the release tarball (`qiln-website-v0.5.8.tar.gz`).
5. Pushes the commit and tags to the remote repository.
