import "server-only";

import { unstable_cache } from "next/cache";

export type KickstarterProject = {
  title: string;
  description: string;
  image: string;
  url: string;
  endDate: string;
  backers: number;
  raised: number;
  goal: number;
  currency: string;
};

type KickstarterPhoto = {
  full?: string;
  ed?: string;
  med?: string;
  little?: string;
};

type KickstarterCreator = {
  id?: number;
  name?: string;
  slug?: string;
};

type KickstarterWebUrls = {
  project?: string;
  rewards?: string;
};

type KickstarterUrls = {
  web?: KickstarterWebUrls;
};

type KickstarterApiProject = {
  id?: number;
  name?: string;
  blurb?: string;
  goal?: number;
  pledged?: number;
  state?: string;
  slug?: string;
  currency?: string;
  deadline?: number;
  backers_count?: number;
  photo?: KickstarterPhoto;
  creator?: KickstarterCreator;
  urls?: KickstarterUrls;
  category?: {
    id?: number;
    name?: string;
  };
};

type KickstarterApiResponse = {
  projects?: KickstarterApiProject[];
  total_hits?: number;
  has_more?: boolean;
};

const KICKSTARTER_API_URL =
  "https://www.kickstarter.com/discover/advanced.json" +
  "?sort=magic" +
  "&agg_fields=state" +
  "&category_id[]=34" +
  "&state[]=upcoming" +
  "&state[]=live" +
  "&state[]=late_pledge";

const CACHE_DURATION_SECONDS = 60 * 60;

function getProjectUrl(
  project: KickstarterApiProject
): string {
  const officialUrl =
    project.urls?.web?.project?.trim();

  if (officialUrl) {
    return officialUrl;
  }

  const creatorSlug =
    project.creator?.slug?.trim();

  const projectSlug =
    project.slug?.trim();

  if (creatorSlug && projectSlug) {
    return `https://www.kickstarter.com/projects/${creatorSlug}/${projectSlug}`;
  }

  return "";
}

function getProjectImage(
  project: KickstarterApiProject
): string {
  return (
    project.photo?.full ??
    project.photo?.ed ??
    project.photo?.med ??
    project.photo?.little ??
    ""
  );
}

function getEndDate(
  deadline: number | undefined
): string {
  if (
    typeof deadline !== "number" ||
    !Number.isFinite(deadline)
  ) {
    return "";
  }

  return new Date(
    deadline * 1000
  ).toISOString();
}
const KICKSTARTER_DISCOVER_URL =
  "https://www.kickstarter.com/discover/categories/games/tabletop%20games" +
  "?sort=magic" +
  "&agg_fields=state" +
  "&category_id[]=34" +
  "&state[]=upcoming" +
  "&state[]=live" +
  "&state[]=late_pledge";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/127.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9," +
    "image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
};

function getResponseCookies(response: Response): string {
  /*
   * Node/Undici espone getSetCookie(), ma TypeScript non lo
   * include sempre nella definizione standard di Headers.
   */
  const headersWithCookies = response.headers as Headers & {
    getSetCookie?: () => string[];
  };

  const setCookies =
    headersWithCookies.getSetCookie?.() ?? [];

  if (setCookies.length > 0) {
    return setCookies
      .map((cookie) => cookie.split(";")[0])
      .join("; ");
  }

  const singleHeader =
    response.headers.get("set-cookie");

  if (!singleHeader) {
    return "";
  }

  return singleHeader
    .split(/,(?=[^;,]+=)/)
    .map((cookie) => cookie.split(";")[0].trim())
    .join("; ");
}

async function createKickstarterSession(): Promise<string> {
  const response = await fetch(
    KICKSTARTER_DISCOVER_URL,
    {
      headers: BROWSER_HEADERS,
      cache: "no-store",
      redirect: "follow",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Impossibile inizializzare la sessione Kickstarter: ${response.status}`
    );
  }

  /*
   * Consumiamo il body affinché la connessione venga
   * completata correttamente prima della seconda richiesta.
   */
  await response.text();

  return getResponseCookies(response);
}
async function fetchKickstarterProjects(): Promise<
  KickstarterProject[]
> {
  try {
   const cookie = await createKickstarterSession();

const response = await fetch(
  KICKSTARTER_API_URL,
  {
    headers: {
      ...BROWSER_HEADERS,
      Accept: "application/json, text/javascript, */*; q=0.01",
      Referer: KICKSTARTER_DISCOVER_URL,
      "X-Requested-With": "XMLHttpRequest",
      ...(cookie
        ? {
            Cookie: cookie,
          }
        : {}),
    },
    cache: "no-store",
    redirect: "follow",
  }
);
console.log(
  `[Kickstarter] Risposta endpoint: ${response.status}; sessione: ${
    cookie ? "presente" : "assente"
  }`
);
    if (!response.ok) {
      throw new Error(
        `Kickstarter ha restituito lo stato ${response.status}`
      );
    }

    const data =
      (await response.json()) as KickstarterApiResponse;

    const projects =
      Array.isArray(data.projects)
        ? data.projects
        : [];

    return projects
      .filter((project) => {
        const url = getProjectUrl(project);
        const image = getProjectImage(project);

        return Boolean(
          project.name &&
            project.blurb &&
            url &&
            image
        );
      })
      .slice(0, 4)
      .map((project) => ({
        title: project.name ?? "",
        description: project.blurb ?? "",
        image: getProjectImage(project),
        url: getProjectUrl(project),
        endDate: getEndDate(
          project.deadline
        ),
        backers:
          project.backers_count ?? 0,
        raised: project.pledged ?? 0,
        goal: project.goal ?? 0,
        currency: project.currency ?? "",
      }));
  } catch (error) {
    console.error(
      "[Kickstarter] Errore nel caricamento automatico delle campagne:",
      error
    );

    return [];
  }
}

const getCachedKickstarterProjects =
  unstable_cache(
    fetchKickstarterProjects,
   [
  "kickstarter-tabletop-projects-v3",
],
    {
      revalidate:
        CACHE_DURATION_SECONDS,
      tags: ["kickstarter-projects"],
    }
  );

export async function getKickstarterProjects(): Promise<
  KickstarterProject[]
> {
  return fetchKickstarterProjects();
}