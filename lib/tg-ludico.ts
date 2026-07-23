import "server-only";

import OpenAI from "openai";
import Parser from "rss-parser";
import { unstable_noStore as noStore } from "next/cache";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

type RawFeedItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  contentSnippet?: string;
  content?: string;
  contentEncoded?: string;
  enclosure?: {
    url?: string;
  };
  mediaContent?: {
    $?: {
      url?: string;
    };
  };
  mediaThumbnail?: {
    $?: {
      url?: string;
    };
  };
};

export type TgLudicoItem = {
  title: string;
  link: string;
  description: string;
  date: string;
  source: string;
  image: string | null;
};

type TranslatedArticle = {
  title: string;
  description: string;
};

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
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);

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

function getScore(item: RawFeedItem) {
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

  return keywordScore + freshnessScore;
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
    const normalizedLink = item.link.split("?")[0].replace(/\/$/, "");

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

function extractJsonObject(value: string): string | null {
  const cleaned = value
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    return null;
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

function parseTranslatedArticle(
  value: string,
  fallbackTitle: string,
  fallbackDescription: string
): TranslatedArticle {
  const jsonObject = extractJsonObject(value);

  if (!jsonObject) {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
    };
  }

  try {
    const parsed = JSON.parse(jsonObject) as Partial<TranslatedArticle>;

    const title =
      typeof parsed.title === "string"
        ? cleanText(parsed.title, 180)
        : "";

    const description =
      typeof parsed.description === "string"
        ? cleanText(parsed.description, 360)
        : "";

    return {
      title: title || fallbackTitle,
      description: description || fallbackDescription,
    };
  } catch (error) {
    console.error(
      "[TG Ludico] Impossibile interpretare il JSON di OpenAI:",
      error
    );

    return {
      title: fallbackTitle,
      description: fallbackDescription,
    };
  }
}

async function translateArticle(
  title: string,
  description: string
): Promise<TranslatedArticle> {
  if (!title.trim() && !description.trim()) {
    return {
      title,
      description,
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;

  console.log("[TG Ludico] Traduzione richiesta:", title);
  console.log("[TG Ludico] Chiave OpenAI presente:", Boolean(apiKey));

  if (!apiKey) {
    console.error(
      "[TG Ludico] OPENAI_API_KEY non è disponibile nell'ambiente server."
    );

    return {
      title,
      description,
    };
  }

  try {
    const openai = new OpenAI({
      apiKey,
    });

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      reasoning: {
        effort: "minimal",
      },
      store: false,
      max_output_tokens: 500,
      instructions: `
Sei il redattore del TG Ludico, una sezione italiana dedicata
alle notizie sui giochi da tavolo.

Devi tradurre in italiano il titolo e tradurre e riassumere
la descrizione ricevuta.

Regole obbligatorie:
- restituisci esclusivamente un oggetto JSON valido;
- il JSON deve contenere soltanto le proprietà "title" e "description";
- non usare Markdown;
- non aggiungere testo prima o dopo il JSON;
- scrivi titolo e descrizione esclusivamente in italiano;
- mantieni invariati i nomi propri;
- mantieni invariati i titoli ufficiali dei giochi;
- mantieni invariati i nomi di aziende, autori e piattaforme;
- traduci le parole descrittive presenti nel titolo;
- rendi il titolo naturale, chiaro e giornalistico;
- non creare un titolo sensazionalistico;
- la descrizione deve essere composta da una o due frasi;
- la descrizione non deve superare indicativamente 320 caratteri;
- non inventare informazioni;
- non aggiungere commenti o valutazioni;
- non iniziare la descrizione con "L'articolo parla di",
  "La notizia riguarda" o formule simili.

Formato obbligatorio:
{
  "title": "Titolo italiano",
  "description": "Descrizione italiana"
}
      `.trim(),
      input: `
Titolo originale:
${title}

Descrizione originale:
${description}
      `.trim(),
    });

    console.log("[TG Ludico] Stato OpenAI:", response.status);
    console.log("[TG Ludico] Risposta ricevuta:", response.output_text);

    if (!response.output_text.trim()) {
      console.error(
        `[TG Ludico] OpenAI non ha prodotto testo per "${title}".`,
        {
          status: response.status,
          usage: response.usage,
          output: response.output,
        }
      );

      return {
        title,
        description,
      };
    }

    return parseTranslatedArticle(
      response.output_text,
      title,
      description
    );
  } catch (error) {
    console.error(
      `[TG Ludico] Errore OpenAI durante la traduzione di "${title}":`,
      error
    );

    return {
      title,
      description,
    };
  }
}

async function translateArticles(
  articles: TgLudicoItem[]
): Promise<TgLudicoItem[]> {
  const translatedArticles: TgLudicoItem[] = [];

  for (const article of articles) {
    const translation = await translateArticle(
      article.title,
      article.description
    );

    translatedArticles.push({
      ...article,
      title: translation.title,
      description: translation.description,
    });
  }

  return translatedArticles;
}

async function readFeed(feed: (typeof FEEDS)[number]) {
  try {
    const result = await parser.parseURL(feed.url);

    return (result.items as RawFeedItem[])
      .filter((item) => item.title && item.link)
      .map((item) => ({
        raw: item,
        article: {
          title: stripHtml(item.title),
          link: item.link as string,
          description: stripHtml(
            item.contentSnippet ??
              item.content ??
              item.contentEncoded ??
              ""
          ).slice(0, 500),
          date:
            item.isoDate ??
            item.pubDate ??
            new Date(0).toISOString(),
          source: feed.name,
          image: getImage(item),
        } satisfies TgLudicoItem,
      }));
  } catch (error) {
    console.error(`[TG Ludico] Errore nel feed ${feed.name}:`, error);

    return [];
  }
}

export async function getTgLudicoNews(
  limit = 5
): Promise<TgLudicoItem[]> {
  noStore();

  console.log("[TG Ludico] Recupero delle notizie iniziato.");

  const feedResults = await Promise.all(FEEDS.map(readFeed));

  const rankedItems = feedResults
    .flat()
    .sort((a, b) => {
      const scoreDifference = getScore(b.raw) - getScore(a.raw);

      if (scoreDifference !== 0) {
        return scoreDifference;
      }

      return getTimestamp(b.raw) - getTimestamp(a.raw);
    })
    .map((entry) => entry.article);

  const selectedArticles = removeDuplicates(rankedItems).slice(
    0,
    limit
  );

  console.log(
    `[TG Ludico] Notizie selezionate: ${selectedArticles.length}`
  );

  return translateArticles(selectedArticles);
}