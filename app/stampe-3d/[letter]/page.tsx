import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  getAvailableLetters,
  getGamesByLetter,
} from "@/data/stampe-3d";

type PageProps = {
  params: Promise<{
    letter: string;
  }>;
};

export async function generateStaticParams() {
  return getAvailableLetters().map((letter) => ({
    letter: letter.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { letter } = await params;
  const normalizedLetter = letter.toUpperCase();

  const games = getGamesByLetter(normalizedLetter);

  if (games.length === 0) {
    return {
      title: "Stampe 3D",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `Stampe 3D - ${normalizedLetter}`,
    description: `Giochi da tavolo presenti nell'archivio Stampe 3D sotto la lettera ${normalizedLetter}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function Stampe3DLetterPage({
  params,
}: PageProps) {
  const { letter } = await params;

  const normalizedLetter = letter.toUpperCase();

  if (!/^[A-Z]$/.test(normalizedLetter)) {
    notFound();
  }

  const games = getGamesByLetter(normalizedLetter);

  if (games.length === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-white">
      <section className="border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Link
            href="/stampe-3d"
            className="text-sm font-semibold text-primary transition hover:text-primary-hover"
          >
            ← Torna all&apos;indice
          </Link>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Stampe 3D
          </p>

          <h1 className="mt-4 font-heading text-5xl uppercase md:text-7xl">
            Lettera {normalizedLetter}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            Seleziona un gioco per accedere alla sua raccolta di progetti per la
            stampa 3D.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
<div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">          {games.map((game) => (
            <Link
              key={game.slug}
              href={`/stampe-3d/game/${game.slug}`}
              className="group overflow-hidden rounded-3xl border border-brand-border bg-surface transition duration-300 hover:-translate-y-1 hover:border-primary"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-black">
                <Image
                  src={game.coverImage}
                  alt={`Scatola di ${game.name}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
                    {game.projects.length}{" "}
                    {game.projects.length === 1 ? "progetto" : "progetti"}
                  </p>

                  <h2 className="mt-2 font-heading text-2xl uppercase leading-tight text-white">
                    {game.name}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}