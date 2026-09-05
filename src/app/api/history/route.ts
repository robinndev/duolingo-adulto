import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET /api/history?category=CASA|CASAL&playerId=xxx&limit=100
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryRaw = searchParams.get("category");
  const playerId = searchParams.get("playerId");
  const limit = Math.min(500, Math.max(1, Number(searchParams.get("limit") ?? 100)));

  const where: {
    category?: Category;
    playerId?: string;
  } = {};
  if (categoryRaw === "CASA" || categoryRaw === "CASAL") where.category = categoryRaw;
  if (playerId) where.playerId = playerId;

  const [completions, players, undos] = await Promise.all([
    prisma.completion.findMany({
      where,
      orderBy: { completedAt: "desc" },
      take: limit,
      include: { activity: true, player: true },
    }),
    prisma.player.findMany(),
    prisma.undoLog.findMany({
      orderBy: { undoneAt: "desc" },
      take: 50,
    }),
  ]);

  return NextResponse.json({ completions, players, undos });
}
