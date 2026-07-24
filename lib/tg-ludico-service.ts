import "server-only";

import { redis } from "@/lib/redis";
import { getTgLudicoNews } from "@/lib/tg-ludico";
import { buildWeeklyEdition } from "@/lib/tg-ludico-weekly";

import type {
  TgLudicoWeeklyArticle,
  TgLudicoWeeklyEdition,
} from "@/lib/tg-ludico-types";

export type WeeklyEditionOptions = {
  year: number;
  week: number;
  periodStart: string;
  periodEnd: string;
  limit?: number;
};

type WeeklyEditionCacheValue = {
  version: number;
  generatedAt: string;
  edition: TgLudicoWeeklyEdition;
};

const WEEKLY_EDITION_CACHE_VERSION = 1;

const WEEKLY_EDITION_CACHE_SECONDS =
  60 * 60 * 24 * 7;

const WEEKLY_EDITION_LOCK_SECONDS = 60 * 2;

const LOCK_POLL_INTERVAL_MS = 500;

const LOCK_WAIT_TIMEOUT_MS = 60 * 2 * 1000;

function getEditionId(
  year: number,
  week: number
): string {
  return `${year}-week-${String(week).padStart(
    2,
    "0"
  )}`;
}

function getEditionCacheKey(
  year: number,
  week: number
): string {
  return [
    "tg-ludico",
    "weekly-edition",
    `v${WEEKLY_EDITION_CACHE_VERSION}`,
    getEditionId(year, week),
  ].join(":");
}

function getEditionLockKey(
  year: number,
  week: number
): string {
  return [
    "tg-ludico",
    "weekly-edition-lock",
    `v${WEEKLY_EDITION_CACHE_VERSION}`,
    getEditionId(year, week),
  ].join(":");
}

function sleep(
  milliseconds: number
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function isString(
  value: unknown
): value is string {
  return typeof value === "string";
}

function isNumber(
  value: unknown
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

function isNullableString(
  value: unknown
): value is string | null | undefined {
  return (
    value === null ||
    value === undefined ||
    typeof value === "string"
  );
}

function isStringArray(
  value: unknown
): value is string[] {
  return (
    Array.isArray(value) &&
    value.every(isString)
  );
}

/**
 * Controlla la struttura di un articolo già scritto
 * per l'edizione settimanale.
 *
 * Questi campi sono diversi da quelli di TgLudicoItem:
 * - summary invece di description;
 * - originalUrl invece di link;
 * - publishedAt invece di date;
 * - article, subtitle e keyPoints.
 */
function isWeeklyArticle(
  value: unknown
): value is TgLudicoWeeklyArticle {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate =
    value as Record<string, unknown>;

  return (
    isString(candidate.title) &&
    isString(candidate.subtitle) &&
    isString(candidate.summary) &&
    isString(candidate.article) &&
    isStringArray(candidate.keyPoints) &&
    isString(candidate.category) &&
    isString(candidate.source) &&
    isString(candidate.originalUrl) &&
    isString(candidate.originalTitle) &&
    isNullableString(candidate.image) &&
    isString(candidate.publishedAt)
  );
}

function isWeeklyEdition(
  value: unknown
): value is TgLudicoWeeklyEdition {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate =
    value as Record<string, unknown>;

  return (
    isString(candidate.id) &&
    isNumber(candidate.year) &&
    isNumber(candidate.week) &&
    isString(candidate.title) &&
    isString(candidate.publishedAt) &&
    isString(candidate.periodStart) &&
    isString(candidate.periodEnd) &&
    Array.isArray(candidate.articles) &&
    candidate.articles.every(isWeeklyArticle)
  );
}

function isWeeklyEditionCacheValue(
  value: unknown
): value is WeeklyEditionCacheValue {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate =
    value as Record<string, unknown>;

  return (
    candidate.version ===
      WEEKLY_EDITION_CACHE_VERSION &&
    isString(candidate.generatedAt) &&
    isWeeklyEdition(candidate.edition)
  );
}

/**
 * Legge un'edizione completa da Redis.
 */
async function getStoredWeeklyEdition(
  options: WeeklyEditionOptions
): Promise<TgLudicoWeeklyEdition | null> {
  const cacheKey = getEditionCacheKey(
    options.year,
    options.week
  );

  try {
    const storedValue =
      await redis.get<unknown>(cacheKey);

    if (storedValue === null) {
      console.log(
        `[TG Ludico Service] Edizione assente in Redis: ${cacheKey}`
      );

      return null;
    }

    if (
      !isWeeklyEditionCacheValue(storedValue)
    ) {
      console.warn(
        `[TG Ludico Service] Cache non valida per ${cacheKey}.`
      );

      console.dir(storedValue, {
        depth: 2,
      });

      return null;
    }

    console.log(
      `[TG Ludico Service] Edizione letta da Redis: ${storedValue.edition.id}`
    );

    return storedValue.edition;
  } catch (error) {
    console.error(
      `[TG Ludico Service] Errore durante la lettura Redis: ${cacheKey}`
    );

    console.error(error);

    return null;
  }
}

/**
 * Salva l'intera edizione settimanale in Redis.
 */
async function saveWeeklyEdition(
  edition: TgLudicoWeeklyEdition
): Promise<void> {
  const cacheKey = getEditionCacheKey(
    edition.year,
    edition.week
  );

  const cacheValue: WeeklyEditionCacheValue = {
    version:
      WEEKLY_EDITION_CACHE_VERSION,
    generatedAt: new Date().toISOString(),
    edition,
  };

  try {
    await redis.set(cacheKey, cacheValue, {
      ex: WEEKLY_EDITION_CACHE_SECONDS,
    });

    console.log(
      `[TG Ludico Service] Edizione salvata in Redis: ${edition.id}`
    );
  } catch (error) {
    console.error(
      `[TG Ludico Service] Impossibile salvare l'edizione in Redis: ${edition.id}`
    );

    console.error(error);
  }
}

/**
 * Prova ad acquisire il lock distribuito.
 */
async function acquireEditionLock(
  options: WeeklyEditionOptions
): Promise<boolean> {
  const lockKey = getEditionLockKey(
    options.year,
    options.week
  );

  try {
    const result = await redis.set(
      lockKey,
      {
        createdAt: new Date().toISOString(),
      },
      {
        nx: true,
        ex: WEEKLY_EDITION_LOCK_SECONDS,
      }
    );

    return result === "OK";
  } catch (error) {
    console.error(
      `[TG Ludico Service] Errore durante l'acquisizione del lock: ${lockKey}`
    );

    console.error(error);

    /*
     * Se Redis non è disponibile, permettiamo comunque
     * la generazione per non bloccare la pagina.
     */
    return true;
  }
}

/**
 * Rimuove il lock di generazione.
 */
async function releaseEditionLock(
  options: WeeklyEditionOptions
): Promise<void> {
  const lockKey = getEditionLockKey(
    options.year,
    options.week
  );

  try {
    await redis.del(lockKey);
  } catch (error) {
    console.error(
      `[TG Ludico Service] Impossibile rimuovere il lock: ${lockKey}`
    );

    console.error(error);
  }
}

/**
 * Attende che una richiesta concorrente termini
 * la generazione e salvi l'edizione.
 */
async function waitForGeneratedEdition(
  options: WeeklyEditionOptions
): Promise<TgLudicoWeeklyEdition | null> {
  const startedAt = Date.now();

  console.log(
    "[TG Ludico Service] Un'altra richiesta sta generando l'edizione. Attendo..."
  );

  while (
    Date.now() - startedAt <
    LOCK_WAIT_TIMEOUT_MS
  ) {
    await sleep(LOCK_POLL_INTERVAL_MS);

    const storedEdition =
      await getStoredWeeklyEdition(options);

    if (storedEdition) {
      return storedEdition;
    }
  }

  console.warn(
    "[TG Ludico Service] Tempo massimo di attesa del lock superato."
  );

  return null;
}

/**
 * Genera e salva una nuova edizione.
 */
async function generateWeeklyEdition(
  options: WeeklyEditionOptions
): Promise<TgLudicoWeeklyEdition> {
  const {
    year,
    week,
    periodStart,
    periodEnd,
    limit = 5,
  } = options;

  console.log(
    `[TG Ludico Service] Recupero delle ${limit} notizie per l'edizione ${getEditionId(
      year,
      week
    )}...`
  );

  const articles =
    await getTgLudicoNews(limit);

  if (articles.length === 0) {
    throw new Error(
      "Non sono disponibili notizie per generare l'edizione settimanale."
    );
  }

  const edition =
    await buildWeeklyEdition({
      year,
      week,
      periodStart,
      periodEnd,
      articles,
    });

  await saveWeeklyEdition(edition);

  return edition;
}

/**
 * Restituisce l'edizione settimanale dalla cache
 * oppure la genera quando non è ancora presente.
 */
export async function getWeeklyEdition(
  options: WeeklyEditionOptions
): Promise<TgLudicoWeeklyEdition> {
  const storedEdition =
    await getStoredWeeklyEdition(options);

  if (storedEdition) {
    return storedEdition;
  }

  const hasLock =
    await acquireEditionLock(options);

  if (!hasLock) {
    const generatedEdition =
      await waitForGeneratedEdition(options);

    if (generatedEdition) {
      return generatedEdition;
    }

    const hasRetryLock =
      await acquireEditionLock(options);

    if (!hasRetryLock) {
      throw new Error(
        "Non è stato possibile ottenere il lock per generare l'edizione."
      );
    }
  }

  try {
    /*
     * Una seconda richiesta potrebbe aver salvato
     * l'edizione tra la prima lettura e il lock.
     */
    const editionCreatedMeanwhile =
      await getStoredWeeklyEdition(options);

    if (editionCreatedMeanwhile) {
      return editionCreatedMeanwhile;
    }

    return await generateWeeklyEdition(
      options
    );
  } finally {
    await releaseEditionLock(options);
  }
}

/**
 * Rigenera intenzionalmente l'edizione ignorando
 * il contenuto corrente della cache.
 */
export async function refreshWeeklyEdition(
  options: WeeklyEditionOptions
): Promise<TgLudicoWeeklyEdition> {
  const hasLock =
    await acquireEditionLock(options);

  if (!hasLock) {
    const generatedEdition =
      await waitForGeneratedEdition(options);

    if (generatedEdition) {
      return generatedEdition;
    }

    throw new Error(
      "È già in corso una generazione dell'edizione."
    );
  }

  try {
    console.log(
      `[TG Ludico Service] Rigenerazione forzata: ${getEditionId(
        options.year,
        options.week
      )}`
    );

    return await generateWeeklyEdition(
      options
    );
  } finally {
    await releaseEditionLock(options);
  }
}