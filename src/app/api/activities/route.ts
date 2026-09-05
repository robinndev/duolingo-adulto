import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryRaw = searchParams.get("category");
  const q = (searchParams.get("q") ?? "").trim();

  if (categoryRaw !== "CASA" && categoryRaw !== "CASAL") {
    return NextResponse.json({ error: "invalid category" }, { status: 400 });
  }

  const category = categoryRaw as Category;

  const activities = await prisma.activity.findMany({
    where: {
      category,
      ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    },
    orderBy: [{ points: "desc" }, { name: "asc" }],
  });

  return NextResponse.json({ activities });
}
