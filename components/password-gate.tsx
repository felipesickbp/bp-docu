"use client";

import Image from "next/image";
import { LockKeyhole } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useState } from "react";

const ACCESS_PASSWORD = "Burkhartundpartners2026";
const STORAGE_KEY = "bp-docu-access-granted";

type PasswordGateProps = {
  children: ReactNode;
};

export function PasswordGate({ children }: PasswordGateProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const granted = window.localStorage.getItem(STORAGE_KEY) === "true";
    setIsUnlocked(granted);
    setIsReady(true);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password === ACCESS_PASSWORD) {
      window.localStorage.setItem(STORAGE_KEY, "true");
      setIsUnlocked(true);
      setError("");
      return;
    }

    setError("Passwort nicht korrekt.");
  }

  if (!isReady) {
    return null;
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f7fb]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(91,82,255,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(7,26,64,0.16),transparent_26%),linear-gradient(180deg,#ffffff,#eef2fb)]" />
      <div className="absolute inset-0 bg-grid bg-[size:22px_22px] opacity-40" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="grid w-full gap-6 lg:grid-cols-[1.2fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/70 bg-[#071a40] p-8 text-white shadow-panel sm:p-10">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/10 p-3">
                <Image src="/favicon.png" alt="Burkhart & Partners" width={44} height={44} />
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.28em] text-white/65">
                  Burkhart & Partners
                </div>
                <h1 className="mt-2 font-[var(--font-heading)] text-4xl font-bold tracking-tight">
                  BP Docu
                </h1>
              </div>
            </div>

            <p className="mt-8 max-w-xl text-lg leading-8 text-white/82">
              Interne Wissensdatenbank fuer Onboarding, Prozesse, Vorlagen und
              teamrelevante Informationen.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-white/55">
                  Inhalt
                </div>
                <div className="mt-2 text-base font-semibold">Onboarding und Prozesse</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-white/55">
                  Zugriff
                </div>
                <div className="mt-2 text-base font-semibold">Einfacher Passwortschutz</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-white/55">
                  V1
                </div>
                <div className="mt-2 text-base font-semibold">Schnell testbar auf dem VM</div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-panel backdrop-blur sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#071a40,#5b52ff)] text-white">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <div className="mt-6 text-sm uppercase tracking-[0.24em] text-[#5b52ff]">
              Interner Zugang
            </div>
            <h2 className="mt-3 font-[var(--font-heading)] text-3xl font-bold tracking-tight text-[#071a40]">
              Inhalte entsperren
            </h2>
            <p className="mt-4 leading-7 text-[#42506c]">
              Fuer V1 ist ein einfacher Passwortschutz aktiv. Das ist praktisch fuer
              internes Testen, aber noch kein vollwertiger Sicherheitsmechanismus.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#071a40]">
                  Passwort
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-14 w-full rounded-2xl border border-[#d7dff0] bg-[#f6f8fd] px-4 text-[#071a40] outline-none transition focus:border-[#5b52ff]"
                  placeholder="Passwort eingeben"
                />
              </label>
              {error ? <p className="text-sm text-[#bf3f5f]">{error}</p> : null}
              <button
                type="submit"
                className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#071a40,#5b52ff)] px-5 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Wissensdatenbank oeffnen
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
