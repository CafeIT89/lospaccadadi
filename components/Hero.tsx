import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-brand-border bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(254,236,0,0.14),transparent_34%)]" />

      <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="inline-flex rounded-full border border-brand-border bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            IA per i giochi da tavolo
          </span>

          <h1 className="mt-8 max-w-3xl font-heading text-6xl uppercase leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
            Le notizie
            <br />
            <span className="text-primary">che contano.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-muted md:text-xl">
            Lo Spacca Dadi seleziona ogni giorno le notizie più importanti
            da BoardGameGeek, Kickstarter e Gamefound e le trasforma in un
            briefing rapido, chiaro e utile.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#tg-ludico"
              className="rounded-xl bg-primary px-6 py-3 text-center font-bold text-black transition hover:bg-primary-hover"
            >
              Leggi il TG Ludico
            </a>

            <a
              href="#crowdfunding"
              className="rounded-xl border border-brand-border px-6 py-3 text-center font-semibold text-primary transition hover:bg-primary/10"
            >
              Crowdfunding Radar
            </a>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative rounded-[2rem] border border-brand-border bg-surface/80 p-6 shadow-2xl shadow-black/50 backdrop-blur">
            <Image
              src="/logo-spaccadadi.png"
              alt="Logo Lo Spacca Dadi"
              width={520}
              height={520}
              className="h-auto w-full max-w-md rounded-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}