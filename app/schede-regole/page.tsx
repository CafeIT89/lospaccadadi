import Link from "next/link";
import type { Metadata } from "next";

import {
  getAvailableRiepiloghiLetters,
  getRiepiloghi,
} from "@/data/riepiloghi";

export const metadata: Metadata = {
  title: "Schede Regole",
  description:
    "Schede di consultazione rapida delle regole dei giochi da tavolo realizzate da Lo Spacca Dadi.",

  alternates: {
    canonical: "/schede-regole",
  },

  openGraph: {
    url: "/schede-regole",
  },

  robots: {
    index: true,
    follow: true,
  },
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function SchedeRegolePage() {
  const riepiloghi = getRiepiloghi();

  const availableLetters = new Set(
    getAvailableRiepiloghiLetters()
  );

  return (
    <main className="min-h-screen bg-background text-white">
      <section className="border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Archivio Lo Spacca Dadi
          </p>

          <h1 className="mt-5 font-heading text-5xl uppercase md:text-7xl">
            Schede Regole
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-8 text-muted">
            Schede di consultazione rapida per avere le regole essenziali
            dei tuoi giochi da tavolo sempre a portata di mano.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
          Esplora per lettera
        </p>

        <h2 className="mt-4 font-heading text-4xl uppercase md:text-5xl">
          Indice alfabetico
        </h2>

        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
          Seleziona una lettera per trovare il gioco che stai cercando.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {ALPHABET.map((letter) => {
            const isAvailable = availableLetters.has(letter);

            if (!isAvailable) {
              return (
                <span
                  key={letter}
                  className="flex h-12 w-12 cursor-not-allowed items-center justify-center rounded-xl border border-brand-border bg-background font-heading text-xl uppercase text-muted/40"
                  aria-disabled="true"
                >
                  {letter}
                </span>
              );
            }

            return (
              <Link
                key={letter}
                href={`/schede-regole#${letter.toLowerCase()}`}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary bg-background font-heading text-xl uppercase text-white transition hover:-translate-y-0.5 hover:bg-primary hover:text-black"
              >
                {letter}
              </Link>
            );
          })}
        </div>

       
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="space-y-4">
          {riepiloghi.map((riepilogo) => {
            const letter =
              riepilogo.name.charAt(0).toLowerCase();

            return (
              <article
                key={riepilogo.slug}
                id={letter}
                className="scroll-mt-28 flex flex-col gap-5 rounded-2xl border border-brand-border bg-surface p-6 transition hover:border-primary md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
                    Scheda Regole
                  </p>

                  <h2 className="mt-2 font-heading text-2xl uppercase text-white md:text-3xl">
                    {riepilogo.name} — Scheda Regole
                  </h2>

                  {riepilogo.description ? (
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {riepilogo.description}
                    </p>
                  ) : null}
                </div>

                <a
                  href={riepilogo.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary px-5 py-3 font-bold text-black transition hover:bg-primary-hover"
                >
                  Apri PDF ↗
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-3xl border border-brand-border bg-surface p-6 md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
            Nota
          </p>

          <h2 className="mt-3 font-heading text-2xl uppercase">
            Materiale non ufficiale
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-muted">
            Le Schede Regole presenti in questo archivio sono materiali
            non ufficiali realizzati da Lo Spacca Dadi come supporto alla
            consultazione durante il gioco. Non sostituiscono i regolamenti
            ufficiali dei rispettivi giochi. Per chiarimenti, aggiornamenti
            delle regole ed eventuali errata, fai sempre riferimento al
            regolamento e ai materiali ufficiali pubblicati
            dall&apos;editore.
          </p>
        </div>
      </section>
    </main>
  );
}