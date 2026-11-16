
import type { Metadata } from "next";

import { KickstarterUpdateCard } from "@/components/kickstarter/KickstarterUpdateCard";
import { getLatestKickstarterUpdates } from "@/lib/kickstarter-updates";

export const metadata: Metadata = {
  title: "Kickstarter Updates | Lo Spacca Dadi",
  description:
    "Gli ultimi aggiornamenti delle campagne Kickstarter di giochi da tavolo monitorate da Lo Spacca Dadi.",
};

export default async function KickstarterPage() {
  const updates = await getLatestKickstarterUpdates(100);

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      <header className="mb-12">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#FEEC00]">
          Crowdfunding
        </p>

        <h1 className="font-anton text-4xl uppercase leading-none sm:text-5xl">
          Kickstarter Updates
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-white/65">
          Tutte le ultime novità pubblicate dalle campagne
          Kickstarter che seguiamo, ordinate dalla più recente.
        </p>
      </header>

      {updates.length === 0 ? (
        <p className="text-white/65">
          Nessun aggiornamento disponibile al momento.
        </p>
      ) : (
        <div className="@container">
          <div className="grid grid-cols-1 gap-6 @min-[500px]:grid-cols-2 @min-[1100px]:grid-cols-4">
            {updates.map((update) => (
              <KickstarterUpdateCard
                key={update.id}
                update={update}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
