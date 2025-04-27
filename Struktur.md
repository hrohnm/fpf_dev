# Detaillierte Projektstruktur für Freiplatzfinder

Die folgende Struktur listet alle benötigten Dateien für das "Freiplatzfinder"-Projekt auf, optimiert für die Entwicklung mit Cursor.AI:

```
freiplatzfinder/
├── README.md                                 # Projekt-Dokumentation und Setup-Anleitung
├── package.json                              # Haupt-Package-Datei für Workspaces
├── .gitignore                                # Git-Ignorierungs-Konfiguration
├── .env.example                              # Beispiel-Umgebungsvariablen
├── docker-compose.yml                        # Docker-Compose-Konfiguration für die Entwicklung
│
├── docs/                                     # Dokumentation
│   ├── api/                                  # API-Dokumentation
│   │   ├── admin-api.md                      # Admin-API-Dokumentation
│   │   ├── carrier-api.md                    # Träger-API-Dokumentation
│   │   ├── manager-api.md                    # Fallmanager-API-Dokumentation
│   │   └── leadership-api.md                 # Amtsleitung-API-Dokumentation
│   ├── database/                             # Datenbank-Dokumentation
│   │   ├── erd.png                           # Entity-Relationship-Diagramm
│   │   └── schema.md                         # Datenbankschema-Dokumentation
│   ├── deployment/                           # Deployment-Dokumentation
│   │   ├── installation.md                   # Installationsanleitung
│   │   ├── configuration.md                  # Konfigurationsanleitung
│   │   ├── backup.md                         # Backup-Anleitung
│   │   └── update.md                         # Update-Anleitung
│   └── user/                                 # Benutzerdokumentation
│       ├── admin-guide.md                    # Administratorenhandbuch
│       ├── carrier-guide.md                  # Trägerhandbuch
│       ├── manager-guide.md                  # Fallmanagerhandbuch
│       └── leadership-guide.md               # Amtsleitungshandbuch
│
├── frontend/                                 # Frontend-Anwendung
│   ├── package.json                          # Frontend-Package-Datei
│   ├── tsconfig.json                         # TypeScript-Konfiguration
│   ├── .eslintrc.js                          # ESLint-Konfiguration
│   ├── .prettierrc                           # Prettier-Konfiguration
│   ├── tailwind.config.js                    # Tailwind CSS-Konfiguration
│   ├── postcss.config.js                     # PostCSS-Konfiguration
│   ├── vite.config.ts                        # Vite-Konfiguration
│   ├── index.html                            # HTML-Einstiegspunkt
│   ├── public/                               # Statische Assets
│   │   ├── favicon.ico                       # Favicon
│   │   ├── robots.txt                        # Robots.txt
│   │   ├── manifest.json                     # PWA-Manifest
│   │   ├── logo192.png                       # Logo (klein)
│   │   ├── logo512.png                       # Logo (groß)
│   │   └── locales/                          # Übersetzungsdateien
│   │       ├── de/                           # Deutsche Übersetzungen
│   │       │   └── translation.json          # Hauptübersetzungsdatei
│   │       └── en/                           # Englische Übersetzungen
│   │           └── translation.json          # Hauptübersetzungsdatei
│   └── src/                                  # Quellcode
│       ├── index.tsx                         # Haupteinstiegspunkt
│       ├── App.tsx                           # Hauptanwendungskomponente
│       ├── routes.tsx                        # Routendefinitionen
│       ├── i18n.ts                           # i18n-Konfiguration
│       ├── assets/                           # Bilder, Fonts etc.
│       │   ├── images/                       # Bildressourcen
│       │   │   ├── logo.svg                  # Logo
│       │   │   └── icons/                    # Icon-Assets
│       │   └── styles/                       # Globale Styles
│       │       └── index.css                 # Hauptstyle-Datei (für Tailwind)
│       ├── components/                       # UI-Komponenten
│       │   ├── common/                       # Gemeinsame Komponenten
│       │   │   ├── AppBar.tsx                # Hauptnavigationsleiste
│       │   │   ├── Sidebar.tsx               # Seitennavigation
│       │   │   ├── DataTable.tsx             # Wiederverwendbare Tabelle
│       │   │   ├── SearchBar.tsx             # Suchleiste
│       │   │   ├── FilterPanel.tsx           # Filterpanel
│       │   │   ├── DetailsCard.tsx           # Detailansichtskarte
│       │   │   ├── ActionButton.tsx          # Aktionsschaltfläche
│       │   │   ├── StatusBadge.tsx           # Statusanzeige
│       │   │   ├── ConfirmDialog.tsx         # Bestätigungsdialog
│       │   │   ├── NotificationBell.tsx      # Benachrichtigungsglocke
│       │   │   ├── Breadcrumbs.tsx           # Breadcrumb-Navigation
│       │   │   ├── TabPanel.tsx              # Tab-Navigation
│       │   │   ├── FileUploader.tsx          # Datei-Upload-Komponente
│       │   │   ├── DateRangePicker.tsx       # Datumsbereichsauswahl
│       │   │   ├── MultiSelect.tsx           # Mehrfachauswahl
│       │   │   ├── Loader.tsx                # Ladeindikator
│       │   │   ├── ErrorBoundary.tsx         # Fehlergrenze
│       │   │   ├── EmptyState.tsx            # Leerzustand
│       │   │   └── PageLayout.tsx            # Seitenlayout
│       │   ├── admin/                        # Admin-spezifische Komponenten
│       │   │   ├── UserManagementTable.tsx   # Benutzerverwaltungstabelle
│       │   │   ├── CarrierManagementCard.tsx # Trägerverwaltungskarte
│       │   │   ├── CategoryTree.tsx          # Kategoriebaum
│       │   │   ├── SystemSettingsForm.tsx    # Systemeinstellungsformular
│       │   │   ├── LogViewer.tsx             # Log-Anzeige
│       │   │   ├── AdminDashboard.tsx        # Admin-Dashboard
│       │   │   └── AdminStats.tsx            # Admin-Statistiken
│       │   ├── carrier/                      # Träger-spezifische Komponenten
│       │   │   ├── FacilityCard.tsx          # Einrichtungskarte
│       │   │   ├── AvailabilityEditor.tsx    # Verfügbarkeitseditor
│       │   │   ├── BatchUpdatePanel.tsx      # Massenaktualisierungspanel
│       │   │   ├── FacilityForm.tsx          # Einrichtungsformular
│       │   │   ├── StatisticsChart.tsx       # Statistikdiagramm
│       │   │   ├── CarrierDashboard.tsx      # Träger-Dashboard
│       │   │   └── ImageGallery.tsx          # Bildergalerie
│       │   ├── manager/                      # Fallmanager-spezifische Komponenten
│       │   │   ├── CategorySelectGrid.tsx    # Kategorieauswahlraster
│       │   │   ├── CarrierList.tsx           # Trägerliste
│       │   │   ├── FacilityList.tsx          # Einrichtungsliste
│       │   │   ├── FacilityDetailView.tsx    # Einrichtungsdetailansicht
│       │   │   ├── ContactActions.tsx        # Kontaktaktionen
│       │   │   ├── FavoritesPanel.tsx        # Favoritenpanel
│       │   │   ├── ManagerDashboard.tsx      # Fallmanager-Dashboard
│       │   │   └── SavedFilters.tsx          # Gespeicherte Filter
│       │   └── leadership/                   # Amtsleitung-spezifische Komponenten
│       │       ├── DashboardStats.tsx        # Dashboard-Statistiken
│       │       ├── OccupancyChart.tsx        # Belegungsdiagramm
│       │       ├── TrendAnalysisGraph.tsx    # Trendanalysegraph
│       │       ├── ReportGenerator.tsx       # Berichtsgenerator
│       │       ├── ExportOptions.tsx         # Exportoptionen
│       │       └── LeadershipDashboard.tsx   # Amtsleitungs-Dashboard
│       ├── contexts/                         # React Contexts
│       │   ├── AuthContext.tsx               # Authentifizierungskontext
│       │   ├── NotificationContext.tsx       # Benachrichtigungskontext
│       │   ├── ThemeContext.tsx              # Themenkontext
│       │   └── SettingsContext.tsx           # Einstellungskontext
│       ├── hooks/                            # Custom Hooks
│       │   ├── useAuth.ts                    # Authentifizierungs-Hook
│       │   ├── useApi.ts                     # API-Hook
│       │   ├── useNotification.ts            # Benachrichtigungs-Hook
│       │   ├── useLocalStorage.ts            # LocalStorage-Hook
│       │   ├── useDebounce.ts                # Debounce-Hook
│       │   ├── useMediaQuery.ts              # MediaQuery-Hook für responsive Design
│       │   ├── useFacilities.ts              # Hook für Einrichtungen
│       │   ├── useCategories.ts              # Hook für Kategorien
│       │   ├── useAvailabilities.ts          # Hook für Verfügbarkeiten
│       │   └── useStatistics.ts              # Hook für Statistiken
│       ├── pages/                            # Seitenkomponenten
│       │   ├── auth/                         # Authentifizierungsseiten
│       │   │   ├── LoginPage.tsx             # Login-Seite
│       │   │   ├── ForgotPasswordPage.tsx    # Passwort-Vergessen-Seite
│       │   │   └── ResetPasswordPage.tsx     # Passwort-Zurücksetzen-Seite
│       │   ├── admin/                        # Admin-Seiten
│       │   │   ├── AdminDashboardPage.tsx    # Admin-Dashboard-Seite
│       │   │   ├── UserManagementPage.tsx    # Benutzerverwaltungsseite
│       │   │   ├── CarrierManagementPage.tsx # Trägerverwaltungsseite
│       │   │   ├── CategoryManagementPage.tsx # Kategorienverwaltungsseite
│       │   │   ├── SystemSettingsPage.tsx    # Systemeinstellungsseite
│       │   │   └── SystemLogsPage.tsx        # Systemlog-Seite
│       │   ├── carrier/                      # Träger-Seiten
│       │   │   ├── CarrierDashboardPage.tsx  # Träger-Dashboard-Seite
│       │   │   ├── FacilityListPage.tsx      # Einrichtungslistenseite
│       │   │   ├── FacilityFormPage.tsx      # Einrichtungsformularseite
│       │   │   ├── AvailabilityPage.tsx      # Verfügbarkeitsseite
│       │   │   └── StatisticsPage.tsx        # Statistikseite (Premium)
│       │   ├── manager/                      # Fallmanager-Seiten
│       │   │   ├── ManagerDashboardPage.tsx  # Fallmanager-Dashboard-Seite
│       │   │   ├── SearchPage.tsx            # Suchseite
│       │   │   ├── CategorySelectionPage.tsx # Kategorieauswahlseite
│       │   │   ├── CarrierSelectionPage.tsx  # Trägerauswahlseite
│       │   │   ├── FacilitySelectionPage.tsx # Einrichtungsauswahlseite
│       │   │   ├── FacilityDetailsPage.tsx   # Einrichtungsdetailseite
│       │   │   └── FavoritesPage.tsx         # Favoritenseite
│       │   ├── leadership/                   # Amtsleitungs-Seiten
│       │   │   ├── LeadershipDashboardPage.tsx # Amtsleitungs-Dashboard-Seite
│       │   │   ├── OccupancyRatesPage.tsx     # Belegungsquoten-Seite
│       │   │   ├── TrendAnalysisPage.tsx      # Trendanalyse-Seite
│       │   │   ├── ResourcePlanningPage.tsx   # Ressourcenplanungsseite
│       │   │   └── ReportingPage.tsx          # Berichterstellungsseite
│       │   ├── common/                       # Gemeinsame Seiten
│       │   │   ├── HomePage.tsx              # Startseite
│       │   │   ├── ProfilePage.tsx           # Profilseite
│       │   │   ├── NotFoundPage.tsx          # 404-Seite
│       │   │   ├── ErrorPage.tsx             # Fehlerseite
│       │   │   ├── HelpPage.tsx              # Hilfeseite
│       │   │   └── SettingsPage.tsx          # Einstellungsseite
│       │   └── index.ts                      # Export aller Seiten
│       ├── services/                         # API-Dienste
│       │   ├── api.ts                        # API-Client-Konfiguration
│       │   ├── auth.service.ts               # Authentifizierungsdienst
│       │   ├── user.service.ts               # Benutzerdienst
│       │   ├── carrier.service.ts            # Trägerdienst
│       │   ├── facility.service.ts           # Einrichtungsdienst
│       │   ├── category.service.ts           # Kategoriedienst
│       │   ├── availability.service.ts       # Verfügbarkeitsdienst
│       │   ├── search.service.ts             # Suchdienst
│       │   ├── favorites.service.ts          # Favoritendienst
│       │   ├── statistics.service.ts         # Statistikdienst
│       │   └── report.service.ts             # Berichtsdienst
│       ├── types/                            # TypeScript-Typdefinitionen
│       │   ├── auth.types.ts                 # Authentifizierungstypen
│       │   ├── user.types.ts                 # Benutzertypen
│       │   ├── carrier.types.ts              # Trägertypen
│       │   ├── facility.types.ts             # Einrichtungstypen
│       │   ├── category.types.ts             # Kategorietypen
│       │   ├── availability.types.ts         # Verfügbarkeitstypen
│       │   ├── search.types.ts               # Suchtypen
│       │   ├── statistics.types.ts           # Statistiktypen
│       │   ├── report.types.ts               # Berichttypen
│       │   └── common.types.ts               # Gemeinsame Typen
│       └── utils/                            # Hilfsfunktionen
│           ├── formatters.ts                 # Formatierungsfunktionen
│           ├── validators.ts                 # Validierungsfunktionen
│           ├── helpers.ts                    # Allgemeine Hilfsfunktionen
│           ├── constants.ts                  # Konstanten
│           ├── storage.ts                    # Storage-Funktionen
│           ├── logger.ts                     # Logger-Funktionen
│           └── theme.ts                      # Themenfunktionen
│
├── backend/                                  # Backend-Anwendung
│   ├── package.json                          # Backend-Package-Datei
│   ├── tsconfig.json                         # TypeScript-Konfiguration
│   ├── .eslintrc.js                          # ESLint-Konfiguration
│   ├── .prettierrc                           # Prettier-Konfiguration
│   ├── nodemon.json                          # Nodemon-Konfiguration
│   ├── .env.example                          # Beispiel-Umgebungsvariablen
│   ├── src/                                  # Quellcode
│   │   ├── index.ts                          # Haupteinstiegspunkt
│   │   ├── app.ts                            # Express-App-Konfiguration
│   │   ├── server.ts                         # HTTP-Server-Konfiguration
│   │   ├── api/                              # API-Routen
│   │   │   ├── index.ts                      # API-Routenexport
│   │   │   ├── admin/                        # Admin-Routen
│   │   │   │   ├── users.routes.ts           # Benutzerrouten
│   │   │   │   ├── carriers.routes.ts        # Trägerrouten
│   │   │   │   ├── categories.routes.ts      # Kategorierouten
│   │   │   │   ├── logs.routes.ts            # Logrouten
│   │   │   │   ├── statistics.routes.ts      # Statistikrouten
│   │   │   │   ├── settings.routes.ts        # Einstellungsrouten
│   │   │   │   └── index.ts                  # Admin-Routenexport
│   │   │   ├── carrier/                      # Träger-Routen
│   │   │   │   ├── facilities.routes.ts      # Einrichtungsrouten
│   │   │   │   ├── availability.routes.ts    # Verfügbarkeitsrouten
│   │   │   │   ├── images.routes.ts          # Bildrouten
│   │   │   │   ├── statistics.routes.ts      # Statistikrouten
│   │   │   │   └── index.ts                  # Träger-Routenexport
│   │   │   ├── manager/                      # Fallmanager-Routen
│   │   │   │   ├── search.routes.ts          # Suchrouten
│   │   │   │   ├── categories.routes.ts      # Kategorierouten
│   │   │   │   ├── carriers.routes.ts        # Trägerrouten
│   │   │   │   ├── facilities.routes.ts      # Einrichtungsrouten
│   │   │   │   ├── favorites.routes.ts       # Favoritenrouten
│   │   │   │   ├── filters.routes.ts         # Filterrouten
│   │   │   │   └── index.ts                  # Fallmanager-Routenexport
│   │   │   ├── leadership/                   # Amtsleitung-Routen
│   │   │   │   ├── dashboard.routes.ts       # Dashboard-Routen
│   │   │   │   ├── statistics.routes.ts      # Statistikrouten
│   │   │   │   ├── reports.routes.ts         # Berichtsrouten
│   │   │   │   └── index.ts                  # Amtsleitung-Routenexport
│   │   │   └── auth/                         # Authentifizierungs-Routen
│   │   │       ├── auth.routes.ts            # Authentifizierungsrouten
│   │   │       └── index.ts                  # Authentifizierungs-Routenexport
│   │   ├── config/                           # Konfigurationsdateien
│   │   │   ├── index.ts                      # Konfigurationsexport
│   │   │   ├── db.config.ts                  # Datenbankkonfiguration
│   │   │   ├── auth.config.ts                # Authentifizierungskonfiguration
│   │   │   ├── logger.config.ts              # Logger-Konfiguration
│   │   │   ├── redis.config.ts               # Redis-Konfiguration
│   │   │   └── upload.config.ts              # Upload-Konfiguration
│   │   ├── controllers/                      # Controller-Logik
│   │   │   ├── admin/                        # Admin-Controller
│   │   │   │   ├── user.controller.ts        # Benutzercontroller
│   │   │   │   ├── carrier.controller.ts     # Trägercontroller
│   │   │   │   ├── category.controller.ts    # Kategoriecontroller
│   │   │   │   ├── log.controller.ts         # Logcontroller
│   │   │   │   ├── statistics.controller.ts  # Statistikcontroller
│   │   │   │   └── settings.controller.ts    # Einstellungscontroller
│   │   │   ├── carrier/                      # Träger-Controller
│   │   │   │   ├── facility.controller.ts    # Einrichtungscontroller
│   │   │   │   ├── availability.controller.ts # Verfügbarkeitscontroller
│   │   │   │   ├── image.controller.ts       # Bildcontroller
│   │   │   │   └── statistics.controller.ts  # Statistikcontroller
│   │   │   ├── manager/                      # Fallmanager-Controller
│   │   │   │   ├── search.controller.ts      # Suchcontroller
│   │   │   │   ├── category.controller.ts    # Kategoriecontroller
│   │   │   │   ├── carrier.controller.ts     # Trägercontroller
│   │   │   │   ├── facility.controller.ts    # Einrichtungscontroller
│   │   │   │   ├── favorite.controller.ts    # Favoritencontroller
│   │   │   │   └── filter.controller.ts      # Filtercontroller
│   │   │   ├── leadership/                   # Amtsleitung-Controller
│   │   │   │   ├── dashboard.controller.ts   # Dashboard-Controller
│   │   │   │   ├── statistics.controller.ts  # Statistikcontroller
│   │   │   │   └── report.controller.ts      # Berichtscontroller
│   │   │   └── auth/                         # Authentifizierungs-Controller
│   │   │       └── auth.controller.ts        # Authentifizierungscontroller
│   │   ├── middlewares/                      # Express-Middlewares
│   │   │   ├── auth.middleware.ts            # Authentifizierungs-Middleware
│   │   │   ├── error.middleware.ts           # Fehlerbehandlungs-Middleware
│   │   │   ├── validation.middleware.ts      # Validierungs-Middleware
│   │   │   ├── log.middleware.ts             # Log-Middleware
│   │   │   ├── upload.middleware.ts          # Upload-Middleware
│   │   │   ├── cache.middleware.ts           # Cache-Middleware
│   │   │   └── role.middleware.ts            # Rollenüberprüfungs-Middleware
│   │   ├── models/                           # Datenbankmodelle
│   │   │   ├── index.ts                      # Modellexport und Initialisierung
│   │   │   ├── user.model.ts                 # Benutzermodell
│   │   │   ├── carrier.model.ts              # Trägermodell
│   │   │   ├── carrier-user.model.ts         # Träger-Benutzer-Zuordnungsmodell
│   │   │   ├── facility.model.ts             # Einrichtungsmodell
│   │   │   ├── facility-image.model.ts       # Einrichtungsbild-Modell
│   │   │   ├── category.model.ts             # Kategoriemodell
│   │   │   ├── availability.model.ts         # Verfügbarkeitsmodell
│   │   │   ├── saved-filter.model.ts         # Gespeicherter-Filter-Modell
│   │   │   ├── favorite.model.ts             # Favoriten-Modell
│   │   │   └── system-log.model.ts           # Systemlog-Modell
│   │   ├── services/                         # Geschäftslogik
│   │   │   ├── user.service.ts               # Benutzerdienst
│   │   │   ├── auth.service.ts               # Authentifizierungsdienst
│   │   │   ├── carrier.service.ts            # Trägerdienst
│   │   │   ├── facility.service.ts           # Einrichtungsdienst
│   │   │   ├── category.service.ts           # Kategoriedienst
│   │   │   ├── availability.service.ts       # Verfügbarkeitsdienst
│   │   │   ├── search.service.ts             # Suchdienst
│   │   │   ├── statistics.service.ts         # Statistikdienst
│   │   │   ├── report.service.ts             # Berichtsdienst
│   │   │   ├── file.service.ts               # Dateidienst
│   │   │   ├── email.service.ts              # E-Mail-Dienst
│   │   │   ├── log.service.ts                # Logdienst
│   │   │   └── cache.service.ts              # Cache-Dienst
│   │   ├── utils/                            # Hilfsfunktionen
│   │   │   ├── logger.ts                     # Logger-Utility
│   │   │   ├── jwt.ts                        # JWT-Utility
│   │   │   ├── password.ts                   # Passwort-Utility
│   │   │   ├── validation.ts                 # Validierungs-Utility
│   │   │   ├── formatters.ts                 # Formatierungsfunktionen
│   │   │   ├── geocoder.ts                   # Geocoding-Utility
│   │   │   └── constants.ts                  # Konstanten
│   │   ├── validations/                      # Validierungsschemas
│   │   │   ├── user.validation.ts            # Benutzervalidierung
│   │   │   ├── auth.validation.ts            # Authentifizierungsvalidierung
│   │   │   ├── carrier.validation.ts         # Trägervalidierung
│   │   │   ├── facility.validation.ts        # Einrichtungsvalidierung
│   │   │   ├── category.validation.ts        # Kategorievalidierung
│   │   │   ├── availability.validation.ts    # Verfügbarkeitsvalidierung
│   │   │   ├── search.validation.ts          # Suchvalidierung
│   │   │   └── common.validation.ts          # Gemeinsame Validierungen
│   │   └── migrations/                       # Datenbankmigrationen
│   │       ├── 20250101000000-create-users.js   # Benutzertabellenmigration
│   │       ├── 20250101000001-create-carriers.js # Trägertabellenmigration
│   │       ├── 20250101000002-create-carrier-users.js # Träger-Benutzer-Tabellenmigration
│   │       ├── 20250101000003-create-categories.js # Kategorientabellenmigration
│   │       ├── 20250101000004-create-facilities.js # Einrichtungstabellenmigration
│   │       ├── 20250101000005-create-facility-images.js # Einrichtungsbild-Tabellenmigration
│   │       ├── 20250101000006-create-availabilities.js # Verfügbarkeitstabellenmigration
│   │       ├── 20250101000007-create-saved-filters.js # Gespeicherte-Filter-Tabellenmigration
│   │       ├── 20250101000008-create-favorites.js # Favoritentabellenmigration
│   │       └── 20250101000009-create-system-logs.js # Systemlog-Tabellenmigration
│   ├── tests/                                # Tests
│   │   ├── setup.ts                          # Test-Setup
│   │   ├── mocks/                            # Mock-Daten für Tests
│   │   │   ├── users.mock.ts                 # Benutzer-Mocks
│   │   │   ├── carriers.mock.ts              # Träger-Mocks
│   │   │   ├── facilities.mock.ts            # Einrichtungs-Mocks
│   │   │   ├── categories.mock.ts            # Kategorien-Mocks
│   │   │   └── availabilities.mock.ts        # Verfügbarkeits-Mocks
│   │   ├── unit/                             # Unit-Tests
│   │   │   ├── controllers/                  # Controller-Tests
│   │   │   ├── services/                     # Service-Tests
│   │   │   ├── middlewares/                  # Middleware-Tests
│   │   │   └── utils/                        # Utility-Tests
│   │   └── integration/                      # Integrationstests
│   │       ├── auth.test.ts               # Authentifizierungstests
│   │       ├── admin.test.ts              # Admin-API-Tests
│   │       ├── carrier.test.ts            # Träger-API-Tests
│   │       ├── manager.test.ts            # Fallmanager-API-Tests
│   │       └── leadership.test.ts         # Amtsleitung-API-Tests
│   └── seeds/                                # Seed-Daten für Datenbank
│       ├── index.js                          # Seed-Runner
│       ├── 20250101000000-users.js           # Benutzer-Seeds
│       ├── 20250101000001-carriers.js        # Träger-Seeds
│       ├── 20250101000002-carrier-users.js   # Träger-Benutzer-Seeds
│       ├── 20250101000003-categories.js      # Kategorien-Seeds
│       ├── 20250101000004-facilities.js      # Einrichtungs-Seeds
│       └── 20250101000005-availabilities.js  # Verfügbarkeits-Seeds
│
├── infrastructure/                           # Infrastruktur-Konfiguration
│   ├── docker/                               # Docker-Konfigurationen
│   │   ├── frontend/                         # Frontend-Docker-Konfiguration
│   │   │   ├── Dockerfile                    # Frontend-Dockerfile
│   │   │   └── nginx.conf                    # Nginx-Konfiguration
│   │   ├── backend/                          # Backend-Docker-Konfiguration
│   │   │   └── Dockerfile                    # Backend-Dockerfile
│   │   └── monitoring/                       # Monitoring-Docker-Konfiguration
│   │       ├── prometheus/                   # Prometheus-Konfiguration
│   │       │   └── prometheus.yml            # Prometheus-Konfigurationsdatei
│   │       └── grafana/                      # Grafana-Konfiguration
│   │           ├── datasources/              # Grafana-Datenquellen
│   │           │   └── prometheus.yml        # Prometheus-Datenquelle
│   │           └── dashboards/               # Grafana-Dashboards
│   │               ├── system-overview.json  # System-Übersicht-Dashboard
│   │               └── app-metrics.json      # App-Metriken-Dashboard
│   └── scripts/                              # Deployment-Skripte
│       ├── deploy.sh                         # Deployment-Skript
│       ├── update.sh                         # Update-Skript
│       ├── backup.sh                         # Backup-Skript
│       ├── restore.sh                        # Wiederherstellungs-Skript
│       ├── install-deps.sh                   # Abhängigkeiten-Installations-Skript
│       ├── setup-server.sh                   # Server-Setup-Skript
│       └── monitoring-setup.sh               # Monitoring-Setup-Skript
│
└── .github/                                  # GitHub-Konfiguration
    └── workflows/                            # GitHub Actions Workflows
        ├── ci.yml                            # Continuous Integration Workflow
        ├── deploy-staging.yml                # Staging-Deployment-Workflow
        └── deploy-production.yml             # Produktions-Deployment-Workflow