"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import useSWRLike from "@/lib/useFetch";
import { getDeviceLabel } from "@/lib/device";
import { ArrowLeft, Undo2, X, Clock } from "lucide-react";
import clsx from "clsx";

type Completion = {
  id: string;
  points: number;
  category: "CASA" | "CASAL";
  completedAt: string;
  activity: { name: string };
  player: { id: string; name: string; color: "NAVY" | "PINK" };
};

type Undo = {
  id: string;
  activityName: string;
  activityPoints: number;
  category: "CASA" | "CASAL";
  completedAt: string;
  reason: string;
  deviceLabel: string;
  undoneAt: string;
  playerId: string;
};

type Player = { id: string; name: string; color: "NAVY" | "PINK" };

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-2.5 py-1 rounded-md text-[11px] font-medium border whitespace-nowrap transition-colors flex items-center gap-1.5",
        active
          ? "bg-neutral-950 border-neutral-950 text-white"
          : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-900",
      )}
    >
      {children}
    </button>
  );
}

function PlayerTag({ player }: { player: { name: string; color: "NAVY" | "PINK" } }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-600">
      <span className={player.color === "NAVY" ? "dot-navy" : "dot-pink"} />
      <span className="font-medium text-neutral-900">{player.name}</span>
    </span>
  );
}

export default function HistoricoPage() {
  const [category, setCategory] = useState<"ALL" | "CASA" | "CASAL">("ALL");
  const [playerId, setPlayerId] = useState<string | "ALL">("ALL");
  const [undoTarget, setUndoTarget] = useState<Completion | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"list" | "logs">("list");
  const [device, setDevice] = useState("");

  useEffect(() => { setDevice(getDeviceLabel()); }, []);

  const params = new URLSearchParams();
  if (category !== "ALL") params.set("category", category);
  if (playerId !== "ALL") params.set("playerId", playerId);
  params.set("limit", "200");

  const { data, refetch } = useSWRLike<{
    completions: Completion[];
    players: Player[];
    undos: Undo[];
  }>(`/api/history?${params.toString()}`);

  const grouped = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, Completion[]>();
    for (const c of data.completions) {
      const d = new Date(c.completedAt);
      const key = d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    }
    return Array.from(map.entries());
  }, [data]);

  async function submitUndo() {
    if (!undoTarget || !reason.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/completions/undo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completionId: undoTarget.id,
          reason,
          deviceLabel: getDeviceLabel(),
        }),
      });
      if (!res.ok) throw new Error();
      setUndoTarget(null);
      setReason("");
      refetch();
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="btn-ghost -ml-2">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
        </Link>
        <span className="kbd">histórico</span>
        <div className="w-8" />
      </div>

      <div className="flex border border-neutral-200 rounded-md p-0.5 bg-neutral-50">
        {(["list", "logs"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              "flex-1 py-1.5 text-[11px] font-medium rounded transition-colors",
              tab === t ? "bg-white shadow-sm text-neutral-950" : "text-neutral-500",
            )}
          >
            {t === "list" ? "atividades" : "undos"}
          </button>
        ))}
      </div>

      {tab === "list" && (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="kbd w-12">tipo</span>
              <div className="flex gap-1.5 overflow-x-auto">
                {(["ALL", "CASA", "CASAL"] as const).map((c) => (
                  <Pill key={c} active={category === c} onClick={() => setCategory(c)}>
                    {c === "ALL" ? "tudo" : c.toLowerCase()}
                  </Pill>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="kbd w-12">quem</span>
              <div className="flex gap-1.5 overflow-x-auto">
                <Pill active={playerId === "ALL"} onClick={() => setPlayerId("ALL")}>
                  ambos
                </Pill>
                {data?.players.map((p) => (
                  <Pill key={p.id} active={playerId === p.id} onClick={() => setPlayerId(p.id)}>
                    <span className={p.color === "NAVY" ? "dot-navy" : "dot-pink"} />
                    {p.name.toLowerCase()}
                  </Pill>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {grouped.map(([day, items]) => (
              <section key={day} className="flex flex-col gap-2">
                <div className="kbd">{day}</div>
                <div className="flex flex-col divide-y divide-neutral-100 border border-neutral-200 rounded-lg overflow-hidden bg-white">
                  {items.map((c) => (
                    <div key={c.id} className="px-3.5 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{c.activity.name}</div>
                        <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-2 flex-wrap">
                          <PlayerTag player={c.player} />
                          <span className="text-neutral-300">·</span>
                          <span className="inline-flex items-center gap-1 tabular-nums">
                            <Clock className="w-2.5 h-2.5" strokeWidth={2} />
                            {new Date(c.completedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <span className="text-neutral-300">·</span>
                          <span>{c.category.toLowerCase()}</span>
                          <span className="text-neutral-300">·</span>
                          <span className="font-semibold text-neutral-900 tabular-nums">+{c.points}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setUndoTarget(c)}
                        className="text-neutral-400 hover:text-neutral-950 transition-colors p-1.5 -mr-1.5"
                        aria-label="desfazer"
                      >
                        <Undo2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            ))}
            {grouped.length === 0 && (
              <div className="text-center kbd py-10">sem registros</div>
            )}
          </div>
        </>
      )}

      {tab === "logs" && (
        <div className="flex flex-col gap-2">
          {data?.undos.length === 0 && (
            <div className="text-center kbd py-10">nenhum undo</div>
          )}
          {data?.undos.map((u) => {
            const p = data.players.find((x) => x.id === u.playerId);
            return (
              <div key={u.id} className="card p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{u.activityName}</div>
                    <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-2 flex-wrap">
                      {p && <PlayerTag player={p} />}
                      <span className="text-neutral-300">·</span>
                      <span>{u.category.toLowerCase()}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-900 tabular-nums shrink-0">
                    −{u.activityPoints}
                  </span>
                </div>
                <div className="border-l-2 border-neutral-200 pl-3 text-xs text-neutral-700">
                  {u.reason}
                </div>
                <div className="text-[10px] text-neutral-400 kbd flex items-center gap-1.5 flex-wrap">
                  <span>{u.deviceLabel}</span>
                  <span className="text-neutral-300">·</span>
                  <span>{new Date(u.undoneAt).toLocaleString("pt-BR")}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {undoTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4"
          onClick={() => { setUndoTarget(null); setReason(""); }}
        >
          <div
            className="w-full max-w-md bg-white rounded-lg border border-neutral-200 p-5 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="kbd">desfazer</span>
                <h2 className="text-base font-semibold mt-1">{undoTarget.activity.name}</h2>
                <div className="text-xs text-neutral-500 mt-1 flex items-center gap-1.5">
                  <PlayerTag player={undoTarget.player} />
                  <span className="text-neutral-300">·</span>
                  <span className="tabular-nums">−{undoTarget.points} pts</span>
                </div>
              </div>
              <button
                onClick={() => { setUndoTarget(null); setReason(""); }}
                className="btn-ghost !p-1.5"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="kbd">motivo (obrigatório)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="marquei sem querer / não fiz de verdade..."
                className="input resize-none"
              />
            </div>
            <div className="text-[10px] kbd">
              será registrado como <span className="text-neutral-900">{device}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setUndoTarget(null); setReason(""); }}
                className="btn-outline flex-1"
              >
                cancelar
              </button>
              <button
                onClick={submitUndo}
                disabled={busy || !reason.trim()}
                className="btn-primary flex-1"
              >
                {busy ? "..." : "desfazer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
