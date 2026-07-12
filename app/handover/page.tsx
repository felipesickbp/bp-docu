import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BexFLOW — Technische Übergabe | BP Docu",
  description:
    "Technische Übergabe von BexFLOW: Architektur, Deployment, Runbook. Deutsch, mit englischen Codebezeichnern.",
};

function loadHandover() {
  const filePath = path.join(process.cwd(), "app/handover/handover.html");
  const raw = fs.readFileSync(filePath, "utf8");

  const styleMatch = raw.match(/<style>([\s\S]*?)<\/style>/);
  const style = styleMatch ? styleMatch[1] : "";

  // Body starts after the closing </style> tag and continues to end of file.
  const afterStyle = raw.split("</style>")[1] ?? "";
  return { style, body: afterStyle };
}

const DOWNLOAD_BAR_HTML = `
<div class="handover-actions">
  <div class="handover-actions-inner">
    <div class="handover-actions-text">
      Diese Seite entspricht dem PDF-Dokument. Für den Offline-Versand steht
      dieselbe Fassung als PDF-Download bereit.
    </div>
    <a class="handover-download" href="/downloads/BexFLOW_Uebergabe.pdf" download>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
           stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      <span>PDF herunterladen</span>
    </a>
  </div>
</div>
`;

const RESET_CSS = `
  /* Neutralise bp-docu globals for this page so the handover design owns it. */
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

  /* Download-CTA banner, style-linked to the handover system */
  .handover-actions {
    max-width: 1180px;
    margin: 0 auto;
    padding: 24px 32px 0;
  }
  .handover-actions-inner {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 12px 18px;
    border: 1px solid var(--rule);
    background: var(--surface);
    box-shadow: var(--shadow);
  }
  .handover-actions-text {
    flex: 1;
    color: var(--ink-muted);
    font-size: 13px;
    line-height: 1.5;
    min-width: 0;
  }
  .handover-download {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--accent);
    color: #FFFFFF !important;
    padding: 9px 14px;
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    text-decoration: none !important;
    border-radius: 2px;
    white-space: nowrap;
    transition: background 120ms ease;
  }
  .handover-download:hover,
  .handover-download:focus-visible {
    background: var(--accent-strong);
    color: #FFFFFF !important;
  }
  :root[data-theme="dark"] .handover-download,
  @media (prefers-color-scheme: dark) {
    .handover-download { color: #0A0E15 !important; }
    .handover-download:hover, .handover-download:focus-visible { color: #0A0E15 !important; }
  }
  @media (max-width: 720px) {
    .handover-actions { padding: 16px 20px 0; }
    .handover-actions-inner { flex-direction: column; align-items: flex-start; }
    .handover-download { align-self: stretch; justify-content: center; }
  }
`;

export default function HandoverPage() {
  const { style, body } = loadHandover();
  const combinedCss = RESET_CSS + "\n" + style;
  const combinedBody = DOWNLOAD_BAR_HTML + body;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: combinedCss }} />
      <div dangerouslySetInnerHTML={{ __html: combinedBody }} />
    </>
  );
}
