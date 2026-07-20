import Parser from "rss-parser";

const parser = new Parser();

const sources = [
  {
    name: "BoardGameWire",
    url: "https://boardgamewire.com/index.php/feed/",
  },
];

export type TgNewsItem = {
  title: string;
  excerpt: string;
  url: string;
  source: string;
  publishedAt: string;
  score: number;
};

const importantKeywords = [
  "kickstarter",
  "gamefound",
  "crowdfunding",
  "asmodee",
  "awards",
  "announcement",
  "release",
  "expansion",
  "board game",
];

function calculateScore(title: string, publishedAt?: string) {
  const normalizedTitle = title.toLowerCase();

  const keywordScore = importantKeywords.reduce((score, keyword) => {
    return normalizedTitle.includes(keyword) ? score + 10 : score;
  }, 0);

  const publishedTime = publishedAt
    ? new Date(publishedAt).getTime()
    : 0;

  const ageInHours =
    (Date.now() - publishedTime) / (1000 * 60 * 60);

  const freshnessScore = Math.max(0, 100 - ageInHours);

  return keywordScore + freshnessScore;
}

export async function getTgLudicoNews(): Promise<TgNewsItem[]> {
  const results = await Promise.allSettled(
    sources.map(async (source) => {
      const response = await fetch(source.url, {
  next: { revalidate: 3600 },
});

if (!response.ok) {
  throw new Error(`Errore nel caricamento di ${source.name}`);
}

const xml = await response.text();
const feed = await parser.parseString(xml);

      return feed.items.map((item) => {
        const title = item.title ?? "Notizia senza titolo";
        const publishedAt =
          item.isoDate ??
          item.pubDate ??
          new Date().toISOString();

        return {
          title,
          excerpt:
            item.contentSnippet ??
            item.content ??
            "Apri la notizia per leggere tutti i dettagli.",
          url: item.link ?? "#",
          source: source.name,
          publishedAt,
          score: calculateScore(title, publishedAt),
        };
      });
    }),
  );

  const news = results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );

  const uniqueNews = Array.from(
    new Map(news.map((item) => [item.url, item])).values(),
  );

  return uniqueNews
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}