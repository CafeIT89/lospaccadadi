import { getGamefoundProjects } from "@/lib/gamefound";
import {
  getCachedKickstarterProjects,
} from "@/lib/kickstarter-service";

type CrowdfundingCampaign = {
  title: string;
  description: string;
  image: string;
  url: string;
  endDate: string;
  backers: number;
  raised: number;
  goal: number;
  currency: string;
  platform: "Gamefound" | "Kickstarter";
};

type CampaignCardProps = {
  campaign: CrowdfundingCampaign;
};

function CampaignCard({
  campaign,
}: CampaignCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-border bg-background transition hover:-translate-y-1 hover:border-primary">
      <a
        href={campaign.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden bg-black"
      >
        {campaign.image ? (
          <img
  src={campaign.image}
  alt={campaign.title}
  width={1200}
  height={675}
  loading="lazy"
  className={`aspect-video w-full object-cover transition duration-300 group-hover:scale-105 ${
    campaign.platform === "Kickstarter"
      ? "brightness-110 contrast-105"
      : ""
  }`}
/>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-surface px-6 text-center text-sm font-bold uppercase tracking-[0.15em] text-muted">
            Immagine non disponibile
          </div>
        )}
      </a>

      <div className="flex flex-1 flex-col p-6">
        <span className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
          {campaign.platform}
        </span>

        <h3 className="mt-4 line-clamp-3 min-h-[5.25rem] font-heading text-2xl uppercase leading-tight text-white">
          {campaign.title}
        </h3>

        {campaign.description ? (
          <p className="mt-4 line-clamp-4 text-sm leading-6 text-muted">
            {campaign.description}
          </p>
        ) : null}

        <div className="mt-5 space-y-1 text-sm text-muted">
          {campaign.raised > 0 ? (
            <p>
              <strong className="text-white">
                Raccolti:
              </strong>{" "}
              {campaign.raised.toLocaleString(
                "it-IT"
              )}{" "}
              {campaign.currency}
            </p>
          ) : null}

          {campaign.backers > 0 ? (
            <p>
              <strong className="text-white">
                Sostenitori:
              </strong>{" "}
              {campaign.backers.toLocaleString(
                "it-IT"
              )}
            </p>
          ) : null}
        </div>

        <a
          href={campaign.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex pt-6 font-semibold text-primary transition hover:text-primary-hover"
        >
          Vai alla campagna →
        </a>
      </div>
    </article>
  );
}

export default async function CrowdfundingRadar() {
  const [
    gamefoundResult,
    kickstarterResult,
  ] = await Promise.allSettled([
    getGamefoundProjects(),
   getCachedKickstarterProjects(),
  ]);

  const gamefoundCampaigns =
    gamefoundResult.status === "fulfilled"
      ? gamefoundResult.value
          .slice(0, 4)
          .map(
            (
              campaign
            ): CrowdfundingCampaign => ({
              ...campaign,
              platform: "Gamefound",
            })
          )
      : [];

  const kickstarterCampaigns =
    kickstarterResult.status === "fulfilled"
      ? kickstarterResult.value
          .slice(0, 4)
          .map(
            (
              campaign
            ): CrowdfundingCampaign => ({
              ...campaign,
              platform: "Kickstarter",
            })
          )
      : [];

  if (gamefoundResult.status === "rejected") {
    console.error(
      "[Crowdfunding Radar] Errore Gamefound:",
      gamefoundResult.reason
    );
  }

  if (
    kickstarterResult.status === "rejected"
  ) {
    console.error(
      "[Crowdfunding Radar] Errore Kickstarter:",
      kickstarterResult.reason
    );
  }

  const hasCampaigns =
    gamefoundCampaigns.length > 0 ||
    kickstarterCampaigns.length > 0;

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
            Le campagne di crowdfunding più
            interessanti del momento
          </p>
        </div>

        {!hasCampaigns ? (
          <p className="mt-10 text-lg text-muted">
            Nessuna campagna disponibile.
          </p>
        ) : (
          <div className="mt-12 space-y-14">
            <section>
              <div className="flex items-center gap-4">
                <h3 className="font-heading text-3xl uppercase text-white">
                  Gamefound
                </h3>

                <span className="rounded-full border border-primary px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-primary">
                  {gamefoundCampaigns.length}/4
                </span>
              </div>

              {gamefoundCampaigns.length ===
              0 ? (
                <p className="mt-6 text-muted">
                  Le campagne Gamefound non sono
                  momentaneamente disponibili.
                </p>
              ) : (
                <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {gamefoundCampaigns.map(
                    (campaign) => (
                      <CampaignCard
                        key={`gamefound-${campaign.url}`}
                        campaign={campaign}
                      />
                    )
                  )}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-4">
                <h3 className="font-heading text-3xl uppercase text-white">
                  Kicktraq per Kickstarter
                </h3>

                <span className="rounded-full border border-primary px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-primary">
                  {kickstarterCampaigns.length}/4
                </span>
              </div>

              {kickstarterCampaigns.length ===
              0 ? (
                <p className="mt-6 text-muted">
                  Le campagne Kickstarter non sono
                  momentaneamente disponibili.
                </p>
              ) : (
                <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {kickstarterCampaigns.map(
                    (campaign) => (
                      <CampaignCard
                        key={`kickstarter-${campaign.url}`}
                        campaign={campaign}
                      />
                    )
                  )}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </section>
  );
}