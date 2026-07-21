import Image from "next/image";

import type { GamefoundUpdate } from "@/lib/gamefound-updates";

type GamefoundUpdateCardProps = {
  update: GamefoundUpdate;
};

function isNewUpdate(publishedAt: string) {
  const publishedTime = new Date(publishedAt).getTime();
  const now = Date.now();

  if (!Number.isFinite(publishedTime)) {
    return false;
  }

  const difference = now - publishedTime;
  const twentyFourHours = 24 * 60 * 60 * 1000;

  return difference >= 0 && difference <= twentyFourHours;
}

function formatRelativeDate(dateString: string) {
  const publishedAt = new Date(dateString);
  const now = new Date();

  const differenceInMilliseconds =
    now.getTime() - publishedAt.getTime();

  const differenceInMinutes = Math.floor(
    differenceInMilliseconds / (1000 * 60)
  );

  const differenceInHours = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60)
  );

  const differenceInDays = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24)
  );

  if (differenceInMinutes < 1) {
    return "Adesso";
  }

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} min fa`;
  }

  if (differenceInHours < 24) {
    return `${differenceInHours} ${
      differenceInHours === 1 ? "ora" : "ore"
    } fa`;
  }

  if (differenceInDays === 1) {
    return "Ieri";
  }

  if (differenceInDays < 7) {
    return `${differenceInDays} giorni fa`;
  }

  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(publishedAt);
}

export function GamefoundUpdateCard({
  update,
}: GamefoundUpdateCardProps) {
  const isNew = isNewUpdate(update.publishedAt);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111111] transition duration-300 hover:-translate-y-1 hover:border-[#FEEC00]/60">
      <a
        href={update.url}
        target="_blank"
        rel="noreferrer"
        className="relative block aspect-[16/10] overflow-hidden bg-black"
        aria-label={`Leggi l'aggiornamento ${update.title}`}
      >
        {update.image ? (
          <Image
            src={update.image}
            alt={`Immagine dell'aggiornamento ${update.title}`}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white/50">
            Immagine non disponibile
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-[#FEEC00] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-black">
            Gamefound
          </span>

          {isNew ? (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-black">
              New
            </span>
          ) : null}
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

        {update.excerpt ? (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/65">
            {update.excerpt}
          </p>
        ) : null}

        <a
          href={update.url}
          target="_blank"
          rel="noreferrer"
          className="mt-auto pt-6 text-sm font-bold text-[#FEEC00] transition hover:text-white"
        >
          Leggi l&apos;aggiornamento →
        </a>
      </div>
    </article>
  );
}