# PV-Planer Dokumentation

## Übersicht

PV-Planer ist eine Personalplanungssoftware für PV-Installationsbetriebe, die speziell für den Einsatz auf einem Raspberry Pi entwickelt wurde. Die Anwendung ermöglicht es Planern, Termine und Einsätze zu verwalten, während Monteure ihre Wochenpläne einsehen können.

## Version 1.5.0

Diese Version enthält folgende Funktionen und Verbesserungen:

- Responsive Design für alle Geräte (Desktop, Tablet, Smartphone)
- Verschiedene Kalenderansichten (Tag, Woche, Monat)
- Einfache Navigation zwischen Tagen und Wochen
- Scrollbare Terminformulare für bessere Benutzererfahrung
- Neue Schaltfläche zum Erstellen von Terminen (nur für eingeloggte Benutzer sichtbar)
- Mitarbeiterverwaltung mit individuellen Profilen
- Teamverwaltung für Gruppenzuweisungen
- Zuweisungsfunktion für Mitarbeiter und Teams zu Terminen
- Namentliche Anzeige von zugewiesenen Teams und Monteuren in Terminen
- Gleichmäßige Tageskacheln mit verbesserter Klickbarkeit
- Kundenverwaltung mit manueller Eingabe von Kunden, Adressen und Firmennamen

## Systemanforderungen

- Raspberry Pi 3 oder höher
- Raspbian OS oder kompatibles Linux
- Node.js 12 oder höher
- Internetbrowser für die Anzeige

## Installation

Die Installation erfolgt über ein einfaches Bash-Skript:

1. Entpacken Sie die ZIP-Datei auf Ihrem Raspberry Pi
2. Navigieren Sie zum entpackten Verzeichnis
3. Führen Sie das Installationsskript aus:

```bash
cd pv-planner
./scripts/pv-planner.sh install
```

## Verwendung

### Starten der Anwendung

```bash
./scripts/pv-planner.sh start
```

Nach dem Start ist die Anwendung unter http://localhost:3000 erreichbar.

### Beenden der Anwendung

```bash
./scripts/pv-planner.sh stop
```

### Deinstallation

```bash
./scripts/pv-planner.sh uninstall
```

## Benutzerhandbuch

### Ansichten wechseln

Die Anwendung bietet drei verschiedene Ansichten:
- **Tag**: Detaillierte Ansicht eines einzelnen Tages
- **Woche**: Übersicht über eine ganze Woche (Standardansicht)
- **Monat**: Monatskalender mit allen Terminen

Klicken Sie auf die entsprechenden Schaltflächen in der oberen Leiste, um zwischen den Ansichten zu wechseln.

### Navigation

- Verwenden Sie die Pfeiltasten, um zwischen Tagen, Wochen oder Monaten zu navigieren
- Klicken Sie auf "Heute", um zum aktuellen Datum zurückzukehren
- Nutzen Sie die Tag/Woche-Navigationstasten für präzise Navigation

### Termine verwalten

#### Neuen Termin erstellen

1. Klicken Sie auf die Schaltfläche "Neuer Termin"
2. Füllen Sie das Formular mit den Termindaten aus
3. Weisen Sie Mitarbeiter und/oder Teams zu
4. Klicken Sie auf "Speichern"

#### Termin bearbeiten

1. Klicken Sie auf einen bestehenden Termin im Kalender
2. Bearbeiten Sie die Daten im Formular
3. Klicken Sie auf "Speichern"

### Mitarbeiterverwaltung

#### Zugriff auf die Verwaltung

1. Klicken Sie auf die Schaltfläche "Verwaltung" in der oberen Leiste
2. Wählen Sie zwischen den Tabs "Mitarbeiter", "Teams" und "Kunden"

#### Neuen Mitarbeiter anlegen

1. Klicken Sie auf "Neuer Mitarbeiter"
2. Füllen Sie das Formular mit den Mitarbeiterdaten aus
3. Weisen Sie den Mitarbeiter bei Bedarf Teams zu
4. Klicken Sie auf "Speichern"

#### Neues Team anlegen

1. Wechseln Sie zum Tab "Teams"
2. Klicken Sie auf "Neues Team"
3. Geben Sie einen Namen und eine Farbe für das Team ein
4. Wählen Sie die Teammitglieder aus
5. Klicken Sie auf "Speichern"

### Kundenverwaltung

#### Neuen Kunden anlegen

1. Wechseln Sie zum Tab "Kunden"
2. Klicken Sie auf "Neuer Kunde"
3. Füllen Sie das Formular mit den Kundendaten aus (Name, Adresse, Kontaktperson, etc.)
4. Klicken Sie auf "Speichern"

#### Kunden bearbeiten

1. Wechseln Sie zum Tab "Kunden"
2. Klicken Sie auf das Bearbeiten-Symbol neben dem gewünschten Kunden
3. Aktualisieren Sie die Daten im Formular
4. Klicken Sie auf "Speichern"

## Administratorbereich

### Login

1. Klicken Sie auf "Login" in der oberen Leiste
2. Geben Sie die Zugangsdaten ein:
   - Benutzername: admin
   - Passwort: password

Nach erfolgreicher Anmeldung haben Sie Zugriff auf erweiterte Funktionen wie das Erstellen und Bearbeiten von Terminen sowie die Mitarbeiterverwaltung.

### Logout

Klicken Sie auf "Logout" in der oberen Leiste, um sich abzumelden.

## Technische Details

Die Anwendung basiert auf folgenden Technologien:

- Frontend: HTML5, CSS3, JavaScript (vanilla)
- Backend: Node.js mit Express
- Datenbank: JSON-Dateien (keine SQL-Datenbank erforderlich)

Die Daten werden in folgenden Dateien gespeichert:
- `/data/database.json`: Enthält Termine, Mitarbeiter und Teams

## Fehlerbehebung

### Die Anwendung startet nicht

1. Prüfen Sie, ob Node.js korrekt installiert ist:
   ```bash
   node --version
   ```

2. Prüfen Sie, ob der Port 3000 bereits verwendet wird:
   ```bash
   netstat -tulpn | grep 3000
   ```

3. Überprüfen Sie die Logs:
   ```bash
   cat /var/log/pv-planner.log
   ```

### Änderungen werden nicht gespeichert

1. Stellen Sie sicher, dass der Benutzer, der die Anwendung ausführt, Schreibrechte im Datenverzeichnis hat:
   ```bash
   ls -la /opt/pv-planner/data
   ```

2. Prüfen Sie den freien Speicherplatz:
   ```bash
   df -h
   ```

## Support

Bei Fragen oder Problemen wenden Sie sich bitte an den Support unter support@example.com.
