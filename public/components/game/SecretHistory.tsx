import { Avatar } from "@/components/Avatar";
import { isCorrect, type ResolvedSecret } from "@/lib/types";

export function SecretHistory({ secrets, title }: { secrets: ResolvedSecret[]; title?: string }) {
  if (!secrets.length) return null;
  return (
    <div className="space-y-4">
      {title && <h3 className="text-xl font-bold">{title}</h3>}
      <ul className="space-y-3">
        {secrets.map((s) => {
          const ok = isCorrect(s);
          return (
            <li
              key={s.id}
              className={`animate-reveal rounded-2xl border p-5 ${
                ok ? "border-red-400/30 bg-red-500/5" : "border-emerald-400/30 bg-emerald-500/5"
              }`}
            >
              <p className="text-lg leading-snug">« {s.content} »</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
                <span className="flex items-center gap-2">
                  <Avatar name={s.target.username} size="sm" />
                  Sur <b className="text-white">{s.target.username}</b>
                </span>
                <span className="flex items-center gap-2">
                  <Avatar name={s.author.username} size="sm" />
                  Écrit par <b className="text-white">{s.author.username}</b>
                </span>
              </div>
              <p className={`mt-3 text-sm font-semibold ${ok ? "text-red-300" : "text-emerald-300"}`}>
                {s.guessed_author
                  ? ok
                    ? `${s.author.username} a été démasqué par ${s.target.username}.`
                    : `${s.target.username} a accusé ${s.guessed_author.username}, mais c'était ${s.author.username}.`
                  : `${s.author.username} n'a pas été démasqué.`}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
