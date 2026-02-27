# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for Schreinerei Nowak, a German carpentry business. Pure HTML/CSS with no build process, dependencies, or JavaScript frameworks.

## Development

**Preview the site:**
```bash
# Option 1: Open HTML files directly in browser
open index.html

# Option 2: Use a local server (recommended for testing)
python3 -m http.server 8000
# Then visit http://localhost:8000
```

No build, compile, or bundling steps required. Edit HTML/CSS files directly.

## Architecture

**Single-page design with navigation:**
- `index.html` - Main homepage (German language) with parallax scrolling, team section, services, and contact form
- `about.html` - About page (English language)
- `services.html` - Services page (English language)
- `contact.html` - Contact page (English language)
- `styles.css` - Shared stylesheet with responsive design (mobile breakpoint: 768px)

**Key design patterns:**
- Parallax backgrounds using `background-attachment: fixed`
- Clip-path polygons for angled section transitions
- Flexbox layouts throughout
- Color scheme: Brown/wood tones (#8E6C4B, #645749, #7f5a35)

## Known Issues & Inconsistencies

**Language inconsistency:** index.html is in German while other pages are in English. Future work should unify language choice.

**Branding confusion:**
- index.html refers to "Schreinerei Nowak" and "Holzmanufaktur BENZ GmbH"
- about.html, services.html, contact.html refer to "WoodCraft"
- Clarify correct company name before making changes

**Missing assets:**
- `logo.png` is referenced in index.html header but file doesn't exist

**Non-functional forms:** Contact forms use `action="#"` - no backend integration currently implemented.

## Contact Information

Business details in index.html contact section:
- Holzmanufaktur BENZ GmbH
- Waldeckstraße 3, 79400 Kandern
- Phone: 0049 (0) 7626 7518
- Email: info@holz-benz.de
