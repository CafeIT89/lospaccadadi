import "server-only";

import { refreshWeeklyEdition } from "@/lib/tg-ludico-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type RomeDateParts = {
  year: number;
  month: number;
  day: number;
};

type IsoWeekData = {
  year: number;
  week: number;
  periodStart: string;
  periodEnd: string;
};

function getRomeDateParts(date = new Date()): RomeDateParts {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);

  const year = Number(
    parts.find((part) => part.type === "year")?.value
  );

  const month = Number(
    parts.find((part) => part.type === "month")?.value
  );

  const day = Number(
    parts.find((part) => part.type === "day")?.value
  );

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    throw new Error(
      "Impossibile determinare la data corrente per Europe/Rome."
    );
  }

  return {
    year,
    month,
    day,
  };
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Calcola settimana ISO e intervallo lunedì-domenica.
 *
 * Usiamo una data UTC costruita dai componenti del giorno
 * italiano, così il risultato non dipende dal fuso orario
 * della funzione Vercel.
 */
function getCurrentIsoWeek(): IsoWeekData {
  const {
    year,
    month,
    day,
  } = getRomeDateParts();

  const currentDate = new Date(
    Date.UTC(year, month - 1, day)
  );

  const isoDay =
    currentDate.getUTCDay() === 0
      ? 7
      : currentDate.getUTCDay();

  const periodStartDate = new Date(currentDate);
  periodStartDate.setUTCDate(
    currentDate.getUTCDate() - isoDay + 1
  );

  const periodEndDate = new Date(periodStartDate);
  periodEndDate.setUTCDate(
    periodStartDate.getUTCDate() + 6
  );

  /*
   * La settimana ISO appartiene all'anno che contiene
   * il giovedì della settimana corrente.
   */
  const thursday = new Date(currentDate);
  thursday.setUTCDate(
    currentDate.getUTCDate() + 4 - isoDay
  );

  const isoYear = thursday.getUTCFullYear();

  const firstThursday = new Date(
    Date.UTC(isoYear, 0, 4)
  );

  const firstThursdayIsoDay =
    firstThursday.getUTCDay() === 0
      ? 7
      : firstThursday.getUTCDay();

  firstThursday.setUTCDate(
    firstThursday.getUTCDate() +
      4 -
      firstThursdayIsoDay
  );

  const week =
    1 +
    Math.round(
      (thursday.getTime() -
        firstThursday.getTime()) /
        604_800_000
    );

  return {
    year: isoYear,
    week,
    periodStart: formatDate(periodStartDate),
    periodEnd: formatDate(periodEndDate),
  };
}

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.error(
      "[TG Ludico Refresh] CRON_SECRET non configurato."
    );

    return false;
  }

  const authorization =
    request.headers.get("authorization");

  return authorization === `Bearer ${secret}`;
}

export async function GET(
  request: Request
): Promise<Response> {
  if (!isAuthorized(request)) {
    return Response.json(
      {
        success: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const startedAt = Date.now();

  try {
    const {
      year,
      week,
      periodStart,
      periodEnd,
    } = getCurrentIsoWeek();

    console.log(
      `[TG Ludico Refresh] Avvio rigenerazione ${year}-week-${String(
        week
      ).padStart(2, "0")}...`
    );

    const edition =
      await refreshWeeklyEdition({
        year,
        week,
        periodStart,
        periodEnd,
        limit: 5,
      });

    const durationMs =
      Date.now() - startedAt;

    console.log(
      `[TG Ludico Refresh] Rigenerazione completata in ${durationMs} ms: ${edition.id}`
    );

    return Response.json({
      success: true,
      editionId: edition.id,
      year: edition.year,
      week: edition.week,
      periodStart: edition.periodStart,
      periodEnd: edition.periodEnd,
      articles: edition.articles.length,
      generatedAt: edition.publishedAt,
      durationMs,
    });
  } catch (error) {
    const durationMs =
      Date.now() - startedAt;

    console.error(
      "[TG Ludico Refresh] Rigenerazione fallita."
    );

    console.error(error);

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Errore sconosciuto durante la rigenerazione.",
        durationMs,
      },
      {
        status: 500,
      }
    );
  }
}