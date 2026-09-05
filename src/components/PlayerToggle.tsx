"use client";
import clsx from "clsx";
import type { Player } from "@/lib/types";

export function PlayerToggle({
  players,
  active,
  onChange,
}: {
  players: Player[];
  active: string | null;
  onChange: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {players.map((p) => {
        const isNavy = p.color === "NAVY";
        const isActive = active === p.id;
        return (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            className={clsx(
              "rounded-xl py-3 px-3 font-semibold border transition text-sm",
              isNavy
                ? isActive
                  ? "bg-navy-500 border-navy-300 text-white"
                  : "bg-navy-800 border-navy-700 text-navy-100"
                : isActive
                  ? "bg-pink-400 border-pink-200 text-white"
                  : "bg-pink-900/40 border-pink-800 text-pink-100",
            )}
          >
            {isNavy ? "🔵" : "🩷"} {p.name}
          </button>
        );
      })}
    </div>
  );
}
