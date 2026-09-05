"use client";
import useSWRLike from "@/lib/useFetch";
import type { Stats } from "@/lib/types";
import clsx from "clsx";

export function Scoreboard() {
  const { data, loading } = useSWRLike<{ stats: Stats[] }>("/api/stats");
  if (loading || !data) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4 h-28 animate-pulse" />
        <div className="card p-4 h-28 animate-pulse" />
      </div>
    );
  }

  const navy = data.stats.find((s) => s.player.color === "NAVY");
  const pink = data.stats.find((s) => s.player.color === "PINK");

  return (
    <div className="grid grid-cols-2 gap-3">
      {[navy, pink].map((s) =>
        s ? (
          <div key={s.player.id} className="card p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={s.player.color === "NAVY" ? "dot-navy" : "dot-pink"} />
                <span className="text-xs font-medium">{s.player.name}</span>
              </div>
              <span className="kbd">mês</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className={clsx(
                  "text-3xl font-bold tabular-nums",
                  s.player.color === "NAVY" ? "text-navy-800" : "text-pink-500",
                )}
              >
                {s.casa.month.points + s.casal.month.points}
              </span>
              <span className="text-[11px] text-neutral-500">pts</span>
            </div>
            <div className="flex flex-col gap-1 text-[11px] text-neutral-600 border-t border-neutral-100 pt-2">
              <div className="flex justify-between">
                <span>casa</span>
                <span className="tabular-nums font-medium text-neutral-900">
                  {s.casa.month.points}
                  <span className="text-neutral-400"> · {s.casa.month.count}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span>casal</span>
                <span className="tabular-nums font-medium text-neutral-900">
                  {s.casal.month.points}
                  <span className="text-neutral-400"> · {s.casal.month.count}</span>
                </span>
              </div>
            </div>
          </div>
        ) : null,
      )}
    </div>
  );
}
