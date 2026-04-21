import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_ROOT = path.join(process.cwd(), "content");

const SECTION_ORDER = [
  "Unternehmen",
  "Mandate & Kunden",
  "Buchhaltung",
  "Personaladministration / Payroll",
  "Steuern / MWST",
  "Ressourcen",
];

export type Doc = {
  slug: string[];
  title: string;
  description: string;
  section: string;
  navOrder: number;
  content: string;
  href: string;
};

export type SearchEntry = {
  title: string;
  description: string;
  section: string;
  href: string;
  content: string;
};

export type NavGroup = {
  label: string;
  items: Array<{
    title: string;
    href: string;
  }>;
};

function walkMdxFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return walkMdxFiles(fullPath);
    }

    return fullPath.endsWith(".mdx") ? [fullPath] : [];
  });
}

function stripMarkdown(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[>#*_~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function filePathToSlug(filePath: string) {
  const relativePath = path.relative(CONTENT_ROOT, filePath);
  const withoutExtension = relativePath.replace(/\.mdx$/, "");

  if (withoutExtension === "start") {
    return [];
  }

  return withoutExtension.split(path.sep);
}

export function slugToHref(slug: string[]) {
  return slug.length === 0 ? "/" : `/${slug.join("/")}`;
}

export function getAllDocs(): Doc[] {
  const files = walkMdxFiles(CONTENT_ROOT);

  return files
    .map((filePath) => {
      const source = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(source);
      const slug = filePathToSlug(filePath);

      return {
        slug,
        title: String(data.title ?? slug.at(-1) ?? "Unbenannt"),
        description: String(data.description ?? ""),
        section: String(data.section ?? "Allgemein"),
        navOrder: Number(data.navOrder ?? 999),
        content,
        href: slugToHref(slug),
      };
    })
    .sort((a, b) => a.navOrder - b.navOrder || a.href.localeCompare(b.href));
}

export function getDocBySlug(slug: string[]) {
  return getAllDocs().find((doc) => doc.href === slugToHref(slug));
}

export function getAllDocSlugs() {
  return getAllDocs().map((doc) => doc.slug);
}

export function getNavigation(): NavGroup[] {
  const groups = new Map<string, NavGroup>();

  for (const section of SECTION_ORDER) {
    groups.set(section, { label: section, items: [] });
  }

  for (const doc of getAllDocs()) {
    if (!groups.has(doc.section)) {
      groups.set(doc.section, { label: doc.section, items: [] });
    }

    groups.get(doc.section)?.items.push({
      title: doc.title,
      href: doc.href,
    });
  }

  const ordered = Array.from(groups.entries())
    .sort((a, b) => {
      const aIndex = SECTION_ORDER.indexOf(a[0]);
      const bIndex = SECTION_ORDER.indexOf(b[0]);
      const safeA = aIndex === -1 ? SECTION_ORDER.length : aIndex;
      const safeB = bIndex === -1 ? SECTION_ORDER.length : bIndex;

      return safeA - safeB || a[0].localeCompare(b[0]);
    })
    .map(([, group]) => group)
    .filter((group) => group.items.length > 0);

  return ordered;
}

export function getSearchEntries(): SearchEntry[] {
  return getAllDocs().map((doc) => ({
    title: doc.title,
    description: doc.description,
    section: doc.section,
    href: doc.href,
    content: stripMarkdown(doc.content),
  }));
}
