
import "server-only";

import Parser from "rss-parser";

import type { KickstarterTrackedProject } from "./projects";

export type KickstarterUpdate = {
  id: string;
  projectName: string;
  projectCreator: string;
  projectSlug: string;
  title: string;
  excerpt: string;
  image: string | null;
  publishedAt: string;
  url: string;
};

type KickstarterAtomItem = {
  title?: string;
  link?: string;
  guid?: string;
  pubDate?: string;
  isoDate?: string;
  content?: string;
  contentSnippet?: string;
  contentEncoded?: string;
  summary?: string;
};

const parser = new Parser<unknown, KickstarterAtomItem>({
  customFields: {
    item: [
      ["content:encoded", "contentEncoded"],
      ["summary", "summary"],
    ],
  },
});

function getFeedUrl(project: KickstarterTrackedProject): string {
  return (
    `https://www.kickstarter.com/projects/` +
    `${project.creator}/${project.slug}/posts.atom`
  );
}

function stripHtml(value: string): string {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function extractImage(html: string): string | null {
  const match = html.match(
    /<img\b[^>]*\bsrc=["']([^"']+)["']/i
  );

  if (!match?.[1]) {
    return null;
  }

  try {
    const url = new URL(
      match[1].replace(/&amp;/g, "&"),
      "https://www.kickstarter.com"
    );

    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function fetchKickstarterProjectUpdates(
  project: KickstarterTrackedProject
): Promise<KickstarterUpdate[]> {
  const feedUrl = getFeedUrl(project);

  const response = await fetch(feedUrl, {
    headers: {
      Accept: "application/atom+xml, application/xml, text/xml",
      "User-Agent":
        "LoSpaccadadi/1.0 (+https://lospaccadadi.it)",
    },
    next: {
      revalidate: 60 * 60,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Kickstarter Atom ${project.name}: HTTP ${response.status}`
    );
  }

  const xml = await response.text();
  const feed = await parser.parseString(xml);

  return feed.items
    .map((item): KickstarterUpdate | null => {
      const url = item.link?.trim();
      const title = item.title?.trim();
      const publishedAt = item.isoDate ?? item.pubDate;

      if (!url || !title || !publishedAt) {
        return null;
      }

      const html =
        item.contentEncoded ??
        item.content ??
        item.summary ??
        "";

      const excerpt = stripHtml(
        item.contentSnippet || html
      ).slice(0, 350);

      return {
        id: item.guid ?? url,
        projectName: project.name,
        projectCreator: project.creator,
        projectSlug: project.slug,
        title,
        excerpt,
        image: extractImage(html),
        publishedAt,
        url,
      };
    })
    .filter(
      (item): item is KickstarterUpdate => item !== null
    );
}
