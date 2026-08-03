/* ==========================================================================
   VEXORA — 3D Tilt & Parallax Engine
   Pointer-driven 3D perspective tilt for hero art, category tiles and
   product cards, plus a subtle parallax drift on floating chips and a
   3D-rotating showcase for the hero visual. Framework-free, zero
   third-party dependencies, zero API keys — pure CSS transforms + rAF.
   Respects prefers-reduced-motion.
   ========================================================================== */

(() => {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TILT_SELECTOR = '.hero-card, .product-card, .cat-card, .tilt-3d';
  const MAX_TILT = 10; // degrees
  const MAX_LIFT = 14; // px translateZ on hover

  let ticking = false;
  let pendingEvent = null;
  let activeEl = null;

  function applyTilt(el, clientX, clientY) {
    const rect = el.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width;   // 0..1
    const py = (clientY - rect.top) / rect.height;    // 0..1
    const rx = (0.5 - py) * MAX_TILT;
    const ry = (px - 0.5) * MAX_TILT;
    el.style.transform =
      `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(${MAX_LIFT}px)`;
    el.style.setProperty('--glare-x', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--glare-y', `${(py * 100).toFixed(1)}%`);
  }

  function resetTilt(el) {
    el.style.transform = '';
    el.style.removeProperty('--glare-x');
    el.style.removeProperty('--glare-y');
  }

  function onMove(e) {
    const el = e.target.closest(TILT_SELECTOR);
    if (!el) {
      if (activeEl) { resetTilt(activeEl); activeEl = null; }
      return;
    }
    activeEl = el;
    pendingEvent = { x: e.clientX, y: e.clientY, el };
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        if (pendingEvent) applyTilt(pendingEvent.el, pendingEvent.x, pendingEvent.y);
        ticking = false;
      });
    }
  }

  function onLeave(e) {
    const el = e.target.closest(TILT_SELECTOR);
    if (el) resetTilt(el);
    if (activeEl === el) activeEl = null;
  }

  /* ---------------- Ambient parallax for hero chips / mesh blobs ---------------- */
  function initAmbientParallax() {
    const layer = document.querySelector('.hero');
    if (!layer) return;
    const chips = layer.querySelectorAll('[data-parallax]');
    if (!chips.length) return;

    let raf = null;
    layer.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = layer.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width - 0.5;
        const cy = (e.clientY - rect.top) / rect.height - 0.5;
        chips.forEach(chip => {
          const depth = parseFloat(chip.getAttribute('data-parallax')) || 1;
          chip.style.transform = `translate3d(${(cx * depth * 22).toFixed(1)}px, ${(cy * depth * 22).toFixed(1)}px, 0)`;
        });
        raf = null;
      });
    });
    layer.addEventListener('pointerleave', () => {
      chips.forEach(chip => { chip.style.transform = ''; });
    });
  }

  /* ---------------- Scroll-linked 3D reveal for section headers ---------------- */
  function initDepthReveal() {
    const targets = document.querySelectorAll('[data-reveal-3d]');
    if (!targets.length) return;
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible-3d');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    targets.forEach(t => observer.observe(t));
  }

  function init() {
    if (REDUCED) return; // motion-sensitive users get the static, still-polished layout
    document.body.classList.add('has-tilt3d');
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave, true);
    initAmbientParallax();
    initDepthReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
