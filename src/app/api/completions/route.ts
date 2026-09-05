import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.activityId || !body?.playerId) {
    return NextResponse.json({ error: "activityId e playerId são obrigatórios" }, { status: 400 });
  }

  const activity = await prisma.activity.findUnique({ where: { id: body.activityId } });
  if (!activity) return NextResponse.json({ error: "atividade não encontrada" }, { status: 404 });

  const completion = await prisma.completion.create({
    data: {
      activityId: activity.id,
      playerId: body.playerId,
      category: activity.category,
      points: activity.points,
    },
  });

  return NextResponse.json({ completion });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  await prisma.completion.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
