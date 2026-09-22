import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  getAvailableRiepiloghiLetters,
  getRiepiloghiByLetter,
} from "@/data/riepiloghi";

type PageProps = {
  params: Promise<{
    letter: string;
  }>;
};

export async function generateStaticParams() {
  return getAvailableRiepiloghiLetters().map((letter) => ({
    letter: letter.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { letter } = await params;
  const normalizedLetter = letter.toUpperCase();

 return {
  title: `Schede Regole - ${normalizedLetter}`,
  description: `Schede Regole dei giochi da tavolo sotto la lettera ${normalizedLetter}.`,

  alternates: {
    canonical: `/schede-regole/${letter.toLowerCase()}`,
  },

  robots: {
    index: true,
    follow: true,
  },
};
}

export default async function RiepiloghiLetterPage({
  params,
}: PageProps) {
  const { letter } = await params;
  const normalizedLetter = letter.toUpperCase();

  if (!/^[A-Z]$/.test(normalizedLetter)) {
    notFound();
  }

  const riepiloghi = getRiepiloghiByLetter(normalizedLetter);

  if (riepiloghi.length === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-white">
      <section className="border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Link
  href="/schede-regole"
  className="text-sm font-semibold text-primary transition hover:text-primary-hover"
>
  ← Torna all&apos;indice
</Link>
<p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-primary">
  Schede Regole
</p>

         <h1 className="mt-5 font-heading text-5xl uppercase md:text-7xl">
  Schede Regole
</h1>

         <p className="mt-6 max-w-3xl text-xl leading-8 text-muted">
  Schede di consultazione rapida per avere le regole essenziali dei tuoi
  giochi da tavolo sempre a portata di mano.
</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="space-y-4">
          {riepiloghi.map((riepilogo) => (
            <article
              key={riepilogo.slug}
              className="flex flex-col gap-5 rounded-2xl border border-brand-border bg-surface p-6 transition hover:border-primary md:flex-row md:items-center md:justify-between"
            >
              <div>
               <h2 className="font-heading text-2xl uppercase text-white md:text-3xl">
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
          ))}
        </div>
      </section>
    </main>
  );
}