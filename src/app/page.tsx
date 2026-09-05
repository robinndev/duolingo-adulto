import Link from "next/link";
import { Scoreboard } from "@/components/Scoreboard";
import { ContributionCalendar } from "@/components/ContributionCalendar";
import { Home, Heart, History, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <span className="kbd">duolingo_adulto</span>
        <h1 className="text-2xl font-bold tracking-tight">o jogo do casal</h1>
      </header>

      <Scoreboard />

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/casa"
          className="card p-4 flex flex-col gap-3 hover:border-neutral-950 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <Home className="w-5 h-5" strokeWidth={1.5} />
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-950 group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">casa</span>
            <span className="text-[11px] text-neutral-500">tarefas do dia</span>
          </div>
        </Link>
        <Link
          href="/casal"
          className="card p-4 flex flex-col gap-3 hover:border-neutral-950 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <Heart className="w-5 h-5" strokeWidth={1.5} />
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-950 group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">casal</span>
            <span className="text-[11px] text-neutral-500">relacionamento</span>
          </div>
        </Link>
      </div>

      <ContributionCalendar category="CASA" />
      <ContributionCalendar category="CASAL" />

      <Link
        href="/historico"
        className="btn-outline w-full justify-between"
      >
        <span className="flex items-center gap-2">
          <History className="w-4 h-4" strokeWidth={1.5} />
          histórico & desfazer
        </span>
        <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
      </Link>

      <footer className="text-center kbd pt-4">
        no final, os dois ganham
      </footer>
    </main>
  );
}
