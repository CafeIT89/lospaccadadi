import "server-only";

import {
  getKickstarterProjectsFromFeeds,
} from "@/lib/kickstarter-feed";

import {
  saveKickstarterProjects,
} from "@/lib/kickstarter-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.error(
      "[Kickstarter Refresh] CRON_SECRET non configurato."
    );

    return false;
  }

  const authorization =
    request.headers.get("authorization");

  return authorization === `Bearer ${secret}`;
}

export async function GET(
  request: Request
): Promise<Response> {
  if (!isAuthorized(request)) {
    return Response.json(
      {
        success: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const startedAt = Date.now();

  try {
    console.log(
      "[Kickstarter Refresh] Aggiornamento automatico avviato..."
    );

    const projects =
      await getKickstarterProjectsFromFeeds(4);

    if (projects.length !== 4) {
      return Response.json(
        {
          success: false,
          error:
            "Non sono state recuperate esattamente 4 campagne Kickstarter valide.",
          received: projects.length,
        },
        {
          status: 502,
        }
      );
    }

    await saveKickstarterProjects(
      projects
    );

    const durationMs =
      Date.now() - startedAt;

    console.log(
      `[Kickstarter Refresh] Aggiornamento completato in ${durationMs} ms.`
    );

    return Response.json({
      success: true,
      projects: projects.length,
      updatedAt: new Date().toISOString(),
      durationMs,
    });
  } catch (error) {
    const durationMs =
      Date.now() - startedAt;

    console.error(
      "[Kickstarter Refresh] Aggiornamento fallito."
    );

    console.error(error);

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Errore sconosciuto.",
        durationMs,
      },
      {
        status: 500,
      }
    );
  }
}