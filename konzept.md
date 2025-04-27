# Konzept für die Webapp "Freiplatzfinder"

## Überblick

"Freiplatzfinder" ist eine mobile-optimierte Webapp zur Verwaltung und Suche von freien Plätzen und Stunden in Jugendhilfeeinrichtungen nach SGB VIII. Die Anwendung bietet vier Benutzerrollen mit unterschiedlichen Berechtigungen und Funktionen.

## Rollenkonzept

### 1. Administrator

**Hauptfunktionen:**
- Benutzerkonten anlegen und verwalten
- Träger anlegen und verwalten
- Jugendhilfe-Kategorien nach SGB VIII definieren
- Benutzerkonten mit Trägern verknüpfen (n:m-Beziehung)
- Systemeinstellungen konfigurieren
- Zugriff auf umfangreiche Logdaten

### 2. Träger

**Hauptfunktionen:**
- Eigene Einrichtungen anlegen und verwalten mit folgenden Informationen:
  - Name, Anschrift
  - Ansprechpartner, Telefonnummer, E-Mail
  - Öffnungszeiten
  - Maximale Kapazität
- Verfügbare Plätze/Stunden verwalten, kategorisiert nach:
  - Jugendhilfe-Kategorien (vom Admin definiert)
  - Geschlechtereignung
  - Altersgruppen
- Zugang zu Premium-Modul für erweiterte Auswertungen

### 3. Fallmanager (Jugendamt)

**Hauptfunktionen:**
- Schnelle, unkomplizierte Suche nach freien Plätzen/Stunden
- Drill-Down-Navigation:
  1. Kategorie auswählen
  2. Träger auswählen
  3. Einrichtung auswählen
  4. Einrichtungsdetails einsehen
- Direktkontaktmöglichkeiten:
  - Telefonanruf starten
  - E-Mail schreiben
  - Navigation zur Einrichtung öffnen
- Filteroptionen nach Geschlecht und Alter

### 4. Amtsleitung

**Hauptfunktionen:**
- Umfangreiche Auswertungsmöglichkeiten:
  - Platzbelegungsquoten
  - Trendanalysen
  - Bedarfsplanung
- Export von Berichten und Statistiken

## Technische Anforderungen

- Mobile-optimierte Benutzeroberfläche
- Responsive Design für verschiedene Endgeräte
- Reine Informationsplattform ohne Buchungs- oder Bestätigungsfunktionen
- Sicheres Authentifizierungssystem mit Rollenverwaltung
- Datenbankstruktur für effiziente Suche und Filterung

## Systemarchitektur

Die Anwendung besteht aus folgenden Hauptkomponenten:

1. **Frontend**
   - Responsive Benutzeroberfläche
   - Authentifizierungsmodul
   - Rollenspezifische Dashboards

2. **Backend**
   - REST-API für Datenzugriff
   - Authentifizierungs- und Autorisierungssystem
   - Business-Logic für Suche und Filterung

3. **Datenbank**
   - Benutzer und Rollen
   - Träger und deren Zuordnungen
   - Einrichtungen mit Detailinformationen
   - SGB VIII Kategorien
   - Verfügbare Plätze/Stunden mit Eigenschaften
   - System-Logs

## Datenmodell

Das Datenmodell umfasst folgende Hauptentitäten:

1. **Benutzer**
   - Benutzerdaten und Zugangsinformationen
   - Rollenzuordnung (Admin, Träger, Fallmanager, Amtsleitung)

2. **Träger**
   - Grundlegende Trägerinformationen
   - Verknüpfung mit Benutzerkonten (n:m)
   - Premium-Status

3. **Einrichtungen**
   - Detaillierte Einrichtungsinformationen
   - Maximale Kapazität
   - Zuordnung zu einem Träger

4. **Kategorien**
   - SGB VIII spezifische Kategorien
   - Referenzen und Beschreibungen

5. **Verfügbare Plätze**
   - Anzahl freier Plätze oder Stunden
   - Kategorie-Zuordnung
   - Geschlechtereignung
   - Altersbereich
   - Aktualisierungsdatum

6. **System-Logs**
   - Benutzeraktionen
   - Systemereignisse
   - Zeitstempel und IP-Adressen

## Funktionsablauf nach Benutzerrollen

### Administrator
1. Login in das Administratorpanel
2. Verwalten von Benutzern, Trägern und Kategorien
3. Zuordnung von Trägern zu Benutzerkonten
4. Konfiguration von Systemeinstellungen
5. Einsicht in Logdaten

### Träger
1. Login in das Trägerportal
2. Verwaltung der eigenen Einrichtungen
3. Pflege der Einrichtungsdetails
4. Aktualisierung der verfügbaren Plätze/Stunden
5. Bei Premium-Status: Zugriff auf erweiterte Auswertungen

### Fallmanager
1. Login in das Fallmanagerportal
2. Auswahl von Filtern (Geschlecht, Alter)
3. Drill-Down-Navigation: Kategorie → Träger → Einrichtung → Details
4. Direktkontakt mit Einrichtungen (Telefon, E-Mail, Navigation)

### Amtsleitung
1. Login in das Amtsleitungsportal
2. Zugriff auf Dashboard mit Auswertungen
3. Auswahl verschiedener Berichte und Statistiken
4. Export von Daten für weitere Analysen

## Benutzererfahrung und Design

- Klare, intuitive Benutzeroberfläche
- Schnellzugriff auf häufig genutzte Funktionen
- Optimierung für mobile Endgeräte (Touch-freundlich)
- Einheitliches Farbschema und Corporate Design
- Übersichtliche Darstellung komplexer Daten
- Schnelle Ladezeiten

## Sicherheit und Datenschutz

- Sichere Authentifizierung und Autorisierung
- Verschlüsselte Datenübertragung
- Regelmäßige Backups
- Einhaltung der DSGVO-Anforderungen
- Protokollierung sicherheitsrelevanter Ereignisse

## Premium-Funktionen

- Detaillierte Statistiken und Grafiken
- Exportmöglichkeiten in verschiedenen Formaten
- Erweiterte Filtermöglichkeiten
- Historische Datenanalyse und Trenddarstellung
- Kapazitätsplanung

## Tech Stack

### Frontend
- **Framework**: React.js mit TypeScript
- **UI-Komponenten**: Material-UI oder Tailwind CSS für responsive Design
- **State Management**: Redux oder Context API
- **Routing**: React Router
- **Formulare**: Formik mit Yup für Validierung
- **API-Kommunikation**: Axios oder Fetch API
- **Visualisierung**: Chart.js oder D3.js für Auswertungen und Dashboards
- **PWA-Funktionalität**: Service Worker für Offline-Zugriff

### Backend
- **Framework**: Node.js mit Express oder NestJS
- **API-Architektur**: RESTful API
- **Authentifizierung**: JWT (JSON Web Tokens) mit Refresh-Token-Mechanismus
- **Validierung**: Joi oder class-validator
- **Logging**: Winston oder Pino

### Datenbank
- **Primäre DB**: PostgreSQL für relationale Daten
- **Caching**: Redis für Performance-Optimierung
- **ORM**: Sequelize oder TypeORM

### Deployment & DevOps
- **Containerisierung**: Docker mit Docker Compose
- **CI/CD**: GitLab CI/CD oder GitHub Actions
- **Hosting**: AWS, Azure oder Google Cloud Platform
- **SSL**: Let's Encrypt für HTTPS
- **Monitoring**: Prometheus mit Grafana

### Weitere Tools
- **Testing**: Jest mit React Testing Library
- **Dokumentation**: Swagger/OpenAPI für APIs
- **Versionierung**: Git mit Feature-Branch-Workflow
- **Code-Qualität**: ESLint, Prettier, Husky (Pre-commit Hooks)

## Ist-Analyse

### Aktuelle Situation
1. **Manuelle Prozesse**: 
   - Freie Plätze und Stunden werden aktuell telefonisch oder per E-Mail abgefragt
   - Keine zentrale Datenbank für verfügbare Ressourcen
   - Hoher Zeitaufwand für Fallmanager bei der Platzsuche

2. **Informationsfluss**:
   - Verzögerte Aktualisierung von Verfügbarkeiten
   - Unvollständige oder veraltete Informationen
   - Ineffiziente Kommunikation zwischen Jugendamt und Trägern

3. **Datenstruktur**:
   - Uneinheitliche Erfassung von Einrichtungsinformationen
   - Unterschiedliche Kategorisierungen der Hilfeformen
   - Mangelnde Standardisierung von Kapazitätsangaben

4. **Auswertungsmöglichkeiten**:
   - Manuelle Erstellung von Statistiken mit hohem Aufwand
   - Fehlende Echtzeit-Datenbasis für strategische Entscheidungen
   - Eingeschränkte Möglichkeiten zur Bedarfsplanung

5. **Zugänglichkeit**:
   - Wissen über freie Plätze oft nur bei einzelnen Mitarbeitern
   - Keine mobilen Zugriffsmöglichkeiten im Außendienst
   - Zeitgebundene Anfragen während Bürozeiten

### Probleme und Herausforderungen
1. **Zeitverlust**:
   - Durchschnittlich 45-60 Minuten pro Platzsuche durch telefonische Anfragen
   - Verzögerungen bei der Hilfegewährung aufgrund langwieriger Suchprozesse

2. **Ressourceneffizienz**:
   - Erhebliche Personalbindung für administrative Prozesse
   - Suboptimale Auslastung der verfügbaren Plätze im Gesamtsystem

3. **Informationsqualität**:
   - Inkonsistente Daten zu Verfügbarkeiten
   - Fehlende Transparenz über spezifische Platzmerkmale (Alter, Geschlecht)

4. **Planbarkeit**:
   - Mangelnde Datenbasis für fundierte Bedarfsplanung
   - Reaktive statt proaktive Kapazitätssteuerung

5. **Datenschutz**:
   - Unzureichende Kontrolle über sensible Informationen
   - Fehlende Dokumentation von Zugriffen und Änderungen

## Bedarfsanalyse

### Primäre Anforderungen

1. **Zentralisierung**:
   - Einheitliche Plattform für alle Beteiligten im Jugendhilfesystem
   - Standardisierte Erfassung und Kategorisierung nach SGB VIII
   - Echtzeit-Aktualisierung der Verfügbarkeiten

2. **Effizienzsteigerung**:
   - Reduzierung der Suchzeit für passende Plätze um mindestens 75%
   - Beschleunigung der Hilfegewährung durch sofortige Verfügbarkeitsinformation
   - Automatisierte Filterung nach relevanten Kriterien

3. **Transparenz**:
   - Vollständige Übersicht über das regionale Angebot
   - Detaillierte Einrichtungsinformationen für fundierte Entscheidungen
   - Vergleichbarkeit verschiedener Angebote

4. **Mobilität**:
   - Nutzbarkeit auf verschiedenen Endgeräten
   - Offline-Zugriff auf grundlegende Informationen
   - Integration in bestehende mobile Arbeitsabläufe

5. **Analytische Kapazitäten**:
   - Echtzeit-Auswertungen zur Auslastung
   - Trendanalysen für strategische Planung
   - Datenbasierte Entscheidungsgrundlagen für Ressourcenplanung

### Stakeholder-Anforderungen

1. **Jugendamt-Fallmanager**:
   - Schneller Zugriff auf freie Kapazitäten
   - Filter nach spezifischen Bedarfskriterien
   - Direktkommunikation mit Einrichtungen
   - Mobiler Zugriff im Außendienst

2. **Jugendamt-Leitung**:
   - Überblick über Gesamtauslastung
   - Analytische Tools für Bedarfsplanung
   - Exportierbare Berichte für Gremien
   - Trendanalysen für strategische Entscheidungen

3. **Träger und Einrichtungen**:
   - Einfache Aktualisierung der Verfügbarkeiten
   - Bessere Auslastung durch höhere Sichtbarkeit
   - Reduzierter administrativer Aufwand
   - Zugang zu relevanten Statistiken

4. **IT-Administration**:
   - Zentrale Nutzerverwaltung
   - Übersichtliche Berechtigungssteuerung
   - Umfassendes Logging für Sicherheit und Nachvollziehbarkeit
   - Wartungsfreundliche Systemarchitektur

### Funktionale Bedarfe

1. **Suchfunktionen**:
   - Mehrstufige Filterung (Kategorie, Alter, Geschlecht, Region)
   - Sortierung nach Relevanz und Verfügbarkeit
   - Kartenansicht für räumliche Orientierung
   - Speicherung häufiger Suchkriterien

2. **Verwaltungsfunktionen**:
   - Einfache Aktualisierung von Kapazitäten
   - Batch-Import von Einrichtungsdaten
   - Automatische Benachrichtigungen bei kritischen Änderungen
   - Versionierung von Einträgen

3. **Analytische Funktionen**:
   - Dashboards mit Schlüsselkennzahlen
   - Historische Vergleiche der Auslastung
   - Prognosemodelle für zukünftige Bedarfe
   - Exportfunktionen in gängige Formate

4. **Sicherheitsfunktionen**:
   - Rollenbasierte Zugriffssteuerung
   - Protokollierung aller relevanten Aktionen
   - Regelmäßige Datensicherung
   - Compliance mit DSGVO-Anforderungen

### Technische Bedarfe

1. **Performance**:
   - Schnelle Suchzeiten (<2 Sekunden)
   - Optimierte Datenbank für komplexe Abfragen
   - Effizientes Caching für wiederkehrende Anfragen
   - Skalierbare Architektur für wachsende Nutzerzahlen

2. **Sicherheit**:
   - Verschlüsselte Datenübertragung
   - Sichere Authentifizierung mit 2FA-Option
   - Regelmäßige Sicherheitsaudits
   - Automatisierte Bedrohungserkennung

3. **Integration**:
   - API-Schnittstellen für künftige Anbindungen
   - Exportformate für gängige Office-Anwendungen
   - Optionale Anbindung an bestehende Fallmanagementsysteme
   - Benachrichtigungssystem (E-Mail, Push)

4. **Wartbarkeit**:
   - Modulare Architektur für einfache Erweiterungen
   - Umfassende Dokumentation
   - Automatisierte Tests für kritische Funktionen
   - Klare Versionierungsstrategie

## Fazit der Analyse

Die Ist-Analyse zeigt deutliche Ineffizienzen im aktuellen manuellen Prozess der Platzsuche und -verwaltung in der Jugendhilfe. Die identifizierten Probleme führen zu Zeitverlusten, suboptimaler Ressourcennutzung und eingeschränkter Planbarkeit.

Die Bedarfsanalyse unterstreicht die Notwendigkeit einer zentralen, echtzeit-fähigen Plattform mit rollenspezifischen Funktionen. Der vorgeschlagene Tech-Stack bietet die technologische Basis, um sowohl die funktionalen als auch die nicht-funktionalen Anforderungen zu erfüllen.

Die Webapp "Freiplatzfinder" adressiert diese Bedarfe durch ein durchdachtes Rollenkonzept, mobile Optimierung und leistungsfähige Suchfunktionen. Besonderer Wert wird auf Benutzerfreundlichkeit und schnelle Informationsvermittlung gelegt, um den Arbeitsalltag der Akteure im Jugendhilfesystem spürbar zu verbessern.

## Detaillierter Seitenüberblick der Webapp

Die folgende Aufstellung gibt einen strukturierten Überblick über alle wesentlichen Seiten der "Freiplatzfinder"-Webapp, gegliedert nach Benutzerrollen.

### Allgemeine Seiten (Alle Rollen)

1. **Startseite**
   - Login-Formular
   - Kurze Produktbeschreibung
   - Aktuelle Systemmeldungen/Ankündigungen
   - Passwort-Vergessen-Funktion

2. **Login-Seite**
   - Benutzername/E-Mail Eingabefeld
   - Passwort-Eingabefeld
   - "Anmelden"-Button
   - Link zur Passwort-Wiederherstellung

3. **Passwort-Wiederherstellung**
   - E-Mail-Eingabefeld
   - Sicherheitsabfrage
   - Hinweise zum Verfahren

4. **Profilseite**
   - Persönliche Informationen (Name, E-Mail, etc.)
   - Passwort-Änderungsmöglichkeit
   - Benachrichtigungseinstellungen
   - Kontaktinformationen

5. **Hilfe & Support**
   - FAQ-Bereich
   - Kontaktformular
   - Bedienungsanleitung
   - Videotutorials (optional)

### Administrator-Bereich

1. **Admin-Dashboard**
   - Systemübersicht (Nutzerzahlen, aktive Sessions)
   - Wichtige Kennzahlen (Neuregistrierungen, offene Support-Anfragen)
   - Benachrichtigungen und Warnungen
   - Schnellzugriff auf wichtige Funktionen

2. **Benutzerverwaltung**
   - Tabellarische Übersicht aller Benutzer
   - Filteroptionen (nach Rolle, Status, etc.)
   - Benutzer anlegen/bearbeiten/deaktivieren
   - Rollen zuweisen
   - Benutzeraktivitäten einsehen

3. **Trägerverwaltung**
   - Liste aller Träger
   - Neuen Träger anlegen
   - Trägerdetails bearbeiten
   - Premium-Status verwalten
   - Träger deaktivieren

4. **Kategorienverwaltung**
   - Übersicht SGB VIII Kategorien
   - Neue Kategorie anlegen
   - Kategoriehierarchie definieren
   - Kategorien bearbeiten/deaktivieren

5. **Zuordnungsmanagement**
   - Matrix-Ansicht Benutzer/Träger
   - Mehrfachzuordnungen vornehmen
   - Berechtigungen für Zuordnungen verwalten
   - Zuordnungshistorie

6. **Systemeinstellungen**
   - Allgemeine Einstellungen
   - Sicherheits- und Datenschutzeinstellungen
   - E-Mail-Vorlagen konfigurieren
   - System-Backups verwalten
   - Wartungsmodus aktivieren/deaktivieren

7. **Logdaten**
   - Umfangreiche Logsuche mit Filtern
   - Benutzerbezogene Aktivitäten
   - Sicherheitsrelevante Ereignisse
   - Export von Logdaten
   - Archivierte Logs

### Träger-Bereich

1. **Träger-Dashboard**
   - Übersicht eigener Einrichtungen
   - Kennzahlen (Gesamtkapazität, freie Plätze)
   - Benachrichtigungen 
   - Wichtige Termine/Fristen

2. **Einrichtungsverzeichnis**
   - Liste aller eigenen Einrichtungen
   - Filteroptionen
   - Neue Einrichtung anlegen
   - Status-Übersicht (aktiv/inaktiv)

3. **Einrichtung anlegen/bearbeiten**
   - Grunddaten (Name, Anschrift)
   - Kontaktdaten (Ansprechpartner, Telefon, E-Mail)
   - Öffnungszeiten und Erreichbarkeit
   - Upload von Bildern/Dokumenten
   - Kapazitätsangaben

4. **Platzverwaltung**
   - Übersicht freier Plätze nach Kategorien
   - Schnellaktualisierung von Verfügbarkeiten
   - Filtermöglichkeiten (nach Altersgruppen, Geschlecht)
   - Historische Entwicklung

5. **Platzverfügbarkeit bearbeiten**
   - Anzahl freier Plätze/Stunden pro Kategorie
   - Zielgruppenspezifikation (Alter, Geschlecht)
   - Aktualisierungsstatus mit Zeitstempel
   - Bestätigungsfunktion für unveränderte Daten
   - Gültigkeitszeitraum
   - Zusatzinformationen

6. **Premium-Statistiken** (nur mit Premium-Status)
   - Detaillierte Auslastungsstatistiken
   - Vergleich mit ähnlichen Einrichtungen (anonymisiert)
   - Trendanalysen
   - Prognosetools

7. **Aktualisierungsmanagement**
   - Gesamtübersicht aller Platzangebote mit Aktualisierungsdatum
   - Batch-Aktualisierungsfunktion ("Alle Daten bestätigen")
   - Hervorhebung veralteter Einträge (nicht aktualisiert seit X Tagen)
   - Automatische Erinnerungen für regelmäßige Aktualisierungen

### Fallmanager-Bereich

1. **Fallmanager-Dashboard**
   - Schnellsuche nach Plätzen
   - Gespeicherte Suchfilter
   - Aktuelle Benachrichtigungen
   - Zuletzt besuchte Einrichtungen

2. **Platzsuche**
   - Umfassende Filtermöglichkeiten:
     - Kategorie nach SGB VIII
     - Altersgruppe
     - Geschlecht
     - Regionale Eingrenzung
   - Sortieroptionen (Entfernung, Verfügbarkeit)
   - Speichern von Suchkriterien

3. **Kategorieauswahl** (1. Stufe Drill-Down)
   - Übersichtliche Darstellung aller verfügbaren Kategorien
   - Anzahl verfügbarer Plätze pro Kategorie
   - Kurzbeschreibungen
   - Visualisierung durch Icons/Grafiken

4. **Trägerauswahl** (2. Stufe Drill-Down)
   - Liste relevanter Träger für gewählte Kategorie
   - Kurzinfo (Anzahl passender Einrichtungen)
   - Sortieroptionen (alphabetisch, nach Verfügbarkeit)

5. **Einrichtungsauswahl** (3. Stufe Drill-Down)
   - Einrichtungsliste mit Basisinformationen
   - Anzahl freier Plätze in gewählter Kategorie
   - Optional: Kartenansicht
   - Entfernungsangabe

6. **Einrichtungsdetails** (4. Stufe Drill-Down)
   - Umfassende Einrichtungsinformationen
   - Verfügbare Plätze nach Kategorien
   - Datum der letzten Aktualisierung für jeden Platz
   - Kontaktdaten mit Direktaktionen:
     - Anruf-Button
     - E-Mail-Formular
     - Navigations-Button
   - Öffnungszeiten
   - Besonderheiten der Einrichtung

7. **Favoriten**
   - Persönliche Liste gespeicherter Einrichtungen
   - Notizfunktion
   - Schnellzugriff auf Kontaktdaten

8. **Suchergebnisse**
   - Tabellarische und/oder Kartenansicht
   - Detaillierte Filteroptionen
   - Vergleichsfunktion für mehrere Einrichtungen
   - Export-Möglichkeit

### Amtsleitung-Bereich

1. **Amtsleitungs-Dashboard**
   - Übersicht wichtiger Kennzahlen
   - Aktuelle Belegungssituation
   - Trendanzeigen
   - Warnhinweise (kritische Kapazitäten)

2. **Auswertungsmodul**
   - Umfangreiche Filtermöglichkeiten
   - Verschiedene Diagrammtypen
   - Zeitraumauswahl
   - Dynamische Datenvisualisierung

3. **Platzbelegungsquoten**
   - Gesamtübersicht
   - Aufschlüsselung nach Kategorien
   - Historische Entwicklung
   - Regionale Verteilung

4. **Trendanalysen**
   - Langzeitentwicklung der Belegung
   - Saisonale Muster
   - Prognosemodelle
   - Vergleichszeiträume

5. **Bedarfsplanung**
   - Aktuelle vs. benötigte Kapazitäten
   - Szenarien-Simulation
   - Demographische Faktoren
   - Handlungsempfehlungen

6. **Berichterstellung**
   - Auswahl vorbereiteter Berichtsvorlagen
   - Individualisierbare Parameter
   - Vorschaufunktion
   - Exportformate (PDF, Excel, Word)

7. **Export-Center**
   - Verschiedene Exportformate
   - Anpassbare Datenfelder
   - Planbare regelmäßige Exporte
   - Datenschutzhinweise

### Responsive Design-Anpassungen

Für die mobile Nutzung werden folgende Anpassungen vorgesehen:

1. **Navigation**
   - Hamburger-Menü für alle Hauptfunktionen
   - Bottom-Navigation für häufig genutzte Funktionen
   - Breadcrumbs für Drill-Down-Navigation
   - Zurück-Button auf allen Unterseiten

2. **Listenansichten**
   - Reduzierte Informationsdichte
   - Größere Touch-Targets
   - Pull-to-Refresh Funktion
   - Unendliches Scrollen statt Paginierung

3. **Detailansichten**
   - Tab-basierte Organisation von Inhalten
   - Ausklappbare Panels für umfangreiche Informationen
   - Optimierte Eingabeformulare für Touch
   - Große, gut erreichbare Aktions-Buttons

4. **Mobile-spezifische Funktionen**
   - Geolocation für Nahbereichssuche
   - Optimierte Telefon-Integration
   - Kamera-Integration für Dokumentenupload
   - Offline-Funktionalität für Basisinformationen

### Ergänzende Module und Seiten

1. **Benachrichtigungscenter**
   - Zentrale Sammlung aller Systemmeldungen
   - Filteroptionen (gelesen/ungelesen, Priorität)
   - Einstellungen für Benachrichtigungspräferenzen

2. **API-Dokumentation** (für Entwickler/Admin)
   - Dokumentation verfügbarer Schnittstellen
   - Beispielanfragen und -antworten
   - Authentifizierungsinformationen
   - Versionsinformationen

3. **Feedback-System**
   - Bewertung der Plattformfunktionen
   - Verbesserungsvorschläge
   - Fehlermeldungen
   - Feature-Wünsche

4. **Datenschutz-Center**
   - Datenschutzerklärung
   - Einwilligungsverwaltung
   - Datenexport (DSGVO)
   - Löschungsanfragen