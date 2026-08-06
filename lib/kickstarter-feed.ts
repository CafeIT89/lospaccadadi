import "server-only";

import Parser from "rss-parser";

import type { KickstarterProject } from "@/lib/kickstarter-service";

type KicktraqFeedItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  content?: string;
  contentSnippet?: string;
  contentEncoded?: string;
};

type ParsedKicktraqProject = KickstarterProject & {
  score: number;
  kicktraqUrl: string;
};

const parser = new Parser<unknown, KicktraqFeedItem>({
  customFields: {
    item: [
      ["content:encoded", "contentEncoded"],
    ],
  },
});

const KICKTRAQ_FEEDS = [
  "https://www.kicktraq.com/categories/games/tabletop%20games/latest.rss",
  "https://www.kicktraq.com/categories/games/tabletop%20games/ending.rss",
] as const;

function decodeHtml(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&pound;/gi, "£")
    .replace(/&euro;/gi, "€")
    .replace(/&yen;/gi, "¥")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(Number(code))
    );
}

function stripHtml(value = ""): string {
  return decodeHtml(
    value.replace(/<[^>]*>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function parseNumber(value: string): number {
  const normalized = value
    .replace(/\s/g, "")
    .replace(/[^\d.,-]/g, "");

  if (!normalized) {
    return 0;
  }

  /*
   * I numeri nei feed possono usare:
   * 12,345 oppure 12.345 come separatore delle migliaia.
   */
  const withoutThousands = normalized
    .replace(/(?<=\d)[.,](?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");

  const parsed = Number(withoutThousands);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

function getCurrency(value: string): string {
  if (/CA\$/i.test(value)) return "CAD";
  if (/AU\$/i.test(value)) return "AUD";
  if (/NZ\$/i.test(value)) return "NZD";
  if (/MX\$/i.test(value)) return "MXN";
  if (/HK\$/i.test(value)) return "HKD";
  if (/S\$/i.test(value)) return "SGD";
  if (value.includes("€")) return "EUR";
  if (value.includes("£")) return "GBP";
  if (value.includes("¥")) return "JPY";
  if (value.includes("$")) return "USD";

  return "";
}

function getFirstMatch(
  value: string,
  patterns: RegExp[]
): string {
  for (const pattern of patterns) {
    const match = value.match(pattern);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return "";
}

/**
 * Recupera l'immagine così come compare nel feed.
 *
 * Non modifica i parametri dell'URL perché le immagini
 * Kickstarter possono utilizzare URL firmati. Alterare
 * width, height, qualità o altri parametri invaliderebbe
 * la firma e impedirebbe il caricamento dell'immagine.
 */
function extractImage(html: string): string {
  const imageUrl = getFirstMatch(html, [
    /<img[^>]+data-src=["']([^"']+)["']/i,
    /<img[^>]+src=["']([^"']+)["']/i,
  ]);

  return decodeHtml(imageUrl);
}
function extractHighResolutionImage(
  html: string
): string {
  const imageUrl = getFirstMatch(html, [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
  ]);

  return decodeHtml(imageUrl);
}

async function getHighResolutionImage(
  kicktraqUrl: string,
  fallbackImage: string
): Promise<string> {
  if (!kicktraqUrl) {
    return fallbackImage;
  }

  try {
    const response = await fetch(kicktraqUrl, {
      headers: {
        Accept:
          "text/html,application/xhtml+xml",
        "User-Agent":
          "LoSpaccadadi/1.0 (+https://www.lospaccadadi.it)",
      },
      cache: "no-store",
      redirect: "follow",
    });

    if (!response.ok) {
      console.warn(
        `[Kickstarter Feed] Immagine HD non recuperata (${response.status}): ${kicktraqUrl}`
      );

      return fallbackImage;
    }

    const html = await response.text();

    const highResolutionImage =
      extractHighResolutionImage(html);

    return highResolutionImage || fallbackImage;
  } catch (error) {
    console.warn(
      `[Kickstarter Feed] Errore recupero immagine HD: ${kicktraqUrl}`,
      error
    );

    return fallbackImage;
  }
}
function extractKickstarterUrl(
  html: string,
  fallbackUrl: string
): string {
  const kickstarterUrl = getFirstMatch(html, [
    /href=["'](https?:\/\/(?:www\.)?kickstarter\.com\/projects\/[^"']+)["']/i,
  ]);

  return decodeHtml(
    kickstarterUrl || fallbackUrl
  );
}
function extractOfficialKickstarterUrl(
  html: string
): string {
  const url = getFirstMatch(html, [
    /href=["'](https?:\/\/(?:www\.)?kickstarter\.com\/projects\/[^"'?#]+(?:\/[^"'?#]+)?[^"']*)["']/i,
    /content=["'](https?:\/\/(?:www\.)?kickstarter\.com\/projects\/[^"']+)["']/i,
  ]);

  return decodeHtml(url);
}

async function getOfficialKickstarterUrl(
  kicktraqUrl: string,
  fallbackUrl: string
): Promise<string> {
  if (!kicktraqUrl) {
    return fallbackUrl;
  }

  try {
    const response = await fetch(kicktraqUrl, {
      headers: {
        Accept:
          "text/html,application/xhtml+xml",
        "User-Agent":
          "LoSpaccadadi/1.0 (+https://www.lospaccadadi.it)",
      },
      cache: "no-store",
      redirect: "follow",
    });

    if (!response.ok) {
      console.warn(
        `[Kickstarter Feed] Link ufficiale non recuperato (${response.status}): ${kicktraqUrl}`
      );

      return fallbackUrl;
    }

    const html = await response.text();

    const officialUrl =
      extractOfficialKickstarterUrl(html);

    return officialUrl || fallbackUrl;
  } catch (error) {
    console.warn(
      `[Kickstarter Feed] Errore recupero link ufficiale: ${kicktraqUrl}`,
      error
    );

    return fallbackUrl;
  }
}
function extractBackers(text: string): number {
  const value = getFirstMatch(text, [
    /Backers:\s*([\d.,]+)/i,
    /([\d.,]+)\s+backers/i,
    /Sostenitori:\s*([\d.,]+)/i,
  ]);

  return parseNumber(value);
}

function extractFundingData(text: string): {
  raised: number;
  goal: number;
  currency: string;
} {
  const fundingLine = getFirstMatch(text, [
    /Funding:\s*([^\n|]+)/i,
    /Current:\s*([^\n|]+)/i,
    /Pledged:\s*([^\n|]+)/i,
  ]);

  const source = fundingLine || text;

  const match = source.match(
    /([A-Z]{0,3}\s*)?([€£¥$]?\s*[\d.,]+)\s+(?:of|su)\s+([A-Z]{0,3}\s*)?([€£¥$]?\s*[\d.,]+)/i
  );

  if (!match) {
    return {
      raised: 0,
      goal: 0,
      currency: getCurrency(source),
    };
  }

  return {
    raised: parseNumber(match[2]),
    goal: parseNumber(match[4]),
    currency: getCurrency(
      `${match[1] ?? ""}${match[2]} ${
        match[3] ?? ""
      }${match[4]}`
    ),
  };
}

function extractEndDate(
  text: string,
  publishedAt: string
): string {
  const timeLeftMatch = text.match(
    /Time left:\s*(\d+)\s*days?,\s*(\d+)\s*hours?/i
  );

  if (timeLeftMatch) {
    const days = Number(timeLeftMatch[1]);
    const hours = Number(timeLeftMatch[2]);

    const endDate = new Date();

    endDate.setUTCHours(
      endDate.getUTCHours() +
        days * 24 +
        hours
    );

    return endDate.toISOString();
  }

  const campaignDatesMatch = text.match(
    /Campaign Dates:\s*.+?\s*->\s*([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,\s*\d{4})?)/i
  );

  if (campaignDatesMatch?.[1]) {
    const normalizedDate =
      campaignDatesMatch[1].replace(
        /(\d+)(st|nd|rd|th)/i,
        "$1"
      );

    const parsedDate =
      new Date(normalizedDate);

    if (
      !Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return parsedDate.toISOString();
    }
  }

  return publishedAt;
}

function createScore(
  backers: number,
  raised: number,
  goal: number,
  endDate: string
): number {
  const fundingPercentage =
    goal > 0
      ? raised / goal
      : 0;

  const backerScore =
    Math.log10(
      Math.max(backers, 1)
    ) * 30;

  const fundingScore =
    Math.log10(
      Math.max(raised, 1)
    ) * 15;

  const percentageScore =
    Math.min(
      fundingPercentage,
      10
    ) * 12;

  const endTimestamp =
    new Date(endDate).getTime();

  const hoursRemaining =
    Number.isFinite(endTimestamp)
      ? (endTimestamp - Date.now()) /
        3_600_000
      : Number.POSITIVE_INFINITY;

  let urgencyScore = 0;

  if (
    hoursRemaining > 0 &&
    hoursRemaining <= 72
  ) {
    urgencyScore = 25;
  } else if (
    hoursRemaining > 72 &&
    hoursRemaining <= 168
  ) {
    urgencyScore = 12;
  }

  return (
    backerScore +
    fundingScore +
    percentageScore +
    urgencyScore
  );
}

function buildDescription(
  text: string
): string {
  return text
    .replace(
      /Games\s*\/\s*Tabletop Games/gi,
      ""
    )
    .replace(
      /Backers:\s*[\d.,]+/gi,
      ""
    )
    .replace(
      /Funding:\s*.+?(?=Average|Campaign|Time left|$)/gi,
      ""
    )
    .replace(
      /Average daily pledges:\s*.+?(?=Campaign|Time left|$)/gi,
      ""
    )
    .replace(
      /Campaign Dates:\s*.+?(?=Time left|$)/gi,
      ""
    )
    .replace(
      /Time left:\s*.+$/gi,
      ""
    )
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

function parseFeedItem(
  item: KicktraqFeedItem
): ParsedKicktraqProject | null {
  const title = stripHtml(
    item.title ?? ""
  );

  const html =
    item.contentEncoded ??
    item.content ??
    "";

  const text = stripHtml(
    [
      item.contentSnippet,
      html,
    ]
      .filter(Boolean)
      .join(" ")
  );

  const fallbackUrl =
    item.link?.trim() ?? "";

  if (
    !title ||
    !fallbackUrl
  ) {
    return null;
  }

  const {
    raised,
    goal,
    currency,
  } = extractFundingData(text);

  const backers =
    extractBackers(text);

  const publishedAt =
    item.isoDate ??
    item.pubDate ??
    new Date().toISOString();

  const endDate =
    extractEndDate(
      text,
      publishedAt
    );

  const project: KickstarterProject = {
    title,
    description:
      buildDescription(text),
    image:
      extractImage(html),
    url:
      extractKickstarterUrl(
        html,
        fallbackUrl
      ),
    endDate,
    backers,
    raised,
    goal,
    currency,
  };

return {
  ...project,
  score: createScore(
    backers,
    raised,
    goal,
    endDate
  ),
  kicktraqUrl: fallbackUrl,
};
}

async function readFeed(
  feedUrl: string
): Promise<
  ParsedKicktraqProject[]
> {
  try {
    const response =
      await fetch(feedUrl, {
        headers: {
          Accept:
            "application/rss+xml, application/xml, text/xml",
          "User-Agent":
            "LoSpaccadadi/1.0 (+https://www.lospaccadadi.it)",
        },
        cache: "no-store",
      });

    if (!response.ok) {
      throw new Error(
        `Kicktraq ha restituito ${response.status}`
      );
    }

    const xml =
      await response.text();

    const feed =
      await parser.parseString(xml);

    return feed.items
      .map(parseFeedItem)
      .filter(
        (
          project
        ): project is ParsedKicktraqProject =>
          project !== null
      );
  } catch (error) {
    console.error(
      `[Kickstarter Feed] Errore nel feed ${feedUrl}:`,
      error
    );

    return [];
  }
}

function normalizeUrl(
  value: string
): string {
  return value
    .split("?")[0]
    .replace(/\/$/, "")
    .toLowerCase();
}

export async function getKickstarterProjectsFromFeeds(
  limit = 4
): Promise<KickstarterProject[]> {
  console.log(
    "[Kickstarter Feed] Recupero delle campagne Kicktraq..."
  );

  const feedResults =
    await Promise.all(
      KICKTRAQ_FEEDS.map(
        readFeed
      )
    );

  const seenUrls =
    new Set<string>();


const selectedProjects = feedResults
  .flat()
  .sort(
    (a, b) =>
      b.score - a.score
  )
  .filter((project) => {
    const normalizedUrl =
      normalizeUrl(
        project.kicktraqUrl
      );

    if (
      !normalizedUrl ||
      seenUrls.has(normalizedUrl)
    ) {
      return false;
    }

    seenUrls.add(
      normalizedUrl
    );

    return true;
  })
  .slice(0, limit);

const projects = await Promise.all(
  selectedProjects.map(
    async ({
      score: _score,
      kicktraqUrl,
      ...project
    }): Promise<KickstarterProject> => {
      const officialUrl =
        await getOfficialKickstarterUrl(
          kicktraqUrl,
          project.url
        );

      return {
        ...project,
        url: officialUrl,
      };
    }
  )
);

console.log(
  `[Kickstarter Feed] Selezionate ${projects.length} campagne con link ufficiali.`
);

return projects;

}