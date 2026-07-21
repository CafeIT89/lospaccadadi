import { GamefoundUpdateCard } from "./GamefoundUpdateCard";

import { getLatestGamefoundUpdates } from "@/lib/gamefound-updates";

export async function GamefoundUpdatesSection() {
  const updates = await getLatestGamefoundUpdates(4);

  if (updates.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="gamefound-updates-title"
      className="border-y border-white/10 bg-[#050505] py-16 sm:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#FEEC00]">
              Campagne in evidenza
            </p>

            <h2
              id="gamefound-updates-title"
              className="font-anton text-4xl uppercase leading-none text-white sm:text-5xl"
            >
              Gamefound Updates
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">
              Gli ultimi aggiornamenti pubblicati dalle campagne Gamefound che
              sto seguendo.
            </p>
          </div>

          <a
            href="https://gamefound.com"
            target="_blank"
            rel="noreferrer"
            className="w-fit text-sm font-bold text-[#FEEC00] transition hover:text-white"
          >
            Visita Gamefound →
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {updates.map((update) => (
            <GamefoundUpdateCard key={update.id} update={update} />
          ))}
        </div>
      </div>
    </section>
  );
}