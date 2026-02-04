# Radio App Frontend

This repository contains the frontend and core of the radio app developed during the "Mobile Software Engineering" module at International University Erfurt.
It is a **Vite + React** application that can be bundled with **Capacitor** for Android and iOS.

## Tech-Stack

- Vite (Build-Tool)
- React
- JavaScript (je nach Projekt-Setup)
- Tailwind CSS / daisyUI (UI-Styling)
- Prettier (Coding Guidelines)
- Capacitor (Bridge zu Android/iOS)
- vitest + react-testing-library für unit tests
- playwright für user-flow-test

## Requirements

- Node.js (LTS)
- npm

## Installation

```bash
# install dependencies
npm install
```

## Start Development

```bash
# Dev-Server with hot reload
npm run dev
```
Dev-server available at http://localhost:5173 (default).

```bash
# Prettier Check
npm run format:check

# Prettier Apply
npm run format
```

## Testing
```bash
# run all unit tests
npm run test

# run playwright flow-tests
npm run test:playwright

```

## Build for web

```bash
# build app
npm run build
```
App build accessible at dist/-folder.

## Build for mobile

```bash
# build app for web
npm run build

# add capacitor android target
npx cap add android

# sync from mobile to native
npx cap sync

# open Android Studio
npx cap open android
```
Native app builds accessible in android/ and ios/ folder. (Built by Capacitor)

## Folderstructure

```text
src/
  api/             // api calls
  assets/          // pictures
  components/      // ui components
    views/         // single view components
  config/          // configuration files
  context/         // react context providers
  views/           // Seiten/Views
  api/             // API-Calls
  App.jsx          // Layout
  main.jsx         // reacts top level file
tests/             // Playwright tests
+ various config files
```
