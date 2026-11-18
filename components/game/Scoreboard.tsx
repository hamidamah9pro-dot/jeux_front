"use client";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { Button, Card } from "@/components/ui";
import { clearSession } from "@/lib/session";
import { isCorrect, sameId, type GameState } from "@/lib/types";
import { SecretHistory } from "./SecretHistory";

export function Scoreboard({ state }: { state: GameState }) {
  const router = useRouter();

  const ranking = state.players
    .map((p) => ({
      player: p,
      found: state.resolved_secrets.filter((s) => sameId(s.target.id, p.id) && isCorrect(s)).length,
      exposed: state.resolved_secrets.filter((s) => sameId(s.author.id, p.id) && isCorrect(s)).length,
    }))
    .sort((a, b) => b.found - a.found || a.exposed - b.exposed);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="text-center">
        <h2 className="text-4xl font-extrabold sm:text-5xl">Partie terminée</h2>
        <p className="mt-2 text-white/60">Voici qui a écrit quoi, et qui s'est fait griller.</p>
      </header>

      <Card>
        <h3 className="mb-4 text-xl font-bold">Classement</h3>
        <ol className="space-y-3">
          {ranking.map((r, i) => (
            <li key={r.player.id} className="flex items-center gap-4 rounded-2xl bg-white/5 p-3">
              <span className={`w-6 text-center text-xl font-extrabold ${i === 0 ? "text-amber" : "text-white/40"}`}>{i + 1}</span>
              <Avatar name={r.player.username} size="sm" />
              <span className="flex-1 truncate font-semibold">{r.player.username}</span>
              <span className="text-right text-sm text-white/70">
                <b className="text-emerald-300">{r.found}</b> deviné{r.found > 1 ? "s" : ""} · <b className="text-red-300">{r.exposed}</b> démasqué{r.exposed > 1 ? "s" : ""}
              </span>
            </li>
          ))}
        </ol>
      </Card>

      <SecretHistory secrets={state.resolved_secrets} title="Tous les secrets" />

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
