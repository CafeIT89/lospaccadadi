import Image from "next/image";
import Link from "next/link";

import { getSettimanaleVideos } from "@/lib/settimanale";

export default async function Settimanale() {
  const videos = await getSettimanaleVideos();
  const latestVideos = videos.slice(0, 4);

  return (
    <section
      id="settimanale"
      className="border-b border-brand-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Video settimanali
            </p>

            <h2 className="mt-4 font-heading text-4xl uppercase md:text-6xl">
              Il Settimanale
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Gli ultimi episodi pubblicati sul canale YouTube di Lo Spacca
              Dadi.
            </p>
          </div>

          <Link
            href="/settimanale"
            className="inline-flex w-fit rounded-xl bg-primary px-6 py-3 font-bold text-black transition hover:bg-primary-hover"
          >
            Guarda tutti gli episodi
          </Link>
        </div>

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
                  Il Settimanale
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
      </div>
    </section>
  );
}