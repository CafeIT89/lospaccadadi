import "server-only";

import { redis } from "@/lib/redis";
import { getRecensioni } from "@/lib/recensioni";
import {
  getSettimanaleVideos,
  type SettimanaleVideo,
} from "@/lib/settimanale";

export type RecensioneVideo = {
  videoId: string;
  title: string;
  url: string;
  publishedAt: string;
  thumbnail: string;
};

type YouTubeCacheValue<T> = {
  version: number;
  updatedAt: string;
  items: T[];
};

export type YouTubeRefreshResult = {
  recensioni: {
    updated: boolean;
    items: number;
  };
  settimanale: {
    updated: boolean;
    items: number;
  };
  updatedAt: string;
};

const CACHE_VERSION = 1;

const RECENSIONI_CACHE_KEY =
  `youtube:recensioni:v${CACHE_VERSION}`;

const SETTIMANALE_CACHE_KEY =
  `youtube:settimanale:v${CACHE_VERSION}`;

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isRecensioneVideo(
  value: unknown
): value is RecensioneVideo {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    isString(candidate.videoId) &&
    isString(candidate.title) &&
    isString(candidate.url) &&
    isString(candidate.publishedAt) &&
    isString(candidate.thumbnail)
  );
}

function isSettimanaleVideo(
  value: unknown
): value is SettimanaleVideo {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    isString(candidate.videoId) &&
    isString(candidate.title) &&
    isString(candidate.url) &&
    isString(candidate.publishedAt) &&
    isString(candidate.thumbnail)
  );
}

function isCacheValue<T>(
  value: unknown,
  itemGuard: (item: unknown) => item is T
): value is YouTubeCacheValue<T> {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    candidate.version === CACHE_VERSION &&
    isString(candidate.updatedAt) &&
    Array.isArray(candidate.items) &&
    candidate.items.every(itemGuard)
  );
}

async function readCache<T>(
  key: string,
  itemGuard: (item: unknown) => item is T
): Promise<T[]> {
  try {
    const storedValue = await redis.get<unknown>(key);

    if (storedValue === null) {
      console.log(
        `[YouTube Service] Cache assente: ${key}`
      );

      return [];
    }

    if (!isCacheValue(storedValue, itemGuard)) {
      console.warn(
        `[YouTube Service] Cache non valida: ${key}`
      );

      return [];
    }

    console.log(
      `[YouTube Service] Cache letta: ${key} (${storedValue.items.length} elementi)`
    );

    return storedValue.items;
  } catch (error) {
    console.error(
      `[YouTube Service] Errore durante la lettura Redis: ${key}`
    );

    console.error(error);

    return [];
  }
}

async function saveCache<T>(
  key: string,
  items: T[]
): Promise<void> {
  const value: YouTubeCacheValue<T> = {
    version: CACHE_VERSION,
    updatedAt: new Date().toISOString(),
    items,
  };

  try {
    /*
     * Nessuna scadenza automatica:
     * se YouTube non risponde, il sito continuerà a mostrare
     * gli ultimi video recuperati con successo.
     */
    await redis.set(key, value);

    console.log(
      `[YouTube Service] Cache aggiornata: ${key} (${items.length} elementi)`
    );
  } catch (error) {
    console.error(
      `[YouTube Service] Impossibile salvare la cache: ${key}`
    );

    console.error(error);
  }
}

export async function getCachedRecensioni(): Promise<
  RecensioneVideo[]
> {
  return readCache(
    RECENSIONI_CACHE_KEY,
    isRecensioneVideo
  );
}

export async function getCachedSettimanaleVideos(): Promise<
  SettimanaleVideo[]
> {
  return readCache(
    SETTIMANALE_CACHE_KEY,
    isSettimanaleVideo
  );
}

/**
 * Aggiorna entrambe le playlist.
 *
 * Una risposta vuota non sovrascrive la cache precedente:
 * potrebbe infatti essere causata da un timeout temporaneo
 * di YouTube, non da una playlist realmente vuota.
 */
export async function refreshYouTubeContent(): Promise<
  YouTubeRefreshResult
> {
  const updatedAt = new Date().toISOString();

  console.log(
    "[YouTube Service] Aggiornamento delle playlist avviato..."
  );

  const [recensioniResult, settimanaleResult] =
    await Promise.allSettled([
      getRecensioni(),
      getSettimanaleVideos(),
    ]);

  let recensioniUpdated = false;
  let recensioniCount = 0;

  if (recensioniResult.status === "fulfilled") {
    recensioniCount = recensioniResult.value.length;

    if (recensioniCount > 0) {
      await saveCache(
        RECENSIONI_CACHE_KEY,
        recensioniResult.value
      );

      recensioniUpdated = true;
    } else {
      console.warn(
        "[YouTube Service] Recensioni vuote: la cache precedente non verrà sovrascritta."
      );
    }
  } else {
    console.error(
      "[YouTube Service] Aggiornamento Recensioni fallito."
    );

    console.error(recensioniResult.reason);
  }

  let settimanaleUpdated = false;
  let settimanaleCount = 0;

  if (settimanaleResult.status === "fulfilled") {
    settimanaleCount =
      settimanaleResult.value.length;

    if (settimanaleCount > 0) {
      await saveCache(
        SETTIMANALE_CACHE_KEY,
        settimanaleResult.value
      );

      settimanaleUpdated = true;
    } else {
      console.warn(
        "[YouTube Service] Settimanale vuoto: la cache precedente non verrà sovrascritta."
      );
    }
  } else {
    console.error(
      "[YouTube Service] Aggiornamento Settimanale fallito."
    );

    console.error(settimanaleResult.reason);
  }

  console.log(
    "[YouTube Service] Aggiornamento delle playlist completato."
  );

  return {
    recensioni: {
      updated: recensioniUpdated,
      items: recensioniCount,
    },
    settimanale: {
      updated: settimanaleUpdated,
      items: settimanaleCount,
    },
    updatedAt,
  };
}