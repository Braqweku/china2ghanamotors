import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { robotsConfig } from "@/lib/seo/robots";

export default function robots(): MetadataRoute.Robots {
  return robotsConfig(siteConfig.url);
}
