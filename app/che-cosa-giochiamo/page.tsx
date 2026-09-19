import Image from "next/image";
import type { Metadata } from "next";
import { games } from "@/lib/daily-games";

export const metadata: Metadata = {
  title: "Che cosa giochiamo?",
  description:
    "I giochi da tavolo che stiamo portando sul tavolo in questo periodo a Lo Spacca Dadi.",
  alternates: {
    canonical: "/che-cosa-giochiamo",
  },
};

export default function CheCosaGiochiamoPage() {
  return (
    <main className="min-h-screen bg-background text-white">
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Sul nostro tavolo
          </p>

          <h1 className="mt-4 font-heading text-5xl uppercase leading-tight md:text-7xl">
            Che cosa giochiamo?
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            I giochi che stiamo portando sul tavolo in questo periodo.
            Campagne, avventure e titoli che ci stanno accompagnando nelle
            nostre serate di gioco.
          </p>

          <p className="mt-4 text-sm leading-6 text-muted">
            Ogni giorno ne selezioniamo 5 casualmente per la homepage.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <a
              key={game.url}
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-3xl border border-brand-border bg-surface"
            >
              <div className="flex h-80 items-center justify-center bg-background p-6">
                <div className="relative h-full w-full">
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain transition duration-300 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="p-5">
                <h2 className="text-lg font-bold leading-6 transition group-hover:text-primary">
                  {game.title}
                </h2>

                <p className="mt-3 text-xs font-bold uppercase tracking-[0.15em] text-primary">
                  BoardGameGeek ↗
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}