const campaigns = [
  {
    platform: "Gamefound",
    status: "Live",
    title: "Dungeon crawler fantasy",
    description:
      "Campagna cooperativa con miniature, progressione degli eroi e scenari narrativi.",
    gradient: "from-yellow-400/35 via-yellow-300/10 to-transparent",
    code: "DC",
  },
  {
    platform: "Kickstarter",
    status: "In arrivo",
    title: "Boss battler oscuro",
    description:
      "Combattimenti contro boss, sviluppo del gruppo e forte componente tattica.",
    gradient: "from-orange-400/30 via-yellow-300/10 to-transparent",
    code: "BB",
  },
  {
    platform: "Gamefound",
    status: "Da seguire",
    title: "Avventura sci-fi a campagna",
    description:
      "Esplorazione, scelte narrative e missioni collegate in un universo fantascientifico.",
    gradient: "from-amber-300/30 via-yellow-200/10 to-transparent",
    code: "SF",
  },
];

export default function CrowdfundingRadar() {
  return (
    <section
      id="crowdfunding"
      className="border-b border-brand-border bg-surface"
    >
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Crowdfunding Radar
          </p>

          <h2 className="mt-4 font-heading text-4xl uppercase text-white md:text-6xl">
            Le campagne da tenere d&apos;occhio
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted">
            Una selezione dedicata a Gamefound e Kickstarter, con priorità a
            dungeon crawler, boss battler, miniature e giochi narrativi.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <article
              key={campaign.title}
              className="group overflow-hidden rounded-3xl border border-brand-border bg-background transition hover:-translate-y-1 hover:border-primary"
            >
              <div
                className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${campaign.gradient}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(254,236,0,0.35),transparent_45%)]" />

                <span className="absolute left-5 top-5 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase text-black">
                  {campaign.status}
                </span>

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-heading text-7xl text-primary/20">
                    {campaign.code}
                  </span>
                </div>
              </div>

              <div className="p-7">
                <span className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
                  {campaign.platform}
                </span>

                <h3 className="mt-5 font-heading text-3xl uppercase leading-tight text-white">
                  {campaign.title}
                </h3>

                <p className="mt-4 leading-7 text-muted">
                  {campaign.description}
                </p>

                <a
                  href="#"
                  className="mt-6 inline-flex font-semibold text-primary transition group-hover:text-primary-hover"
                >
                  Scopri la campagna →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}