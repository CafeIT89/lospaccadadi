import type { Metadata } from "next";

import { GamefoundUpdateCard } from "@/components/gamefound/GamefoundUpdateCard";
import { getLatestGamefoundUpdates } from "@/lib/gamefound-updates";

export const metadata: Metadata = {
  title: "Gamefound Updates | Lo Spacca Dadi",
  description:
    "Gli ultimi aggiornamenti delle campagne di giochi da tavolo monitorate su Gamefound.",
};

export const revalidate = 3600;

export default async function GamefoundPage() {
  const updates = await getLatestGamefoundUpdates(21);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#FEEC00]">
            Crowdfunding
          </p>

          <h1 className="font-anton text-4xl uppercase leading-none sm:text-5xl lg:text-7xl">
            Gamefound Updates
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
            Gli ultimi aggiornamenti pubblicati dalle campagne Gamefound
            monitorate da Lo Spacca Dadi, ordinati dal più recente.
          </p>
        </div>

        {updates.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {updates.map((update) => (
              <GamefoundUpdateCard
                key={`${update.projectId}-${update.id}`}
                update={update}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-white/10 bg-[#111111] p-8 text-center">
            <p className="text-lg font-semibold text-white">
              Nessun aggiornamento disponibile
            </p>

            <p className="mt-2 text-sm leading-6 text-white/60">
              Al momento non è stato possibile recuperare gli aggiornamenti da
              Gamefound. Riprova più tardi.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}