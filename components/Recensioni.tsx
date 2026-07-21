import Image from "next/image";
import Link from "next/link";

import { getRecensioni } from "@/lib/recensioni";

export default async function Recensioni() {
  const videos = await getRecensioni();
  const latestVideos = videos.slice(0, 4);

  return (
    <section className="border-t border-brand-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              I giochi sotto la lente
            </p>

            <h2 className="mt-4 font-heading text-4xl uppercase md:text-6xl">
              Recensioni
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Le ultime recensioni pubblicate sul canale Lo Spacca Dadi.
            </p>
          </div>

          <Link
            href="/recensioni"
            className="inline-flex w-fit rounded-xl bg-primary px-6 py-3 font-bold text-black transition hover:bg-primary-hover"
          >
            Guarda tutte le recensioni
          </Link>
        </div>

        {latestVideos.length === 0 ? (
          <p className="mt-12 text-lg text-muted">
            Nessuna recensione disponibile.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {latestVideos.map((video) => (
              <a
                key={video.videoId}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-3xl border border-brand-border bg-surface transition duration-300 hover:-translate-y-1 hover:border-primary"
              >
                <div className="relative aspect-video overflow-hidden bg-black">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                </div>

                <div className="flex min-h-44 flex-col p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    Recensione
                  </p>

                  <h3 className="mt-3 line-clamp-3 font-heading text-xl uppercase leading-tight text-white">
                    {video.title}
                  </h3>

                  <p className="mt-auto pt-5 text-sm text-muted">
                    {new Date(video.publishedAt).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}