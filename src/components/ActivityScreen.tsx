"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import useSWRLike from "@/lib/useFetch";
import { getMe, clearMe } from "@/lib/me";
import type { Activity, Category } from "@/lib/types";
import { ArrowLeft, Check, Search, Plus } from "lucide-react";
import clsx from "clsx";

export function ActivityScreen({ category }: { category: Category }) {
  const [me, setMeState] = useState<{ id: string; name: string } | null>(null);
  const [meColor, setMeColor] = useState<"NAVY" | "PINK" | null>(null);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const m = getMe();
    setMeState(m);
    if (m) {
      fetch("/api/setup").then((r) => r.json()).then((d) => {
        const p = d.players.find((x: { id: string }) => x.id === m.id);
        if (p) setMeColor(p.color);
      });
    }
  }, []);

  const { data, refetch } = useSWRLike<{ activities: Activity[] }>(
    `/api/activities?category=${category}&q=${encodeURIComponent(query)}`,
  );

  const activities = useMemo(() => data?.activities ?? [], [data]);

  async function completar(a: Activity) {
    if (!me) return;
    setBusy(a.id);
    try {
      const res = await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId: a.id, playerId: me.id }),
      });
      if (!res.ok) throw new Error();
      setToast(`+${a.points}`);
      setTimeout(() => setToast(null), 1200);
      refetch();
    } catch {
      setToast("erro");
      setTimeout(() => setToast(null), 1200);
    } finally {
      setBusy(null);
    }
  }

  const title = category === "CASA" ? "casa" : "casal";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="btn-ghost -ml-2">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
        </Link>
        <span className="kbd">{title}</span>
        <div className="w-8" />
      </div>

      {me && (
        <div className="card px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={meColor === "NAVY" ? "dot-navy" : meColor === "PINK" ? "dot-pink" : "dot-navy opacity-30"} />
            <span className="text-xs">
              jogando como <span className="font-semibold">{me.name}</span>
            </span>
          </div>
          <button
            onClick={() => { clearMe(); window.location.reload(); }}
            className="kbd hover:text-neutral-950 transition-colors"
          >
            trocar
          </button>
        </div>
      )}

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="buscar atividade"
          className="input pl-9"
        />
      </div>

      <ul className="flex flex-col gap-2">
        {activities.map((a) => (
          <li key={a.id}>
            <button
              disabled={busy === a.id || !me}
              onClick={() => completar(a)}
              className={clsx(
                "w-full card px-4 py-3 flex items-center justify-between text-left transition-all",
                busy === a.id ? "opacity-60" : "hover:border-neutral-950 active:scale-[0.99]",
              )}
            >
              <span className="text-sm pr-3">{a.name}</span>
              <span className="flex items-center gap-2">
                <span className="badge">
                  <Plus className="w-3 h-3" strokeWidth={2} />
                  {a.points}
                </span>
                {busy === a.id ? (
                  <Check className="w-4 h-4 text-neutral-400 animate-pulse" strokeWidth={2} />
                ) : null}
              </span>
            </button>
          </li>
        ))}
        {activities.length === 0 && (
          <li className="text-center kbd py-8">sem resultados</li>
        )}
      </ul>

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-neutral-950 text-white px-4 py-2 rounded-md shadow-lg text-xs font-mono font-semibold flex items-center gap-2">
          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
          {toast}
        </div>
      )}
    </div>
  );
}
