"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { Avatar } from "@/components/Avatar";
import { Button, Card, ErrorBanner, Spinner } from "@/components/ui";
import { flag } from "@/lib/session";
import { sameId, type GameState, type Player } from "@/lib/types";
import { SecretHistory } from "./SecretHistory";

export function Investigation({ code, state, me }: { code: string; state: GameState; me: Player }) {
  const secret = state.current_secret;
  const [pending, setPending] = useState<number | string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, force] = useState(0);

  if (!secret) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <Spinner className="mx-auto mb-4 h-8 w-8" />
        <p className="text-white/70">Le prochain secret arrive…</p>
      </Card>
    );
  }

  const guessKey = `guessed:${code}:${secret.id}`;
  const iAmTarget = sameId(me.id, secret.target.id);
  const guessed = flag.get(guessKey);
  const suspects = state.players.filter((p) => !sameId(p.id, me.id));

  async function accuse(p: Player) {
    if (!secret) return;
    setError(null);
    setPending(p.id);
    try {
      await api.guessSecret({ secret_id: secret.id, guessed_author_id: p.id, user_id: me.id });
      flag.set(guessKey);
      force((n) => n + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Accusation impossible.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-8">
      <div key={secret.id} className="mx-auto max-w-2xl animate-reveal">
        <div className="relative rounded-3xl border border-amber/30 bg-gradient-to-br from-ink to-plum p-8 text-center shadow-[0_0_60px_-15px] shadow-hot/50 sm:p-12">
          <p className="mb-6 flex items-center justify-center gap-3 text-xl font-bold text-amber">
            <Avatar name={secret.target.username} size="sm" />
            C'est le secret de {secret.target.username} !
          </p>
          <blockquote className="text-2xl font-semibold leading-snug sm:text-4xl">« {secret.content} »</blockquote>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        {iAmTarget ? (
          guessed ? (
            <Card className="text-center">
              <Spinner className="mx-auto mb-3" />
              <p className="text-white/70">Accusation envoyée. Verdict dans un instant…</p>
            </Card>
          ) : (
            <Card>
              <h3 className="mb-4 text-center text-xl font-bold">Qui a écrit ça sur toi ?</h3>
              <ul className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {suspects.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => accuse(p)}
                      disabled={pending !== null}
                      className="flex w-full touch-manipulation flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:border-hot hover:bg-hot/10 active:scale-95 disabled:opacity-50"
                    >
                      {sameId(pending, p.id) ? <Spinner className="h-14 w-14 border-4" /> : <Avatar name={p.username} />}
                      <span className="max-w-full truncate font-semibold">{p.username}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <ErrorBanner message={error} />
            </Card>
          )
        ) : (
          <Card className="text-center">
            <Spinner className="mx-auto mb-3" />
            <p className="text-lg text-white/80">
              <b>{secret.target.username}</b> réfléchit à qui a écrit ça…
            </p>
          </Card>
        )}
      </div>

      <div className="mx-auto max-w-2xl">
        <SecretHistory secrets={[...state.resolved_secrets].reverse()} title="Déjà révélés" />
      </div>
    </div>
  );
}
