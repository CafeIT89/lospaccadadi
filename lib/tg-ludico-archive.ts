
import "server-only";

import { redis } from "@/lib/redis";
import type { TgLudicoItem } from "@/lib/tg-ludico-types";

const ARCHIVE_VERSION = "v1";
const ARTICLE_PREFIX = `tg-ludico:article:${ARCHIVE_VERSION}:`;

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
  return `${ARTICLE_PREFIX}${slug}`;
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

/**
 * Recupera l'elenco degli slug archiviati,
 * utilizzando SCAN per evitare query Redis bloccanti.
 */
export async function getArchivedTgLudicoSlugs(): Promise<string[]> {
  try {
    const keys = new Set<string>();
    let cursor = 0;

    do {
      const [nextCursor, batch] = await redis.scan(cursor, {
        match: `${ARTICLE_PREFIX}*`,
        count: 100,
      });

      for (const key of batch) {
        if (key.startsWith(ARTICLE_PREFIX)) {
          const slug = key.slice(ARTICLE_PREFIX.length);

          if (slug) {
            keys.add(slug);
          }
        }
      }

      cursor = Number(nextCursor);
    } while (cursor !== 0);

    return [...keys];
  } catch (error) {
    console.error(
      "Errore durante il recupero degli slug TG Ludico:",
      error
    );

    return [];
  }
}
