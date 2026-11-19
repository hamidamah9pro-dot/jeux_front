import type { Player } from "./types";

export interface Session {
  user: Player;
  is_host: boolean;
  room_code: string;
}

export function saveSession(s: Session) {
  localStorage.setItem("user", JSON.stringify(s.user));
  localStorage.setItem("is_host", String(s.is_host));
  localStorage.setItem("room_code", s.room_code);
}

export function loadSession(): Session | null {
  try {
    const user = localStorage.getItem("user");
    const room = localStorage.getItem("room_code");
    if (!user || !room) return null;
    return {
      user: JSON.parse(user) as Player,
      is_host: localStorage.getItem("is_host") === "true",
      room_code: room,
    };
  } catch {
    return null;
  }
}

export function clearSession() {
  ["user", "is_host", "room_code"].forEach((k) => localStorage.removeItem(k));
}

export const flag = {
  get: (key: string) => {
    try { return localStorage.getItem(key) === "1"; } catch { return false; }
  },
  set: (key: string) => {
    try { localStorage.setItem(key, "1"); } catch {}
  },
};
