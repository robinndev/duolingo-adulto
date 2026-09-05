import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST /api/completions/undo — desfaz uma conclusão registrando o motivo
// body: { completionId, reason, deviceLabel }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.completionId || !body?.reason?.trim() || !body?.deviceLabel?.trim()) {
    return NextResponse.json(
      { error: "completionId, reason e deviceLabel são obrigatórios" },
      { status: 400 },
    );
  }

  const c = await prisma.completion.findUnique({
    where: { id: body.completionId },
    include: { activity: true },
  });
  if (!c) return NextResponse.json({ error: "conclusão não encontrada" }, { status: 404 });

  const userAgent = req.headers.get("user-agent") ?? undefined;

  await prisma.$transaction([
    prisma.undoLog.create({
      data: {
        completionId: c.id,
        activityName: c.activity.name,
        activityPoints: c.points,
        category: c.category,
        playerId: c.playerId,
        completedAt: c.completedAt,
        reason: body.reason.trim().slice(0, 500),
        deviceLabel: body.deviceLabel.trim().slice(0, 100),
        userAgent,
      },
    }),
    prisma.completion.delete({ where: { id: c.id } }),
  ]);

  return NextResponse.json({ ok: true });
}
