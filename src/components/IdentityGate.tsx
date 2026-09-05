"use client";
import { useEffect, useState } from "react";
import { getMe, setMe } from "@/lib/me";
import type { Player } from "@/lib/types";
import clsx from "clsx";

export function IdentityGate() {
  const [needs, setNeeds] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (getMe()) return;
    fetch("/api/setup")
      .then((r) => r.json())
      .then((d) => {
        setPlayers(d.players);
        setNeeds(true);
      });
  }, []);

  function choose(p: Player) {
    setMe(p.id, p.name);
    setNeeds(false);
    window.location.reload();
  }

  if (!needs) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <span className="kbd">step 01</span>
          <h2 className="text-2xl font-semibold tracking-tight">quem tá jogando?</h2>
          <p className="text-sm text-neutral-500">só uma vez nesse dispositivo.</p>
        </div>
        <div className="flex flex-col gap-2">
          {players.map((p) => {
            const isNavy = p.color === "NAVY";
            return (
              <button
                key={p.id}
                onClick={() => choose(p)}
                className={clsx(
                  "group flex items-center justify-between rounded-lg border px-4 py-4 text-left transition-all active:scale-[0.99]",
                  isNavy
                    ? "border-neutral-200 hover:border-navy-700 hover:bg-navy-50/50"
                    : "border-neutral-200 hover:border-pink-400 hover:bg-pink-50/50",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={isNavy ? "dot-navy" : "dot-pink"} />
                  <span className="font-medium">{p.name}</span>
                </div>
                <span className="kbd">{isNavy ? "navy" : "pink"}</span>
              </button>
            );
          })}
        </div>
        <div className="text-center text-[11px] text-neutral-400 kbd">
          duolingo_adulto v1
        </div>
      </div>
    </div>
  );
}
