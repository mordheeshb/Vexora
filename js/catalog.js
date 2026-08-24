/* ==========================================================================
   VEXORA — Catalog Module
   Loads categories.json / products.json and renders every data-driven
   view: category cards, subcategory cards, product grids, product detail.
   Editing images/JSON never requires touching HTML.
   ========================================================================== */

const Catalog = (() => {
  let categories = null;
  let products = null;

  async function loadCategories() {
    if (categories) return categories;
    const res = await fetch(VEXORA.resolvePath('data/categories.json'));
    categories = await res.json();
    return categories;
  }

  async function loadProducts() {
    if (products) return products;
    const res = await fetch(VEXORA.resolvePath('data/products.json'));
    products = await res.json();
    return products;
  }

  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function imgUrl(path) {
    if (!path) return VEXORA.resolvePath('assets/images/placeholder.svg');
    if (path.startsWith('http')) return path;
    return VEXORA.resolvePath(path);
  }

  function skeletonGrid(n, cls) {
    return Array.from({ length: n }).map(() =>
      `<div class="skeleton skeleton-card ${cls || ''}"></div>`
    ).join('');
  }

  /* ---------------- Category navigator (home page) ---------------- */

  function aisleSubcardHTML(sub, catSlug) {
    return `
      <a class="aisle-subcard" href="pages/subcategories.html?category=${catSlug}">
        <img class="aisle-subcard-img" data-src="${imgUrl(sub.image)}" alt="${sub.name}" loading="lazy" width="400" height="420" src="${imgUrl('assets/images/placeholder.svg')}">
        <div class="aisle-subcard-text">
          <strong>${sub.name} –</strong>
          <span>${sub.description || ''}</span>
        </div>
      </a>`;
  }

  function aislePanelHTML(activeCat) {
    const nameUpper = activeCat.name.toUpperCase();
    return `
      <div class="aisle-panel-head">
        <div>
          <h2 class="aisle-panel-title"><span class="aisle-blue">${nameUpper}</span> AISLE</h2>
          <p class="aisle-panel-copy">${activeCat.intro || activeCat.tagline}</p>
        </div>
      </div>
      <div class="aisle-subgrid">
        ${activeCat.subcategories.map(sub => aisleSubcardHTML(sub, activeCat.slug)).join('')}
      </div>`;
  }

  function categoryNavigatorHTML(cats, activeSlug) {
    const active = cats.find(c => c.slug === activeSlug) || cats[0];
    return `
      <div class="aisle-shell" data-reveal>
        <div class="aisle-sidebar">
          <div class="aisle-sidebar-heading">
            <span class="eyebrow">Aisle directory</span>
            <h3>Choose a shelf and drill into the right subcategory.</h3>
          </div>
          <div class="aisle-category-list">
            ${cats.map(cat => `<button type="button" class="aisle-category ${cat.slug === active.slug ? 'is-active' : ''}" data-cat="${cat.slug}">${cat.name}</button>`).join('')}
          </div>
        </div>
        <div class="aisle-panel">
          ${aislePanelHTML(active)}
        </div>
      </div>`;
  }

  async function renderCategoryNavigator(mountSelector) {
    const mount = document.querySelector(mountSelector);
    if (!mount) return;
    mount.innerHTML = '<div class="aisle-skeleton" data-reveal></div>';
    const cats = await loadCategories();
    mount.innerHTML = categoryNavigatorHTML(cats, cats[0]?.slug);
    VEXORA.initLazyImages(mount);

    mount.querySelector('.aisle-category-list')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.aisle-category');
      if (!btn) return;
      const activeSlug = btn.getAttribute('data-cat');
      const activeCat = cats.find(c => c.slug === activeSlug) || cats[0];
      const panel = mount.querySelector('.aisle-panel');
      if (!panel) return;

      panel.innerHTML = aislePanelHTML(activeCat);
      VEXORA.initLazyImages(panel);

      mount.querySelectorAll('.aisle-category').forEach(item =>
        item.classList.toggle('is-active', item.getAttribute('data-cat') === activeSlug)
      );
    });
    VEXORA.observeNewReveals(mount);
  }

  /* ---------------- Category cards (home + category listing page) ---------------- */
  function categoryCardHTML(cat, index) {
    return `
      <a class="cat-card" href="pages/subcategories.html?category=${cat.slug}" data-reveal style="transition-delay:${index * 60}ms">
        <img data-src="${imgUrl(cat.image)}" alt="${cat.name}" loading="lazy" width="400" height="400" src="${imgUrl('assets/images/placeholder.svg')}">
        <div class="cat-overlay">
          <h3>${cat.name}</h3>
          <span>${cat.tagline}</span>
        </div>
        <div class="cat-arrow" aria-hidden="true">→</div>
      </a>`;
  }

  async function renderCategoryGrid(mountSelector, root = './') {
    const mount = document.querySelector(mountSelector);
    if (!mount) return;
    mount.innerHTML = skeletonGrid(4);
    const cats = await loadCategories();
    mount.innerHTML = cats.map((c, i) => categoryCardHTML(c, i)).join('');
    fixLinksForRoot(mount, root);
    VEXORA.initLazyImages(mount);
    VEXORA.observeNewReveals(mount);
  }

  /* Prefix relative hrefs/srcs so links work whether we're on the home
     page (root) or nested one level deeper inside /pages/. */
  function fixLinksForRoot(mount, root) {
    if (root === './') return;
    // Cards are authored assuming they render on the homepage (root),
    // where category links point to "pages/subcategories.html...".
    // When rendered from inside /pages/ itself, strip that prefix so the
    // link resolves relative to the current folder instead of the root.
    mount.querySelectorAll('a[href^="pages/"]').forEach(a => {
      a.setAttribute('href', a.getAttribute('href').replace(/^pages\//, ''));
    });
  }

  /* ---------------- Subcategory listing page ---------------- */
  async function renderSubcategoryPage() {
    const catSlug = getParam('category');
    const cats = await loadCategories();
    const cat = cats.find(c => c.slug === catSlug) || cats[0];
    if (!cat) return;

    document.querySelectorAll('[data-bind="category-name"]').forEach(el => el.textContent = cat.name);
    document.querySelectorAll('[data-bind="category-tagline"]').forEach(el => el.textContent = cat.tagline);
    document.title = `${cat.name} — VEXORA`;

    const mount = document.querySelector('#subcategoryGrid');
    if (!mount) return;
    mount.innerHTML = skeletonGrid(cat.subcategories.length || 3);
    mount.innerHTML = cat.subcategories.map((sub, i) => `
      <a class="cat-card" href="products.html?category=${cat.slug}&subcategory=${sub.slug}" data-reveal style="transition-delay:${i * 60}ms">
        <img data-src="${imgUrl(sub.image)}" alt="${sub.name}" loading="lazy" width="400" height="300" src="${imgUrl('assets/images/placeholder.svg')}">
        <div class="cat-overlay"><h3>${sub.name}</h3></div>
        <div class="cat-arrow" aria-hidden="true">→</div>
      </a>`).join('');
    VEXORA.initLazyImages(mount);
    VEXORA.observeNewReveals(mount);
  }

  /* ---------------- Product card component ---------------- */
  function productCardHTML(p, index) {
    const waMsg = `Hi VEXORA, I'm interested in "${p.name}" (${p.price}). Is this in stock?`;
    const waUrl = `https://wa.me/918428817610?text=${encodeURIComponent(waMsg)}`;

    return `
      <div class="product-card" data-reveal style="transition-delay:${(index % 8) * 50}ms">
        <div class="product-thumb">
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
          <a href="${VEXORA.resolvePath(`pages/product.html?id=${p.id}`)}">
            <img data-src="${imgUrl(p.images[0])}" alt="${p.name}" loading="lazy" width="400" height="400" src="${imgUrl('assets/images/placeholder.svg')}">
          </a>
        </div>
        <div class="product-body">
          <span class="product-cat">${p.subcategory.replace(/-/g, ' ')}</span>
          <h3 class="product-name"><a href="${VEXORA.resolvePath(`pages/product.html?id=${p.id}`)}" style="color:inherit;">${p.name}</a></h3>
          <p class="product-desc">${p.shortDesc}</p>
          <div class="product-foot">
            <div class="product-price">${p.price} <small>onwards</small></div>
            <div style="display:flex;gap:6px;">
              <a href="${VEXORA.resolvePath(`pages/product.html?id=${p.id}`)}" class="btn btn-outline btn-sm">Details</a>
              <a data-contact="whatsapp" data-message="${waMsg}" href="${waUrl}" target="_blank" rel="noopener" class="btn btn-accent btn-sm" aria-label="Enquire via WhatsApp">Chat</a>
            </div>
          </div>
        </div>
      </div>`;
  }

  async function renderProductListingPage() {
    const catSlug = getParam('category');
    const subSlug = getParam('subcategory');
    const all = await loadProducts();
    const cats = await loadCategories();
    const cat = cats.find(c => c.slug === catSlug);
    const sub = cat && cat.subcategories.find(s => s.slug === subSlug);

    let filtered = all;
    if (catSlug) filtered = filtered.filter(p => p.category === catSlug);
    if (subSlug) filtered = filtered.filter(p => p.subcategory === subSlug);

    document.title = `${sub ? sub.name : (cat ? cat.name : 'All Products')} — VEXORA`;
    document.querySelectorAll('[data-bind="listing-title"]').forEach(el =>
      el.textContent = sub ? sub.name : (cat ? cat.name : 'All Products'));
    document.querySelectorAll('[data-bind="listing-count"]').forEach(el =>
      el.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`);

    renderBreadcrumb(cat, sub);
    renderFilterChips(cat, subSlug);

    const mount = document.querySelector('#productGrid');
    if (!mount) return;
    mount.innerHTML = skeletonGrid(Math.max(filtered.length, 3));
    if (!filtered.length) {
      mount.innerHTML = `<div class="empty-state"><h3>No products yet</h3><p>Check back soon — new items are added regularly.</p></div>`;
      return;
    }
    mount.innerHTML = filtered.map((p, i) => productCardHTML(p, i)).join('');
    VEXORA.initLazyImages(mount);
    VEXORA.observeNewReveals(mount);
  }

  function renderBreadcrumb(cat, sub) {
    const mount = document.querySelector('#breadcrumb');
    if (!mount) return;
    let html = `<a href="../index.html">Home</a><span class="sep">/</span><a href="categories.html">Categories</a>`;
    if (cat) html += `<span class="sep">/</span><a href="subcategories.html?category=${cat.slug}">${cat.name}</a>`;
    if (sub) html += `<span class="sep">/</span><span class="current">${sub.name}</span>`;
    mount.innerHTML = html;
  }

  function renderFilterChips(cat, activeSub) {
    const mount = document.querySelector('#filterBar');
    if (!mount || !cat) return;
    mount.innerHTML = cat.subcategories.map(s => `
      <a class="filter-chip ${s.slug === activeSub ? 'is-active' : ''}" href="products.html?category=${cat.slug}&subcategory=${s.slug}">${s.name}</a>
    `).join('') + `<a class="filter-chip ${!activeSub ? 'is-active' : ''}" href="products.html?category=${cat.slug}">All</a>`;
  }

  /* ---------------- Product detail page ---------------- */
  async function renderProductDetailPage() {
    const id = getParam('id');
    const all = await loadProducts();
    const product = all.find(p => p.id === id) || all[0];
    if (!product) return;

    document.title = `${product.name} — VEXORA`;

    const cats = await loadCategories();
    const cat = cats.find(c => c.slug === product.category);
    const sub = cat && cat.subcategories.find(s => s.slug === product.subcategory);
    renderBreadcrumb(cat, sub);
    document.querySelectorAll('[data-bind="pd-crumb-current"]').forEach(el => el.textContent = product.name);

    document.querySelector('#pdCategoryTag').textContent = (sub ? sub.name : product.category).replace(/-/g, ' ');
    document.querySelector('#pdTitle').textContent = product.name;
    document.querySelector('#pdPrice').textContent = product.price;
    document.querySelector('#pdDesc').textContent = product.description;

    const mainImg = document.querySelector('#pdMainImage');
    mainImg.src = imgUrl(product.images[0]);
    mainImg.alt = product.name;

    document.querySelector('#pdThumbs').innerHTML = product.images.map((img, i) => `
      <button class="pd-thumb ${i === 0 ? 'is-active' : ''}" data-img="${imgUrl(img)}" aria-label="Show image ${i + 1}">
        <img src="${imgUrl(img)}" alt="${product.name} view ${i + 1}">
      </button>`).join('');

    const mainGalleryWrapper = mainImg.parentElement;

    document.querySelector('#pdThumbs').addEventListener('click', (e) => {
      const btn = e.target.closest('.pd-thumb');
      if (!btn || btn.classList.contains('is-active')) return;

      const newSrc = btn.getAttribute('data-img');

      // Seamless image transition without flicker
      mainGalleryWrapper.classList.add('is-morphing');
      
      const tempImg = new Image();
      tempImg.src = newSrc;
      tempImg.onload = () => {
        mainImg.src = newSrc;
        requestAnimationFrame(() => {
          mainGalleryWrapper.classList.remove('is-morphing');
        });
      };

      document.querySelectorAll('.pd-thumb').forEach(t => t.classList.remove('is-active'));
      btn.classList.add('is-active');
    });

    document.querySelector('#pdSpecs').innerHTML = Object.entries(product.specs).map(([k, v]) =>
      `<div class="spec-row"><span>${k}</span><span>${v}</span></div>`).join('');

    const cfg = await VEXORA.loadSiteConfig();
    const waMsg = `Hi VEXORA, I'm interested in "${product.name}" (${product.price}). Could you share more details?`;
    document.querySelector('[data-contact="whatsapp"]').href = `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(waMsg)}`;
    document.querySelector('[data-contact="email"]').href = `mailto:${cfg.email}?subject=${encodeURIComponent('Enquiry: ' + product.name)}`;
    document.querySelector('[data-contact="call"]').href = `tel:${cfg.phoneNumber}`;

    // Related products: same subcategory, excluding current.
    const related = all.filter(p => p.subcategory === product.subcategory && p.id !== product.id).slice(0, 4);
    const relatedMount = document.querySelector('#relatedGrid');
    if (relatedMount) {
      relatedMount.innerHTML = related.length
        ? related.map((p, i) => productCardHTML(p, i)).join('')
        : `<div class="empty-state"><h3>More coming soon</h3><p>We're adding more items to this category.</p></div>`;
      VEXORA.initLazyImages(relatedMount);
      VEXORA.observeNewReveals(relatedMount);
    }
    VEXORA.wireContactLinks(document);
  }

  /* ---------------- Featured products (home page) ---------------- */
  async function renderFeaturedGrid(mountSelector, limit = 4) {
    const mount = document.querySelector(mountSelector);
    if (!mount) return;
    mount.innerHTML = skeletonGrid(limit);
    const all = await loadProducts();
    const featured = all.filter(p => p.badge).slice(0, limit);
    const list = featured.length ? featured : all.slice(0, limit);
    mount.innerHTML = list.map((p, i) => productCardHTML(p, i)).join('');
    VEXORA.initLazyImages(mount);
    VEXORA.observeNewReveals(mount);
    VEXORA.wireContactLinks(mount);
  }

  return {
    loadCategories, loadProducts, renderCategoryGrid, renderCategoryNavigator, renderSubcategoryPage,
    renderProductListingPage, renderProductDetailPage, renderFeaturedGrid
  };
})();
