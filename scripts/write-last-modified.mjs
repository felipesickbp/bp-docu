import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentRoot = path.join(root, "content");
const outputPath = path.join(root, "lib", "last-modified.generated.json");

function walkMdxFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return walkMdxFiles(fullPath);
    }

    return fullPath.endsWith(".mdx") ? [fullPath] : [];
  });
}

function filePathToHref(filePath) {
  const relativePath = path.relative(contentRoot, filePath);
  const withoutExtension = relativePath.replace(/\.mdx$/, "");

  if (withoutExtension === "start") {
    return "/";
  }

  return `/${withoutExtension.split(path.sep).join("/")}`;
}

function statDate(filePath) {
  return fs.statSync(filePath).mtime.toISOString().slice(0, 10);
}

function gitDate(filePath) {
  const relativePath = path.relative(root, filePath);

  return execFileSync("git", ["log", "-1", "--format=%cs", "--", relativePath], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
}

function canUseGit() {
  try {
    execFileSync("git", ["rev-parse", "--is-inside-work-tree"], {
      cwd: root,
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
}

if (!canUseGit() && fs.existsSync(outputPath)) {
  console.log("Keeping existing last-modified metadata because git is unavailable.");
  process.exit(0);
}

const lastModified = Object.fromEntries(
  walkMdxFiles(contentRoot)
    .map((filePath) => {
      const changedAt = canUseGit() ? gitDate(filePath) || statDate(filePath) : statDate(filePath);
      return [filePathToHref(filePath), changedAt];
    })
    .sort((a, b) => a[0].localeCompare(b[0])),
);

fs.writeFileSync(outputPath, `${JSON.stringify(lastModified, null, 2)}\n`);
console.log(`Wrote last-modified metadata for ${Object.keys(lastModified).length} docs.`);
