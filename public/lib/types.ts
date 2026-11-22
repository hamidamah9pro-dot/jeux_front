export interface Player {
  id: number | string;
  username: string;
  is_host?: boolean | number;
  has_submitted?: boolean | number;
}

export type GameStatus = "waiting" | "submitting" | "playing" | "round_over" | "finished";

export interface CurrentSecret {
  id: number | string;
  content: string;
  target: Player;
}

export interface Score extends Player {
  found: number;
  fooled: number;
  exposed: number;
  points: number;
}

export interface ResolvedSecret {
  id: number | string;
  round?: number;
  content: string;
  author: Player;
  target: Player;
  guessed_author?: Player | null;
  is_correct?: boolean | number;
}

export interface GameState {
  status: GameStatus;
  room_code?: string;
  players: Player[];
  secrets_submitted_count: number;
  current_secret?: CurrentSecret | null;
  resolved_secrets: ResolvedSecret[];
  round?: number;
  scores?: Score[];
  all_resolved_secrets?: ResolvedSecret[];
}

export const sameId = (a?: number | string | null, b?: number | string | null) =>
  a !== undefined && a !== null && b !== undefined && b !== null && String(a) === String(b);

export const isCorrect = (s: ResolvedSecret) =>
  s.is_correct !== undefined
    ? Boolean(Number(s.is_correct))
    : sameId(s.guessed_author?.id, s.author?.id);
