import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import rehypeExternalLinks from "rehype-external-links";
import config from "./.astro/config.generated.json" with { type: "json" };
import remarkParseContent from "./src/utils/remark/ast.ts";
import { defineConfig } from "astro/config";
import {
  remarkReadingTime,
  remarkModifiedTime,
} from "./src/utils/remark/frontmatter.ts";
import { fontProviders } from "astro/config";

let {
  seo: { sitemap: sitemapConfig },
} = config;
const exclude = [
  "widgets",
  "sections",
  "author",
  ...(sitemapConfig.exclude || []),
];
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
            !exclude.some((folder) => page.includes(`/${folder}`)),
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
    remarkPlugins: [remarkParseContent, remarkReadingTime, remarkModifiedTime],
    shikiConfig: {
      theme: "github-dark",
      wrap: false,
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
