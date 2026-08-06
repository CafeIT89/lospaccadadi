import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: [
      ["yt:videoId", "videoId"],
      ["media:group", "mediaGroup"],
    ],
  },
});

const PLAYLIST_ID = "PLnIo02YCYKvZT2PxIT3-0mHbIq9yvbN8P";

export type SettimanaleVideo = {
  videoId: string;
  title: string;
  url: string;
  publishedAt: string;
  thumbnail: string;
};
const FETCH_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1_500;

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function fetchYouTubeFeed(
  feedUrl: string
): Promise<Response> {
  let lastError: unknown;

  for (
    let attempt = 1;
    attempt <= FETCH_ATTEMPTS;
    attempt += 1
  ) {
    try {
      const response = await fetch(feedUrl, {
        next: {
          revalidate: 3600,
        },
      });

      if (!response.ok) {
        throw new Error(
          `YouTube ha restituito lo stato ${response.status}`
        );
      }

      return response;
    } catch (error) {
      lastError = error;

      console.warn(
        `[Settimanale] Tentativo ${attempt}/${FETCH_ATTEMPTS} fallito.`
      );

      if (attempt < FETCH_ATTEMPTS) {
        await sleep(RETRY_DELAY_MS);
      }
    }
  }

  throw lastError;
}
export async function getSettimanaleVideos(): Promise<SettimanaleVideo[]> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;

  try {
    const response = await fetchYouTubeFeed(feedUrl);

    const xml = await response.text();
    const feed = await parser.parseString(xml);

    return feed.items
      .map((item) => {
        const videoId = String(item.videoId ?? "").trim();

        if (!videoId) {
          return null;
        }

        return {
          videoId,
          title: item.title ?? "Video senza titolo",
          url:
            item.link ??
            `https://www.youtube.com/watch?v=${videoId}`,
          publishedAt:
            item.isoDate ??
            item.pubDate ??
            new Date(0).toISOString(),
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        };
      })
      .filter(
        (video): video is SettimanaleVideo =>
          video !== null
      );
  } catch (error) {
    console.error(
      "[Settimanale] Impossibile recuperare la playlist YouTube. Il sito continuerà senza questi video.",
      error
    );

    return [];
  }
}