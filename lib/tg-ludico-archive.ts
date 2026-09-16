import "server-only";

import { redis } from "@/lib/redis";
import type { TgLudicoItem } from "@/lib/tg-ludico-types";

const ARCHIVE_VERSION = "v1";

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getArticleKey(slug: string): string {
  return `tg-ludico:article:${ARCHIVE_VERSION}:${slug}`;
}

/**
 * Salva permanentemente le notizie TG Ludico in Redis.
 */
export async function archiveTgLudicoArticles(
  articles: TgLudicoItem[]
): Promise<void> {
  try {
    await Promise.all(
      articles.map(async (article) => {
        const slug = slugify(article.title);

        if (!slug) {
          return;
        }

        await redis.set(getArticleKey(slug), article);
      })
    );
  } catch (error) {
    console.error(
      "Errore durante l'archiviazione delle notizie TG Ludico:",
      error
    );
  }
}

/**
 * Recupera una singola notizia dall'archivio permanente.
 */
export async function getArchivedTgLudicoArticle(
  slug: string
): Promise<TgLudicoItem | null> {
  try {
    const article = await redis.get<TgLudicoItem>(
      getArticleKey(slug)
    );

    return article ?? null;
  } catch (error) {
    console.error(
      "Errore durante il recupero della notizia TG Ludico:",
      error
    );

    return null;
  }
}