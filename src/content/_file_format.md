---
# Frontmatter Options for Markdown files in the content folder

# image: Use this field to set an `og:image` for social media sharing.
# When the page is shared, this image will display as the preview thumbnail.
image: ""

# title & description: These act as the page's primary title and description, affecting the title bar and SEO.
title: ""
description: ""

# Content Date
date: 2020-02-05

# metaTitle & metaDescription: Override the page's default title and description specifically for SEO.
# If set, these will be used as the meta title and description instead of the primary title and description.
metaTitle: ""
metaDescription: ""

# canonical: Specify the canonical URL for this page to avoid duplicate content issues.
# Use this if the page has multiple versions or exists elsewhere, ensuring it points to the preferred URL.
canonical: ""

# keywords: Add keywords specific to the page for SEO optimization.
# This helps search engines understand the primary topics covered on the page.
keywords:
  - ""

# draft: Set to `true` to prevent this page from being generated in the site build or included in the sitemap.
# NOTE: Setting draft: true in a `-index.md` file (e.g., blog-index.md) will exclude all associated pages
# within that collection (e.g., blog posts and paginated blog pages) from site builds and the sitemap.
draft: false # true/false (default is false)

# robots: Customize search engine directives for this page.
# Example: Use "noindex, nofollow" to tell search engines not to index this page or follow links.
# Common values include "noindex", "nofollow", and "noarchive".
robots: "noindex, nofollow"

# excludeFromSitemap: Set to `true` to exclude this page from the sitemap, even if it’s generated.
excludeFromSitemap: false # true/false (default is false)

# author: Specify the author of this page, if different from the global site author.
author: ""

# tagline: Set a custom tagline for this page.
tagline: ""

# disableTagline: Set to `true` to disable the tagline from `config.toml` for this page.
disableTagline: false
---

## Blog authoring conventions

These conventions apply to `src/content/blog/`. Keep this reference outside that collection so it cannot become a blog post.

### Filenames and URLs

- Use lowercase, hyphen-separated filenames without a frontmatter `slug` override.
- The filename determines the post ID and URL. For example, `agents-get-forks-not-production.md` becomes `/blog/agents-get-forks-not-production/` with the current trailing-slash setting.
- Keep published filenames stable. Renaming a published post changes its URL and requires a redirect decision.

### Images and accessibility

- Store each post's assets in `src/assets/images/blog/<post-filename-without-extension>/`.
- Name the 16:9 cover `hero.png` and reference it through the required `image` frontmatter field.
- Name 4:3 supporting images `<section-title>.png`, using lowercase, hyphen-separated names.
- Use relative paths from the Markdown file. The existing post's cover path is `../../assets/images/blog/agents-get-forks-not-production/hero.png`.
- Add image references only after their files exist. Check image file sizes before committing.
- The optional `imageAlt` frontmatter field supplies cover alt text in blog cards and article pages. Omit it or use `""` for decorative artwork; missing alt text does not fall back to the article title.
- Supply image-specific alt text for informative supporting images using Markdown image syntax and relative paths. Use empty alt text only for decorative images.
- The current card frame is 16:9 and the article cover frame is 16:9, so article covers crop 16:9 artwork.

### Publication and update dates

- Author the required `pubDate` and optional `updatedDate` as quoted date-only values in `YYYY-MM-DD` format. These resolve to midnight UTC and are displayed in UTC.
- Only an explicitly authored `updatedDate` controls the visible "Last updated" label. It appears only when its UTC calendar day is later than `pubDate`.
- Git history, filesystem modification times, and build time do not supply editorial update dates.
- Production excludes draft posts and posts whose `pubDate` is later than the current time captured by the shared publication helper. This applies to blog archives, generated article routes, and related posts.
- Development keeps drafts and future-dated posts visible for preview.
- Blog publication is controlled per post; the general collection-index draft note above does not apply to the current blog routes.
- Scheduled publication requires a new production build at or after `pubDate`. Previously generated static output does not update automatically.
