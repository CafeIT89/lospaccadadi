import "server-only";

import { redis } from "@/lib/redis";

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

type KickstarterCacheValue = {
  version: number;
  updatedAt: string;
  projects: KickstarterProject[];
};

const CACHE_VERSION = 1;

const CACHE_KEY =
  `crowdfunding:kickstarter:v${CACHE_VERSION}`;

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

function isKickstarterProject(
  value: unknown
): value is KickstarterProject {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate =
    value as Record<string, unknown>;

  return (
    isString(candidate.title) &&
    isString(candidate.description) &&
    isString(candidate.image) &&
    isString(candidate.url) &&
    isString(candidate.endDate) &&
    isNumber(candidate.backers) &&
    isNumber(candidate.raised) &&
    isNumber(candidate.goal) &&
    isString(candidate.currency)
  );
}

function isCacheValue(
  value: unknown
): value is KickstarterCacheValue {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate =
    value as Record<string, unknown>;

  return (
    candidate.version === CACHE_VERSION &&
    isString(candidate.updatedAt) &&
    Array.isArray(candidate.projects) &&
    candidate.projects.every(
      isKickstarterProject
    )
  );
}

export async function getCachedKickstarterProjects(): Promise<
  KickstarterProject[]
> {
  try {
    const stored =
      await redis.get<unknown>(CACHE_KEY);

    if (!isCacheValue(stored)) {
      console.warn(
        "[Kickstarter Service] Cache assente o non valida."
      );

      return [];
    }

    console.log(
      `[Kickstarter Service] Cache letta: ${stored.projects.length} campagne.`
    );

    return stored.projects.slice(0, 4);
  } catch (error) {
    console.error(
      "[Kickstarter Service] Errore lettura Redis:",
      error
    );

    return [];
  }
}

export async function saveKickstarterProjects(
  projects: KickstarterProject[]
): Promise<void> {
  const validProjects = projects
    .filter(isKickstarterProject)
    .slice(0, 4);

  if (validProjects.length === 0) {
    throw new Error(
      "Nessuna campagna Kickstarter valida ricevuta."
    );
  }

  const value: KickstarterCacheValue = {
    version: CACHE_VERSION,
    updatedAt: new Date().toISOString(),
    projects: validProjects,
  };

  await redis.set(CACHE_KEY, value);

  console.log(
    `[Kickstarter Service] Salvate ${validProjects.length} campagne in Redis.`
  );
}