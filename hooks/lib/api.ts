import type { GameState, Player } from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export class ApiError extends Error {}

async function request<T>(path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      cache: "no-store",
      ...(body !== undefined && {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    });
  } catch {
    throw new ApiError("Impossible de joindre le serveur. Vérifie ta connexion.");
  }

  const raw = await res.text();
  let data: any = null;
  try {
    data = JSON.parse(raw);
  } catch {
    // PHP peut afficher un warning/BOM avant le JSON : on tente d'extraire l'objet JSON.
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try { data = JSON.parse(raw.slice(start, end + 1)); } catch {}
    }
  }

  if (data === null || typeof data !== "object") {
    console.error(`[API] Réponse non JSON sur ${path} (HTTP ${res.status}) :`, raw.slice(0, 500));
    throw new ApiError(`Réponse invalide du serveur (HTTP ${res.status}). Ouvre la console pour voir le détail.`);
  }

  if (!res.ok || data.success === false || data.error) {
    throw new ApiError(data.error ?? data.message ?? `Erreur serveur (${res.status})`);
  }
  return data as T;
}

interface JoinResult { user: Player; room_code: string }

function normalize(data: any, username: string, fallbackCode?: string): JoinResult {
  const payload = data?.data ?? data ?? {};
  const user: Player = payload.user ?? { id: payload.user_id, username };
  const room_code: string = String(payload.room_code ?? payload.code ?? fallbackCode ?? "").toUpperCase();
  if (user.id === undefined || !room_code) throw new ApiError("Réponse inattendue du serveur.");
  return { user, room_code };
}

export const api = {
  createGame: async (username: string) =>
    normalize(await request("/create_game.php", { username }), username),

  joinGame: async (username: string, room_code: string) =>
    normalize(await request("/join_game.php", { username, room_code }), username, room_code),

  getState: (code: string) =>
    request<GameState>(`/game_state.php?code=${encodeURIComponent(code)}`),

  startGame: (room_code: string, user_id: number | string) =>
    request("/start_game.php", { room_code, user_id }),

  submitSecret: (p: { room_code: string; author_id: number | string; target_id: number | string; content: string }) =>
    request("/submit_secret.php", p),

  guessSecret: (p: { secret_id: number | string; guessed_author_id: number | string; user_id: number | string }) =>
    request("/guess_secret.php", p),
};
