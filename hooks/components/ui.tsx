"use client";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-night">
      <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] animate-drift rounded-full bg-hot/25 blur-[120px]" />
      <div className="absolute -bottom-40 -right-24 h-[30rem] w-[30rem] animate-drift rounded-full bg-violet-600/30 blur-[130px] [animation-delay:-6s]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,#0a0912_85%)]" />
    </div>
  );
}

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Chargement"
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/25 border-t-white ${className}`}
    />
  );
}

type Variant = "primary" | "secondary" | "ghost";

export function Button({
  loading,
  variant = "primary",
  className = "",
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; variant?: Variant }) {
  const styles: Record<Variant, string> = {
    primary: "bg-gradient-to-r from-hot to-violet-600 text-white shadow-lg shadow-hot/20 hover:brightness-110",
    secondary: "border border-white/15 bg-white/5 text-white hover:bg-white/10",
    ghost: "text-white/70 hover:text-white hover:bg-white/5",
  };
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="animate-pop rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
      {message}
    </p>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl border border-white/10 bg-plum/70 p-6 backdrop-blur-xl sm:p-8 ${className}`}>
      {children}
    </section>
  );
}
