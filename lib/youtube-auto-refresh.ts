
import "server-only";

import { redis } from "@/lib/redis";
import { getLatestYouTubeVideo } from "@/lib/latest-youtube-video";

const REFRESH_INTERVAL_SECONDS = 30 * 60;
const REFRESH_LOCK_SECONDS = 2 * 60;

const LAST_CHECK_KEY = "youtube:latest:last-check:v1";
const REFRESH_LOCK_KEY = "youtube:latest:refresh-lock:v1";
const LATEST_VIDEO_CACHE_KEY = "youtube:latest:v1";

export async function refreshLatestYouTubeVideoIfNeeded(): Promise<void> {
  try {
    // Evita controlli ripetuti nei 30 minuti successivi.
    const lastCheck = await redis.get<string>(LAST_CHECK_KEY);

    if (lastCheck) {
      return;
    }

    // Solo una richiesta può ottenere il blocco Redis.
    const lockAcquired = await redis.set(
      REFRESH_LOCK_KEY,
      "1",
      {
        nx: true,
        ex: REFRESH_LOCK_SECONDS,
      }
    );

    if (lockAcquired !== "OK") {
      return;
    }

    try {
      // Ricontrolla dopo aver ottenuto il blocco.
      const recentCheck = await redis.get<string>(LAST_CHECK_KEY);

      if (recentCheck) {
        return;
      }

      // Registra il controllo prima della chiamata esterna.
      await redis.set(
        LAST_CHECK_KEY,
        new Date().toISOString(),
        { ex: REFRESH_INTERVAL_SECONDS }
      );

      const latestVideo = await getLatestYouTubeVideo();

      if (!latestVideo) {
        console.warn(
          "[YouTube Auto Refresh] Nessun video recuperato. Cache invariata."
        );
        return;
      }

      const currentCache = await redis.get<{
        version: number;
        updatedAt: string;
        items: Array<{ videoId: string }>;
      }>(LATEST_VIDEO_CACHE_KEY);

      const currentVideoId = currentCache?.items?.[0]?.videoId;

      if (currentVideoId === latestVideo.videoId) {
        console.log(
          "[YouTube Auto Refresh] Il video in homepage è già aggiornato."
        );
        return;
      }

      await redis.set(LATEST_VIDEO_CACHE_KEY, {
        version: 1,
        updatedAt: new Date().toISOString(),
        items: [latestVideo],
      });

      console.log(
        `[YouTube Auto Refresh] Nuovo video: ${latestVideo.title}`
      );
    } finally {
      await redis.del(REFRESH_LOCK_KEY);
    }
  } catch (error) {
    console.error(
      "[YouTube Auto Refresh] Errore durante l'aggiornamento:",
      error
    );
  }
}
