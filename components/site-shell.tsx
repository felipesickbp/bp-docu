"use client";

import { BookText, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";
import { PasswordGate } from "@/components/password-gate";
import type { NavGroup, SearchEntry } from "@/lib/docs";
import { SearchBox } from "@/components/search-box";
import { SidebarNav } from "@/components/sidebar-nav";

type SiteShellProps = {
  children: ReactNode;
  navigation: NavGroup[];
  searchEntries: SearchEntry[];
  currentPath: string;
};

export function SiteShell({
  children,
  navigation,
  searchEntries,
  currentPath,
}: SiteShellProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PasswordGate>
      <div className="min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-[300px] shrink-0 flex-col rounded-[2rem] border border-white/70 bg-white/82 p-5 shadow-panel backdrop-blur lg:flex">
            <Link href="/" className="rounded-[1.6rem] bg-[linear-gradient(155deg,#071a40,#3a3d8f_55%,#7b61ff)] p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Image src="/favicon.png" alt="Burkhart & Partners" width={38} height={38} />
                </div>
                <div>
                  <div className="font-[var(--font-heading)] text-lg font-bold tracking-tight">
                    BP Docu
                  </div>
                  <div className="text-sm text-white/75">Onboarding, Prozesse und Vorlagen</div>
                </div>
              </div>
            </Link>
            <div className="mt-5">
              <SearchBox entries={searchEntries} compact />
            </div>
            <div className="mt-6 overflow-y-auto pr-1">
              <SidebarNav navigation={navigation} currentPath={currentPath} />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <header className="mb-6 overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 shadow-panel backdrop-blur">
              <div className="bg-[linear-gradient(120deg,rgba(7,26,64,0.96),rgba(44,56,132,0.92)_55%,rgba(123,97,255,0.88))] px-5 py-5 text-white sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsOpen(true)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white lg:hidden"
                      aria-label="Navigation oeffnen"
                    >
                      <Menu className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-white/10 sm:flex">
                        <Image
                          src="/favicon.png"
                          alt="Burkhart & Partners"
                          width={38}
                          height={38}
                        />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/72">
                          Interne Wissensdatenbank
                        </div>
                        <h1 className="font-[var(--font-heading)] text-2xl font-bold tracking-tight">
                          Burkhart & Partners
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div className="w-full max-w-xl">
                    <SearchBox entries={searchEntries} initialQuery="" />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 px-5 py-4 sm:px-6">
                <div className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#4a46d4]">
                  BP Internal
                </div>
                <div className="text-sm text-slate">
                  Schnell auffindbares Wissen fuer Mitarbeitende, Prozesse und Vorlagen.
                </div>
              </div>
            </header>

            <main>{children}</main>
          </div>
        </div>
        {isOpen ? (
          <div className="fixed inset-0 z-40 bg-ink/35 lg:hidden" onClick={() => setIsOpen(false)}>
            <aside
              className="h-full w-[85vw] max-w-[320px] border-r border-white/70 bg-panel p-5 shadow-panel"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pine text-white">
                    <BookText className="h-5 w-5" />
                  </div>
                  <div className="font-[var(--font-heading)] text-lg font-bold text-ink">
                    BP Docu
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-ink"
                  aria-label="Navigation schliessen"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-5">
                <SearchBox entries={searchEntries} compact />
              </div>
              <div className="mt-6 overflow-y-auto">
                <SidebarNav
                  navigation={navigation}
                  currentPath={currentPath}
                  onNavigate={() => setIsOpen(false)}
                />
              </div>
            </aside>
          </div>
        ) : null}
      </div>
    </PasswordGate>
  );
}
