import * as cheerio from "cheerio";

const TEST_URL =
  "https://gamefound.com/en/projects/awaken-realms/nemesis-legacy/updates";

export async function testGamefoundUpdatesPage() {
  const response = await fetch(TEST_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; LoSpaccaDadi/1.0; +https://lospaccadadi.it)",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Gamefound ha risposto con ${response.status} ${response.statusText}`
    );
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const updateLinks = new Set<string>();

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");

    if (href && /\/updates\/[^/?#]+/i.test(href)) {
      updateLinks.add(href);
    }
  });

  const interestingScripts: string[] = [];

  $("script").each((_, element) => {
    const content = $(element).html()?.trim() ?? "";

    if (
      content &&
      /update|projectId|projectSlug|initialState|apollo|graphql/i.test(content)
    ) {
      interestingScripts.push(content.slice(0, 1500));
    }
  });

  const scriptSources = $("script[src]")
    .map((_, element) => $(element).attr("src"))
    .get()
    .filter((src): src is string => Boolean(src));

  const interestingHtmlMatches =
    html.match(
      /.{0,150}(?:\/updates\/|projectId|projectSlug|graphql|api\/).{0,300}/gi
    ) ?? [];

  return {
    length: html.length,

    pageTitle: $("title").text().trim(),

    projectImage:
      $('meta[property="og:image"]').attr("content") ??
      $('meta[name="twitter:image"]').attr("content") ??
      null,

    updateLinks: [...updateLinks].slice(0, 20),

    interestingScripts: interestingScripts.slice(0, 10),

    interestingHtmlMatches: interestingHtmlMatches.slice(0, 20),

    scriptSources: scriptSources.slice(0, 30),
  };
}