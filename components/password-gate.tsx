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
    <div className="min-h-screen bg-[#0b214c]">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full rounded-[2rem] border border-white/10 bg-white p-8 shadow-[0_12px_30px_rgba(7,26,64,0.12)] sm:p-10">
          <div className="rounded-2xl bg-[#0b214c] px-4 py-4">
            <Image src="/bp-logo.png" alt="Burkhart & Partners" width={150} height={44} />
          </div>

          <div className="mt-8 flex items-center gap-3 text-[#0b214c]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b214c] text-white">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div>
              <div className="font-[var(--font-heading)] text-3xl font-bold tracking-tight">
                Wissensdatenbank
              </div>
              <div className="mt-1 text-sm text-[#5a6985]">Version 21.04.2026</div>
            </div>
          </div>

          <p className="mt-6 leading-7 text-[#42506c]">
            Interne Wissensdatenbank für Onboarding, Prozesse und Vorlagen.
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
                className="h-14 w-full rounded-2xl border border-[#d7dff0] bg-[#f6f8fd] px-4 text-[#071a40] outline-none transition focus:border-[#0b214c]"
                placeholder="Passwort eingeben"
              />
            </label>
            {error ? <p className="text-sm text-[#bf3f5f]">{error}</p> : null}
            <button
              type="submit"
              className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[#0b214c] px-5 text-sm font-semibold text-white transition hover:bg-[#12316c]"
            >
              Wissensdatenbank öffnen
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
