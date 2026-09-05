import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";
import {
  daysFromToday,
  toDayKey,
  endOfCurrentMonthKey,
  currentMonthLabel,
  daysLeftInMonth,
} from "@/lib/date";

export const dynamic = "force-dynamic";

// GET /api/calendar?category=CASA|CASAL — 180 dias a partir de hoje
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryRaw = searchParams.get("category");
  const days = Math.min(365, Math.max(30, Number(searchParams.get("days") ?? 180)));

  if (categoryRaw !== "CASA" && categoryRaw !== "CASAL") {
    return NextResponse.json({ error: "invalid category" }, { status: 400 });
  }
  const category = categoryRaw as Category;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const players = await prisma.player.findMany();
  const completions = await prisma.completion.findMany({
    where: { category, completedAt: { gte: today } },
    select: { playerId: true, completedAt: true },
  });

  const dayKeys = daysFromToday(days);
  const monthEnd = endOfCurrentMonthKey();
  const byPlayer: Record<string, Record<string, number>> = {};
  for (const p of players) byPlayer[p.id] = Object.fromEntries(dayKeys.map((k) => [k, 0]));

  for (const c of completions) {
    const key = toDayKey(new Date(c.completedAt));
    if (byPlayer[c.playerId]?.[key] !== undefined) byPlayer[c.playerId][key] += 1;
  }

  const maxLevel = category === "CASA" ? 6 : 3;

  return NextResponse.json({
    category,
    days: dayKeys,
    maxLevel,
    monthLabel: currentMonthLabel(),
    monthEndKey: monthEnd,
    daysLeft: daysLeftInMonth(),
    byPlayer,
    players,
  });
}
