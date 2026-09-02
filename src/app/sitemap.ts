import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://emailarchiver.app";
  const paths = ["", "/features", "/security", "/pricing", "/faq"];
  return paths.map((p) => ({
    url: `${base}${p || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
}
