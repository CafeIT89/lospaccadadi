import { fetchLatestProjectUpdate } from "./api";
import { GAMEFOUND_PROJECTS } from "./projects";

import type { GamefoundUpdate } from "./api";

const GAMEFOUND_CONCURRENCY = 4;

type SettledProjectResult = {
  index: number;
  result: PromiseSettledResult<GamefoundUpdate | null>;
};

async function runWithConcurrencyLimit(
  concurrency: number
): Promise<SettledProjectResult[]> {
  const results: SettledProjectResult[] = [];
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const currentIndex = nextIndex;

      if (currentIndex >= GAMEFOUND_PROJECTS.length) {
        return;
      }

      nextIndex += 1;

      const project = GAMEFOUND_PROJECTS[currentIndex];

      try {
        const value =
          await fetchLatestProjectUpdate(project);

        results.push({
          index: currentIndex,
          result: {
            status: "fulfilled",
            value,
          },
        });
      } catch (reason) {
        results.push({
          index: currentIndex,
          result: {
            status: "rejected",
            reason,
          },
        });
      }
    }
  }

  const workerCount = Math.min(
    concurrency,
    GAMEFOUND_PROJECTS.length
  );

  await Promise.all(
    Array.from(
      { length: workerCount },
      () => worker()
    )
  );

  return results.sort(
    (a, b) => a.index - b.index
  );
}

export async function getLatestGamefoundUpdates(
  limit = 4
): Promise<GamefoundUpdate[]> {
  const settledResults =
    await runWithConcurrencyLimit(
      GAMEFOUND_CONCURRENCY
    );

  const updates: GamefoundUpdate[] = [];

  settledResults.forEach(
    ({ index, result }) => {
      if (result.status === "fulfilled") {
        if (result.value) {
          updates.push(result.value);
        }

        return;
      }

      const project =
        GAMEFOUND_PROJECTS[index];

      console.error(
        `Errore aggiornamenti Gamefound per ${
          project?.name ??
          "progetto sconosciuto"
        }:`,
        result.reason
      );
    }
  );

  return updates
    .filter((update) => {
      const timestamp = new Date(
        update.publishedAt
      ).getTime();

      return Number.isFinite(timestamp);
    })
    .sort(
      (a, b) =>
        new Date(
          b.publishedAt
        ).getTime() -
        new Date(
          a.publishedAt
        ).getTime()
    )
    .slice(0, limit);
}

export type {
  GamefoundUpdate,
} from "./api";

export {
  GAMEFOUND_PROJECTS,
} from "./projects";