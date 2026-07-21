import * as cheerio from "cheerio";

import type { GamefoundProject } from "./projects";

const GAMEFOUND_BASE_URL = "https://gamefound.com";

const UPDATES_WITH_UNUSABLE_IMAGE = new Set([
  "https://gamefound.com/en/projects/devir/claustrophobia-1692/updates/20",
  "https://gamefound.com/en/projects/indie-boards-and-cards/aeons-end-system-overload/updates/14",
]);

type GamefoundInitialState = {
  analyticsConfig?: {
    project?: {
      projectID?: number;
    };
  };
};

type GamefoundApiUpdate = {
  abstract: string | null;
  content: string | null;
  hasImage: boolean;
  imageUrl: string | null;
  projectUpdateUrl: string;
  createdAt: string;
  publishedAt: string | null;
  projectID: number;
  projectUpdateID: number;
  sequenceNumber: number;
  title: string;
  isPublished: boolean;
  status: number;
};

type GamefoundUpdatesResponse = {
  pagedItems: GamefoundApiUpdate[];
  totalItemCount: number;
};

type GamefoundPublicProjectResponse = {
  projectImageUrl?: string | null;
};

export type GamefoundUpdate = {
  id: number;
  projectId: number;
  projectName: string;
  projectCreator: string;
  projectSlug: string;
  title: string;
  excerpt: string;
  image: string | null;
  publishedAt: string;
  url: string;
  sequenceNumber: number;
};

function getProjectPageUrl(project: GamefoundProject) {
  return `${GAMEFOUND_BASE_URL}/en/projects/${project.creator}/${project.slug}/updates`;
}

function normalizeImageUrl(imageUrl: string | null | undefined) {
  if (!imageUrl) {
    return null;
  }

  const cleanedUrl = imageUrl
    .trim()
    .replace(/&amp;/g, "&")
    .replace(/^["']|["']$/g, "");

  if (!cleanedUrl || cleanedUrl.startsWith("data:")) {
    return null;
  }

  try {
    return new URL(cleanedUrl, GAMEFOUND_BASE_URL).toString();
  } catch {
    return null;
  }
}

function extractFirstImageFromContent(content: string | null) {
  if (!content) {
    return null;
  }

  const $ = cheerio.load(content);
  const imageElements = $("img").toArray();

  for (const element of imageElements) {
    const imageElement = $(element);

    const possibleSources = [
      imageElement.attr("src"),
      imageElement.attr("data-src"),
      imageElement.attr("data-original"),
      imageElement.attr("data-lazy-src"),
      imageElement.attr("data-image"),
    ];

    for (const source of possibleSources) {
      const normalizedUrl = normalizeImageUrl(source);

      if (normalizedUrl) {
        return normalizedUrl;
      }
    }

    const srcset =
      imageElement.attr("srcset") ??
      imageElement.attr("data-srcset") ??
      imageElement.attr("data-lazy-srcset");

    if (srcset) {
      const sources = srcset
        .split(",")
        .map((item) => item.trim().split(/\s+/)[0])
        .filter(Boolean)
        .reverse();

      for (const source of sources) {
        const normalizedUrl = normalizeImageUrl(source);

        if (normalizedUrl) {
          return normalizedUrl;
        }
      }
    }
  }

  return null;
}

async function getProjectId(
  project: GamefoundProject
): Promise<number> {
  if (project.projectId) {
    return project.projectId;
  }

  const pageUrl = getProjectPageUrl(project);

  const response = await fetch(pageUrl, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent":
        "Mozilla/5.0 (compatible; LoSpaccaDadi/1.0; +https://lospaccadadi.it)",
    },
    next: {
      revalidate: 60 * 60 * 24,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Impossibile recuperare ${project.name}: ${response.status} ${response.statusText}`
    );
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const initialStateScript = $("script")
    .toArray()
    .map((element) => $(element).html()?.trim() ?? "")
    .find((content) => content.startsWith("window.__INITIAL_STATE__"));

  if (!initialStateScript) {
    throw new Error(
      `window.__INITIAL_STATE__ non trovato per ${project.name}`
    );
  }

  const assignmentIndex = initialStateScript.indexOf("=");

  if (assignmentIndex === -1) {
    throw new Error(`Stato iniziale non valido per ${project.name}`);
  }

  const jsonText = initialStateScript
    .slice(assignmentIndex + 1)
    .trim()
    .replace(/;\s*$/, "");

  let initialState: GamefoundInitialState;

  try {
    initialState = JSON.parse(jsonText) as GamefoundInitialState;
  } catch {
    throw new Error(
      `Impossibile leggere lo stato iniziale di ${project.name}`
    );
  }

  const projectId = initialState.analyticsConfig?.project?.projectID;

  if (!projectId) {
    throw new Error(`Project ID non trovato per ${project.name}`);
  }

  return projectId;
}

async function getProjectImage(project: GamefoundProject) {
  const endpoint = new URL(
    "/api/public/projects/getCrowdfundingProject",
    GAMEFOUND_BASE_URL
  );

  endpoint.searchParams.set("urlName", project.slug);

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent":
          "Mozilla/5.0 (compatible; LoSpaccaDadi/1.0; +https://lospaccadadi.it)",
      },
      next: {
        revalidate: 60 * 60 * 24,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data =
      (await response.json()) as GamefoundPublicProjectResponse;

    return normalizeImageUrl(data.projectImageUrl);
  } catch {
    return null;
  }
}

async function requestProjectUpdates(
  projectId: number
): Promise<GamefoundUpdatesResponse> {
  const response = await fetch(
    `${GAMEFOUND_BASE_URL}/api/projectUpdates/searchProjectUpdates`,
    {
      method: "POST",

      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        Origin: GAMEFOUND_BASE_URL,
        Referer: GAMEFOUND_BASE_URL,
        "User-Agent":
          "Mozilla/5.0 (compatible; LoSpaccaDadi/1.0; +https://lospaccadadi.it)",
      },

      body: JSON.stringify({
        dateFrom: null,
        dateTo: null,
        lowestFetchedSequenceNumber: null,
        onlyUserRelevant: false,
        projectID: projectId,
        projectUpdateUserContext: 1,
        searchTerm: "",
      }),

      next: {
        revalidate: 60 * 60,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Gamefound Updates API: ${response.status} ${response.statusText}`
    );
  }

  return (await response.json()) as GamefoundUpdatesResponse;
}

export async function fetchLatestProjectUpdate(
  project: GamefoundProject
): Promise<GamefoundUpdate | null> {
  const [projectId, projectImage] = await Promise.all([
    getProjectId(project),
    getProjectImage(project),
  ]);

  const response = await requestProjectUpdates(projectId);

  const latestUpdate = response.pagedItems
    .filter(
      (update) =>
        update.isPublished &&
        Boolean(update.publishedAt) &&
        Boolean(update.projectUpdateUrl)
    )
    .sort(
      (a, b) =>
        new Date(b.publishedAt as string).getTime() -
        new Date(a.publishedAt as string).getTime()
    )[0];

  if (!latestUpdate || !latestUpdate.publishedAt) {
    return null;
  }

  const updateUrl = new URL(
    latestUpdate.projectUpdateUrl,
    GAMEFOUND_BASE_URL
  ).toString();

  const updateImage = normalizeImageUrl(latestUpdate.imageUrl);

  const contentImage = extractFirstImageFromContent(
    latestUpdate.content
  );

  const hasUnusableUpdateImage =
    UPDATES_WITH_UNUSABLE_IMAGE.has(updateUrl);

  const image = hasUnusableUpdateImage
    ? projectImage ?? contentImage ?? updateImage
    : updateImage ?? contentImage ?? projectImage;

  return {
    id: latestUpdate.projectUpdateID,
    projectId,
    projectName: project.name,
    projectCreator: project.creator,
    projectSlug: project.slug,
    title: latestUpdate.title.trim(),
    excerpt: latestUpdate.abstract?.trim() ?? "",
    image,
    publishedAt: latestUpdate.publishedAt,
    url: updateUrl,
    sequenceNumber: latestUpdate.sequenceNumber,
  };
}