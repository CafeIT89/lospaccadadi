import Image from "next/image";
import { getGamefoundProjects } from "@/lib/gamefound";

export default async function CrowdfundingRadar() {
  const campaigns = await getGamefoundProjects();

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
            Le campagne Gamefound più interessanti del momento, aggiornate
            automaticamente.
          </p>
        </div>

        {campaigns.length === 0 ? (
          <p className="mt-10 text-lg text-muted">
            Nessuna campagna disponibile.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {campaigns.map((campaign) => (
              <article
                key={campaign.url}
                className="group overflow-hidden rounded-3xl border border-brand-border bg-background transition hover:-translate-y-1 hover:border-primary"
              >
                <a
                  href={campaign.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={campaign.image}
                    alt={campaign.title}
                    width={800}
                    height={450}
                    className="aspect-video w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </a>

                <div className="p-6">
                  <span className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
                    Gamefound
                  </span>

                  <h3 className="mt-4 font-heading text-2xl uppercase leading-tight text-white">
                    {campaign.title}
                  </h3>

                  <p className="mt-4 line-clamp-4 text-sm leading-6 text-muted">
                    {campaign.description}
                  </p>

                  <div className="mt-5 space-y-1 text-sm text-muted">
                    <p>
                      <strong>Raccolti:</strong>{" "}
                      {campaign.raised.toLocaleString("it-IT")}{" "}
                      {campaign.currency}
                    </p>

                    <p>
                      <strong>Sostenitori:</strong>{" "}
                      {campaign.backers.toLocaleString("it-IT")}
                    </p>
                  </div>

                  <a
                    href={campaign.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex font-semibold text-primary transition hover:text-primary-hover"
                  >
                    Vai alla campagna →
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}