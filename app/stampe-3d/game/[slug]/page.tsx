import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  getStampe3DGame,
  getStampe3DGames,
} from "@/data/stampe-3d";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getStampe3DGames().map((game) => ({
    slug: game.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getStampe3DGame(slug);

  if (!game) {
    return {
      title: "Stampe 3D",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `Stampe 3D - ${game.name}`,
    description: `Raccolta di progetti per la stampa 3D dedicati a ${game.name}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function Stampe3DGamePage({
  params,
}: PageProps) {
  const { slug } = await params;
  const game = getStampe3DGame(slug);

  if (!game) {
    notFound();
  }

  const letter = game.name.charAt(0).toLowerCase();

  return (
    <main className="min-h-screen bg-background text-white">
      <header className="border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Link
              href="/stampe-3d"
              className="text-sm font-semibold text-primary transition hover:text-primary-hover"
            >
              ← Stampe 3D
            </Link>

            <Link
              href={`/stampe-3d/${letter}`}
              className="text-sm font-semibold text-primary transition hover:text-primary-hover"
            >
              ← Lettera {letter.toUpperCase()}
            </Link>
          </div>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Raccolta Stampe 3D
          </p>

          <h1 className="mt-4 font-heading text-5xl uppercase md:text-7xl">
            {game.name}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            Progetti e risorse per la stampa 3D dedicati a {game.name},
            selezionati e raccolti manualmente da Lo Spacca Dadi.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16">
        {game.projects.length === 0 ? (
          <div className="rounded-3xl border border-brand-border bg-surface p-8">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
              Raccolta in preparazione
            </p>

            <h2 className="mt-4 font-heading text-3xl uppercase">
              I progetti arriveranno presto
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-muted">
              Questa raccolta non contiene ancora progetti. Stiamo preparando
              una selezione di risorse dedicate a {game.name}.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {game.projects.map((project) => (
             <article
  key={project.url}
  className="group flex min-h-72 flex-col rounded-3xl border border-brand-border bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-primary"
>
  <div className="flex flex-wrap gap-2">
    <span className="rounded-full border border-primary/40 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-primary">
      {project.category}
    </span>

    <span className="rounded-full border border-brand-border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
      {project.platform}
    </span>
  </div>

  <h2 className="mt-5 font-heading text-2xl uppercase leading-tight">
    {project.title}
  </h2>

  <p className="mt-4 text-sm leading-6 text-muted">
    {project.description}
  </p>

  <a
    href={project.url}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-auto pt-6 font-semibold text-primary transition hover:text-primary-hover"
  >
    Vai al progetto ↗
  </a>
</article>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-brand-border">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="max-w-4xl text-sm leading-7 text-muted">
            I progetti presenti in questa raccolta appartengono ai rispettivi
            autori. Lo Spacca Dadi raccoglie esclusivamente collegamenti alle
            pagine originali e non riceve compensi o commissioni dai link
            pubblicati, salvo ove esplicitamente indicato.
          </p>
        </div>
      </section>
    </main>
  );
}