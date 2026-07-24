import "server-only";

import { writeWeeklyEditionArticles } from "@/lib/tg-ludico-weekly-edition-writer";

import type {
  TgLudicoItem,
  TgLudicoWeeklyEdition,
} from "@/lib/tg-ludico-types";

export type BuildWeeklyEditionOptions = {
  year: number;
  week: number;
  periodStart: string;
  periodEnd: string;
  articles: TgLudicoItem[];
};

/**
 * Costruisce un numero del TG Ludico.
 *
 * L'intera edizione viene generata con
 * una singola richiesta OpenAI.
 */
export async function buildWeeklyEdition(
  options: BuildWeeklyEditionOptions
): Promise<TgLudicoWeeklyEdition> {
  const {
    year,
    week,
    periodStart,
    periodEnd,
    articles,
  } = options;

  console.log(
    `[TG Ludico Weekly] Generazione edizione (${articles.length} articoli)...`
  );

  const generatedArticles =
    await writeWeeklyEditionArticles(articles);

  console.log(
    "[TG Ludico Weekly] Edizione completata."
  );

  return {
    id: `${year}-week-${String(week).padStart(2, "0")}`,
    year,
    week,
    title: `TG Ludico — Settimana ${week}`,
    publishedAt: new Date().toISOString(),
    periodStart,
    periodEnd,
    articles: generatedArticles,
  };
}