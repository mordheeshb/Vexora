/* ==========================================================================
   VEXORA — Flagship Hero 3D Interactive Model Engine
   Handles: 3D metallic emblem floating, orbiting 3D product cards,
   mouse tracking perspective tilt, ambient particle matrix, and specular glare.
   ========================================================================== */

(function () {
  'use strict';

  function initHero3DModel() {
    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual) return;

    // Create or locate hero canvas
    let canvas = document.getElementById('hero3dCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'hero3dCanvas';
      canvas.className = 'hero-3d-canvas';
      heroVisual.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false };
    let ripples = [];

    // Ambient floating 3D particle matrix
    const numParticles = 45;
    const particles = [];

    // Orbiting 3D Product Badges & Geometry Nodes
    const orbitItems = [
      { label: '📓 Leather Planners', radius: 140, angle: 0, speed: 0.008, color: '#ff7b38', z: 40 },
      { label: '✒️ Luxury Pens', radius: 170, angle: Math.PI * 0.5, speed: 0.006, color: '#00a3ff', z: 60 },
      { label: '🧰 Student Kits', radius: 150, angle: Math.PI, speed: 0.007, color: '#ffb700', z: 30 },
      { label: '✨ Desk Tech', radius: 180, angle: Math.PI * 1.5, speed: 0.005, color: '#00e5a3', z: 50 }
    ];

    // 3D Monogram V Geometry (3D Wireframe Mesh Points)
    const vMesh = [
      // Left arm of V
      { x: -50, y: -60, z: 0 }, { x: -30, y: -60, z: 20 }, { x: 0, y: 50, z: 20 }, { x: 0, y: 50, z: 0 },
      // Right arm of V
      { x: 50, y: -60, z: 0 }, { x: 30, y: -60, z: 20 }, { x: 0, y: 50, z: 20 }, { x: 0, y: 50, z: 0 }
    ];

    function resize() {
      const rect = heroVisual.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    }

    // Initialize 3D ambient particle system
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        z: Math.random() * 100 + 20,
        radius: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.7 + 0.3,
        vx: (Math.random() - 0.5) * 0.0006,
        vy: (Math.random() - 0.5) * 0.0006,
        color: Math.random() > 0.5 ? 'rgba(255, 123, 56,' : 'rgba(0, 163, 255,'
      });
    }

    // Interactive mouse listeners
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      mouse.targetX = (e.clientX - rect.left) / rect.width - 0.5;
      mouse.targetY = (e.clientY - rect.top) / rect.height - 0.5;
      mouse.isHovered = true;
    });

    heroVisual.addEventListener('mouseleave', () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.isHovered = false;
    });

    heroVisual.addEventListener('click', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 10,
        maxRadius: 180,
        alpha: 0.9
      });
    });

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
        scale: scale,
        z: z2
      };
    }

    let globalRotation = 0;

    function render() {
      // Smooth interpolation for mouse tracking
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      globalRotation += 0.01;

      // 3D tactile CSS tilt on the hero visual card container
      const tiltX = -mouse.y * 22;
      const tiltY = mouse.x * 22;
      heroVisual.style.transform = `perspective(1200px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(${mouse.isHovered ? 1.025 : 1}, ${mouse.isHovered ? 1.025 : 1}, 1)`;

      ctx.clearRect(0, 0, width, height);

      // Render 3D ambient particle grid
      particles.forEach(p => {
        p.x += p.vx + mouse.x * 0.0004;
        p.y += p.vy + mouse.y * 0.0004;

        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1;
        if (p.y > 1) p.y = 0;

        const posX = p.x * width + mouse.x * p.z * 0.6;
        const posY = p.y * height + mouse.y * p.z * 0.6;

        ctx.beginPath();
        ctx.arc(posX, posY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color + '0.9)';
        ctx.fill();
      });

      // Render 3D Ripples
      ripples.forEach((r, idx) => {
        r.radius += 4;
        r.alpha *= 0.95;

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 123, 56, ${r.alpha})`;
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff7b38';
        ctx.stroke();

        if (r.alpha < 0.02) ripples.splice(idx, 1);
      });

      // Render Central 3D Floating VEXORA Monogram & Rings
      const rotX = mouse.y * 0.4;
      const rotY = globalRotation * 0.5 + mouse.x * 0.6;

      // 3D Orbital Rings around VEXORA
      for (let r = 0; r < 2; r++) {
        const ringRadius = 110 + r * 35;
        ctx.beginPath();
        const steps = 40;
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 2;
          const rx = Math.cos(theta) * ringRadius;
          const ry = Math.sin(theta) * ringRadius * (r === 0 ? 0.35 : 0.6);
          const rz = Math.sin(theta) * ringRadius * 0.4;

          const proj = project3D(rx, ry, rz, rotX, rotY + (r * 1.2));
          if (i === 0) ctx.moveTo(proj.px, proj.py);
          else ctx.lineTo(proj.px, proj.py);
        }
        ctx.strokeStyle = r === 0 ? 'rgba(255, 123, 56, 0.65)' : 'rgba(0, 163, 255, 0.55)';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 12;
        ctx.shadowColor = r === 0 ? '#ff7b38' : '#00a3ff';
        ctx.stroke();
      }

      // Render Central 3D VEXORA Emblem Emblem Nodes
      const centerProj = project3D(0, -10, 0, rotX, rotY);
      ctx.save();
      ctx.translate(centerProj.px, centerProj.py);
      ctx.scale(centerProj.scale, centerProj.scale);

      // Glow behind VEXORA Emblem
      const glowGradient = ctx.createRadialGradient(0, 0, 10, 0, 0, 90);
      glowGradient.addColorStop(0, 'rgba(255, 123, 56, 0.35)');
      glowGradient.addColorStop(1, 'rgba(11, 42, 74, 0)');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(0, 0, 90, 0, Math.PI * 2);
      ctx.fill();

      // Draw V Symbol
      ctx.beginPath();
      ctx.moveTo(-32, -35);
      ctx.lineTo(0, 32);
      ctx.lineTo(32, -35);
      ctx.strokeStyle = '#ff7b38';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#ff7b38';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, -48, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#ffb700';
      ctx.fill();

      // VEXORA 3D Typography Label
      ctx.font = '800 18px "Outfit", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(255,255,255,0.8)';
      ctx.fillText('VEXORA', 0, 68);

      ctx.restore();

      // Render Orbiting 3D Product Cards
      orbitItems.forEach((item) => {
        item.angle += item.speed;
        const ox = Math.cos(item.angle) * item.radius;
        const oy = Math.sin(item.angle) * (item.radius * 0.4);
        const oz = Math.sin(item.angle) * 50;

        const proj = project3D(ox + mouse.x * item.z, oy + mouse.y * item.z, item.z + oz, rotX * 0.5, rotY * 0.5);

        ctx.save();
        ctx.translate(proj.px, proj.py);
        ctx.scale(proj.scale, proj.scale);

        // Glass card pill shape
        ctx.fillStyle = 'rgba(11, 42, 74, 0.82)';
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 14;
        ctx.shadowColor = item.color;

        const cardWidth = 140;
        const cardHeight = 36;
        const radius = 18;

        ctx.beginPath();
        ctx.roundRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, radius);
        ctx.fill();
        ctx.stroke();

        // Label text inside 3D card
        ctx.font = '700 12px "Inter", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#ffffff';
        ctx.fillText(item.label, 0, 0);

        ctx.restore();
      });

      requestAnimationFrame(render);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero3DModel);
  } else {
    initHero3DModel();
  }
})();
