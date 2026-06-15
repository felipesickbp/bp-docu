import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { OnboardingChecklist, UsefulLinksSection } from "@/components/onboarding-checklist";
import { SiteShell } from "@/components/site-shell";
import { mdxComponents } from "@/components/mdx-components";
import {
  getAllDocSlugs,
  getDocBySlug,
  getNavigation,
  getSearchEntries,
  slugToHref,
} from "@/lib/docs";

type PageProps = {
  params: {
    slug?: string[];
  };
};

function formatSwissDate(date: string) {
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return "";
  }

  return `${day}.${month}.${year}`;
}

export function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps) {
  const doc = getDocBySlug(params.slug ?? []);

  if (!doc) {
    return {};
  }

  return {
    title: `${doc.title} | BP Docu`,
    description: doc.description,
  };
}

export default function DocPage({ params }: PageProps) {
  const doc = getDocBySlug(params.slug ?? []);

  if (!doc) {
    notFound();
  }

  const isOnboardingPage = doc.href === "/unternehmen/onboarding/erste-woche";
  const isUsefulLinksPage = doc.href === "/unternehmen/onboarding/nuetzliche-links";

  return (
    <SiteShell
      navigation={getNavigation()}
      searchEntries={getSearchEntries()}
      currentPath={slugToHref(doc.slug)}
    >
      <div className="rounded-[2rem] border border-white/70 bg-panel/95 p-6 shadow-panel sm:p-10">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <span className="rounded-full border border-pine/15 bg-pine/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-pine">
              {doc.section}
            </span>
            <span className="text-sm text-slate">{doc.description}</span>
          </div>
          {doc.lastModified ? (
            <span className="shrink-0 text-xs font-medium uppercase tracking-[0.14em] text-slate/70 md:pt-1">
              Zuletzt geändert: {formatSwissDate(doc.lastModified)}
            </span>
          ) : null}
        </div>
        {isOnboardingPage ? <OnboardingChecklist /> : null}
        <article className={isOnboardingPage ? "docs-prose mt-12" : "docs-prose"}>
          <MDXRemote
            source={doc.content}
            components={mdxComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </article>
        {isUsefulLinksPage ? <UsefulLinksSection /> : null}
      </div>
    </SiteShell>
  );
}
