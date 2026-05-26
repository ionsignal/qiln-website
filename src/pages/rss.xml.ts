import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import config from "../../.astro/config.generated.json";
import { getPublishedBlogPosts } from "@/utils/content";
import type { APIRoute } from "astro";

const parser = new MarkdownIt();
export const GET: APIRoute = async (context) => {
  const posts = await getPublishedBlogPosts();
  return rss({
    title:
      config.site.title +
      (config.site.tagline ? ` - ${config.site.tagline}` : ""),
    description: config.site.description,
    site: context.site || config.site.baseUrl,
    trailingSlash: config.site.trailingSlash === true,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
      content: sanitizeHtml(parser.render(post.body || ""), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
    })),
    customData: `<language>${config.settings.multilingual.defaultLanguage || "en"}</language>`,
  });
};
