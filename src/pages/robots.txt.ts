import config from ".astro/config.generated.json";
import type { APIRoute } from "astro";

const { enable, disallow } = config.seo.robotsTxt;

const getRobotsTxt = (
  sitemapUrl: URL,
) => `# Robots.txt file for controlling web crawler access

User-agent: *

# Allowed pages
Allow: /

# Disallowed pages
${disallow?.map((item) => `Disallow: ${item}`).join("\n") || ""}

# Sitemap location
Sitemap: ${sitemapUrl.href}
`;

export const GET: APIRoute = ({ site }) => {
  if (!enable) {
    return new Response(null, { status: 404 });
  }
  const siteUrl = site ?? new URL(config.site.baseUrl);
  const sitemapUrl = new URL("sitemap-index.xml", siteUrl);
  return new Response(getRobotsTxt(sitemapUrl), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
