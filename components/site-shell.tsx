"use client";

import { Menu, X } from "lucide-react";
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
          <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-[300px] shrink-0 flex-col rounded-[2rem] border border-[#d9e2f0] bg-white p-5 shadow-panel lg:flex">
            <Link href="/" className="rounded-[1.6rem] bg-[#0b214c] p-4 text-white">
              <div className="px-1 py-1">
                <Image
                  src="/bp-logo-white.png"
                  alt="Burkhart & Partners"
                  width={132}
                  height={38}
                />
              </div>
            </Link>
            <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-1">
              <SidebarNav navigation={navigation} currentPath={currentPath} />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <header className="mb-6 overflow-hidden rounded-[2rem] border border-[#d9e2f0] bg-white shadow-panel">
              <div className="flex flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d9e2f0] bg-white text-[#0b214c] lg:hidden"
                  aria-label="Navigation öffnen"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className="w-full max-w-xl">
                  <SearchBox entries={searchEntries} initialQuery="" />
                </div>
              </div>
            </header>

            <main>{children}</main>
          </div>
        </div>
        {isOpen ? (
          <div className="fixed inset-0 z-40 bg-ink/35 lg:hidden" onClick={() => setIsOpen(false)}>
            <aside
              className="flex h-full w-[85vw] max-w-[320px] flex-col overflow-hidden border-r border-white/70 bg-panel p-5 shadow-panel"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <Link href="/" onClick={() => setIsOpen(false)} className="rounded-2xl bg-[#0b214c] p-3">
                  <Image
                    src="/bp-logo-white.png"
                    alt="Burkhart & Partners"
                    width={110}
                    height={32}
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-ink"
                  aria-label="Navigation schließen"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-1">
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
