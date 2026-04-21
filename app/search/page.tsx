import { Suspense } from "react";
import { SiteShell } from "@/components/site-shell";
import { SearchResults } from "@/components/search-results";
import { getNavigation, getSearchEntries } from "@/lib/docs";

export const metadata = {
  title: "Suche | BP Docu",
};

export default function SearchPage() {
  return (
    <SiteShell
      navigation={getNavigation()}
      searchEntries={getSearchEntries()}
      currentPath="/search"
    >
      <Suspense
        fallback={
          <div className="rounded-[2rem] border border-white/70 bg-panel/95 p-6 shadow-panel sm:p-10">
            <div className="text-sm text-slate">Suche wird geladen...</div>
          </div>
        }
      >
        <SearchResults entries={getSearchEntries()} />
      </Suspense>
    </SiteShell>
  );
}
