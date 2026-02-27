/**
 * Portfolio-Funktionalität für Schreinerei Nowak
 */

let allProjects = [];
let currentProject = null;

// Hilfsfunktion zum Parsen von Frontmatter (gleich wie in content-loader.js)
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content: content };
  }

  const [, frontmatterText, markdown] = match;
  const data = {};

  // Parse YAML-ähnliche Frontmatter mit Listen-Unterstützung
  const lines = frontmatterText.split('\n');
  let currentKey = null;
  let currentList = null;
  let currentListItem = null;

  lines.forEach(line => {
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
    // Einfaches Key-Value
    else {
      const colonIndex = line.indexOf(':');
      if (colonIndex > -1 && !line.match(/^\s{2,}/)) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }

        if (!isNaN(value) && value !== '') {
          value = Number(value);
        }

        if (value === 'true') value = true;
        if (value === 'false') value = false;

        data[key] = value;
        currentKey = key;
        currentList = null;
        currentListItem = null;
      }
    }
  });

  return { data, content: markdown };
}

// Portfolio laden
async function loadPortfolio() {
  try {
    // Lade alle Portfolio-Dateien
    const portfolioFiles = ['beispiel-kueche']; // Später dynamisch erweitern
    allProjects = [];

    for (const file of portfolioFiles) {
      try {
        const response = await fetch(`/data/portfolio/${file}.md`);
        const text = await response.text();
        const { data, content } = parseFrontmatter(text);
        allProjects.push({ ...data, markdown: content, slug: file });
      } catch (error) {
        console.warn(`Portfolio-Projekt ${file} konnte nicht geladen werden:`, error);
      }
    }

    // Nach Datum sortieren (neueste zuerst)
    allProjects.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return dateB - dateA;
    });

    renderPortfolio(allProjects);
  } catch (error) {
    console.error('Portfolio konnte nicht geladen werden:', error);
    const grid = document.querySelector('.portfolio-grid');
    if (grid) {
      grid.innerHTML = '<p class="error-message">Portfolio konnte nicht geladen werden.</p>';
    }
  }
}

// Portfolio-Grid rendern
function renderPortfolio(projects) {
  const grid = document.querySelector('.portfolio-grid');
  if (!grid) return;

  if (projects.length === 0) {
    grid.innerHTML = '<p class="no-projects">Noch keine Projekte vorhanden.</p>';
    return;
  }

  grid.innerHTML = projects.map(project => {
    const firstImage = project.images && project.images.length > 0
      ? project.images[0].src
      : '/uploads/placeholder.jpg';
    const imageAlt = project.images && project.images.length > 0
      ? project.images[0].alt
      : project.title;

    return `
      <div class="portfolio-card" data-category="${project.category}" data-slug="${project.slug}">
        <div class="portfolio-image">
          <img src="${firstImage}" alt="${imageAlt}" loading="lazy">
          <div class="portfolio-overlay">
            <h3>${project.title}</h3>
            <span class="category-badge">${project.category}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Click-Handler für Modal
  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', () => {
      const slug = card.dataset.slug;
      const project = allProjects.find(p => p.slug === slug);
      if (project) {
        openProjectModal(project);
      }
    });
  });
}

// Filter-Funktionalität
function initializeFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Aktive Klasse umschalten
      filterButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const category = e.target.dataset.category;
      const filtered = category === 'all'
        ? allProjects
        : allProjects.filter(p => p.category === category);

      renderPortfolio(filtered);
    });
  });
}

// Modal für Projekt-Details öffnen
function openProjectModal(project) {
  currentProject = project;

  // Erstelle Modal-HTML
  const modal = document.createElement('div');
  modal.className = 'portfolio-modal';
  modal.id = 'portfolioModal';

  const images = project.images || [];
  const imagesHTML = images.length > 0
    ? images.map((img, index) => `
        <div class="modal-image ${index === 0 ? 'active' : ''}">
          <img src="${img.src}" alt="${img.alt || project.title}" loading="lazy">
          <p class="image-caption">${img.alt || ''}</p>
        </div>
      `).join('')
    : '<p>Keine Bilder vorhanden</p>';

  const navigationHTML = images.length > 1
    ? `
      <button class="modal-nav modal-prev" aria-label="Vorheriges Bild">
        <span>&#8249;</span>
      </button>
      <button class="modal-nav modal-next" aria-label="Nächstes Bild">
        <span>&#8250;</span>
      </button>
      <div class="modal-dots">
        ${images.map((_, index) => `
          <span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
        `).join('')}
      </div>
    `
    : '';

  // Formatiere Datum
  const dateFormatted = project.date
    ? new Date(project.date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long' })
    : '';

  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" aria-label="Schließen">&times;</button>
      <div class="modal-body">
        <div class="modal-gallery">
          ${imagesHTML}
          ${navigationHTML}
        </div>
        <div class="modal-info">
          <span class="category-badge">${project.category}</span>
          <h2>${project.title}</h2>
          ${dateFormatted ? `<p class="project-date">${dateFormatted}</p>` : ''}
          <div class="project-description">
            ${project.markdown ? marked(project.markdown) : '<p>Keine Beschreibung vorhanden</p>'}
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  // Event-Listener
  setTimeout(() => modal.classList.add('active'), 10);

  // Schließen-Button
  modal.querySelector('.modal-close').addEventListener('click', closeProjectModal);

  // Außerhalb klicken
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProjectModal();
    }
  });

  // ESC-Taste
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  // Bildnavigation
  if (images.length > 1) {
    initializeImageNavigation(modal, images.length);
  }
}

// Bildnavigation im Modal
function initializeImageNavigation(modal, imageCount) {
  let currentImageIndex = 0;

  const showImage = (index) => {
    const modalImages = modal.querySelectorAll('.modal-image');
    const dots = modal.querySelectorAll('.dot');

    modalImages.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    currentImageIndex = index;
  };

  // Prev/Next Buttons
  const prevBtn = modal.querySelector('.modal-prev');
  const nextBtn = modal.querySelector('.modal-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const newIndex = (currentImageIndex - 1 + imageCount) % imageCount;
      showImage(newIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const newIndex = (currentImageIndex + 1) % imageCount;
      showImage(newIndex);
    });
  }

  // Dots
  modal.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index);
      showImage(index);
    });
  });

  // Pfeiltasten
  const keyHandler = (e) => {
    if (e.key === 'ArrowLeft') {
      prevBtn?.click();
    } else if (e.key === 'ArrowRight') {
      nextBtn?.click();
    }
  };
  document.addEventListener('keydown', keyHandler);

  // Speichere Handler zum späteren Entfernen
  modal.dataset.keyHandler = keyHandler;
}

// Modal schließen
function closeProjectModal() {
  const modal = document.getElementById('portfolioModal');
  if (!modal) return;

  modal.classList.remove('active');
  document.body.style.overflow = '';

  setTimeout(() => {
    modal.remove();
  }, 300);
}

// Einfacher Markdown-Parser (Alternative zu marked.js)
function marked(markdown) {
  // Sehr einfache Markdown-to-HTML Konvertierung
  return markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/^/gim, '<p>')
    .replace(/$/gim, '</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[1-6]>)/g, '$1')
    .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
    .replace(/<p>(<ul>)/g, '$1')
    .replace(/(<\/ul>)<\/p>/g, '$1');
}

// Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
  loadPortfolio();
  initializeFilters();
});
