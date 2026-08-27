import Link from "next/link";

import { GamefoundUpdateCard } from "@/components/gamefound/GamefoundUpdateCard";
import type { GamefoundUpdate } from "@/lib/gamefound-updates/api";
import gamefoundUpdatesData from "@/data/gamefound-updates.json";

export function GamefoundUpdatesSection() {
  const updates = (
    gamefoundUpdatesData as GamefoundUpdate[]
  )
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
    )
    .slice(0, 4);

  if (updates.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#FEEC00]">
            Crowdfunding
          </p>

          <h2 className="font-anton text-3xl uppercase leading-none sm:text-4xl lg:text-5xl">
            Gamefound Updates
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">
            Gli ultimi aggiornamenti pubblicati dalle campagne Gamefound
            monitorate da Lo Spacca Dadi.
          </p>
        </div>

        <Link
          href="/gamefound"
          className="shrink-0 text-sm font-bold uppercase tracking-wider text-[#FEEC00] transition hover:text-white"
        >
          Tutti gli aggiornamenti →
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {updates.map((update) => (
          <GamefoundUpdateCard
            key={`${update.projectId}-${update.id}`}
            update={update}
          />
        ))}
      </div>
    </section>
  );
}