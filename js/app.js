/* ==========================================================================
   VEXORA — Core App Script
   Handles: navbar, mobile menu, scroll reveal, page transitions,
   ripple buttons, toast, back-to-top, animated counters, contact links.
   Framework-free, dependency-free.
   ========================================================================== */

const VEXORA = (() => {
  let siteConfig = null;

  /* ---------------- Site config loader (contact numbers, brand, etc.) --------------- */
  async function loadSiteConfig() {
    if (siteConfig) return siteConfig;
    try {
      const res = await fetch(resolvePath('data/site-config.json'));
      siteConfig = await res.json();
    } catch (err) {
      console.error('VEXORA: failed to load site-config.json', err);
      siteConfig = {
        brandName: 'VEXORA', whatsappNumber: '918428817610',
        phoneNumber: '+918428817610', email: 'vedanexus8@gmail.com', social: {}
      };
    }
    return siteConfig;
  }

  /* Resolve a data/asset path correctly whether the current page lives in
     the project root or inside /pages/. Every HTML page sets
     <body data-root="./"> or <body data-root="../"> accordingly. */
  function resolvePath(path) {
    const root = document.body.getAttribute('data-root') || './';
    return root + path;
  }

  /* ---------------- Navbar ---------------- */
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (!navbar) return;

    const onScroll = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 12);
      toggleBackToTop();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('is-open');
        toggle.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
      links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        links.classList.remove('is-open');
        toggle.classList.remove('is-open');
        document.body.style.overflow = '';
      }));
    }

    highlightActiveSection();
  }

  /* Highlight the current nav link: on the homepage it tracks the section
     in view via IntersectionObserver; on other pages it matches by page. */
  function highlightActiveSection() {
    const navLinks = document.querySelectorAll('.nav-links a[data-nav]');
    if (!navLinks.length) return;
    const page = document.body.getAttribute('data-page') || 'home';

    if (page !== 'home') {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('data-nav') === page));
      return;
    }

    const sections = [...navLinks]
      .map(a => document.getElementById(a.getAttribute('data-nav')))
      .filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('data-nav') === entry.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s));
  }

  /* ---------------- Scroll reveal ---------------- */
  function initScrollReveal() {
    const targets = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
    if (!targets.length) return;
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    targets.forEach(t => observer.observe(t));
  }

  /* Re-run reveal for dynamically injected content (product grids, etc.) */
  function observeNewReveals(container) {
    const targets = container.querySelectorAll('[data-reveal], [data-reveal-stagger]');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    targets.forEach(t => observer.observe(t));
  }

  /* ---------------- Animated counters ---------------- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    counters.forEach(c => observer.observe(c));
  }

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-counter'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------------- Ripple buttons ---------------- */
  function initRipple() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 620);
    });
  }

  /* ---------------- Toast ---------------- */
  let toastEl = null;
  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove('is-visible'), 2600);
  }

  /* ---------------- Back to top ---------------- */
  let backToTopEl = null;
  function toggleBackToTop() {
    if (!backToTopEl) {
      backToTopEl = document.querySelector('.back-to-top');
      if (!backToTopEl) return;
    }
    backToTopEl.classList.toggle('is-visible', window.scrollY > 600);
  }
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------------- Page transitions & Back Navigation ---------------- */
  function initPageTransitions() {
    requestAnimationFrame(() => document.body.classList.add('is-loaded'));

    const overlay = document.querySelector('.page-transition');

    // Automatically remove overlay if returning via browser Back/Forward button
    window.addEventListener('pageshow', (e) => {
      if (overlay) overlay.classList.remove('is-active');
      document.body.classList.add('is-loaded');
    });

    window.addEventListener('popstate', () => {
      if (overlay) overlay.classList.remove('is-active');
    });

    if (!overlay) return;

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');

      // Ignore back links or javascript triggers
      if (href === 'javascript:history.back()' || href === 'javascript:void(0);') return;

      const isInternal = href && !href.startsWith('http') && !href.startsWith('#')
        && !href.startsWith('mailto:') && !href.startsWith('tel:') && !link.hasAttribute('target');
      if (!isInternal) return;

      // Don't intercept if modifier keys pressed (Ctrl/Cmd click opens new tab)
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      e.preventDefault();
      overlay.classList.add('is-active');
      setTimeout(() => { window.location.href = href; }, 260);
    });
  }

  /* ---------------- Lazy image loading ---------------- */
  function initLazyImages(container = document) {
    const imgs = container.querySelectorAll('img[data-src]');
    if (!('IntersectionObserver' in window)) {
      imgs.forEach(img => { img.src = img.getAttribute('data-src'); img.removeAttribute('data-src'); });
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        const fallback = img.getAttribute('src');
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
        img.addEventListener('error', () => {
          img.src = fallback || 'assets/images/placeholder.svg';
          img.classList.add('is-loaded', 'is-fallback');
        }, { once: true });
        obs.unobserve(img);
      });
    }, { rootMargin: '200px 0px' });
    imgs.forEach(img => observer.observe(img));
  }

  /* ---------------- Contact links (WhatsApp / Call / Email) ---------------- */
  async function wireContactLinks(container = document) {
    const cfg = await loadSiteConfig();
    container.querySelectorAll('[data-contact="whatsapp"]').forEach(a => {
      const msg = a.getAttribute('data-message') || `Hi VEXORA, I'm interested in your products.`;
      a.href = `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(msg)}`;
      a.target = '_blank';
      a.rel = 'noopener';
    });
    container.querySelectorAll('[data-contact="call"]').forEach(a => {
      a.href = `tel:${cfg.phoneNumber}`;
    });
    container.querySelectorAll('[data-contact="email"]').forEach(a => {
      const subject = a.getAttribute('data-subject') || 'Product Enquiry — VEXORA';
      a.href = `mailto:${cfg.email}?subject=${encodeURIComponent(subject)}`;
    });
    container.querySelectorAll('[data-brand-name]').forEach(el => { el.textContent = cfg.brandName; });
  }

  /* ---------------- Mega-menu & Search ---------------- */
  let searchIndex = null;

  async function initMegaMenuAndSearch() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    try {
      const [catsRes, prodsRes] = await Promise.all([
        fetch(resolvePath('data/categories.json')),
        fetch(resolvePath('data/products.json'))
      ]);
      const categories = await catsRes.json();
      const products = await prodsRes.json();

      // Build search index
      searchIndex = [];
      categories.forEach(cat => {
        searchIndex.push({
          type: 'category',
          title: cat.name,
          subtitle: `Category · ${cat.subcategories.length} subcategories`,
          url: resolvePath(`pages/subcategories.html?category=${cat.slug}`),
          keywords: [cat.name, cat.tagline, cat.slug]
        });
        cat.subcategories.forEach(sub => {
          searchIndex.push({
            type: 'subcategory',
            title: sub.name,
            subtitle: `In ${cat.name}`,
            url: resolvePath(`pages/products.html?category=${cat.slug}&subcategory=${sub.slug}`),
            keywords: [sub.name, sub.description, sub.slug, cat.name]
          });
        });
      });

      products.forEach(p => {
        searchIndex.push({
          type: 'product',
          title: p.name,
          subtitle: `${p.price} · ${p.shortDesc}`,
          url: resolvePath(`pages/product.html?id=${p.id}`),
          keywords: [p.name, p.shortDesc, p.category, p.subcategory]
        });
      });

      setupSearchUI();
      setupMegaMenuUI(categories);
    } catch (err) {
      console.warn('VEXORA: Search/Megamenu index build deferred or failed', err);
    }
  }

  function setupSearchUI() {
    const searchInput = document.querySelector('.nav-search-input');
    const dropdown = document.querySelector('.nav-search-dropdown');
    if (!searchInput || !dropdown) return;

    let selectedIdx = -1;

    const renderResults = (query) => {
      const q = query.trim().toLowerCase();
      if (!q || !searchIndex) {
        dropdown.classList.remove('is-open');
        dropdown.innerHTML = '';
        return;
      }

      const matches = searchIndex.filter(item =>
        item.keywords.some(k => k.toLowerCase().includes(q)) || item.title.toLowerCase().includes(q)
      ).slice(0, 7);

      if (!matches.length) {
        dropdown.innerHTML = `<div class="search-item" style="cursor:default;"><span class="search-item-meta">No matches found for "${query}"</span></div>`;
      } else {
        dropdown.innerHTML = matches.map((m, idx) => `
          <a href="${m.url}" class="search-item ${idx === selectedIdx ? 'is-selected' : ''}" data-idx="${idx}">
            <div class="search-item-info">
              <span class="search-item-title">${m.title}</span>
              <span class="search-item-meta">${m.subtitle}</span>
            </div>
            <span class="search-badge">${m.type}</span>
          </a>
        `).join('');
      }

      dropdown.classList.add('is-open');
    };

    searchInput.addEventListener('input', (e) => {
      selectedIdx = -1;
      renderResults(e.target.value);
    });

    searchInput.addEventListener('keydown', (e) => {
      const items = dropdown.querySelectorAll('.search-item');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIdx = Math.min(selectedIdx + 1, items.length - 1);
        items.forEach((it, i) => it.classList.toggle('is-selected', i === selectedIdx));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIdx = Math.max(selectedIdx - 1, 0);
        items.forEach((it, i) => it.classList.toggle('is-selected', i === selectedIdx));
      } else if (e.key === 'Enter' && selectedIdx >= 0) {
        e.preventDefault();
        items[selectedIdx].click();
      } else if (e.key === 'Escape') {
        dropdown.classList.remove('is-open');
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('is-open');
      }
    });
  }

  function setupMegaMenuUI(categories) {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;

    const catLink = [...navLinks.querySelectorAll('a')].find(a => a.getAttribute('data-nav') === 'categories');
    if (!catLink) return;

    const parentLi = catLink.parentElement;
    catLink.classList.add('has-megamenu');

    const megaDiv = document.createElement('div');
    megaDiv.className = 'megamenu-dropdown';

    // Group categories into 3 balanced columns
    const cols = [[], [], []];
    categories.forEach((cat, i) => cols[i % 3].push(cat));

    megaDiv.innerHTML = cols.map(col => `
      <div class="megamenu-col">
        ${col.map(cat => `
          <div style="margin-bottom: 16px;">
            <h4><a href="${resolvePath(`pages/subcategories.html?category=${cat.slug}`)}" style="color:inherit;">${cat.name}</a></h4>
            <div class="megamenu-list">
              ${cat.subcategories.slice(0, 4).map(sub => `
                <a href="${resolvePath(`pages/products.html?category=${cat.slug}&subcategory=${sub.slug}`)}" class="megamenu-link">
                  <span>${sub.name}</span>
                </a>
              `).join('')}
              ${cat.subcategories.length > 4 ? `<a href="${resolvePath(`pages/subcategories.html?category=${cat.slug}`)}" class="megamenu-link" style="color:var(--color-primary);font-weight:700;">+ ${cat.subcategories.length - 4} more</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');

    catLink.appendChild(megaDiv);
  }

  /* ---------------- Keyboard nav polish ---------------- */
  function initKeyboardEscape() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const links = document.querySelector('.nav-links.is-open');
      const toggle = document.querySelector('.nav-toggle.is-open');
      const searchDrop = document.querySelector('.nav-search-dropdown.is-open');
      if (links) { links.classList.remove('is-open'); document.body.style.overflow = ''; }
      if (toggle) toggle.classList.remove('is-open');
      if (searchDrop) searchDrop.classList.remove('is-open');
    });
  }

  /* ---------------- Init ---------------- */
  function init() {
    initNavbar();
    initScrollReveal();
    initCounters();
    initRipple();
    initBackToTop();
    initPageTransitions();
    initLazyImages();
    initKeyboardEscape();
    wireContactLinks();
    initMegaMenuAndSearch();
  }

  document.addEventListener('DOMContentLoaded', init);

  return { resolvePath, loadSiteConfig, toast, observeNewReveals, initLazyImages, wireContactLinks };
})();
