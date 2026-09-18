import Image from "next/image";
import type { Metadata } from "next";
import rankingData from "@/data/gamefound-ranking.json";

export const metadata: Metadata = {
  title: "Gamefound - Più finanziati",
  description:
    "Le campagne di giochi da tavolo più finanziate attualmente su Gamefound.",
  alternates: {
    canonical: "/gamefound/piu-finanziati",
  },
};

function formatMoney(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${Math.round(value).toLocaleString("it-IT")} ${currency}`;
  }
}

export default function GamefoundPiuFinanziatiPage() {
  const projects = rankingData.projects;

  return (
    <main className="min-h-screen bg-background text-white">
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Gamefound
          </p>

          <h1 className="mt-4 font-heading text-5xl uppercase leading-tight md:text-7xl">
            Più finanziati
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Le campagne attive che stanno raccogliendo più fondi su
            Gamefound, ordinate per finanziamento totale.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <a
              key={project.url}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-3xl border border-brand-border bg-surface"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-background">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />

                <div className="absolute left-4 top-4 flex h-12 min-w-12 items-center justify-center rounded-xl bg-background/90 px-3">
                  <span className="font-heading text-2xl text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted">
                  {project.creator}
                </p>

                <h2 className="mt-2 text-xl font-bold leading-7 transition group-hover:text-primary">
                  {project.name}
                </h2>

                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <span className="text-lg font-bold text-primary">
                    {formatMoney(
                      project.fundsGathered,
                      project.currency
                    )}
                  </span>

                  <span className="text-sm text-muted">
                    {project.backerCount.toLocaleString("it-IT")} sostenitori
                  </span>
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-primary">
                  Vedi su Gamefound ↗
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}