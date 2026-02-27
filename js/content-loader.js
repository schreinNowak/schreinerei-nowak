/**
 * Content Loader für Schreinerei Nowak
 * Lädt dynamischen Content aus Markdown/JSON-Dateien
 */

// Hilfsfunktion zum Parsen von Frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content: content };
  }

  const [, frontmatterText, markdown] = match;
  const data = {};

  // Parse YAML-ähnliche Frontmatter mit Listen- und Mehrzeilen-Unterstützung
  const lines = frontmatterText.split('\n');
  let currentKey = null;
  let currentList = null;
  let currentListItem = null;
  let multilineValue = null;
  let multilineMode = null; // 'quoted', 'literal', 'folded'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Mehrzeilige quoted strings (innerhalb von Anführungszeichen)
    if (multilineMode === 'quoted') {
      multilineValue += '\n' + line;
      if (line.includes('"') && !line.endsWith('\\"')) {
        // Ende des quoted string
        const endIndex = line.lastIndexOf('"');
        multilineValue = multilineValue.substring(0, multilineValue.lastIndexOf('\n') + 1 + endIndex);
        data[currentKey] = multilineValue.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
        multilineMode = null;
        multilineValue = null;
        currentList = null;
        currentListItem = null;
      }
      continue;
    }

    // Liste-Item mit Unterpunkten
    if (line.match(/^\s{2,4}-\s+\w+:/)) {
      const keyMatch = line.match(/^\s{2,4}-\s+(\w+):\s*(.*)$/);
      if (keyMatch && currentList) {
        currentListItem = {};
        const [, key, value] = keyMatch;
        currentListItem[key] = value.replace(/^["']|["']$/g, '');
        currentList.push(currentListItem);
      }
    }
    // Weitere Eigenschaften des List-Items
    else if (line.match(/^\s{4,6}\w+:/) && currentListItem) {
      const keyMatch = line.match(/^\s{4,6}(\w+):\s*(.*)$/);
      if (keyMatch) {
        const [, key, value] = keyMatch;
        currentListItem[key] = value.replace(/^["']|["']$/g, '');
      }
    }
    // Neue Liste
    else if (line.match(/^\w+:\s*$/)) {
      const key = line.replace(':', '').trim();
      currentKey = key;
      currentList = [];
      data[key] = currentList;
    }
    // Fortsetzungszeile (YAML folded style - eingerückt, kein neuer Key)
    else if (line.match(/^\s{2}\S/) && currentKey && !currentList) {
      // Dies ist eine Fortsetzungszeile für den vorherigen Wert
      const continuedText = line.trim();
      if (typeof data[currentKey] === 'string') {
        data[currentKey] += ' ' + continuedText;
      }
    }
    // Einfaches Key-Value
    else {
      const colonIndex = line.indexOf(':');
      if (colonIndex > -1 && !line.match(/^\s{2,}/)) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        // Mehrzeiliger quoted string beginnt
        if (value.startsWith('"') && !value.endsWith('"')) {
          multilineMode = 'quoted';
          multilineValue = value;
          currentKey = key;
          continue;
        }

        // Entferne Anführungszeichen
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }

        // Konvertiere Zahlen
        if (!isNaN(value) && value !== '') {
          value = Number(value);
        }

        // Konvertiere Booleans
        if (value === 'true') value = true;
        if (value === 'false') value = false;

        data[currentKey] = value;
        currentKey = key;
        currentList = null;
        currentListItem = null;
      }
    }
  }

  return { data, content: markdown };
}

// Services laden
async function loadServices() {
  try {
    const servicesContainer = document.querySelector('.services-grid');
    if (!servicesContainer) return;

    // Lade alle Service-Dateien
    const serviceFiles = ['fenster', 'moebel', 'fussboeden'];
    const services = [];

    for (const file of serviceFiles) {
      try {
        const response = await fetch(`/data/services/${file}.md`);
        const text = await response.text();
        const { data } = parseFrontmatter(text);
        services.push(data);
      } catch (error) {
        console.warn(`Service ${file} konnte nicht geladen werden:`, error);
      }
    }

    // Sortiere nach 'order'
    services.sort((a, b) => (a.order || 0) - (b.order || 0));

    // HTML generieren
    servicesContainer.innerHTML = services.map((service, index) => `
      <div class="service-card">
        <div class="service-number">${String(index + 1).padStart(2, '0')}</div>
        <div class="service-image-wrapper">
          <img src="${service.image || '/uploads/placeholder.jpg'}" alt="${service.title}" class="service-image">
        </div>
        <div class="service-content">
          <h3 class="service-title">${service.title}</h3>
          <p class="service-subtitle">${service.subtitle}</p>
          <p class="service-description">${service.description}</p>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Services konnten nicht geladen werden:', error);
  }
}

// Team laden
async function loadTeam() {
  try {
    const teamContainer = document.querySelector('.team-grid');
    if (!teamContainer) return;

    // Lade alle Team-Dateien
    const teamFiles = ['michael-nowak', 'igor-ovchek', 'maik-musk'];
    const team = [];

    for (const file of teamFiles) {
      try {
        const response = await fetch(`/data/team/${file}.md`);
        const text = await response.text();
        const { data } = parseFrontmatter(text);
        team.push(data);
      } catch (error) {
        console.warn(`Team-Mitglied ${file} konnte nicht geladen werden:`, error);
      }
    }

    // Sortiere nach 'order'
    team.sort((a, b) => (a.order || 0) - (b.order || 0));

    // HTML generieren (nutzt team-card Struktur von index.html)
    teamContainer.innerHTML = team.map(member => `
      <div class="team-card">
        <div class="team-image-wrapper">
          <img src="${member.photo || '/uploads/placeholder.jpg'}" alt="${member.name}" class="team-image">
          <div class="team-overlay"></div>
        </div>
        <div class="team-info">
          <h3 class="team-name">${member.name}</h3>
          <p class="team-role">${member.role}</p>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Team konnte nicht geladen werden:', error);
  }
}

// Featured Portfolio für Homepage laden
async function loadFeaturedPortfolio() {
  try {
    const featuredContainer = document.querySelector('.featured-grid');
    if (!featuredContainer) return;

    // Lade Beispiel-Projekt
    const portfolioFiles = ['beispiel-kueche'];
    const projects = [];

    for (const file of portfolioFiles) {
      try {
        const response = await fetch(`/data/portfolio/${file}.md`);
        const text = await response.text();
        const { data } = parseFrontmatter(text);
        if (data.featured) {
          projects.push(data);
        }
      } catch (error) {
        console.warn(`Portfolio-Projekt ${file} konnte nicht geladen werden:`, error);
      }
    }

    // Zeige maximal 3 Featured-Projekte
    const featured = projects.slice(0, 3);

    if (featured.length === 0) {
      featuredContainer.innerHTML = '<p class="no-projects">Noch keine Referenzprojekte vorhanden.</p>';
      return;
    }

    // HTML generieren
    featuredContainer.innerHTML = featured.map(project => {
      const firstImage = project.images && project.images[0] ? project.images[0].src : '/uploads/placeholder.jpg';
      return `
        <div class="portfolio-preview">
          <div class="portfolio-preview-image">
            <img src="${firstImage}" alt="${project.title}">
          </div>
          <div class="portfolio-preview-content">
            <h3>${project.title}</h3>
            <span class="category-badge">${project.category}</span>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Featured Portfolio konnte nicht geladen werden:', error);
  }
}

// Settings laden (für Kontaktdaten)
async function loadSettings() {
  try {
    const response = await fetch('/data/settings.json');
    const settings = await response.json();

    // Aktualisiere Kontaktdaten wenn Elemente vorhanden
    const phoneElement = document.querySelector('.contact-phone');
    if (phoneElement) phoneElement.textContent = settings.phone;

    const emailElement = document.querySelector('.contact-email');
    if (emailElement) emailElement.textContent = settings.email;

    const addressElement = document.querySelector('.contact-address');
    if (addressElement) addressElement.innerHTML = settings.address.replace(/\n/g, '<br>');

  } catch (error) {
    console.error('Settings konnten nicht geladen werden:', error);
  }
}

// Beim Laden der Seite ausführen
document.addEventListener('DOMContentLoaded', () => {
  loadServices();
  loadTeam();
  loadFeaturedPortfolio();
  loadSettings();
});
