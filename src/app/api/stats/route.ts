import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";
import { startOfCurrentMonth } from "@/lib/date";

export const dynamic = "force-dynamic";

// GET /api/stats — pontuação por jogador × categoria (mês atual + ano + total)
export async function GET(_req: NextRequest) {
  const players = await prisma.player.findMany();
  const monthStart = startOfCurrentMonth();
  const yearStart = new Date(new Date().getFullYear(), 0, 1);

  async function agg(playerId: string, category: Category, since?: Date) {
    const r = await prisma.completion.aggregate({
      where: { playerId, category, ...(since ? { completedAt: { gte: since } } : {}) },
      _sum: { points: true },
      _count: true,
    });
    return { points: r._sum.points ?? 0, count: r._count };
  }

  const result = await Promise.all(
    players.map(async (p) => ({
      player: p,
      casa: {
        month: await agg(p.id, "CASA", monthStart),
        year: await agg(p.id, "CASA", yearStart),
        total: await agg(p.id, "CASA"),
      },
      casal: {
        month: await agg(p.id, "CASAL", monthStart),
        year: await agg(p.id, "CASAL", yearStart),
        total: await agg(p.id, "CASAL"),
      },
    })),
  );

  return NextResponse.json({ stats: result });
}
