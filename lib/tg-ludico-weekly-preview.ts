import "server-only";

import { getWeeklyEdition } from "@/lib/tg-ludico-service";

import type {
  TgLudicoWeeklyEdition,
} from "@/lib/tg-ludico-types";

export type WeeklyPreviewOptions = {
  year: number;
  week: number;
  periodStart: string;
  periodEnd: string;
  limit?: number;
};

/**
 * Restituisce l'anteprima dell'edizione settimanale.
 *
 * La logica di cache, lock e generazione è interamente
 * delegata al service.
 */
export async function getWeeklyEditionPreview(
  options: WeeklyPreviewOptions
): Promise<TgLudicoWeeklyEdition> {
  return getWeeklyEdition(options);
}