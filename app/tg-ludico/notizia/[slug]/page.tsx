import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getTgLudicoNews } from "@/lib/tg-ludico";

export const revalidate = 300;

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getArticle(slug: string) {
  const news = await getTgLudicoNews(5);

  return (
    news.find((item) => slugify(item.title) === slug) ?? null
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "Notizia non trovata | TG Ludico",
    };
  }

  return {
    title: `${article.title} | TG Ludico`,
    description: article.description,
    alternates: {
      canonical: `/tg-ludico/notizia/${slug}`,
    },
  };
}

export default async function TgLudicoArticlePage({
  params,
}: PageProps) {
  const { slug } = await params;

  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <Link
          href="/tg-ludico"
          className="inline-flex text-sm font-bold uppercase tracking-[0.15em] text-primary transition hover:text-primary-hover"
        >
          ← Torna al TG Ludico
        </Link>

        <header className="mt-10 border-b border-brand-border pb-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase text-black">
                  TG Ludico
                </span>

                <span className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
                  {article.source}
                </span>

                <time
                  dateTime={article.date}
                  className="text-sm text-muted"
                >
                  {formatDate(article.date)}
                </time>
              </div>

              <h1 className="mt-6 font-heading text-4xl uppercase leading-tight text-white md:text-6xl">
                {article.title}
              </h1>

              {article.description ? (
                <p className="mt-6 max-w-3xl text-lg leading-8 text-muted md:text-xl md:leading-9">
                  {article.description}
                </p>
              ) : null}
            </div>

            {article.image ? (
              <div className="flex shrink-0 justify-center md:justify-end">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-auto max-h-[220px] w-auto max-w-[220px] rounded-2xl border border-brand-border object-contain"
                />
              </div>
            ) : null}
          </div>
        </header>

        <footer className="mt-10">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-xl bg-primary px-6 py-3 font-bold text-black transition hover:bg-primary-hover"
          >
            Leggi la fonte originale ↗
          </a>

          <div className="mt-8 rounded-2xl border border-brand-border bg-surface px-5 py-4">
            <p className="text-sm leading-6 text-muted">
              <span className="font-bold text-primary">
                Nota sulle fonti:
              </span>{" "}
              Questa notizia proviene da una fonte editoriale
              esterna e rimane di proprietà del rispettivo autore
              o editore. Lo Spacca Dadi seleziona e rielabora il
              contenuto a scopo informativo. La fonte originale è
              disponibile tramite il collegamento qui sopra.
            </p>
          </div>
        </footer>
      </article>
    </main>
  );
}
