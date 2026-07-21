import { getTgLudicoNews, type TgNewsItem } from "@/lib/tg-ludico";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TG Ludico",
  description:
    "Le principali notizie dal mondo dei giochi da tavolo selezionate ogni giorno da Lo Spacca Dadi.",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SecondaryNewsCard({ item }: { item: TgNewsItem }) {
  return (
    <article className="group flex min-h-[220px] flex-col rounded-3xl border border-brand-border bg-surface p-5 transition hover:-translate-y-1 hover:border-primary">
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-xs font-bold uppercase tracking-[0.12em] text-primary">
          {item.source}
        </span>

        <time
          dateTime={item.publishedAt}
          className="shrink-0 text-xs text-muted"
        >
          {formatDate(item.publishedAt)}
        </time>
      </div>

      <h2 className="mt-4 line-clamp-3 font-heading text-xl uppercase leading-tight text-white">
        {item.title}
      </h2>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
        {item.excerpt}
      </p>

      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex pt-4 text-sm font-semibold text-primary transition hover:text-primary-hover"
      >
        Leggi →
      </a>
    </article>
  );
}

export default async function TgLudicoPage() {
  const news = await getTgLudicoNews();

  const mainNews = news[0];
  const secondaryNews = news.slice(1, 5);

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              TG Ludico
            </p>

            <h1 className="mt-4 font-heading text-5xl uppercase leading-tight text-white md:text-7xl">
              Le notizie più importanti,
              <span className="text-primary"> senza rumore.</span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-muted">
              Notizie, annunci e aggiornamenti dal mondo dei giochi da tavolo,
              selezionati automaticamente.
            </p>
          </div>

          {!mainNews ? (
            <p className="mt-12 text-lg text-muted">
              Nessuna notizia disponibile.
            </p>
          ) : (
           <div className="mt-12 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
  <article className="group flex flex-col rounded-3xl border border-brand-border bg-surface p-8 transition hover:border-primary md:p-10">
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase text-black">
          In evidenza
        </span>

        <span className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
          {mainNews.source}
        </span>

        <time
          dateTime={mainNews.publishedAt}
          className="text-sm text-muted"
        >
          {formatDate(mainNews.publishedAt)}
        </time>
      </div>

      <h2 className="mt-6 line-clamp-3 font-heading text-4xl uppercase leading-tight text-white md:text-5xl">
        {mainNews.title}
      </h2>

      <p className="mt-5 line-clamp-5 text-base leading-7 text-muted md:text-lg md:leading-8">
        {mainNews.excerpt}
      </p>
    </div>

    <a
      href={mainNews.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-8 inline-flex w-fit rounded-xl bg-primary px-6 py-3 font-bold text-black transition hover:bg-primary-hover"
    >
      Leggi la notizia →
    </a>
  </article>

  <div className="grid gap-4 sm:grid-cols-2">
    {secondaryNews.map((item) => (
      <SecondaryNewsCard key={item.link} item={item} />
    ))}
  </div>
</div>
          )}
        </div>
      </section>
    </main>
  );
}