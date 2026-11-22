"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { Avatar } from "@/components/Avatar";
import { Button, Card, ErrorBanner, Spinner } from "@/components/ui";
import { flag } from "@/lib/session";
import { sameId, type GameState, type Player } from "@/lib/types";

const MAX = 280;

export function WriteSecret({ code, state, me }: { code: string; state: GameState; me: Player }) {
  const round = state.round ?? 1;
  const storageKey = `submitted:${code}:${round}:${me.id}`;
  const [submitted, setSubmitted] = useState(() => flag.get(storageKey));
  const [targetId, setTargetId] = useState<number | string | null>(null);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const others = state.players.filter((p) => !sameId(p.id, me.id));
  const alreadyDone = submitted || Boolean(Number(state.players.find((p) => sameId(p.id, me.id))?.has_submitted));

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (targetId === null) return setError("Choisis le coéquipier concerné.");
    if (content.trim().length < 3) return setError("Ton secret est trop court.");
    setSending(true);
    try {
      await api.submitSecret({ room_code: code, author_id: me.id, target_id: targetId, content: content.trim() });
      flag.set(storageKey);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Envoi impossible.");
    } finally {
      setSending(false);
    }
  }

  if (alreadyDone) {
    const total = state.players.length || 1;
    const pct = Math.min(100, Math.round((state.secrets_submitted_count / total) * 100));
    return (
      <Card className="mx-auto max-w-lg text-center">
        <Spinner className="mx-auto mb-5 h-8 w-8" />
        <h2 className="text-2xl font-bold">Secret envoyé</h2>
        <p className="mt-2 text-white/60">On attend que tout le monde ait fini d'écrire.</p>
        <p className="mt-6 text-3xl font-extrabold text-amber">
          {state.secrets_submitted_count} / {state.players.length} secrets prêts
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-hot to-amber transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <form onSubmit={send} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Manche {round} : écris un secret sur un coéquipier</h2>
          <p className="mt-1 text-white/60">Il devra deviner que c'est toi. Reste drôle, pas blessant.</p>
        </div>

        <fieldset>
          <legend className="mb-3 text-sm font-medium text-white/70">Sur qui ?</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {others.map((p) => {
              const active = sameId(p.id, targetId);
              return (
                <label
                  key={p.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-amber ${
                    active ? "border-hot bg-hot/10" : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <input type="radio" name="target" className="sr-only" checked={active} onChange={() => setTargetId(p.id)} />
                  <Avatar name={p.username} size="sm" />
                  <span className="truncate font-medium">{p.username}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="secret" className="mb-2 block text-sm font-medium text-white/70">Ton secret</label>
          <textarea
            id="secret"
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, MAX))}
            rows={4}
            placeholder="Ex. Il a pleuré devant la fin d'un dessin animé."
            className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-lg outline-none transition placeholder:text-white/30 focus:border-hot focus:bg-white/10"
          />
          <p className="mt-1 text-right text-xs text-white/40">{content.length} / {MAX}</p>
        </div>

        <ErrorBanner message={error} />
        <Button type="submit" loading={sending} className="w-full py-4 text-lg">Envoyer mon secret</Button>
      </form>
    </Card>
  );
}
