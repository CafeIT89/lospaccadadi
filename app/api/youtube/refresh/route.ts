import "server-only";

import { refreshYouTubeContent } from "@/lib/youtube-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.error(
      "[YouTube Refresh] CRON_SECRET non configurato."
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
      "[YouTube Refresh] Aggiornamento manuale avviato..."
    );

    const result =
      await refreshYouTubeContent();

    const durationMs =
      Date.now() - startedAt;

    console.log(
      `[YouTube Refresh] Aggiornamento completato in ${durationMs} ms.`
    );

    return Response.json({
      success: true,
      recensioni: result.recensioni,
      settimanale: result.settimanale,
      updatedAt: result.updatedAt,
      durationMs,
    });
  } catch (error) {
    const durationMs =
      Date.now() - startedAt;

    console.error(
      "[YouTube Refresh] Aggiornamento fallito."
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