# Projekt: Radio App zur Interaktion zwischen Hörer:innen und Radiomoderator:innen bei Radio Regenbogen
```text
Die Folgende Datei umfasst eine grobe Gliederung des Projektberichts, der diesem Universitäts-Projekt angegliedert ist. Er ist als Inspiration gedacht und umfasst weder den Endzustand noch hat er den Anspruch an Perfektion.
- no english version -
```

## 1. Einleitung (1.5 - 2)
1.1 Ausgangssituation (kurz)
- Beschreibung der Problemstellung (Interaktionsmöglichkeiten zwischen Moderator:innen und Hörer:innen)
- Zielsetzung des Projekts

1.2 Projektidee und Ziele
- Definition der Zielgruppen (Hörer:innen und Radiomoderator:innen) (inkl. Basis Barrierefrei)
- Beschreibung der App-Funktionalitäten (User Strories)
- Nichtfunktionale Anforderungen (CIA, testing-strat, homogener Look & Feel, Userflow, ..)
- Geplantes Endprodukt (interaktiver Radio-App Prototyp, nicht deployed (kein ops), keine pipeline)

1.3 Kurzer Überblick über die Gliederung des Berichts

## 2. Projektplanung (2 - 2.5)
2.1 Projektorganisation
- Rollenverteilung im Team / Überblick über Entwicklungsansatz (Sprints, Scrum Light-Light?! (Dailys, Aufgabenteilung, Gegencheck))
- Kommunikation (Teams (daylies + rückfragen per chat)) 
- Kollaboration (GitHub + Link + Verweis auf Readme)

2.2 Projektphasen und Zeitplanung
- Projektstruktur mit Meilensteinen:
  - Sprint 1: Projektplanung (inkl alles in diesem Kapitel) + Tech-Stack-Test + Grober Backend-Stub (startet mit einer Kickoff besprechung mit allem in diesem Kapitel genannten)
  - Sprint 2: hardcoded UI/UX Layout + Grundkonzept + User Story 1 
  - Sprint 3: User Stories 2-5 mit nachschärfen von UI/UX
  - Sprint 4: Teststrategie planen + UI/UX angleichen + Refactoring (Architektur, Projektstruktur,..)
  - Sprint 5: Tests implementieren + Refactoring (minor)

2.3 Ressourcenplanung
- Datenquellen (Backend-Stub-Annahmen)
- Backend Stub grob implementiert + Anpassungen (da Vorerfahrung einseitig)
- Vorüberlegung Tech-Stack (nur grob: React + Capacitor, Design-Adds?, Codequality-Adds? etc.)
- Entwicklungs Software (IDE, Emulatoren (eventuell))

## 3. Projektdurchführung (7–8)
3.1 Technisches Konzept (final)
- Architekturübersicht (Frontend/Backend-Kommunikation, API-Stubs, Diagram?)
- Entscheidungen zu Framework/Sprachen/Tools
- Sicherheits- und Authentifizierungskonzept (Login/Register-Funktion, Tokenhandling)

3.2 Frontend-Implementierung (final)
- Projektstruktur (allgemein + frontend im Detail)
- UI/UX-Konzept (Layout-Aufbau, Navigation, mobile Responsive Design, Toast Messages)
- Beschreibung Views (Home (+Moderatorbewertung), Playlist, Liedwunsch/Feedback, Login/User)
- Wiederkehrende Komponenten (ContentWrapper mit Header-Child (fixable) + Weitere, homogene Buttons (3 typen), homogene Cards (Varianten), Loading Spinner)?
- Barrierefreiheit in Form von xy
- Codebeispiele?

3.3 Backend-Stub-Implementierung
- Beschreibung Endpunkte
- Datenmodell und Beispielantworten
- kein Testing ?

3.4 Strategie im Detail
- Datenaustausch (ein detailliertes Beispiel von WishASong?)
- Rollen und Authentifizierung
- Fehler- und Ausnahmebehandlung, Userfeedback

3.5 Tests und Qualitätssicherung?
- Tests (unit tests im frontend (logik + teils komponenten), playwright test für userflow, 20 klicks manuell im browser für moderator:in + hörer:in (überschaubar))
- Codequality mit Prettier (Whitespaces, Linelength, Naming) + IDE-Hinweise (kein fest implementiertes Tool für Code Smells)
- Screenshots (Testlauf, Playwright Testlauf)?

## 4. Ergebnisse und Reflexion (2)
4.1 Projektergebnisse
- Implementierung vs. User Stories (alles erfüllt)
- Technischer Erfolg (Funktion auf Android/iOS?)

4.2 Nutzertauglich ?
- Wie gut erfüllt die App die Anforderungen des Radiosenders?
- Nutzerinteraktion erfoglreich? Mehrwert gegenüber Instagram?
- Kein realer Test von Barrierefreiheit, aber Aufbau gemäß W3C-HTML-Empfehlungen

4.3 Kritik und Verbesserungspotenziale
- organisatorische Herausforderungen?
  - neues Team -> eingrooven
- technische Herausforderungen
  - teils neue Tools + wenig Vorerfahrung = viele Documentationen wälzen
  - mehr testen?
- zukünftige Erweiterungen 
  - Spam-Schutz?
  - Backend-Integration
  - Weitere Features
    - Themes (Dark/Light) mit DaisyUI
    - Echtzeit-Kommunikation
    - Push Notifications
    - Userprofile
    - Forcast Playlists/Moderatoren

4.4 Persönliche Reflexion
- Teamarbeit und Aufgabenteilung
- Lernfortschritte im Bereich Mobile Software Engineering

## 5. Fazit und Ausblick (0,5–1)
- wichtigsten Erkenntnisse
- Potenziale (zukünftige Weiterentwicklung, bestehende Systeme)


-----------------------
-----------------------
## Quellen und Anhang
- Literatur
- Architekturdiagramme
- Mockups
- Codeauszüge
- Screenshots
(GitHub Link aufs Titelblatt)