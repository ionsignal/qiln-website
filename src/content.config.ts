import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const collections = {
  sections: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/sections" }),
    schema: ({ image }) =>
      z.object({
        enable: z.boolean().optional(),
        draft: z.boolean().optional(),
        title: z.string().optional(),
        badge: z.string().optional(),
        subtitle: z.string().optional(),
        description: z.string().optional(),
        image: z.union([image(), z.string()]).optional(),
        ratingContent: z.string().optional(),
        limit: z.union([z.boolean(), z.number()]).optional(),
        features: z.array(z.string()).optional(),
        subscription: z
          .object({
            enable: z.boolean().optional(),
          })
          .optional(),
        // Explicit Buttons Array (from home-banner)
        buttons: z
          .array(
            z.object({
              enable: z.boolean().optional(),
              label: z.string(),
              url: z.string().optional(),
              type: z.string().optional(),
              rel: z.string().optional(),
              target: z.string().optional(),
              icon: z.string().optional(),
              variant: z.string().optional(),
              video: z
                .object({
                  src: z.string(),
                  type: z.string().optional(),
                  provider: z.string().optional(),
                  poster: z.string().optional(),
                  autoplay: z.boolean().optional(),
                  id: z.string().optional(),
                })
                .optional(),
            }),
          )
          .optional(),
        // Single CTA Button (from call-to-action)
        ctaBtn: z
          .object({
            enable: z.boolean().optional(),
            label: z.string(),
            url: z.string().optional(),
            type: z.string().optional(),
            rel: z.string().optional(),
            target: z.string().optional(),
            video: z
              .object({
                src: z.string(),
                type: z.string().optional(),
                provider: z.string().optional(),
                poster: z.string().optional(),
                autoplay: z.boolean().optional(),
                id: z.string().optional(),
              })
              .optional(),
          })
          .optional(),
        // Marquee configuration (from customers)
        marquee: z
          .object({
            pauseOnHover: z.boolean().optional(),
            reverse: z.string().optional(),
            duration: z.string().optional(),
          })
          .optional(),
        showCategories: z.boolean().optional(),
        // Discriminated Union for the overloaded 'list' property
        list: z
          .union([
            // A. Customers List (Images)
            z.array(
              z.object({
                src: z.union([image(), z.string()]),
                alt: z.string().optional(),
              }),
            ),
            // B. Features List (Text)
            z.array(
              z.object({
                title: z.string(),
                description: z.string().optional(),
              }),
            ),
            // C. FAQ Categories List
            z.array(
              z.object({
                label: z.string(),
                list: z.array(
                  z.object({
                    active: z.boolean().optional(),
                    title: z.string(),
                    content: z.string(),
                  }),
                ),
              }),
            ),
          ])
          .optional(),
        // Nested Customers override (e.g., inside home-banner.md)
        customers: z
          .object({
            enable: z.boolean().optional(),
            description: z.string().optional(),
            list: z
              .array(
                z.object({
                  src: z.union([image(), z.string()]),
                  alt: z.string().optional(),
                }),
              )
              .optional(),
          })
          .optional(),
        yaml: z.string().optional(),
        callouts: z
          .array(
            z.object({
              title: z.string(),
              description: z.string(),
              icon: z.string().optional(),
              lines: z.array(z.number()),
            }),
          )
          .optional(),
        infoBox: z
          .object({
            description: z.string(),
          })
          .optional(),
        // Comparison Section Matrix
        tabs: z
          .array(
            z.object({
              id: z.string(),
              label: z.string(),
              tagline: z.string().optional(),
              mobileCompetitor: z.string(),
              competitors: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  highlight: z.boolean().optional(),
                  badge: z.string().optional(),
                  mobileHide: z.boolean().optional(),
                }),
              ),
              rows: z.array(
                z.object({
                  label: z.string(),
                  isPrice: z.boolean().optional(),
                  isBestFor: z.boolean().optional(),
                  cells: z.record(z.string(), z.string()),
                }),
              ),
              footnotes: z.array(z.string()).optional(),
            }),
          )
          .optional(),
      }),
  }),

  homepage: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/homepage" }),
    schema: ({ image }) =>
      z.object({
        draft: z.boolean().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        image: z.union([image(), z.string()]).optional(),
        // Global SEO / Meta Fields
        date: z.union([z.date(), z.string()]).optional(),
        canonical: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        robots: z.string().optional(),
        excludeFromSitemap: z.boolean().optional(),
        author: z.string().optional(),
        tagline: z.string().optional(),
        disableTagline: z.boolean().optional(),
      }),
  }),

  // Documentation pages collection.
  docs: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs" }),
    schema: ({ image }) =>
      z.object({
        title: z.string(),
        description: z.string().optional(),
        sidebarLabel: z.string().optional(),
        order: z.number().default(999),
        draft: z.boolean().default(false),
        // Table of Contents controls (consumed in Phase 4)
        tableOfContents: z.boolean().default(true),
        tocMinLevel: z.number().min(1).max(6).default(2),
        tocMaxLevel: z.number().min(1).max(6).default(3),
        // SEO passthrough — mirrors `homepage` schema for Base.astro compatibility
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        canonical: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        robots: z.string().optional(),
        image: z.union([image(), z.string()]).optional(),
        disableTagline: z.boolean().optional(),
      }),
  }),

  // Per-folder category metadata loaded from `_category.json`.
  docCategories: defineCollection({
    loader: glob({
      pattern: "**/_category.json",
      base: "./src/content/docs",
      generateId: ({ entry }) => entry.replace(/\/_category\.json$/, ""),
    }),
    schema: z.object({
      label: z.string(),
      order: z.number().default(999),
      icon: z.string().optional(),
      collapsed: z.boolean().default(false),
    }),
  }),
};
