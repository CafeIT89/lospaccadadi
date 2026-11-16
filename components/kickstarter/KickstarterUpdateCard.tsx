
import type { KickstarterUpdate } from "@/lib/kickstarter-updates";

type KickstarterUpdateCardProps = {
  update: KickstarterUpdate;
};

function isNewUpdate(publishedAt: string) {
  const publishedTime = new Date(publishedAt).getTime();
  const difference = Date.now() - publishedTime;

  return (
    Number.isFinite(publishedTime) &&
    difference >= 0 &&
    difference <= 24 * 60 * 60 * 1000
  );
}

function formatRelativeDate(dateString: string) {
  const publishedAt = new Date(dateString);
  const difference = Date.now() - publishedAt.getTime();

  const minutes = Math.floor(difference / 60000);
  const hours = Math.floor(difference / 3600000);
  const days = Math.floor(difference / 86400000);

  if (minutes < 1) return "Adesso";
  if (minutes < 60) return `${minutes} min fa`;
  if (hours < 24) {
    return `${hours} ${hours === 1 ? "ora" : "ore"} fa`;
  }
  if (days === 1) return "Ieri";
  if (days < 7) return `${days} giorni fa`;

  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(publishedAt);
}

export function KickstarterUpdateCard({
  update,
}: KickstarterUpdateCardProps) {
  const isNew = isNewUpdate(update.publishedAt);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111111] transition duration-300 hover:-translate-y-1 hover:border-[#FEEC00]/60">
      <a
        href={update.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-[16/10] overflow-hidden bg-black"
        aria-label={`Leggi l'aggiornamento ${update.title}`}
      >
        {update.image ? (
          <img
            src={update.image}
            alt={`Immagine dell'aggiornamento ${update.title}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white/50">
            Immagine non disponibile
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-[#FEEC00] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-black">
            Kickstarter
          </span>

          {isNew && (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-black">
              New
            </span>
          )}
        </div>
      </a>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-[#FEEC00]">
            {update.projectName}
          </p>

          <time
            dateTime={update.publishedAt}
            className="shrink-0 text-xs text-white/50"
          >
            {formatRelativeDate(update.publishedAt)}
          </time>
        </div>

        <h3 className="text-xl font-bold leading-tight text-white">
          {update.title}
        </h3>

        {update.excerpt && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/65">
            {update.excerpt}
          </p>
        )}

        <a
          href={update.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto pt-6 text-sm font-bold text-[#FEEC00] transition hover:text-white"
        >
          Leggi l&apos;aggiornamento →
        </a>
      </div>
    </article>
  );
}
