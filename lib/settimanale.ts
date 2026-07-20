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

export async function getSettimanaleVideos(): Promise<SettimanaleVideo[]> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;

  const response = await fetch(feedUrl, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Errore nel caricamento della playlist YouTube");
  }

  const xml = await response.text();
  const feed = await parser.parseString(xml);

  return feed.items
    .map((item) => {
      const videoId = String(item.videoId ?? "");

      return {
        videoId,
        title: item.title ?? "Video senza titolo",
        url: item.link ?? `https://www.youtube.com/watch?v=${videoId}`,
        publishedAt:
          item.isoDate ?? item.pubDate ?? new Date().toISOString(),
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      };
    })
    .filter((video) => video.videoId);
}