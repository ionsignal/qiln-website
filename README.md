# Qiln Website

Marketing, documentation, and blog website for **Qiln** — Persistent visual-first AI workspaces for ComfyUI, private model vaults, and reserved high-VRAM GPUs.

## Tech Stack

- **Framework:** [Astro 7](https://astro.build/) (Static Site Generation)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI & Interactivity:** [Preline UI](https://preline.co/) (Vanilla JS plugins) & Motion
- **Content:** MDX with strictly typed Astro Content Collections
- **Configuration:** TOML-driven site settings

## Prerequisites

- **Node.js:** `>= 22.23.1`
- **npm:** `>= 10.9.1`

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

Releases use npm's version lifecycle. Always release from a clean, up-to-date `main` branch.

### 1. Confirm the release state

```bash
git status --short
git pull --ff-only
git tag --sort=-version:refname | head -n 1
```

`git status --short` must return no output before continuing.

### 2. Run the version bump

Choose one:

```bash
npm version patch
npm version minor
npm version major
```

For example, `npm version patch` moves `0.5.13` to `0.5.14`.

### What the version command does

1. Runs `npm run typecheck`.
2. Updates the package version and creates a release commit.
3. Creates an annotated Git tag such as `v0.5.14`.
4. Runs `npm run build`, including TOML generation.
5. Creates `qiln-website-v0.5.14.tar.gz` from `dist`.
6. Pushes the release commit and tag to GitHub.

Do not use `astro build` directly for a release. Use `npm run build` so `src/config/config.toml` is compiled into `.astro/config.generated.json` first.

### 3. Verify the pushed release

```bash
git show --no-patch --format=fuller v0.5.14
git status --short
```

The generated `.tar.gz` archive may appear as an untracked local artifact. Do not commit it. Attach it to the GitHub Release only if you intend to distribute the static build archive.

### 4. Create the GitHub Release

Create the release manually in GitHub:

- **Tag:** `v0.5.14`
- **Title:** `v0.5.14`
- **Description:** Use the template below.

The GitHub Release description is separate from the Git tag annotation.

## GitHub Release Template

```md
Brief summary of the release and its user-facing impact.

## What's Changed

- feat: describe the primary feature
- feat: describe another notable improvement
- fix: describe an important fix
- refactor: describe meaningful internal or architectural work
- chore: describe dependency, tooling, or release updates
```
