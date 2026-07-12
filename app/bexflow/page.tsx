import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BexFLOW — Technisches Dokument | BP Docu",
  description:
    "Technische Übersicht von BexFLOW: was die App tut, wie sie aufgebaut ist, wie sie deployt und betrieben wird. Für Entwicklerinnen und Entwickler.",
};

function loadDocument() {
  const filePath = path.join(process.cwd(), "app/bexflow/document.html");
  const raw = fs.readFileSync(filePath, "utf8");

  const styleMatch = raw.match(/<style>([\s\S]*?)<\/style>/);
  const style = styleMatch ? styleMatch[1] : "";

  const afterStyle = raw.split("</style>")[1] ?? "";
  return { style, body: afterStyle };
}

const RESET_CSS = `
  /* Neutralise bp-docu globals so this page owns its visual system. */
  body {
    background: #EDEFF3 !important;
    background-image: none !important;
    color: #0F172A !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif !important;
    min-height: 100vh !important;
  }
  @media (prefers-color-scheme: dark) {
    body { background: #0A0E15 !important; color: #E7EAEE !important; }
  }
  :root[data-theme="light"] body { background: #EDEFF3 !important; color: #0F172A !important; }
  :root[data-theme="dark"]  body { background: #0A0E15 !important; color: #E7EAEE !important; }
`;

export default function BexflowDocumentPage() {
  const { style, body } = loadDocument();
  const combinedCss = RESET_CSS + "\n" + style;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: combinedCss }} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  );
}
