"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameState } from "@/hooks/useGameState";
import { loadSession, type Session } from "@/lib/session";
import { sameId } from "@/lib/types";
import { Backdrop, Button, Card, Spinner } from "@/components/ui";
import { Lobby } from "./Lobby";
import { WriteSecret } from "./WriteSecret";
import { Investigation } from "./Investigation";
import { Scoreboard } from "./Scoreboard";
import { RoundOver } from "./RoundOver";

export default function GameHub({ code }: { code: string }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const s = loadSession();
    if (!s || s.room_code.toUpperCase() !== code) {
      router.replace(`/?code=${code}`);
      return;
    }
    setSession(s);
    setChecked(true);
  }, [code, router]);

  const { state, error, loading, refresh } = useGameState(checked ? code : null);

  if (!checked || !session || (loading && !state)) {
    return (
      <main className="grid min-h-screen place-items-center">
        <Backdrop />
        <Spinner className="h-10 w-10" />
      </main>
    );
  }

  if (!state) {
    return (
      <main className="grid min-h-screen place-items-center px-5">
        <Backdrop />
        <Card className="max-w-md text-center">
          <h1 className="text-2xl font-bold">Salon introuvable</h1>
          <p className="mt-2 text-white/60">{error ?? "Vérifie le code ou crée un nouveau salon."}</p>
          <Button className="mt-6" onClick={() => router.push("/")}>Retour à l'accueil</Button>
        </Card>
      </main>
    );
  }

  const me = session.user;
  const isHost = session.is_host || Boolean(Number(state.players.find((p) => sameId(p.id, me.id))?.is_host));

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-8">
      <Backdrop />
      <header className="mb-8 flex items-center justify-between gap-4">
        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70">
          Salon <b className="tracking-widest text-amber">{code}</b>
        </span>
        <span className="text-sm text-white/60">
          {state.status !== "waiting" && state.status !== "finished" && <>Manche {state.round ?? 1} · </>}
          {me.username}
        </span>
      </header>

      {error && (
        <p role="status" className="mb-6 rounded-xl border border-amber/30 bg-amber/10 px-4 py-2 text-center text-sm text-amber">
          Connexion instable, nouvelle tentative…
        </p>
      )}

      {state.status === "waiting" && <Lobby code={code} state={state} me={me} isHost={isHost} onStarted={refresh} />}
      {state.status === "submitting" && <WriteSecret code={code} state={state} me={me} />}
      {state.status === "playing" && <Investigation code={code} state={state} me={me} />}
      {state.status === "round_over" && <RoundOver code={code} state={state} me={me} isHost={isHost} onChanged={refresh} />}
      {state.status === "finished" && <Scoreboard state={state} me={me} />}
    </main>
  );
}
