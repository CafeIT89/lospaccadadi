import Parser from "rss-parser";

const PLAYLIST_ID = "PLnIo02YCYKvads9E0r7iaxcJVFG9ANAGp";

const RSS_URL = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;

type RecensioneVideo = {
  videoId: string;
  title: string;
  url: string;
  publishedAt: string;
  thumbnail: string;
};

type YouTubeFeedItem = {
  id?: string;
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
};

export async function getRecensioni(): Promise<RecensioneVideo[]> {
  const parser = new Parser<unknown, YouTubeFeedItem>();

  try {
    const response = await fetch(RSS_URL, {
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error("Impossibile caricare la playlist Recensioni.");
    }

    const xml = await response.text();
    const feed = await parser.parseString(xml);

    return feed.items
      .map((item) => {
        const videoId = item.id?.replace("yt:video:", "");

        if (!videoId || !item.title || !item.link) {
          return null;
        }

        return {
          videoId,
          title: item.title,
          url: item.link,
          publishedAt: item.isoDate ?? item.pubDate ?? "",
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        };
      })
      .filter((video): video is RecensioneVideo => video !== null);
  } catch (error) {
    console.error("Errore nel caricamento delle recensioni:", error);
    return [];
  }
}