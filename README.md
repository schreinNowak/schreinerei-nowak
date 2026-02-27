<<<<<<< HEAD
# Schreinerei Nowak - Website mit Decap CMS

Statische Website für Schreinerei Nowak mit integriertem Content Management System.

## 🚀 Features

- **Statische Website**: Keine Build-Tools, keine Abhängigkeiten - reines HTML/CSS/JS
- **Decap CMS**: Benutzerfreundliches Admin-Interface für Content-Verwaltung
- **Portfolio-System**: Projekte mit Bildern, Kategorien und Filtern
- **Dynamische Inhalte**: Services, Team und Portfolio werden aus Markdown-Dateien geladen
- **Netlify Hosting**: Automatisches Deployment + kostenlose Formulare
- **Responsive Design**: Optimiert für Desktop, Tablet und Mobile

## 📁 Projektstruktur

```
schreinerei_nowak/
├── admin/
│   ├── index.html          # Decap CMS Admin-Interface
│   └── config.yml          # CMS-Konfiguration
├── data/
│   ├── services/           # Service-Dateien (Markdown)
│   ├── team/               # Team-Mitglieder (Markdown)
│   ├── portfolio/          # Portfolio-Projekte (Markdown)
│   └── settings.json       # Firmen-Einstellungen
├── js/
│   ├── content-loader.js   # Lädt dynamische Inhalte
│   └── portfolio.js        # Portfolio-Funktionalität
├── uploads/                # Hochgeladene Bilder
├── index.html              # Hauptseite
├── portfolio.html          # Portfolio-Seite
├── about.html              # Über uns
├── services.html           # Leistungen
├── contact.html            # Kontakt
├── styles.css              # Stylesheet
├── script.js               # Allgemeine Scripts
└── netlify.toml            # Netlify-Konfiguration
```

## 🛠️ Lokale Entwicklung

### Voraussetzungen

- Python 3 (für lokalen Server)
- Webbrowser

### Website lokal starten

```bash
# Im Projektverzeichnis:
python3 -m http.server 8000

# Dann im Browser öffnen:
# http://localhost:8000
```

**Wichtig**: Das CMS (`/admin`) funktioniert nur auf Netlify, nicht lokal.

## 📝 Content-Verwaltung

### Admin-Zugang (nach Netlify-Deployment)

1. Öffne `https://ihre-website.netlify.app/admin`
2. Logge dich mit Netlify Identity ein
3. Verwalte Inhalte über das Dashboard

### Content-Bereiche

#### Leistungen (Services)
- Titel, Untertitel, Beschreibung
- Bild hochladen
- Reihenfolge festlegen

#### Portfolio-Projekte
- Projekttitel & Kategorie
- Mehrere Bilder hochladen
- Beschreibung (Markdown)
- Fertigstellungsdatum
- "Featured" für Startseite

#### Team-Mitglieder
- Name & Position
- Foto hochladen
- Reihenfolge festlegen

#### Firmen-Einstellungen
- Kontaktdaten
- Öffnungszeiten
- Adresse

## 🚀 Netlify Deployment

### 1. GitHub Repository erstellen

```bash
git init
git add .
git commit -m "Initial commit: Decap CMS Integration"
git remote add origin https://github.com/DEIN-USERNAME/schreinerei-nowak.git
git push -u origin main
```

### 2. Netlify verbinden

1. Gehe zu [netlify.com](https://netlify.com)
2. "New site from Git" → GitHub Repository wählen
3. Build Settings:
   - **Build Command**: (leer lassen)
   - **Publish Directory**: `/`
4. "Deploy site"

### 3. Netlify Identity aktivieren

1. Site Settings → Identity → "Enable Identity"
2. Settings & usage → Registration: "Invite only"
3. Services → "Enable Git Gateway"

### 4. Admin-Zugang erstellen

1. Identity Tab → "Invite users"
2. E-Mail-Adresse eingeben
3. User erhält Einladungslink
4. Passwort setzen
5. Login unter `/admin`

### 5. Netlify Forms aktivieren

Forms sind bereits konfiguriert - Submissions erscheinen automatisch unter:
- Site → Forms → contact

## 📋 Content-Migration

### Bestehende Inhalte übertragen

Aktuell sind Beispieldaten vorhanden:

**Services:**
- Fenster
- Möbel
- Fußböden

**Team:**
- Michael Nowak (Meister · Geschäftsführer)
- Igor Ovchek (Geselle)
- Maik Musk (Geselle)

**Portfolio:**
- Beispiel-Küche (Featured)

Diese können über `/admin` bearbeitet oder durch neue ersetzt werden.

## 🎨 Anpassungen

### Farben ändern

In `styles.css`:

```css
:root {
    --color-primary: #5A3E2B;
    --color-accent: #B4764E;
    /* ... */
}
```

### Neue Portfolio-Kategorien

In `admin/config.yml`:

```yaml
options: ["Fenster", "Möbel", "Fußböden", "Sonstiges", "NEUE-KATEGORIE"]
```

Danach in `portfolio.html` Filter-Button hinzufügen.

## 🐛 Fehlerbehebung

### Content wird nicht angezeigt

1. Browser-Console auf Fehler prüfen (F12)
2. Prüfen ob Dateien in `data/` vorhanden sind
3. Pfade in `content-loader.js` überprüfen

### Admin lässt sich nicht öffnen

1. Netlify Identity aktiviert?
2. Git Gateway aktiviert?
3. Browser-Cache leeren

### Bilder werden nicht hochgeladen

1. Prüfen ob `uploads/` Ordner existiert
2. Git LFS für große Dateien aktivieren (optional)
3. Externe Media Library erwägen (Cloudinary)

## 📞 Support

Bei Fragen zur Implementierung:
- GitHub Issues: [Link zum Repository]
- Decap CMS Docs: https://decapcms.org/docs/

## 📄 Lizenz

Proprietary - Schreinerei Nowak © 2025
=======
# schreinerei-nowak
Schreinerei
>>>>>>> 29c9e14c1f743f8ee7d9f0dafc12f4b4ecb57ae1
