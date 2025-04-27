# API-Dokumentation Freiplatzfinder

## Übersicht

Die Freiplatzfinder-API ist eine RESTful-API, die auf Node.js und Express basiert. Sie bietet Endpunkte für die verschiedenen Benutzerrollen des Systems:

- **Authentifizierung**: Anmeldung, Registrierung, Token-Aktualisierung
- **Administrator**: Verwaltung von Benutzern, Trägern und Kategorien
- **Träger**: Verwaltung von Einrichtungen und Verfügbarkeiten
- **Fallmanager**: Suche nach freien Plätzen und Verwaltung von Favoriten
- **Amtsleitung**: Zugriff auf Statistiken und Berichte

## Basis-URL

Die API ist unter folgender Basis-URL erreichbar:

```
http://localhost:4000/api
```

## Authentifizierung

Die API verwendet JWT (JSON Web Tokens) für die Authentifizierung. Bei erfolgreicher Anmeldung erhält der Client ein Token, das bei nachfolgenden Anfragen im Authorization-Header mitgesendet werden muss:

```
Authorization: Bearer <token>
```

### Endpunkte

#### POST /api/auth/login

Anmeldung eines Benutzers.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "firstName": "Max",
    "lastName": "Mustermann",
    "role": "manager",
    "isActive": true,
    "lastLogin": "2023-11-15T10:30:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-11-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/auth/register

Registrierung eines neuen Benutzers.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "firstName": "Erika",
  "lastName": "Musterfrau",
  "role": "manager"
}
```

**Response:**
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "email": "newuser@example.com",
    "firstName": "Erika",
    "lastName": "Musterfrau",
    "role": "manager",
    "isActive": true,
    "createdAt": "2023-11-15T11:00:00.000Z",
    "updatedAt": "2023-11-15T11:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/auth/refresh-token

Aktualisierung eines abgelaufenen Tokens.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Rollenspezifische API-Endpunkte

### Administrator-Endpunkte

Alle Administrator-Endpunkte erfordern die Rolle `admin`.

#### GET /api/admin/users

Abrufen aller Benutzer mit Paginierung und Filterung.

**Query-Parameter:**
- `page`: Seitennummer (Standard: 1)
- `limit`: Anzahl der Einträge pro Seite (Standard: 10)
- `search`: Suchbegriff für Name oder E-Mail
- `role`: Filterung nach Rolle
- `isActive`: Filterung nach Aktiv-Status
- `sortBy`: Sortierfeld (Standard: createdAt)
- `sortOrder`: Sortierreihenfolge (asc oder desc, Standard: desc)

**Response:**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "firstName": "Max",
      "lastName": "Mustermann",
      "role": "manager",
      "isActive": true,
      "lastLogin": "2023-11-15T10:30:00.000Z",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-11-15T10:30:00.000Z",
      "Carriers": [
        {
          "id": "123e4567-e89b-12d3-a456-426614174010",
          "name": "Beispielträger"
        }
      ]
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Träger-Endpunkte

Alle Träger-Endpunkte erfordern die Rolle `carrier` oder `admin`.

#### GET /api/carrier/facilities

Abrufen aller Einrichtungen des Trägers mit Paginierung und Filterung.

**Query-Parameter:**
- `page`: Seitennummer (Standard: 1)
- `limit`: Anzahl der Einträge pro Seite (Standard: 10)
- `search`: Suchbegriff für Name oder Beschreibung
- `carrierId`: Filterung nach Träger-ID
- `city`: Filterung nach Stadt
- `postalCode`: Filterung nach Postleitzahl
- `isActive`: Filterung nach Aktiv-Status
- `sortBy`: Sortierfeld (Standard: createdAt)
- `sortOrder`: Sortierreihenfolge (asc oder desc, Standard: desc)

**Response:**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174020",
      "carrierId": "123e4567-e89b-12d3-a456-426614174010",
      "name": "Beispieleinrichtung",
      "description": "Eine Beispieleinrichtung",
      "contactPerson": "Anna Schmidt",
      "email": "info@beispieleinrichtung.de",
      "phone": "0123456789",
      "address": "Beispielstraße 123",
      "city": "Musterstadt",
      "postalCode": "12345",
      "latitude": 52.5200,
      "longitude": 13.4050,
      "openingHours": "Mo-Fr 8:00-18:00",
      "maxCapacity": 20,
      "isActive": true,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-11-15T10:30:00.000Z",
      "carrier": {
        "id": "123e4567-e89b-12d3-a456-426614174010",
        "name": "Beispielträger"
      },
      "images": [
        {
          "id": "123e4567-e89b-12d3-a456-426614174030",
          "url": "/uploads/beispielbild.jpg",
          "caption": "Außenansicht",
          "isMain": true
        }
      ],
      "availabilities": [
        {
          "id": "123e4567-e89b-12d3-a456-426614174040",
          "categoryId": "123e4567-e89b-12d3-a456-426614174050",
          "availablePlaces": 3,
          "lastUpdated": "2023-11-15T09:00:00.000Z",
          "category": {
            "id": "123e4567-e89b-12d3-a456-426614174050",
            "name": "Heimerziehung (§ 34 SGB VIII)"
          }
        }
      ]
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Fallmanager-Endpunkte

Alle Fallmanager-Endpunkte erfordern die Rolle `manager` oder `admin`.

#### POST /api/manager/search

Suche nach freien Plätzen basierend auf verschiedenen Kriterien.

**Request:**
```json
{
  "categoryIds": ["123e4567-e89b-12d3-a456-426614174050"],
  "genderSuitability": "male",
  "minAge": 12,
  "maxAge": 16,
  "city": "Musterstadt",
  "postalCode": "12345",
  "radius": 50,
  "latitude": 52.5200,
  "longitude": 13.4050,
  "page": 1,
  "limit": 10,
  "sortBy": "distance",
  "sortOrder": "asc"
}
```

**Response:**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174020",
      "name": "Beispieleinrichtung",
      "description": "Eine Beispieleinrichtung",
      "address": "Beispielstraße 123",
      "city": "Musterstadt",
      "postalCode": "12345",
      "latitude": 52.5200,
      "longitude": 13.4050,
      "distance": 0.5,
      "carrier": {
        "id": "123e4567-e89b-12d3-a456-426614174010",
        "name": "Beispielträger"
      },
      "images": [
        {
          "id": "123e4567-e89b-12d3-a456-426614174030",
          "url": "/uploads/beispielbild.jpg",
          "caption": "Außenansicht",
          "isMain": true
        }
      ],
      "availabilities": [
        {
          "id": "123e4567-e89b-12d3-a456-426614174040",
          "categoryId": "123e4567-e89b-12d3-a456-426614174050",
          "availablePlaces": 3,
          "genderSuitability": "male",
          "minAge": 10,
          "maxAge": 18,
          "lastUpdated": "2023-11-15T09:00:00.000Z",
          "category": {
            "id": "123e4567-e89b-12d3-a456-426614174050",
            "name": "Heimerziehung (§ 34 SGB VIII)"
          }
        }
      ]
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "filters": {
      "categoryIds": ["123e4567-e89b-12d3-a456-426614174050"],
      "genderSuitability": "male",
      "minAge": 12,
      "maxAge": 16,
      "city": "Musterstadt",
      "postalCode": "12345",
      "radius": 50,
      "latitude": 52.5200,
      "longitude": 13.4050
    }
  }
}
```

### Amtsleitung-Endpunkte

Alle Amtsleitung-Endpunkte erfordern die Rolle `leadership` oder `admin`.

#### GET /api/leadership/dashboard

Abrufen von Dashboard-Daten für die Amtsleitung.

**Response:**
```json
{
  "totalFacilities": 25,
  "totalCarriers": 8,
  "totalAvailablePlaces": 47,
  "occupancyRate": 78.5,
  "recentUpdates": [
    {
      "facilityId": "123e4567-e89b-12d3-a456-426614174020",
      "facilityName": "Beispieleinrichtung",
      "categoryId": "123e4567-e89b-12d3-a456-426614174050",
      "categoryName": "Heimerziehung (§ 34 SGB VIII)",
      "availablePlaces": 3,
      "lastUpdated": "2023-11-15T09:00:00.000Z"
    }
  ]
}
```

## Fehlerbehandlung

Die API gibt bei Fehlern einen entsprechenden HTTP-Statuscode und eine JSON-Antwort mit einer Fehlermeldung zurück:

```json
{
  "status": 400,
  "message": "Validierungsfehler",
  "details": {
    "email": "Bitte geben Sie eine gültige E-Mail-Adresse ein"
  }
}
```

### Häufige Statuscodes

- `200 OK`: Anfrage erfolgreich
- `201 Created`: Ressource erfolgreich erstellt
- `400 Bad Request`: Ungültige Anfrage (z.B. Validierungsfehler)
- `401 Unauthorized`: Nicht authentifiziert
- `403 Forbidden`: Keine Berechtigung
- `404 Not Found`: Ressource nicht gefunden
- `500 Internal Server Error`: Serverfehler
