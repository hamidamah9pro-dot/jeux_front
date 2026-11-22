"use client";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { clearSession } from "@/lib/session";
import type { GameState, Player } from "@/lib/types";
import { Leaderboard } from "./Leaderboard";
import { SecretHistory } from "./SecretHistory";

export function Scoreboard({ state, me }: { state: GameState; me?: Player }) {
  const router = useRouter();
  const scores = state.scores ?? [];
  const top = scores.length ? scores[0].points : 0;
  const winners = scores.filter((s) => s.points === top && top > 0).map((s) => s.username);

  const all = state.all_resolved_secrets ?? state.resolved_secrets;
  const rounds = Array.from(new Set(all.map((s) => s.round ?? 1))).sort((a, b) => a - b);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="text-center">
        <h2 className="text-4xl font-extrabold sm:text-5xl">Partie terminée</h2>
        {winners.length > 0 && (
          <p className="mt-3 text-2xl font-bold text-amber">
            {winners.length > 1 ? "Égalité : " : "Vainqueur : "}
            {winners.join(", ")} avec {top} pt{top > 1 ? "s" : ""}
          </p>
        )}
      </header>

      <Card>
        <h3 className="mb-4 text-xl font-bold">Classement final</h3>
        <Leaderboard scores={scores} me={me} />
      </Card>

      {rounds.map((r) => (
        <SecretHistory key={r} secrets={all.filter((s) => (s.round ?? 1) === r)} title={`Manche ${r}`} />
      ))}

      <div className="text-center">
        <Button
          onClick={() => {
            clearSession();
            router.push("/");
          }}
          className="px-10"
        >
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
}
