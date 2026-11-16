
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";

import { getCachedLatestYouTubeVideo } from "@/lib/youtube-service";
import { after } from "next/server";
import { refreshLatestYouTubeVideoIfNeeded } from "@/lib/youtube-auto-refresh";

export default async function Hero() {
  const latestVideo = await getCachedLatestYouTubeVideo();

  after(async () => {
    await refreshLatestYouTubeVideoIfNeeded();
  });

  return (
    <section className="@container relative min-w-0 overflow-hidden border-b border-brand-border bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(254,236,0,0.14),transparent_34%)]" />

      <div className="relative mx-auto grid min-w-0 max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 @min-[1100px]:min-h-[680px] @min-[1100px]:grid-cols-2 @min-[1100px]:gap-12 @min-[1100px]:px-8 @min-[1100px]:py-20">
        <div className="min-w-0">
          <h1 className="font-heading text-[clamp(2.5rem,7cqw,6rem)] uppercase leading-[0.95] tracking-tight text-white">
            Le notizie
            <br />
            <span className="text-primary">che contano.</span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-7 text-muted @min-[600px]:text-lg @min-[1100px]:text-xl @min-[1100px]:leading-8">
            Lo Spacca Dadi seleziona ogni giorno le notizie più importanti da
            BoardGameGeek, Kickstarter e Gamefound e le trasforma in un
            briefing rapido, chiaro e utile.
          </p>
        </div>

        {/* VIDEO E PULSANTI */}
        <div className="relative flex min-w-0 flex-col items-center gap-5 @min-[1100px]:items-end">
          <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-primary/20 blur-3xl @min-[600px]:h-80 @min-[600px]:w-80" />

          {latestVideo ? (
            <a
              href={latestVideo.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Guarda ${latestVideo.title} su YouTube`}
              className="group relative w-full max-w-xl min-w-0 overflow-hidden rounded-[2rem] border border-brand-border bg-surface/80 p-3 shadow-2xl shadow-black/50 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary"
            >
              <div className="relative aspect-video overflow-hidden rounded-[1.4rem] bg-black">
                <Image
                  src={latestVideo.thumbnail}
                  alt={latestVideo.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, (max-width: 1800px) 70vw, 600px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-black shadow-xl transition duration-300 group-hover:scale-110 group-hover:bg-white @min-[600px]:h-20 @min-[600px]:w-20">
                    <Play
                      size={34}
                      fill="currentColor"
                      className="ml-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 @min-[600px]:bottom-5 @min-[600px]:left-5">
                  <span className="rounded-full bg-black/70 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur @min-[600px]:px-4 @min-[600px]:text-xs @min-[600px]:tracking-[0.2em]">
                    Ultimo video • Lo Spacca Dadi
                  </span>
                </div>
              </div>
            </a>
          ) : (
            <div className="relative w-full max-w-xl min-w-0 rounded-[2rem] border border-brand-border bg-surface/80 p-8 text-center shadow-2xl shadow-black/50 backdrop-blur">
              <p className="font-heading text-2xl uppercase text-white">
                Lo Spacca Dadi
              </p>

              <p className="mt-3 text-sm leading-6 text-muted">
                L&apos;ultimo video non è momentaneamente disponibile.
              </p>
            </div>
          )}

          {/* PULSANTI AGGIORNAMENTI */}
          <div className="relative grid w-full max-w-xl grid-cols-1 gap-3 @min-[500px]:grid-cols-2">
            <Link
              href="/gamefound"
              className="group flex min-h-16 items-center justify-between gap-3 rounded-xl bg-[#FEEC00] px-4 py-3 text-black transition duration-300 hover:-translate-y-1 hover:bg-white"
            >
              <span className="text-sm font-bold leading-snug">
                Leggi gli aggiornamenti Gamefound
              </span>

              <ArrowUpRight
                size={22}
                className="shrink-0 transition group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden="true"
              />
            </Link>

            <Link
              href="/kickstarter"
              className="group flex min-h-16 items-center justify-between gap-3 rounded-xl border border-[#FEEC00] bg-[#111111] px-4 py-3 text-[#FEEC00] transition duration-300 hover:-translate-y-1 hover:bg-[#FEEC00] hover:text-black"
            >
              <span className="text-sm font-bold leading-snug">
                Leggi gli aggiornamenti Kickstarter
              </span>

              <ArrowUpRight
                size={22}
                className="shrink-0 transition group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
