import "server-only";

import OpenAI from "openai";
import Parser from "rss-parser";
import { createHash } from "node:crypto";
import { unstable_cache } from "next/cache";

import {
  getTgLudicoCategory,
  getTgLudicoCategoryWeight,
  type TgLudicoCategory,
} from "@/lib/tg-ludico-categories";
import { redis } from "@/lib/redis";
import type {
  RawFeedItem,
  TgLudicoItem,
  TranslatedArticle,
} from "@/lib/tg-ludico-types";

export type { TgLudicoItem } from "@/lib/tg-ludico-types";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

const FEEDS = [
  {
    name: "BoardGameWire",
    url: "https://boardgamewire.com/index.php/feed/",
  },
  {
    name: "BoardGameGeek",
    url: "https://boardgamegeek.com/rss/blog/1",
  },
  {
    name: "Meeple Mountain",
    url: "https://www.meeplemountain.com/feed/",
  },
  {
    name: "Board Game Quest",
    url: "https://www.boardgamequest.com/feed/",
  },
  {
    name: "Board Game Beat",
    url: "https://www.wericmartin.com/rss/",
  },
] as const;

const KEYWORDS = [
  "board game",
  "boardgame",
  "tabletop",
  "gamefound",
  "kickstarter",
  "crowdfunding",
  "publisher",
  "designer",
  "expansion",
  "release",
  "spiel des jahres",
  "asmodee",
  "game",
];

const CACHE_DURATION_SECONDS = 60 * 30;
const TRANSLATION_CACHE_VERSION = "v1";

function stripHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanText(value: string, maxLength: number) {
  return value
    .replace(/^["“”']+|["“”']+$/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function getImage(item: RawFeedItem): string | null {
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }

  if (item.mediaContent?.$?.url) {
    return item.mediaContent.$.url;
  }

  if (item.mediaThumbnail?.$?.url) {
    return item.mediaThumbnail.$.url;
  }

  const html = item.contentEncoded ?? item.content ?? "";

  const match = html.match(
    /<img[^>]+src=["']([^"']+)["']/i
  );

  return match?.[1] ?? null;
}

function getTimestamp(item: RawFeedItem) {
  const value = item.isoDate ?? item.pubDate;

  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getScore(
  item: RawFeedItem,
  category: TgLudicoCategory
) {
  const text = `${item.title ?? ""} ${
    item.contentSnippet ?? ""
  }`.toLowerCase();

  const keywordScore = KEYWORDS.reduce((score, keyword) => {
    return text.includes(keyword) ? score + 2 : score;
  }, 0);

  const timestamp = getTimestamp(item);

  const ageInHours = timestamp
    ? (Date.now() - timestamp) / (1000 * 60 * 60)
    : 9999;

  let freshnessScore = 0;

  if (ageInHours <= 24) freshnessScore = 10;
  else if (ageInHours <= 72) freshnessScore = 7;
  else if (ageInHours <= 168) freshnessScore = 4;
  else if (ageInHours <= 336) freshnessScore = 2;

  const categoryScore =
    getTgLudicoCategoryWeight(category);

  return keywordScore + freshnessScore + categoryScore;
}

function normalizeTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9à-ÿ]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function removeDuplicates(items: TgLudicoItem[]) {
  const seenLinks = new Set<string>();
  const seenTitles = new Set<string>();

  return items.filter((item) => {
    const normalizedTitle = normalizeTitle(item.title);

    const normalizedLink = item.link
      .split("?")[0]
      .replace(/\/$/, "");

    if (
      seenLinks.has(normalizedLink) ||
      seenTitles.has(normalizedTitle)
    ) {
      return false;
    }

    seenLinks.add(normalizedLink);
    seenTitles.add(normalizedTitle);

    return true;
  });
}

function getTranslationCacheKey(link: string) {
  const hash = createHash("sha256")
    .update(link)
    .digest("hex");

  return `tg-ludico:translation:${TRANSLATION_CACHE_VERSION}:${hash}`;
}

function parseTranslatedArticle(
  value: unknown
): TranslatedArticle | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;

  if (
    typeof candidate.title !== "string" ||
    typeof candidate.description !== "string"
  ) {
    return null;
  }

  const title = cleanText(candidate.title, 220);
  const description = cleanText(
    candidate.description,
    700
  );

  if (!title || !description) {
    return null;
  }

  return {
    title,
    description,
  };
}

async function getStoredTranslation(
  link: string
): Promise<TranslatedArticle | null> {
  try {
    const cacheKey = getTranslationCacheKey(link);

    const storedValue = await redis.get<unknown>(
      cacheKey
    );

    const translation =
      parseTranslatedArticle(storedValue);

    if (translation) {
      console.log(
        `[TG Ludico] Traduzione recuperata da Redis: ${link}`
      );
    }

    return translation;
  } catch (error) {
    console.error(
      `[TG Ludico] Errore durante la lettura da Redis: ${link}`,
      error
    );

    return null;
  }
}

async function saveTranslation(
  link: string,
  originalTitle: string,
  translation: TranslatedArticle
) {
  try {
    const cacheKey = getTranslationCacheKey(link);

    await redis.set(cacheKey, {
      title: translation.title,
      description: translation.description,
      originalTitle,
      translatedAt: new Date().toISOString(),
    });

    console.log(
      `[TG Ludico] Traduzione salvata in Redis: ${link}`
    );
  } catch (error) {
    console.error(
      `[TG Ludico] Errore durante il salvataggio in Redis: ${link}`,
      error
    );
  }
}

async function requestTranslationFromOpenAI(
  title: string,
  description: string
): Promise<TranslatedArticle> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn(
      "[TG Ludico] OPENAI_API_KEY non configurata. Uso il testo originale."
    );

    return {
      title,
      description,
    };
  }

  const openai = new OpenAI({
    apiKey,
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content:
            "Traduci notizie sui giochi da tavolo dall'inglese all'italiano. Mantieni nomi propri, titoli dei giochi, aziende e termini ufficiali invariati. Scrivi in italiano naturale e giornalistico. Non aggiungere informazioni. Rispondi esclusivamente con un oggetto JSON contenente le proprietà title e description.",
        },
        {
          role: "user",
          content: JSON.stringify({
            title,
            description,
          }),
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    const content =
      response.choices[0]?.message?.content;

    if (!content) {
      throw new Error(
        "OpenAI non ha restituito alcun contenuto."
      );
    }

    const parsedValue: unknown = JSON.parse(content);

    const translation =
      parseTranslatedArticle(parsedValue);

    if (!translation) {
      throw new Error(
        "La risposta di OpenAI non contiene title e description validi."
      );
    }

    return translation;
  } catch (error) {
    console.error(
      `[TG Ludico] Errore durante la traduzione OpenAI: ${title}`,
      error
    );

    return {
      title,
      description,
    };
  }
}

async function readFeed(feed: (typeof FEEDS)[number]) {
  try {
    const result = await parser.parseURL(feed.url);

    return (result.items as RawFeedItem[])
      .filter((item) => item.title && item.link)
      .map((item) => {
        const title = stripHtml(item.title);

        const description = stripHtml(
          item.contentSnippet ??
            item.content ??
            item.contentEncoded ??
            ""
        ).slice(0, 500);
        const sourceText = stripHtml(
  item.contentEncoded ??
    item.content ??
    item.contentSnippet ??
    ""
).slice(0, 5000);

        return {
          raw: item,
          article: {
            title,
            link: item.link as string,
            description,
            sourceText,
            date:
              item.isoDate ??
              item.pubDate ??
              new Date(0).toISOString(),
            source: feed.name,
            image: getImage(item),
            category: getTgLudicoCategory(
              title,
              description
            ),
          } satisfies TgLudicoItem,
        };
      });
  } catch (error) {
    console.error(
      `[TG Ludico] Errore nel feed ${feed.name}:`,
      error
    );

    return [];
  }
}

async function translateArticles(
  articles: TgLudicoItem[]
): Promise<TgLudicoItem[]> {
  const translatedArticles: TgLudicoItem[] = [];

  for (const article of articles) {
    const storedTranslation =
      await getStoredTranslation(article.link);

    if (storedTranslation) {
      translatedArticles.push({
        ...article,
        title: storedTranslation.title,
        description: storedTranslation.description,
      });

      continue;
    }

    const translation =
      await requestTranslationFromOpenAI(
        article.title,
        article.description
      );

    const translationWasSuccessful =
      translation.title !== article.title ||
      translation.description !== article.description;

    if (translationWasSuccessful) {
      await saveTranslation(
        article.link,
        article.title,
        translation
      );
    } else {
      console.warn(
        `[TG Ludico] Traduzione non salvata perché coincide con il testo originale: ${article.link}`
      );
    }

    translatedArticles.push({
      ...article,
      title: translation.title,
      description: translation.description,
    });
  }

  return translatedArticles;
}

async function buildTgLudicoNews(
  limit: number
): Promise<TgLudicoItem[]> {
  console.log(
    "[TG Ludico] Cache Next.js scaduta: controllo dei feed avviato."
  );

  const feedResults = await Promise.all(
    FEEDS.map(readFeed)
  );

  const rankedItems = feedResults
    .flat()
    .sort((a, b) => {
      const scoreA = getScore(
        a.raw,
        a.article.category
      );

      const scoreB = getScore(
        b.raw,
        b.article.category
      );

      const scoreDifference = scoreB - scoreA;

      if (scoreDifference !== 0) {
        return scoreDifference;
      }

      return getTimestamp(b.raw) - getTimestamp(a.raw);
    })
    .map((entry) => entry.article);

  const selectedArticles = removeDuplicates(
    rankedItems
  ).slice(0, limit);

  console.log(
    `[TG Ludico] Notizie selezionate: ${selectedArticles.length}`
  );

  selectedArticles.forEach((article) => {
    console.log(
      `[TG Ludico] Categoria assegnata: ${article.category} — ${article.title}`
    );
  });

  const translatedArticles =
    await translateArticles(selectedArticles);

  console.log(
    "[TG Ludico] Aggiornamento completato e salvato nella cache Next.js."
  );

  return translatedArticles;
}

const getCachedTgLudicoNews = unstable_cache(
  async (limit: number) =>
    buildTgLudicoNews(limit),
  ["tg-ludico-news-v4"],
  {
    revalidate: CACHE_DURATION_SECONDS,
    tags: ["tg-ludico-news"],
  }
);

export async function getTgLudicoNews(
  limit = 5
): Promise<TgLudicoItem[]> {
  return getCachedTgLudicoNews(limit);
}