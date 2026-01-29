# Radio App Frontend

Dieses Repository enthält das Frontend und Herzstück der Radio-App für das Modul „Mobile Software Engineering“.  
Es handelt sich um eine **Vite + React** Anwendung, die mit Capacitor für Android und iOS gebündelt werden kann.

## Tech-Stack

- Vite (Build-Tool)
- React
- JavaScript (je nach Projekt-Setup)
- Tailwind CSS / daisyUI (UI-Styling)
- Prettier (Coding Guidelines)
- Capacitor (Bridge zu Android/iOS)

## Voraussetzungen

- Node.js (LTS)
- npm

## Installation

```bash
# Dependencies installieren
npm install
```

## Entwicklung starten

```bash
# Dev-Server mit Hot-Reload
npm run dev
```

Der Dev-Server ist unter http://localhost:5173 erreichbar.

```bash
# Prettier Check
npx prettier . --check

# Prettier Anwenden
npx prettier . --write
```

## Build für Web

```bash
# Produktionsbuild erzeugen
npm run build
```

Das gebaute Frontend liegt anschließend im dist/-Ordner.

## Build für Mobile

```bash
# Web-Assets bauen
npm run build

# Änderungen in die nativen Projekte synchronisieren
npx cap sync

# Android Studio / Xcode öffnen (falls eingerichtet)
npx cap open android
npx cap open ios
```

Die generierten Ordner android/ und ios/ werden über Capacitor erzeugt.

## Ordnerstruktur

```text
src/
  components/      // UI-Komponenten
  views/           // Seiten/Views
  api/             // API-Calls
```
