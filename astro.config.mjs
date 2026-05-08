import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import rehypeExternalLinks from "rehype-external-links";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationFocus,
} from "@shikijs/transformers";
import config from "./.astro/config.generated.json" with { type: "json" };
import remarkParseContent from "./src/utils/remark.ts";
import { fontProviders } from "astro/config";

const fonts = [
  {
    provider: fontProviders.google(),
    name: "Syne",
    cssVariable: "--astro-font-secondary",
    fallbacks: ["sans-serif"],
    weights: ["500"],
    styles: ["normal"],
    subsets: ["latin"],
  },
  {
    provider: fontProviders.google(),
    name: "Instrument Serif",
    cssVariable: "--astro-font-tertiary",
    fallbacks: ["sans-serif"],
    weights: ["400"],
    styles: ["normal"],
    subsets: ["latin"],
  },
  {
    provider: fontProviders.google(),
    name: "JetBrains Mono",
    cssVariable: "--astro-font-mono",
    fallbacks: ["monospace"],
    weights: ["400", "500"],
    styles: ["normal"],
    subsets: ["latin"],
  },
];
let {
  seo: { sitemap: sitemapConfig },
} = config;
const EXCLUDE_FOLDERS = [
  "widgets",
  "sections",
  "author",
  ...(sitemapConfig.exclude || []),
];
export default defineConfig({
  site: config.site.baseUrl ? config.site.baseUrl : "http://examplesite.com",
  trailingSlash: config.site.trailingSlash ? "always" : "never",
  image: {
    layout: "constrained",
    remotePatterns: [{ protocol: "https" }],
  },
  fonts,
  integrations: [
    mdx(),
    sitemapConfig.enable
      ? sitemap({
          filter: (page) =>
            !EXCLUDE_FOLDERS.some((folder) => page.includes(`/${folder}`)),
        })
      : null,
  ],
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      ],
    ],
    remarkPlugins: [remarkParseContent],
    shikiConfig: {
      theme: "github-dark",
      wrap: false,
      langs: ["toml", "yaml", "json", "bash", "typescript"],
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerNotationFocus(),
      ],
    },
    extendDefaultPlugins: true,
  },
  vite: {
    plugins: [tailwindcss()],
    // RE: [404] /@id/astro/runtime/client/dev-toolbar/astro_runtime_client_dev-toolbar_entrypoint__js.js.map 103ms
    // optimizeDeps: {
    //   include: ["astro/toolbar"],
    // },
  },
});
