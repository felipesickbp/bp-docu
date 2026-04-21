"use client";

import Link from "next/link";
import { CheckCircle2, Circle, ExternalLink, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const CHECKLIST_STORAGE_KEY = "bp-docu-onboarding-checklist";

const DEFAULT_ITEMS = [
  "Laptop, E-Mail und Kalenderzugang pruefen",
  "Teams, geteilte Ordner und Passwort-Tools einrichten",
  "Vorstellung mit Teamlead und wichtigsten Ansprechpartnern machen",
  "Wichtige Prozesse im eigenen Bereich ueberblicken",
  "Erste Fragen und offene Punkte dokumentieren",
];

const USEFUL_LINKS = [
  {
    title: "ESTV MWST Portal",
    href: "https://www.mwstabrechnen.estv.admin.ch/pro/home",
    description: "Offizielles Portal fuer MWST-Abrechnung und related Aufgaben.",
  },
  {
    title: "eAdminPortal",
    href: "https://www.eadminportal.ch/portal/Portal.do?login",
    description: "Zentraler Einstieg fuer weitere administrative Portale.",
  },
  {
    title: "bexflow",
    href: "https://bexflow.ch/de",
    description: "Unternehmensplattform fuer den produktnahen Arbeitskontext.",
  },
];

export function OnboardingChecklist() {
  const [activeItems, setActiveItems] = useState<string[]>(DEFAULT_ITEMS);
  const [archivedItems, setArchivedItems] = useState<string[]>([]);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);

    if (!storedValue) {
      return;
    }

    try {
      const parsed = JSON.parse(storedValue) as {
        activeItems?: string[];
        archivedItems?: string[];
      };

      if (parsed.activeItems) {
        setActiveItems(parsed.activeItems);
      }

      if (parsed.archivedItems) {
        setArchivedItems(parsed.archivedItems);
      }
    } catch {
      window.localStorage.removeItem(CHECKLIST_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      CHECKLIST_STORAGE_KEY,
      JSON.stringify({ activeItems, archivedItems }),
    );
  }, [activeItems, archivedItems]);

  function archiveItem(item: string) {
    setActiveItems((current) => current.filter((entry) => entry !== item));
    setArchivedItems((current) => [item, ...current]);
  }

  function restoreItem(item: string) {
    setArchivedItems((current) => current.filter((entry) => entry !== item));
    setActiveItems((current) => [...current, item]);
  }

  function resetChecklist() {
    setActiveItems(DEFAULT_ITEMS);
    setArchivedItems([]);
  }

  const completedCount = archivedItems.length;
  const totalCount = useMemo(
    () => activeItems.length + archivedItems.length,
    [activeItems.length, archivedItems.length],
  );

  return (
    <section className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-[2rem] border border-[#dde4f5] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5b52ff]">
              Onboarding Checklist
            </div>
            <h2 className="mt-2 font-[var(--font-heading)] text-2xl font-bold tracking-tight text-[#071a40]">
              Erste Schritte fuer neue Mitarbeitende
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#42506c]">
              Klick auf einen Punkt, wenn er erledigt ist. Der Eintrag wandert danach
              automatisch ins Archiv und bleibt fuer diesen Browser gespeichert.
            </p>
          </div>
          <button
            type="button"
            onClick={resetChecklist}
            className="inline-flex items-center gap-2 rounded-full border border-[#d7dff0] px-4 py-2 text-sm font-medium text-[#071a40] transition hover:border-[#5b52ff] hover:text-[#5b52ff]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-[linear-gradient(135deg,rgba(7,26,64,0.06),rgba(91,82,255,0.08))] p-4 text-sm text-[#071a40]">
          Erledigt: <span className="font-semibold">{completedCount}</span> von{" "}
          <span className="font-semibold">{totalCount}</span>
        </div>

        <div className="mt-6 space-y-3">
          {activeItems.length > 0 ? (
            activeItems.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => archiveItem(item)}
                className="flex w-full items-start gap-3 rounded-2xl border border-[#e7ebf6] bg-[#f9fbff] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-[#5b52ff] hover:bg-white"
              >
                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-[#5b52ff]" />
                <span className="text-sm leading-7 text-[#071a40]">{item}</span>
              </button>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#d7dff0] bg-[#f7f9ff] px-4 py-5 text-sm text-[#42506c]">
              Alles erledigt. Im Archiv kannst du Punkte bei Bedarf wieder
              zurueckholen.
            </div>
          )}
        </div>

        <div className="mt-8">
          <div className="text-sm font-semibold text-[#071a40]">Archiv</div>
          <div className="mt-3 space-y-3">
            {archivedItems.length > 0 ? (
              archivedItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => restoreItem(item)}
                  className="flex w-full items-start gap-3 rounded-2xl border border-[#dfe6f6] bg-white px-4 py-4 text-left transition hover:border-[#5b52ff]"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2d8f6f]" />
                  <span className="text-sm leading-7 text-[#42506c]">{item}</span>
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#d7dff0] bg-[#f7f9ff] px-4 py-5 text-sm text-[#42506c]">
                Noch keine archivierten Punkte.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[#dde4f5] bg-white p-6 shadow-sm sm:p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5b52ff]">
          Nuetzliche Links
        </div>
        <h2 className="mt-2 font-[var(--font-heading)] text-2xl font-bold tracking-tight text-[#071a40]">
          Schnellzugriff fuer den Start
        </h2>
        <div className="mt-6 space-y-4">
          {USEFUL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="block rounded-2xl border border-[#e7ebf6] bg-[linear-gradient(180deg,#ffffff,#f8faff)] p-5 transition hover:-translate-y-0.5 hover:border-[#5b52ff]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-base font-semibold text-[#071a40]">{link.title}</div>
                <ExternalLink className="h-4 w-4 text-[#5b52ff]" />
              </div>
              <p className="mt-2 text-sm leading-6 text-[#42506c]">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
