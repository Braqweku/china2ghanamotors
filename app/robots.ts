import type { MetadataRoute } from "next";

const BASE_URL = "https://china2ghana-motors.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
