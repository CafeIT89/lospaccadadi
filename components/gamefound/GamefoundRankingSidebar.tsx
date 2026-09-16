import Image from "next/image";

import rankingData from "@/data/gamefound-ranking.json";

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

export function GamefoundRankingSidebar() {
  const projects = rankingData.projects.slice(0, 5);

  return (
    <aside className="rounded-3xl border border-brand-border bg-surface p-5">
      <div className="border-b border-brand-border pb-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Gamefound
        </p>

        <h2 className="mt-2 font-heading text-2xl uppercase leading-tight tracking-[0.06em] text-white">
          Più finanziati
        </h2>
      </div>

      <div>
        {projects.map((project, index) => (
          <a
            key={project.url}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block border-b border-brand-border py-5 last:border-b-0"
          >
            {/* IMMAGINE */}
            <div className="relative mb-3 aspect-[16/9] overflow-hidden rounded-xl bg-background">
              <Image
                src={project.image}
                alt={project.name}
                fill
                sizes="240px"
                className="object-cover transition duration-300 group-hover:scale-105"
              />

              {/* POSIZIONE CLASSIFICA */}
              <div className="absolute left-2 top-2 flex h-9 min-w-9 items-center justify-center rounded-lg bg-background/90 px-2">
                <span className="font-heading text-xl leading-none text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* TITOLO */}
            <p className="text-sm font-semibold leading-5 tracking-[0.01em] text-white transition group-hover:text-primary">
              {project.name}
            </p>

            {/* DATI */}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-sm font-bold text-primary">
                {formatMoney(
                  project.fundsGathered,
                  project.currency
                )}
              </span>

              <span className="text-xs text-muted">
                {project.backerCount.toLocaleString("it-IT")} sostenitori
              </span>
            </div>
          </a>
        ))}
      </div>

      <a
        href="https://gamefound.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex text-xs font-bold uppercase tracking-[0.15em] text-primary transition hover:text-primary-hover"
      >
        Scopri Gamefound ↗
      </a>
    </aside>
  );
}