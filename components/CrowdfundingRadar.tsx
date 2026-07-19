const campaigns = [
  {
    platform: "Gamefound",
    status: "Live",
    title: "Dungeon crawler fantasy",
    description:
      "Campagna cooperativa con miniature, progressione degli eroi e scenari narrativi.",
  },
  {
    platform: "Kickstarter",
    status: "In arrivo",
    title: "Boss battler oscuro",
    description:
      "Combattimenti contro boss, sviluppo del gruppo e forte componente tattica.",
  },
  {
    platform: "Gamefound",
    status: "Da seguire",
    title: "Avventura sci-fi a campagna",
    description:
      "Esplorazione, scelte narrative e missioni collegate in un universo fantascientifico.",
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
              className="rounded-3xl border border-brand-border bg-background p-7 transition hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
                  {campaign.platform}
                </span>

                <span className="rounded-full border border-brand-border px-3 py-1 text-xs font-semibold text-muted">
                  {campaign.status}
                </span>
              </div>

              <h3 className="mt-6 font-heading text-3xl uppercase leading-tight text-white">
                {campaign.title}
              </h3>

              <p className="mt-4 leading-7 text-muted">
                {campaign.description}
              </p>

              <a
                href="#"
                className="mt-6 inline-flex font-semibold text-primary transition hover:text-primary-hover"
              >
                Scopri la campagna →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}