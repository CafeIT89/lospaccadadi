import { NextResponse } from "next/server";

import { getLatestGamefoundUpdates } from "@/lib/gamefound-updates";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const updates = await getLatestGamefoundUpdates(50);

    return NextResponse.json(
      updates.map((update) => ({
        projectName: update.projectName,
        title: update.title,
        image: update.image,
        url: update.url,
      })),
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Errore sconosciuto",
      },
      {
        status: 500,
      }
    );
  }
}