import { Avatar } from "@/components/Avatar";
import { sameId, type Player, type Score } from "@/lib/types";

export function Leaderboard({ scores, me }: { scores: Score[]; me?: Player }) {
  return (
    <ol className="space-y-3">
      {scores.map((r, i) => (
        <li
          key={r.id}
          className={`flex items-center gap-4 rounded-2xl p-3 ${i === 0 && r.points > 0 ? "border border-amber/40 bg-amber/10" : "bg-white/5"}`}
        >
          <span className={`w-6 text-center text-xl font-extrabold ${i === 0 ? "text-amber" : "text-white/40"}`}>{i + 1}</span>
          <Avatar name={r.username} size="sm" />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold">
              {r.username}
              {me && sameId(r.id, me.id) && <span className="text-white/50"> (toi)</span>}
            </span>
            <span className="block text-xs text-white/50">
              {r.found} deviné{r.found > 1 ? "s" : ""} · {r.fooled} bien caché{r.fooled > 1 ? "s" : ""}
            </span>
          </span>
          <span className="text-right">
            <b className="text-2xl text-white">{r.points}</b>
            <span className="ml-1 text-sm text-white/50">pt{r.points > 1 ? "s" : ""}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
