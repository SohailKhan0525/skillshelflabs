import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://skillshelf.vercel.app";
  return [{ url: base }, { url: `${base}/skills` }, { url: `${base}/ai` }, { url: `${base}/submit` }];
}
