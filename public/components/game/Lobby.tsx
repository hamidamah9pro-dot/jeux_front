"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { Avatar } from "@/components/Avatar";
import { Button, Card, ErrorBanner } from "@/components/ui";
import type { GameState, Player } from "@/lib/types";

export function Lobby({
  code, state, me, isHost, onStarted,
}: { code: string; state: GameState; me: Player; isHost: boolean; onStarted: () => void }) {
  const [copied, setCopied] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const enough = state.players.length >= 3;

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const t = document.createElement("textarea");
      t.value = code;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function start() {
    setError(null);
    setStarting(true);
    try {
      await api.startGame(code, me.id);
      onStarted();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible de lancer la partie.");
    } finally {
      setStarting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="text-center">
        <p className="text-white/60">Code du salon</p>
        <div className="my-5 flex justify-center gap-2 sm:gap-3" aria-label={`Code ${code.split("").join(" ")}`}>
          {code.split("").map((c, i) => (
            <span
              key={i}
              style={{ animationDelay: `${i * 70}ms` }}
              className="grid h-16 w-12 animate-pop place-items-center rounded-2xl border border-amber/40 bg-night text-4xl font-extrabold text-amber shadow-[0_0_30px_-6px] shadow-amber/50 sm:h-24 sm:w-[4.5rem] sm:text-6xl"
            >
              {c}
            </span>
          ))}
        </div>
        <Button variant="secondary" onClick={copy}>
          {copied ? "Code copié !" : "Copier le code"}
        </Button>
      </Card>

      <Card>
        <h2 className="mb-5 text-xl font-bold">
          Joueurs connectés <span className="text-white/50">({state.players.length})</span>
        </h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {state.players.map((p) => (
            <li key={p.id} className="animate-pop flex flex-col items-center gap-2 rounded-2xl bg-white/5 p-4 text-center">
              <Avatar name={p.username} size="lg" />
              <span className="max-w-full truncate font-semibold">
                {p.username}
                {String(p.id) === String(me.id) && <span className="text-white/50"> (toi)</span>}
              </span>
              {Boolean(Number(p.is_host)) && (
                <span className="rounded-full bg-amber/15 px-2.5 py-0.5 text-xs font-bold text-amber">Hôte</span>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <div className="space-y-3 text-center">
        <ErrorBanner message={error} />
        {isHost ? (
          <>
            <Button onClick={start} loading={starting} disabled={!enough} className="w-full py-4 text-lg sm:w-auto sm:px-12">
              Lancer la partie
            </Button>
            {!enough && <p className="text-sm text-white/50">Il faut au moins 3 joueurs pour commencer.</p>}
          </>
        ) : (
          <p className="text-white/60">En attente de l'hôte pour lancer la partie…</p>
        )}
      </div>
    </div>
  );
}
