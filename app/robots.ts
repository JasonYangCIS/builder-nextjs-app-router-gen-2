import type { MetadataRoute } from "next";

/**
 * Blocks all crawlers from indexing the site.
 * Remove or adjust rules when the site is ready for public indexing.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
