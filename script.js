// Shared navigation, About Me card interactions, form feedback and gallery controls.
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (toggle && nav) {
    const closeMenu = () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
    };

    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('click', event => {
      if (window.innerWidth <= 700 && !nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 700) closeMenu(); });
  }

  const yearNode = document.getElementById('current-year');
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());

  // Flip cards for HTML, CSS and JavaScript competencies.
  document.querySelectorAll('.competency-flip').forEach(card => {
    card.addEventListener('click', () => {
      const flipped = card.classList.toggle('flipped');
      card.setAttribute('aria-pressed', String(flipped));
    });
  });

  // Front-end demo form: validate required fields, but never transmit or store them.
  const form = document.getElementById('contact-form');
  if (form) {
    const feedback = document.getElementById('form-feedback');
    const fields = Array.from(form.querySelectorAll('input, select, textarea'));
    const validateField = field => {
      const value = field.value.trim();
      let valid = !field.required || value.length > 0;
      if (valid && field.type === 'email' && value) valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      field.setAttribute('aria-invalid', String(!valid));
      return valid;
    };
    fields.forEach(field => {
      field.addEventListener('input', () => { if (field.hasAttribute('aria-invalid')) validateField(field); });
      field.addEventListener('change', () => { if (field.hasAttribute('aria-invalid')) validateField(field); });
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      const invalid = fields.filter(field => !validateField(field));
      feedback.hidden = false;
      if (invalid.length) {
        feedback.className = 'form-feedback';
        feedback.textContent = 'Please check the highlighted fields and enter a valid email address before continuing.';
        invalid[0].focus();
      } else {
        feedback.className = 'form-feedback success';
        feedback.textContent = 'The form looks complete. This is a website demo, so the message has not been sent or stored.';
      }
    });
    form.addEventListener('reset', () => {
      window.setTimeout(() => {
        fields.forEach(field => field.removeAttribute('aria-invalid'));
        feedback.hidden = true;
        feedback.className = 'form-feedback';
        feedback.textContent = '';
      }, 0);
    });
  }

  // Gallery sample data, matching the search/category/year controls in the wireframe.
  const galleryGrid = document.getElementById('gallery-grid');
  if (galleryGrid) {
    const photos = [
      { id: 1, title: 'burger king', category: 'hobbies', year: 2025 },
      { id: 2, title: 'sky', category: 'places', year: 2024 },
      { id: 3, title: 'gaming 1', category: 'gaming', year: 2023 },
      { id: 4, title: 'fun', category: 'personal', year: 2025 },
      { id: 5, title: 'music', category: 'hobbies', year: 2022 },
      { id: 6, title: 'star', category: 'places', year: 2026 },
      { id: 7, title: 'gaming 2', category: 'gaming', year: 2024 },
      { id: 8, title: 'joy', category: 'personal', year: 2023 }
    ];
    const search = document.getElementById('photo-search');
    const category = document.getElementById('filter-category');
    const sort = document.getElementById('sort-year');
    const count = document.getElementById('gallery-count');
    const noResults = document.getElementById('no-results');
    const reset = document.getElementById('reset-gallery');
    const categoryLabels = { hobbies: 'Hobbies', gaming: 'Gaming', places: 'Places', personal: 'Personal' };

    const render = () => {
      const query = (search.value || '').trim().toLowerCase();
      const selectedCategory = category.value;
      let shown = photos.filter(photo => {
        const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory;
        const haystack = `${photo.title} ${categoryLabels[photo.category]} ${photo.year}`.toLowerCase();
        return matchesCategory && haystack.includes(query);
      });
      if (sort.value === 'oldest') shown.sort((a, b) => a.year - b.year || a.id - b.id);
      else if (sort.value === 'title') shown.sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));
      else shown.sort((a, b) => b.year - a.year || a.id - b.id);

      galleryGrid.innerHTML = shown.map(photo => {
        const num = String(photo.id).padStart(2, '0');
        return `<article class="gallery-card">
          <div class="gallery-image">
            <img src="assets/gallery-${num}.png" alt="Sample artwork placeholder for ${photo.title}; replace it with your own photo" loading="lazy" />
            <span class="gallery-category">${categoryLabels[photo.category]}</span>
          </div>
          <div class="gallery-card-body"><h3>${photo.title}</h3><p class="gallery-card-meta">Sample item · ${photo.year}</p></div>
        </article>`;
      }).join('');
      count.textContent = `${shown.length} ${shown.length === 1 ? 'item' : 'items'}`;
      noResults.hidden = shown.length !== 0;
      galleryGrid.hidden = shown.length === 0;
    };
    search.addEventListener('input', render);
    category.addEventListener('change', render);
    sort.addEventListener('change', render);
    reset.addEventListener('click', () => { search.value = ''; category.value = 'all'; sort.value = 'newest'; render(); search.focus(); });
    render();
  }
})();
