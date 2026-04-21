import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
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

  return (
    <SiteShell
      navigation={getNavigation()}
      searchEntries={getSearchEntries()}
      currentPath={slugToHref(doc.slug)}
    >
      <div className="rounded-[2rem] border border-white/70 bg-panel/95 p-6 shadow-panel sm:p-10">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-pine/15 bg-pine/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-pine">
            {doc.section}
          </span>
          <span className="text-sm text-slate">{doc.description}</span>
        </div>
        <article className="docs-prose">
          <MDXRemote
            source={doc.content}
            components={mdxComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </article>
      </div>
    </SiteShell>
  );
}
