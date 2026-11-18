const GRADIENTS = [
  "from-pink-500 to-rose-600",
  "from-violet-500 to-indigo-600",
  "from-amber-400 to-orange-600",
  "from-cyan-400 to-blue-600",
  "from-emerald-400 to-teal-600",
  "from-fuchsia-500 to-purple-700",
];

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const dims = { sm: "h-9 w-9 text-sm", md: "h-14 w-14 text-xl", lg: "h-20 w-20 text-3xl" }[size];
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-bold shadow-lg ${dims} ${GRADIENTS[hash(name) % GRADIENTS.length]}`}
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}
