import { fetchLatestProjectUpdate } from "./api";
import { GAMEFOUND_PROJECTS } from "./projects";

import type { GamefoundUpdate } from "./api";

export async function getLatestGamefoundUpdates(
  limit = 4
): Promise<GamefoundUpdate[]> {
  const results = await Promise.allSettled(
    GAMEFOUND_PROJECTS.map((project) =>
      fetchLatestProjectUpdate(project)
    )
  );

  const updates: GamefoundUpdate[] = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      if (result.value) {
        updates.push(result.value);
      }

      return;
    }

    const project = GAMEFOUND_PROJECTS[index];

    console.error(
      `Errore aggiornamenti Gamefound per ${
        project?.name ?? "progetto sconosciuto"
      }:`,
      result.reason
    );
  });

  return updates
    .filter((update) => {
      const timestamp = new Date(update.publishedAt).getTime();

      return Number.isFinite(timestamp);
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);
}

export type { GamefoundUpdate } from "./api";
export { GAMEFOUND_PROJECTS } from "./projects";