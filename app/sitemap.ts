import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const vercelDeployment = process.env.VERCEL_URL;
  const base = configured || (vercelProduction ? `https://${vercelProduction}` : vercelDeployment ? `https://${vercelDeployment}` : "http://localhost:3000");

  return [{ url: base }, { url: `${base}/skills` }, { url: `${base}/ai` }, { url: `${base}/submit` }];
}
