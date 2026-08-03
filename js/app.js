/* ==========================================================================
   VEXORA — Interactive Interface Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initSearch();
  initCounters();
  initScrollAnimations();
  initBackToTop();
  initPageTransitions();
  initContactHandlers();
});

/* ---------- 1. Navbar Elevation on Scroll ---------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }, { passive: true });
}

/* ---------- 2. Mobile Menu Toggle ---------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    toggleBtn.classList.toggle('is-active');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      toggleBtn.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', false);
    });
  });
}

/* ---------- 3. Interactive Search Bar ---------- */
function initSearch() {
  const input = document.querySelector('.nav-search-input');
  const dropdown = document.querySelector('.nav-search-dropdown');

  if (!input || !dropdown) return;

  input.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length === 0) {
      dropdown.classList.remove('is-open');
      dropdown.innerHTML = '';
      return;
    }

    if (typeof Catalog !== 'undefined' && Catalog.products) {
      const matches = Catalog.products.filter(p => 
        p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
      );

      if (matches.length > 0) {
        dropdown.innerHTML = matches.map(m => `
          <a href="#" data-contact="whatsapp" data-message="Hi VEXORA! I found ${m.name} via search." class="search-item" style="display: block; padding: 10px 14px; text-decoration: none; color: inherit; border-bottom: 1px solid rgba(0,0,0,0.05);">
            <div style="font-weight: 600; font-size: 14px;">${m.name}</div>
            <div style="font-size: 12px; color: #666;">${m.category} • ₹${m.price}</div>
          </a>
        `).join('');
        dropdown.classList.add('is-open');
      } else {
        dropdown.innerHTML = `<div style="padding: 12px; font-size: 13px; color: #888;">No products found</div>`;
        dropdown.classList.add('is-open');
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-search-wrap')) {
      dropdown.classList.remove('is-open');
    }
  });
}

/* ---------- 4. Stat Counter Animations ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-counter'));
        const suffix = el.getAttribute('data-suffix') || '';
        let current = 0;
        const step = target / 40;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
          } else {
            el.textContent = (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
          }
        }, 30);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ---------- 5. Scroll Reveal Intersection Observer ---------- */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('[data-reveal], [data-reveal-3d]');

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-visible', 'is-visible-3d'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible', 'is-visible-3d');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
}

/* ---------- 6. Back To Top Floating Button ---------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- 7. Smooth Page Transitions ---------- */
function initPageTransitions() {
  document.body.classList.add('is-loaded');
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="javascript:"])').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      e.preventDefault();
      overlay.classList.add('is-active');
      setTimeout(() => { window.location.href = href; }, 250);
    });
  });
}

/* ---------- 8. WhatsApp / Call / Email Contact Handlers ---------- */
function initContactHandlers() {
  const phone = "918428817610";
  const email = "vedanexus8@gmail.com";

  document.addEventListener('click', (e) => {
    const contactBtn = e.target.closest('[data-contact]');
    if (!contactBtn) return;

    const type = contactBtn.getAttribute('data-contact');
    const msg = contactBtn.getAttribute('data-message') || "Hi VEXORA! I'd like to make an enquiry.";

    if (type === 'whatsapp') {
      e.preventDefault();
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    } else if (type === 'call') {
      e.preventDefault();
      window.location.href = `tel:+${phone}`;
    } else if (type === 'email') {
      e.preventDefault();
      const subject = contactBtn.getAttribute('data-subject') || "Enquiry for VEXORA";
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    }
  });
}