import { fetchLatestProjectUpdate } from "./api";
import { GAMEFOUND_PROJECTS } from "./projects";

import type { GamefoundUpdate } from "./api";

const GAMEFOUND_CONCURRENCY = 2;
const GAMEFOUND_MAX_ATTEMPTS = 3;
const GAMEFOUND_RETRY_BASE_DELAY_MS = 1500;

type SettledProjectResult = {
  index: number;
  result: PromiseSettledResult<GamefoundUpdate | null>;
};

function sleep(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function shouldRetry(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();

  return (
    message.includes("403") ||
    message.includes("429") ||
    message.includes("timeout") ||
    message.includes("fetch failed") ||
    message.includes("econnreset") ||
    message.includes("etimedout")
  );
}

async function fetchProjectWithRetry(
  projectIndex: number
): Promise<GamefoundUpdate | null> {
  const project = GAMEFOUND_PROJECTS[projectIndex];

  let lastError: unknown;

  for (
    let attempt = 1;
    attempt <= GAMEFOUND_MAX_ATTEMPTS;
    attempt += 1
  ) {
    try {
      if (attempt > 1) {
        console.log(
          `[Gamefound] Nuovo tentativo ${attempt}/${GAMEFOUND_MAX_ATTEMPTS} per ${project.name}`
        );
      }

      return await fetchLatestProjectUpdate(project);
    } catch (error) {
      lastError = error;

      const retryAllowed =
        attempt < GAMEFOUND_MAX_ATTEMPTS &&
        shouldRetry(error);

      if (!retryAllowed) {
        break;
      }

      const delay =
        GAMEFOUND_RETRY_BASE_DELAY_MS *
        Math.pow(2, attempt - 1);

      console.warn(
        `[Gamefound] Tentativo ${attempt}/${GAMEFOUND_MAX_ATTEMPTS} fallito per ${project.name}. Nuovo tentativo tra ${delay} ms.`
      );

      await sleep(delay);
    }
  }

  throw lastError;
}

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

      try {
        const value =
          await fetchProjectWithRetry(currentIndex);

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

      /*
       * Piccola pausa tra un progetto e il successivo
       * per evitare raffiche continue di richieste.
       */
      await sleep(500);
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