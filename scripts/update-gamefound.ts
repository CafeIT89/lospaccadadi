import fs from "node:fs/promises";
import path from "node:path";

import { getLatestGamefoundUpdates } from "../lib/gamefound-updates";
import type { GamefoundUpdate } from "../lib/gamefound-updates/api";

const OUTPUT_PATH = path.join(
  process.cwd(),
  "data",
  "gamefound-updates.json"
);

async function readExistingUpdates(): Promise<GamefoundUpdate[]> {
  try {
    const content = await fs.readFile(
      OUTPUT_PATH,
      "utf8"
    );

    const parsed = JSON.parse(content) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as GamefoundUpdate[];
  } catch {
    return [];
  }
}

function mergeUpdates(
  existing: GamefoundUpdate[],
  fresh: GamefoundUpdate[]
): GamefoundUpdate[] {
  const updatesByProject = new Map<
    string,
    GamefoundUpdate
  >();

  /*
   * Inseriamo prima i dati già salvati.
   * Se una campagna fallisce oggi, il suo ultimo
   * aggiornamento conosciuto rimarrà disponibile.
   */
  for (const update of existing) {
    const key =
      update.projectSlug ||
      String(update.projectId);

    updatesByProject.set(key, update);
  }

  /*
   * I nuovi dati sovrascrivono quelli vecchi
   * soltanto per le campagne recuperate con successo.
   */
  for (const update of fresh) {
    const key =
      update.projectSlug ||
      String(update.projectId);

    updatesByProject.set(key, update);
  }

  return Array.from(updatesByProject.values())
    .filter((update) => {
      const timestamp = new Date(
        update.publishedAt
      ).getTime();

      return Number.isFinite(timestamp);
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
    );
}

async function main() {
  console.log(
    "[Gamefound GitHub] Recupero aggiornamenti avviato..."
  );

  const existingUpdates =
    await readExistingUpdates();

  console.log(
    `[Gamefound GitHub] Aggiornamenti già presenti: ${existingUpdates.length}`
  );

  const freshUpdates =
    await getLatestGamefoundUpdates(500);

  console.log(
    `[Gamefound GitHub] Aggiornamenti recuperati ora: ${freshUpdates.length}`
  );

  if (
    freshUpdates.length === 0 &&
    existingUpdates.length === 0
  ) {
    throw new Error(
      "Nessun aggiornamento Gamefound disponibile e nessun backup locale presente."
    );
  }

  const mergedUpdates = mergeUpdates(
    existingUpdates,
    freshUpdates
  );

  if (mergedUpdates.length === 0) {
    throw new Error(
      "Il merge degli aggiornamenti Gamefound ha prodotto zero risultati."
    );
  }

  await fs.writeFile(
    OUTPUT_PATH,
    `${JSON.stringify(
      mergedUpdates,
      null,
      2
    )}\n`,
    "utf8"
  );

  console.log(
    `[Gamefound GitHub] Totale aggiornamenti conservati: ${mergedUpdates.length}`
  );

  console.log(
    `[Gamefound GitHub] File aggiornato: ${OUTPUT_PATH}`
  );
}

main().catch((error) => {
  console.error(
    "[Gamefound GitHub] Aggiornamento fallito:",
    error
  );

  process.exit(1);
});