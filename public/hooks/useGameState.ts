"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import type { GameState } from "@/lib/types";

const POLL_MS = 2000;

export function useGameState(code: string | null) {
  const [state, setState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const inFlight = useRef(false);
  const alive = useRef(true);

  const refresh = useCallback(async () => {
    if (!code || inFlight.current) return;
    inFlight.current = true;
    try {
      const data = await api.getState(code);
      if (!alive.current) return;
      setState(data);
      setError(null);
    } catch (e) {
      if (alive.current) setError(e instanceof Error ? e.message : "Connexion perdue");
    } finally {
      inFlight.current = false;
      if (alive.current) setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    alive.current = true;
    if (!code) return;
    refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => {
      alive.current = false;
      clearInterval(id);
    };
  }, [code, refresh]);

  return { state, error, loading, refresh };
}
