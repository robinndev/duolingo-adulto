import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PlayerColor } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET /api/setup — garante que os 2 jogadores existem e retorna eles
export async function GET() {
  await prisma.player.upsert({
    where: { color: PlayerColor.NAVY },
    update: {},
    create: { name: process.env.PLAYER_NAVY_NAME ?? "Ele", color: PlayerColor.NAVY },
  });
  await prisma.player.upsert({
    where: { color: PlayerColor.PINK },
    update: {},
    create: { name: process.env.PLAYER_PINK_NAME ?? "Ela", color: PlayerColor.PINK },
  });

  const players = await prisma.player.findMany({ orderBy: { color: "asc" } });
  return NextResponse.json({ players });
}
