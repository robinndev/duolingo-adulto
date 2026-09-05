"use client";
import useSWRLike from "@/lib/useFetch";
import type { CalendarPayload, Category, Player } from "@/lib/types";
import { CalendarDays } from "lucide-react";
import clsx from "clsx";

function levelClass(count: number, max: number, color: "NAVY" | "PINK", locked: boolean) {
  if (locked) return "bg-neutral-300";
  const level = Math.min(max, count);
  const ratio = level / max;
  if (level === 0) return "bg-neutral-100 border border-neutral-200/60";
  if (color === "NAVY") {
    if (ratio <= 0.2) return "bg-navy-100";
    if (ratio <= 0.4) return "bg-navy-300";
    if (ratio <= 0.6) return "bg-navy-500";
    if (ratio <= 0.8) return "bg-navy-700";
    return "bg-navy-900";
  } else {
    if (ratio <= 0.2) return "bg-pink-100";
    if (ratio <= 0.4) return "bg-pink-200";
    if (ratio <= 0.6) return "bg-pink-300";
    if (ratio <= 0.8) return "bg-pink-400";
    return "bg-pink-500";
  }
}

function Grid({
  days,
  counts,
  max,
  color,
  monthEndKey,
}: {
  days: string[];
  counts: Record<string, number>;
  max: number;
  color: "NAVY" | "PINK";
  monthEndKey: string;
}) {
  const first = new Date(days[0]);
  const offset = first.getDay();
  const cells: (string | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (const d of days) cells.push(d);

  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <div
        className="grid gap-[3px]"
        style={{
          gridTemplateRows: "repeat(7, minmax(0, 1fr))",
          gridAutoFlow: "column",
          gridAutoColumns: "minmax(11px, 11px)",
        }}
      >
        {cells.map((d, i) =>
          d === null ? (
            <div key={i} className="w-[11px] h-[11px]" />
          ) : (
            <div
              key={d}
              title={`${d} — ${counts[d] ?? 0}${d > monthEndKey ? " (bloqueado)" : ""}`}
              className={clsx(
                "w-[11px] h-[11px] rounded-[2px]",
                levelClass(counts[d] ?? 0, max, color, d > monthEndKey),
              )}
            />
          ),
        )}
      </div>
    </div>
  );
}

function Legend({ color, max }: { color: "NAVY" | "PINK"; max: number }) {
  const steps = [0, 1, Math.ceil(max / 2), max];
  return (
    <div className="flex items-center gap-1 text-[10px] text-neutral-400">
      <span className="kbd">−</span>
      {steps.map((s) => (
        <span key={s} className={clsx("w-2.5 h-2.5 rounded-[2px]", levelClass(s, max, color, false))} />
      ))}
      <span className="kbd">+</span>
      <span className="w-2.5 h-2.5 rounded-[2px] bg-neutral-300 ml-1" title="bloqueado" />
    </div>
  );
}

export function ContributionCalendar({ category }: { category: Category }) {
  const { data, loading } = useSWRLike<CalendarPayload>(`/api/calendar?category=${category}&days=180`);
  if (loading || !data) return <div className="card p-4 h-48 animate-pulse" />;

  const navy = data.players.find((p) => p.color === "NAVY");
  const pink = data.players.find((p) => p.color === "PINK");

  return (
    <div className="card p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          {category === "CASA" ? "calendário · casa" : "calendário · casal"}
        </h3>
        <div className="flex items-center gap-1.5 kbd">
          <CalendarDays className="w-3 h-3" strokeWidth={1.5} />
          <span>{data.monthLabel}</span>
          <span className="text-neutral-300">·</span>
          <span>{data.daysLeft === 0 ? "último dia" : `faltam ${data.daysLeft}d`}</span>
        </div>
      </div>

      {navy && (
        <PlayerRow
          player={navy}
          days={data.days}
          counts={data.byPlayer[navy.id] ?? {}}
          max={data.maxLevel}
          monthEndKey={data.monthEndKey}
        />
      )}
      {pink && (
        <PlayerRow
          player={pink}
          days={data.days}
          counts={data.byPlayer[pink.id] ?? {}}
          max={data.maxLevel}
          monthEndKey={data.monthEndKey}
        />
      )}
    </div>
  );
}

function PlayerRow({
  player,
  days,
  counts,
  max,
  monthEndKey,
}: {
  player: Player;
  days: string[];
  counts: Record<string, number>;
  max: number;
  monthEndKey: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={player.color === "NAVY" ? "dot-navy" : "dot-pink"} />
          <span className="text-xs font-medium">{player.name}</span>
        </div>
        <Legend color={player.color} max={max} />
      </div>
      <Grid days={days} counts={counts} max={max} color={player.color} monthEndKey={monthEndKey} />
    </div>
  );
}
