import Link from "next/link";
import { articles } from "@/data/articles";

export default function LatestNews() {
  return (
    <section className="border-b border-brand-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Ultime notizie
            </p>

            <h2 className="mt-4 font-heading text-4xl uppercase text-white md:text-6xl">
              Dal mondo dei giochi da tavolo
            </h2>
          </div>

          <Link
            href="/notizie"
            className="font-semibold text-primary transition hover:text-primary-hover"
          >
            Vedi tutte le notizie →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {articles.slice(0, 3).map((item) => (
            <article
              key={item.slug}
              className="group overflow-hidden rounded-3xl border border-brand-border bg-surface transition hover:-translate-y-1 hover:border-primary"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(254,236,0,0.35),transparent_45%)]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-heading text-7xl text-primary/20">
                    LSD
                  </span>
                </div>
              </div>

              <div className="p-7">
                <span className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
                  {item.category}
                </span>

                <h3 className="mt-5 font-heading text-3xl uppercase leading-tight text-white">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-muted">
                  {item.excerpt}
                </p>

                <Link
                  href={`/notizie/${item.slug}`}
                  className="mt-6 inline-flex font-semibold text-primary transition group-hover:text-primary-hover"
                >
                  Leggi la notizia →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}