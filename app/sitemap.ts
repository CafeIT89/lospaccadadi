
import type { MetadataRoute } from "next";
import { getArchivedTgLudicoSlugs } from "@/lib/tg-ludico-archive";

export const dynamic = "force-dynamic";
export const revalidate = 1800;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.lospaccadadi.it"
  ).replace(/\/$/, "");

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/tg-ludico`,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gamefound`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/settimanale`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/recensioni`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/chi-sono`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/schede-regole`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const slugs = await getArchivedTgLudicoSlugs();

  const articlePages: MetadataRoute.Sitemap = slugs.map(
    (slug) => ({
      url: `${baseUrl}/tg-ludico/notizia/${slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  return [...staticPages, ...articlePages];
}
