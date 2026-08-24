/* ==========================================================================
   VEXORA — Flagship Hero 3D Interactive Model Engine (Performance Optimized)
   Handles: 3D metallic emblem floating, orbiting 3D product cards,
   mouse tracking perspective tilt, viewport visibility observer, and smooth 60fps rendering.
   ========================================================================== */

(function () {
  'use strict';

  function initHero3DModel() {
    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual) return;

    let canvas = document.getElementById('hero3dCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'hero3dCanvas';
      canvas.className = 'hero-3d-canvas';
      heroVisual.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = false;
    let animId = null;

    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false };
    let ripples = [];

    // Optimized particle count
    const numParticles = 22;
    const particles = [];

    // Orbiting 3D Product Badges
    const orbitItems = [
      { label: '📓 Leather Planners', radius: 130, angle: 0, speed: 0.008, color: '#ff7b38', z: 40 },
      { label: '✒️ Luxury Pens', radius: 160, angle: Math.PI * 0.5, speed: 0.006, color: '#00a3ff', z: 50 },
      { label: '🧰 Student Kits', radius: 140, angle: Math.PI, speed: 0.007, color: '#ffb700', z: 30 },
      { label: '✨ Desk Tech', radius: 170, angle: Math.PI * 1.5, speed: 0.005, color: '#00e5a3', z: 45 }
    ];

    function resize() {
      const rect = heroVisual.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      // Cap DPR to 1.25 max for ultra smooth performance without GPU lag
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Initialize 3D ambient particle matrix
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        z: Math.random() * 80 + 20,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.0005,
        vy: (Math.random() - 0.5) * 0.0005,
        color: Math.random() > 0.5 ? 'rgba(255, 123, 56,' : 'rgba(0, 163, 255,'
      });
    }

    // Mouse interaction event listeners with passive flags
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      mouse.targetX = (e.clientX - rect.left) / rect.width - 0.5;
      mouse.targetY = (e.clientY - rect.top) / rect.height - 0.5;
      mouse.isHovered = true;
    }, { passive: true });

    heroVisual.addEventListener('mouseleave', () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.isHovered = false;
      heroVisual.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }, { passive: true });

    heroVisual.addEventListener('click', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 10,
        alpha: 0.85
      });
    }, { passive: true });

    // 3D Perspective Projection math
    function project3D(x, y, z, rotX, rotY) {
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

      let y1 = y * cosX - z * sinX;
      let z1 = y * sinX + z * cosX;

      let x2 = x * cosY + z1 * sinY;
      let z2 = -x * sinY + z1 * cosY;

      const fov = 450;
      const scale = fov / (fov + z2 + 120);
      return {
        px: width / 2 + x2 * scale,
        py: height / 2 + y1 * scale,
        scale: scale
      };
    }

    let globalRotation = 0;

    function render() {
      if (!isVisible) return;

      // Lerp mouse tracking
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      globalRotation += 0.008;

      // Apply subtle 3D card tilt only when hovered or moving
      if (mouse.isHovered || Math.abs(mouse.x) > 0.01 || Math.abs(mouse.y) > 0.01) {
        const tiltX = -mouse.y * 16;
        const tiltY = mouse.x * 16;
        heroVisual.style.transform = `perspective(1200px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(${mouse.isHovered ? 1.02 : 1}, ${mouse.isHovered ? 1.02 : 1}, 1)`;
      }

      ctx.clearRect(0, 0, width, height);

      // Render Particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1;
        if (p.y > 1) p.y = 0;

        const posX = p.x * width + mouse.x * p.z * 0.4;
        const posY = p.y * height + mouse.y * p.z * 0.4;

        ctx.beginPath();
        ctx.arc(posX, posY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
      });

      // Render Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 3.5;
        r.alpha *= 0.94;

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 123, 56, ${r.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (r.alpha < 0.03) ripples.splice(i, 1);
      }

      const rotX = mouse.y * 0.35;
      const rotY = globalRotation * 0.4 + mouse.x * 0.5;

      // 3D Orbital Rings (Optimized 20 steps)
      for (let r = 0; r < 2; r++) {
        const ringRadius = 100 + r * 30;
        ctx.beginPath();
        const steps = 22;
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 2;
          const rx = Math.cos(theta) * ringRadius;
          const ry = Math.sin(theta) * ringRadius * (r === 0 ? 0.35 : 0.55);
          const rz = Math.sin(theta) * ringRadius * 0.35;

          const proj = project3D(rx, ry, rz, rotX, rotY + (r * 1.2));
          if (i === 0) ctx.moveTo(proj.px, proj.py);
          else ctx.lineTo(proj.px, proj.py);
        }
        ctx.strokeStyle = r === 0 ? 'rgba(255, 123, 56, 0.7)' : 'rgba(0, 163, 255, 0.6)';
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // Render Central VEXORA Emblem Monogram
      const centerProj = project3D(0, -5, 0, rotX, rotY);
      ctx.save();
      ctx.translate(centerProj.px, centerProj.py);
      ctx.scale(centerProj.scale, centerProj.scale);

      // Glow behind emblem
      const glowGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 75);
      glowGrad.addColorStop(0, 'rgba(255, 123, 56, 0.3)');
      glowGrad.addColorStop(1, 'rgba(11, 42, 74, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 75, 0, Math.PI * 2);
      ctx.fill();

      // V Monogram
      ctx.beginPath();
      ctx.moveTo(-28, -30);
      ctx.lineTo(0, 28);
      ctx.lineTo(28, -30);
      ctx.strokeStyle = '#ff7b38';
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, -42, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ffb700';
      ctx.fill();

      ctx.font = '800 16px "Outfit", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('VEXORA', 0, 60);

      ctx.restore();

      // Render Orbiting 3D Product Badges
      orbitItems.forEach((item) => {
        item.angle += item.speed;
        const ox = Math.cos(item.angle) * item.radius;
        const oy = Math.sin(item.angle) * (item.radius * 0.38);
        const oz = Math.sin(item.angle) * 45;

        const proj = project3D(ox + mouse.x * item.z, oy + mouse.y * item.z, item.z + oz, rotX * 0.4, rotY * 0.4);

        ctx.save();
        ctx.translate(proj.px, proj.py);
        ctx.scale(proj.scale, proj.scale);

        ctx.fillStyle = 'rgba(11, 42, 74, 0.88)';
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 1.4;

        const cardWidth = 135;
        const cardHeight = 34;
        const radius = 17;

        ctx.beginPath();
        ctx.roundRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, radius);
        ctx.fill();
        ctx.stroke();

        ctx.font = '700 12px "Inter", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label, 0, 0);

        ctx.restore();
      });

      if (isVisible) {
        animId = requestAnimationFrame(render);
      }
    }

    // Viewport IntersectionObserver to completely freeze loop when scrolled out of view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (!animId) {
            animId = requestAnimationFrame(render);
          }
        } else {
          if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
          }
        }
      });
    }, { threshold: 0.05 });

    observer.observe(heroVisual);

    window.addEventListener('resize', resize, { passive: true });
    resize();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero3DModel);
  } else {
    initHero3DModel();
  }
})();
