"use client";

import clsx from "clsx";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { SearchEntry } from "@/lib/docs";

type SearchBoxProps = {
  entries: SearchEntry[];
  initialQuery?: string;
  compact?: boolean;
};

function rankEntries(entries: SearchEntry[], query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  return entries
    .map((entry) => {
      const title = entry.title.toLowerCase();
      const section = entry.section.toLowerCase();
      const description = entry.description.toLowerCase();
      const content = entry.content.toLowerCase();

      let score = 0;

      if (title.includes(normalized)) score += 6;
      if (section.includes(normalized)) score += 3;
      if (description.includes(normalized)) score += 2;
      if (content.includes(normalized)) score += 1;

      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, 6);
}

export function SearchBox({
  entries,
  initialQuery = "",
  compact = false,
}: SearchBoxProps) {
  const [query, setQuery] = useState(initialQuery);
  const results = useMemo(() => rankEntries(entries, query), [entries, query]);

  return (
    <div className="relative">
      <div
        className={clsx(
          "flex items-center gap-3 rounded-2xl border border-white/80 bg-white/85 px-4 shadow-sm backdrop-blur",
          compact ? "h-11" : "h-12",
        )}
      >
        <Search className="h-4 w-4 text-slate" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Suche nach Prozessen, Themen, Begriffen..."
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate/70"
        />
      </div>

      {query.trim() ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-30 overflow-hidden rounded-2xl border border-white/70 bg-panel shadow-panel">
          {results.length > 0 ? (
            <div className="divide-y divide-mist">
              {results.map(({ entry }) => (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className="block px-4 py-3 transition hover:bg-pine/5"
                >
                  <div className="text-sm font-semibold text-ink">{entry.title}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-pine/80">
                    {entry.section}
                  </div>
                  <div className="mt-2 text-sm text-slate">
                    {entry.description}
                  </div>
                </Link>
              ))}
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className="block bg-canvas px-4 py-3 text-sm font-medium text-pine transition hover:bg-mist/50"
              >
                Alle Treffer fuer "{query}" ansehen
              </Link>
            </div>
          ) : (
            <div className="px-4 py-5 text-sm text-slate">
              Keine direkten Treffer. Versuche kürzere Begriffe oder einen anderen Prozessnamen.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
