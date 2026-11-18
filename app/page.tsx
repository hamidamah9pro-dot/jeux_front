"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { loadSession, saveSession } from "@/lib/session";
import { Backdrop, Button, Card, ErrorBanner } from "@/components/ui";

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState<"create" | "join" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s = loadSession();
    if (s) setUsername(s.user.username);
    const fromLink = new URLSearchParams(window.location.search).get("code");
    if (fromLink) setCode(fromLink.replace(/[^a-zA-Z]/g, "").slice(0, 5).toUpperCase());
  }, []);

  const pseudo = username.trim();

  async function run(kind: "create" | "join") {
    setError(null);
    if (!pseudo) return setError("Choisis d'abord un pseudo.");
    if (kind === "join" && code.length !== 5) return setError("Le code du salon fait 5 lettres.");
    setBusy(kind);
    try {
      const res = kind === "create" ? await api.createGame(pseudo) : await api.joinGame(pseudo, code);
      saveSession({ user: res.user, is_host: kind === "create", room_code: res.room_code });
      router.push(`/game/${res.room_code}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
      setBusy(null);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-5 py-12">
      <Backdrop />

      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
          Qui a balancé<span className="text-hot"> ?</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-white/60">
          Écris un secret sur quelqu'un de ta bande. Il devra deviner qui l'a révélé.
        </p>
      </header>

      <div className="mx-auto mb-6 w-full max-w-md">
        <label htmlFor="pseudo" className="mb-2 block text-sm font-medium text-white/70">
          Ton pseudo
        </label>
        <input
          id="pseudo"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={20}
          required
          placeholder="Ex. Kouassi"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-lg outline-none transition placeholder:text-white/30 focus:border-hot focus:bg-white/10"
        />
      </div>

      <div className="mx-auto mb-6 w-full max-w-md empty:hidden">
        <ErrorBanner message={error} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="flex flex-col justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold">Créer un salon</h2>
            <p className="mt-2 text-white/60">Tu lances la partie et tu partages le code à ta bande.</p>
          </div>
          <Button onClick={() => run("create")} loading={busy === "create"} disabled={busy !== null}>
            Créer un salon
          </Button>
        </Card>

        <Card className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-bold">Rejoindre un salon</h2>
            <p className="mt-2 text-white/60">Entre le code que l'hôte t'a envoyé.</p>
          </div>
          <div>
            <label htmlFor="code" className="sr-only">Code du salon</label>
            <input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, 5).toUpperCase())}
              placeholder="Code du salon"
              autoCapitalize="characters"
              autoComplete="off"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center text-2xl font-bold tracking-[.4em] outline-none transition placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-white/30 focus:border-amber focus:bg-white/10"
            />
          </div>
          <Button variant="secondary" onClick={() => run("join")} loading={busy === "join"} disabled={busy !== null}>
            Rejoindre
          </Button>
        </Card>
      </div>
    </main>
  );
}
