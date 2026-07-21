import Link from "next/link";
import { getTgLudicoNews } from "@/lib/tg-ludico";

export default async function TgLudico() {
  const news = await getTgLudicoNews(4);

  return (
    <section
      id="tg-ludico"
      className="border-b border-brand-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            TG Ludico
          </p>

          <h2 className="mt-4 font-heading text-4xl uppercase leading-tight text-white md:text-6xl">
            Le notizie più importanti,
            <span className="text-primary"> senza rumore.</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted">
            Le ultime notizie dal mondo dei giochi da tavolo, selezionate e
            aggiornate automaticamente da più fonti.
          </p>
        </div>

        {news.length === 0 ? (
          <p className="mt-10 text-lg text-muted">
            Nessuna notizia disponibile.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {news.map((item) => (
              <article
                key={item.link}
                className="group flex flex-col rounded-3xl border border-brand-border bg-surface p-6 transition hover:-translate-y-1 hover:border-primary"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
                    {item.source}
                  </span>

                  <time dateTime={item.date} className="text-xs text-muted">
                    {new Date(item.date).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </time>
                </div>

                <h3 className="mt-5 font-heading text-2xl uppercase leading-tight text-white">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="mt-4 line-clamp-5 text-sm leading-6 text-muted">
                    {item.description}
                  </p>
                )}

                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex pt-6 font-semibold text-primary transition hover:text-primary-hover"
                >
                  Leggi la notizia →
                </a>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10">
          <Link
            href="/tg-ludico"
            className="inline-flex rounded-xl bg-primary px-6 py-3 font-bold text-black transition hover:bg-primary-hover"
          >
            Leggi tutto il TG Ludico
          </Link>
        </div>
      </div>
    </section>
  );
}