
import "server-only";

import { fetchKickstarterProjectUpdates } from "./api";
import { KICKSTARTER_PROJECTS } from "./projects";

import type { KickstarterUpdate } from "./api";

export async function getLatestKickstarterUpdates(
  limit = 4
): Promise<KickstarterUpdate[]> {
  const results = await Promise.allSettled(
    KICKSTARTER_PROJECTS.map((project) =>
      fetchKickstarterProjectUpdates(project)
    )
  );

  const updates: KickstarterUpdate[] = [];

  results.forEach((result, index) => {
    const project = KICKSTARTER_PROJECTS[index];

    if (result.status === "fulfilled") {
      const projectUpdates = result.value;

      // Cerca un'immagine negli aggiornamenti dello stesso gioco.
      // Se non esiste, utilizza la copertina configurata.
      const fallbackImage =
        projectUpdates.find((update) => update.image)?.image ??
        project.fallbackImage ??
        null;

      updates.push(
        ...projectUpdates.map((update) => ({
          ...update,
          image: update.image ?? fallbackImage,
        }))
      );

      return;
    }

    console.error(
      `[Kickstarter Updates] Errore per ${project.name}:`,
      result.reason
    );
  });

  const seen = new Set<string>();

  return updates
    .filter((update) => {
      const timestamp = new Date(update.publishedAt).getTime();

      if (!Number.isFinite(timestamp)) {
        return false;
      }

      if (seen.has(update.id)) {
        return false;
      }

      seen.add(update.id);
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);
}

export type { KickstarterUpdate } from "./api";

export { KICKSTARTER_PROJECTS } from "./projects";
