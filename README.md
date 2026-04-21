# BP Docu

Leaner MVP fuer eine interne Wissensdatenbank auf Basis von **Next.js App Router**, **TypeScript**, **Tailwind** und **lokalen MDX-Dateien**.

## Architektur

- `app/`: Seiten und Layouts der Next.js App
- `components/`: wiederverwendbare UI-Bausteine wie Shell, Navigation und Suche
- `content/`: alle Dokumentationsseiten als `.mdx`
- `lib/`: Dateisystem-Loader, Navigation und Suchindex
- `public/`: spaetere statische Assets

Die Inhalte kommen direkt aus dem Repository. Es gibt fuer V1 **keine Datenbank**, **kein Login** und **kein CMS**.

## Lokales Setup

```bash
cd bp-docu
npm install
npm run dev
```

Danach im Browser oeffnen:

```txt
http://YOUR_VM_IP:3005
```

## Statischer Build

```bash
cd bp-docu
npm run build
python3 -m http.server 3005 --directory out
```

Danach ist die exportierte Version unter `http://YOUR_VM_IP:3005` erreichbar.

## Schnell anpassen

- Neue Seiten unter `content/...` als `.mdx` anlegen
- Titel, Beschreibung und Bereich ueber Frontmatter pflegen
- Navigation und Suche werden automatisch aus den Dateien erzeugt

Beispiel:

```mdx
---
title: Neue Seite
description: Kurze Beschreibung
section: Onboarding
---

# Neue Seite

Inhalt hier ergaenzen.
```

## Einfachster Deployment-Pfad fuer die VM

1. Repository auf der VM in einen **separaten Ordner** klonen, z. B. `/opt/bp-docu`
2. `npm install` ausfuehren
3. `npm run build` ausfuehren
4. Den Ordner `out/` ueber einen separaten Webserver oder Reverse Proxy auf `help.burkhart-partners.ch` ausliefern

Fuer V1 ist ein schlanker Reverse-Proxy-Setup ideal, zum Beispiel:

- statisch mit Caddy oder Nginx direkt aus `out/`
- alternativ `npm run dev` nur fuer schnelles internes Testen

## Dateien, die du spaeter manuell pflegst

- `content/**/*.mdx` fuer Inhalte
- `app/layout.tsx` fuer globalen Titel oder Branding
- `tailwind.config.js` und `app/globals.css` fuer Look & Feel
