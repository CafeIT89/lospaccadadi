const features = [
  {
    label: "TG LUDICO",
    title: "Il briefing quotidiano",
    description:
      "Le notizie più importanti dal mondo dei giochi da tavolo, selezionate e riassunte ogni giorno.",
    link: "Leggi il briefing →",
  },
  {
    label: "CROWDFUNDING",
    title: "Campaign Radar",
    description:
      "Kickstarter e Gamefound sotto osservazione, con focus su dungeon crawler, boss battler e giochi con miniature.",
    link: "Scopri le campagne →",
  },
  {
    label: "GIOCO DEL GIORNO",
    title: "Una scoperta al giorno",
    description:
      "Un titolo selezionato tra campagne, giochi narrativi, legacy, cooperativi e miniature.",
    link: "Scopri il gioco →",
  },
];

export default function FeatureCards() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-brand-border bg-surface p-6 transition hover:-translate-y-1 hover:bg-surface-light"
          >
            <span className="text-sm font-semibold text-primary">
              {feature.label}
            </span>

            <h3 className="mt-4 text-2xl font-bold">{feature.title}</h3>

            <p className="mt-3 text-zinc-400">{feature.description}</p>

            <a
              href="#"
              className="mt-6 inline-block font-semibold text-primary transition hover:text-primary-hover"
            >
              {feature.link}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}