"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { Button, Card, ErrorBanner } from "@/components/ui";
import type { GameState, Player } from "@/lib/types";
import { Leaderboard } from "./Leaderboard";
import { SecretHistory } from "./SecretHistory";

export function RoundOver({
  code, state, me, isHost, onChanged,
}: { code: string; state: GameState; me: Player; isHost: boolean; onChanged: () => void }) {
  const [busy, setBusy] = useState<"next" | "end" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(kind: "next" | "end") {
    setError(null);
    setBusy(kind);
    try {
      await (kind === "next" ? api.nextRound(code, me.id) : api.endGame(code, me.id));
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action impossible.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="text-center">
        <h2 className="text-4xl font-extrabold sm:text-5xl">Manche {state.round ?? 1} terminée</h2>
        <p className="mt-2 text-white/60">+1 point si tu devines l'auteur, +1 si on se trompe sur toi.</p>
      </header>

      <Card>
        <h3 className="mb-4 text-xl font-bold">Classement général</h3>
        <Leaderboard scores={state.scores ?? []} me={me} />
      </Card>

      <SecretHistory secrets={state.resolved_secrets} title="Les secrets de cette manche" />

      <div className="space-y-3 text-center">
        <ErrorBanner message={error} />
        {isHost ? (
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={() => run("next")} loading={busy === "next"} disabled={busy !== null} className="px-8 py-4 text-lg">
              Manche suivante
            </Button>
            <Button variant="secondary" onClick={() => run("end")} loading={busy === "end"} disabled={busy !== null} className="px-8 py-4 text-lg">
              Terminer la partie
            </Button>
          </div>
        ) : (
          <p className="text-white/60">L'hôte choisit : nouvelle manche ou fin de partie…</p>
        )}
      </div>
    </div>
  );
}
