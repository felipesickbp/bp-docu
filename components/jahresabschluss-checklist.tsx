"use client";

import { CheckCircle2, Circle, CircleHelp, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const JAHRESABSCHLUSS_STORAGE_KEY = "bp-docu-jahresabschluss-checklist-v1";

const JAHRESABSCHLUSS_ITEMS = [
  "Alle Dokumente sind verfügbar",
  "Banksaldo stimmt",
  "Kreditkarten stimmen",
  "Unklare Beträge",
  "Abschreibungen vorgenommen",
  "Versicherungskonten per Ende Jahr abgestimmt",
  "Darlehen verzinst",
  "Wertberichtigungen Forderungen (Delkredere)",
  "Offene Posten geprüft (Kreditoren und Debitoren)",
  "Unklare Transaktionen verbucht",
  "Jahresabstimmung MWST",
  "Abschluss in Aumico erstellen",
  "Abschlussgespräch abhalten",
  "Vollständigkeitserklärung",
  "GV-Protokoll",
  "Steuererklärung",
];

const PENDENZEN_HELP =
  "Beim Abschluss werden grundsätzlich alle Konten der Bilanz und Erfolgsrechnung durchgegangen. Kontonummern mit auffälligen, unklaren oder diskussionswürdigen Bewegungen werden notiert und später als Pendenzen beziehungsweise Gesprächspunkte mit dem Kunden verwendet.";

export function JahresabschlussChecklist() {
  const [openItems, setOpenItems] = useState<string[]>(JAHRESABSCHLUSS_ITEMS);
  const [doneItems, setDoneItems] = useState<string[]>([]);
  const [showPendenzenHelp, setShowPendenzenHelp] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(JAHRESABSCHLUSS_STORAGE_KEY);

    if (!storedValue) {
      return;
    }

    try {
      const parsed = JSON.parse(storedValue) as {
        openItems?: string[];
        doneItems?: string[];
      };

      if (parsed.openItems) {
        setOpenItems(parsed.openItems);
      }

      if (parsed.doneItems) {
        setDoneItems(parsed.doneItems);
      }
    } catch {
      window.localStorage.removeItem(JAHRESABSCHLUSS_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      JAHRESABSCHLUSS_STORAGE_KEY,
      JSON.stringify({ openItems, doneItems }),
    );
  }, [openItems, doneItems]);

  function completeItem(item: string) {
    setOpenItems((current) => current.filter((entry) => entry !== item));
    setDoneItems((current) => [item, ...current]);
  }

  function reopenItem(item: string) {
    setDoneItems((current) => current.filter((entry) => entry !== item));
    setOpenItems((current) => [...current, item]);
  }

  function resetChecklist() {
    setOpenItems(JAHRESABSCHLUSS_ITEMS);
    setDoneItems([]);
  }

  const completedCount = doneItems.length;
  const totalCount = useMemo(
    () => openItems.length + doneItems.length,
    [openItems.length, doneItems.length],
  );
  const isComplete = totalCount > 0 && completedCount === totalCount;

  return (
    <section className="mt-10">
      <div className="rounded-[2rem] border border-[#dde4f5] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0b214c]">
              Jahresabschluss
            </div>
            <h2 className="mt-2 font-[var(--font-heading)] text-2xl font-bold tracking-tight text-[#071a40]">
              Abschluss-Checkliste
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#42506c]">
              Erledigte Punkte werden für diesen Browser gespeichert. Sobald alle
              Punkte abgeschlossen sind, erscheint der Abschluss als fertig.
            </p>
          </div>
          <button
            type="button"
            onClick={resetChecklist}
            className="inline-flex items-center gap-2 rounded-full border border-[#d7dff0] px-4 py-2 text-sm font-medium text-[#071a40] transition hover:border-[#0b214c] hover:text-[#0b214c]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div
          className={`mt-6 rounded-2xl p-4 text-sm ${
            isComplete
              ? "border border-[#f2c94c] bg-[#fff7d8] text-[#5d4100]"
              : "bg-[#edf3fb] text-[#071a40]"
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            {isComplete ? (
              <span aria-hidden="true" className="text-xl leading-none">
                🏆
              </span>
            ) : null}
            <span>
              Erledigt: <span className="font-semibold">{completedCount}</span> von{" "}
              <span className="font-semibold">{totalCount}</span>
            </span>
            {isComplete ? <span className="font-semibold">Jahresabschluss fertig</span> : null}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {openItems.length > 0 ? (
            openItems.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => completeItem(item)}
                className="flex w-full items-start gap-3 rounded-2xl border border-[#e7ebf6] bg-[#f9fbff] px-4 py-4 text-left transition hover:border-[#0b214c] hover:bg-white"
              >
                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-[#0b214c]" />
                <span className="text-sm leading-7 text-[#071a40]">{item}</span>
              </button>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#f2c94c] bg-[#fff7d8] px-4 py-5 text-sm text-[#5d4100]">
              <span aria-hidden="true" className="mr-2">
                🏆
              </span>
              Alles erledigt. Der Jahresabschluss ist abgeschlossen.
            </div>
          )}
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#071a40]">
            <span>Pendenzen</span>
            <button
              type="button"
              aria-label="Beschreibung zu Pendenzen anzeigen"
              onMouseEnter={() => setShowPendenzenHelp(true)}
              onMouseLeave={() => setShowPendenzenHelp(false)}
              onFocus={() => setShowPendenzenHelp(true)}
              onBlur={() => setShowPendenzenHelp(false)}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#d7dff0] text-[#0b214c] transition hover:border-[#0b214c] hover:bg-[#f7f9ff] focus:outline-none focus:ring-2 focus:ring-[#0b214c]/25"
            >
              <CircleHelp className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 min-h-[4.5rem] rounded-2xl border border-dashed border-[#d7dff0] bg-[#f7f9ff] px-4 py-4 text-sm leading-7 text-[#42506c]">
            {showPendenzenHelp ? (
              PENDENZEN_HELP
            ) : (
              <span className="text-[#6d7890]">
                Offene Punkte aus der Abschlussprüfung.
              </span>
            )}
          </div>
        </div>

        <div className="mt-8">
          <div className="text-sm font-semibold text-[#071a40]">Erledigt</div>
          <div className="mt-3 space-y-3">
            {doneItems.length > 0 ? (
              doneItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => reopenItem(item)}
                  className="flex w-full items-start gap-3 rounded-2xl border border-[#dfe6f6] bg-white px-4 py-4 text-left transition hover:border-[#0b214c]"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2d8f6f]" />
                  <span className="text-sm leading-7 text-[#42506c]">{item}</span>
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#d7dff0] bg-[#f7f9ff] px-4 py-5 text-sm text-[#42506c]">
                Noch keine erledigten Punkte.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
