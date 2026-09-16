import Link from "next/link";

import { getTgLudicoNews } from "@/lib/tg-ludico";

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function TgLudicoSidebar() {
  const news = await getTgLudicoNews(5);

  return (
    <aside className="rounded-3xl border border-brand-border bg-surface p-5">
      <div className="border-b border-brand-border pb-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Le ultime notizie
        </p>

        <h2 className="mt-2 font-heading text-2xl uppercase leading-tight tracking-[0.06em] text-white">
          TG Ludico
        </h2>
      </div>

      <div className="mt-2">
        {news.map((article, index) => {
          const slug = slugify(article.title);

          return (
            <Link
              key={`${article.link}-${index}`}
              href={`/tg-ludico/notizia/${slug}`}
              className="group block border-b border-brand-border py-5 last:border-b-0"
            >
              <h3 className="text-sm font-bold leading-5 text-white transition group-hover:text-primary">
                {article.title}
              </h3>
            </Link>
          );
        })}
      </div>

      <Link
        href="/tg-ludico"
        className="mt-4 inline-flex text-xs font-bold uppercase tracking-[0.15em] text-primary transition hover:text-primary-hover"
      >
        Tutte le notizie →
      </Link>
    </aside>
  );
}