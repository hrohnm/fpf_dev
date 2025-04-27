# Datenbankschema Freiplatzfinder

## Übersicht

Das Datenbankschema des Freiplatzfinder-Projekts besteht aus mehreren Tabellen, die die verschiedenen Entitäten und ihre Beziehungen abbilden. Die Hauptentitäten sind:

- Benutzer (users)
- Träger (carriers)
- Einrichtungen (facilities)
- Kategorien (categories)
- Verfügbarkeiten (availabilities)

## Entitäten und Beziehungen

### Benutzer (users)

Speichert Informationen über alle Benutzer des Systems.

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | UUID | Primärschlüssel |
| email | STRING | E-Mail-Adresse (eindeutig) |
| password | STRING | Gehashtes Passwort |
| firstName | STRING | Vorname |
| lastName | STRING | Nachname |
| role | ENUM | Rolle (admin, carrier, manager, leadership) |
| isActive | BOOLEAN | Aktiv-Status |
| lastLogin | DATE | Zeitpunkt der letzten Anmeldung |
| createdAt | DATE | Erstellungsdatum |
| updatedAt | DATE | Aktualisierungsdatum |

### Träger (carriers)

Speichert Informationen über Träger von Jugendhilfeeinrichtungen.

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | UUID | Primärschlüssel |
| name | STRING | Name des Trägers |
| description | TEXT | Beschreibung |
| contactPerson | STRING | Ansprechpartner |
| email | STRING | E-Mail-Adresse |
| phone | STRING | Telefonnummer |
| address | STRING | Adresse |
| city | STRING | Stadt |
| postalCode | STRING | Postleitzahl |
| isPremium | BOOLEAN | Premium-Status |
| isActive | BOOLEAN | Aktiv-Status |
| createdAt | DATE | Erstellungsdatum |
| updatedAt | DATE | Aktualisierungsdatum |

### Träger-Benutzer-Zuordnung (carrier_users)

Verknüpft Benutzer mit Trägern (n:m-Beziehung).

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | UUID | Primärschlüssel |
| carrierId | UUID | Fremdschlüssel zum Träger |
| userId | UUID | Fremdschlüssel zum Benutzer |
| createdAt | DATE | Erstellungsdatum |
| updatedAt | DATE | Aktualisierungsdatum |

### Kategorien (categories)

Speichert Kategorien nach SGB VIII für die Jugendhilfe.

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | UUID | Primärschlüssel |
| name | STRING | Name der Kategorie |
| description | TEXT | Beschreibung |
| parentId | UUID | Fremdschlüssel zur übergeordneten Kategorie (Selbstreferenz) |
| isActive | BOOLEAN | Aktiv-Status |
| createdAt | DATE | Erstellungsdatum |
| updatedAt | DATE | Aktualisierungsdatum |

### Einrichtungen (facilities)

Speichert Informationen über Jugendhilfeeinrichtungen.

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | UUID | Primärschlüssel |
| carrierId | UUID | Fremdschlüssel zum Träger |
| name | STRING | Name der Einrichtung |
| description | TEXT | Beschreibung |
| contactPerson | STRING | Ansprechpartner |
| email | STRING | E-Mail-Adresse |
| phone | STRING | Telefonnummer |
| address | STRING | Adresse |
| city | STRING | Stadt |
| postalCode | STRING | Postleitzahl |
| latitude | FLOAT | Breitengrad für Geolocation |
| longitude | FLOAT | Längengrad für Geolocation |
| openingHours | STRING | Öffnungszeiten |
| maxCapacity | INTEGER | Maximale Kapazität |
| isActive | BOOLEAN | Aktiv-Status |
| createdAt | DATE | Erstellungsdatum |
| updatedAt | DATE | Aktualisierungsdatum |

### Einrichtungsbilder (facility_images)

Speichert Bilder von Einrichtungen.

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | UUID | Primärschlüssel |
| facilityId | UUID | Fremdschlüssel zur Einrichtung |
| url | STRING | URL zum Bild |
| caption | STRING | Bildunterschrift |
| isMain | BOOLEAN | Hauptbild-Status |
| createdAt | DATE | Erstellungsdatum |
| updatedAt | DATE | Aktualisierungsdatum |

### Verfügbarkeiten (availabilities)

Speichert Informationen über verfügbare Plätze in Einrichtungen.

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | UUID | Primärschlüssel |
| facilityId | UUID | Fremdschlüssel zur Einrichtung |
| categoryId | UUID | Fremdschlüssel zur Kategorie |
| availablePlaces | INTEGER | Anzahl verfügbarer Plätze |
| genderSuitability | ENUM | Geschlechtereignung (male, female, all) |
| minAge | INTEGER | Mindestalter |
| maxAge | INTEGER | Höchstalter |
| notes | TEXT | Anmerkungen |
| lastUpdated | DATE | Zeitpunkt der letzten Aktualisierung |
| createdAt | DATE | Erstellungsdatum |
| updatedAt | DATE | Aktualisierungsdatum |

### Gespeicherte Filter (saved_filters)

Speichert benutzerdefinierte Suchfilter.

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | UUID | Primärschlüssel |
| userId | UUID | Fremdschlüssel zum Benutzer |
| name | STRING | Name des Filters |
| filters | JSONB | Filterkriterien als JSON |
| createdAt | DATE | Erstellungsdatum |
| updatedAt | DATE | Aktualisierungsdatum |

### Favoriten (favorites)

Speichert von Benutzern favorisierte Einrichtungen.

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | UUID | Primärschlüssel |
| userId | UUID | Fremdschlüssel zum Benutzer |
| facilityId | UUID | Fremdschlüssel zur Einrichtung |
| notes | TEXT | Anmerkungen |
| createdAt | DATE | Erstellungsdatum |
| updatedAt | DATE | Aktualisierungsdatum |

### Systemlogs (system_logs)

Speichert Systemereignisse für Audit-Zwecke.

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | UUID | Primärschlüssel |
| userId | UUID | Fremdschlüssel zum Benutzer (optional) |
| action | STRING | Ausgeführte Aktion |
| entity | STRING | Betroffene Entität |
| entityId | UUID | ID der betroffenen Entität (optional) |
| details | JSONB | Zusätzliche Details als JSON |
| ipAddress | STRING | IP-Adresse |
| userAgent | STRING | User-Agent |
| createdAt | DATE | Erstellungsdatum |

## ER-Diagramm

```
+-------+     +---------------+     +---------+
| users | <-- | carrier_users | --> | carriers|
+-------+     +---------------+     +---------+
    ^                                    ^
    |                                    |
    v                                    v
+---------------+                   +-----------+
| saved_filters |                   | facilities|
+---------------+                   +-----------+
                                        ^  ^
                                        |  |
                                        v  v
                    +---------------+  +----------------+
                    | availabilities|  | facility_images|
                    +---------------+  +----------------+
                           ^
                           |
                           v
                     +-----------+
                     | categories|
                     +-----------+
```

## Indizes

Für optimale Leistung wurden Indizes auf folgenden Feldern erstellt:

- `users`: email, role, isActive
- `carriers`: name, city, postalCode, isActive
- `carrier_users`: carrierId, userId, (carrierId, userId)
- `categories`: name, parentId, isActive
- `facilities`: carrierId, name, city, postalCode, (latitude, longitude), isActive
- `facility_images`: facilityId, isMain
- `availabilities`: facilityId, categoryId, genderSuitability, (minAge, maxAge), lastUpdated, availablePlaces
- `saved_filters`: userId
- `favorites`: userId, facilityId, (userId, facilityId)
- `system_logs`: userId, action, entity, entityId, createdAt
