"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { SearchEntry } from "@/lib/docs";

type SearchResultsProps = {
  entries: SearchEntry[];
};

function scoreEntry(entry: SearchEntry, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return 0;
  }

  let score = 0;

  if (entry.title.toLowerCase().includes(normalized)) score += 6;
  if (entry.section.toLowerCase().includes(normalized)) score += 3;
  if (entry.description.toLowerCase().includes(normalized)) score += 2;
  if (entry.content.toLowerCase().includes(normalized)) score += 1;

  return score;
}

export function SearchResults({ entries }: SearchResultsProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const results = useMemo(() => {
    const normalized = query.trim();

    if (!normalized) {
      return [];
    }

    return entries
      .map((entry) => ({ entry, score: scoreEntry(entry, normalized) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title));
  }, [entries, query]);

  return (
    <div className="rounded-[2rem] border border-white/70 bg-panel/95 p-6 shadow-panel sm:p-10">
      <div className="max-w-3xl">
        <div className="rounded-full border border-pine/15 bg-pine/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-pine w-fit">
          Volltextsuche
        </div>
        <h1 className="mt-4 font-[var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
          Inhalte schnell finden
        </h1>
        <p className="mt-4 text-lg leading-7 text-slate">
          Die Suche durchsucht Seitentitel, Beschreibungen und Inhalte aller lokalen
          Dokumente im Repository.
        </p>
      </div>

      {!query.trim() ? (
        <div className="mt-8 rounded-2xl border border-dashed border-mist bg-canvas/70 p-6 text-slate">
          Nutze die Suche oben, um passende Seiten anzuzeigen.
        </div>
      ) : null}

      {query.trim() && results.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-mist bg-canvas/70 p-6 text-slate">
          Keine Treffer für "{query}". Versuche eine Abteilung, einen Prozessnamen oder
          einen Fachbegriff.
        </div>
      ) : null}

      {results.length > 0 ? (
        <div className="mt-8 grid gap-4">
          {results.map(({ entry }) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="rounded-2xl border border-mist bg-white/80 p-5 transition hover:-translate-y-0.5 hover:border-pine/30 hover:shadow-sm"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-pine">
                {entry.section}
              </div>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">
                {entry.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate">{entry.description}</p>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
