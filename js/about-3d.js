/* ==========================================================================
   VEXORA — 3D Visual & Interactive Animation Engine (Performance Optimized)
   Handles: 3D interactive Canvas animation, floating 3D objects,
   lighting effects, depth parallax, viewport visibility pause, and smooth mouse tilt.
   ========================================================================== */

(function () {
  'use strict';

  function init3DAboutVisual() {
    const container = document.querySelector('.about-media');
    if (!container) return;

    let canvas = document.getElementById('about3dCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'about3dCanvas';
      canvas.className = 'about-3d-canvas';
      container.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = false;
    let animId = null;

    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false };

    // Optimized particle count
    const numParticles = 20;
    const particles = [];
    
    // 3D Floating Geometry Nodes
    const shapes = [
      { x: 0.25, y: 0.3, z: 35, size: 24, rx: 0.4, ry: 0.6, speedX: 0.007, speedY: 0.01, color: 'rgba(255, 123, 56, 0.85)' },
      { x: 0.78, y: 0.25, z: 50, size: 20, rx: 0.2, ry: 0.3, speedX: -0.009, speedY: 0.006, color: 'rgba(15, 118, 255, 0.85)' },
      { x: 0.82, y: 0.75, z: 28, size: 28, rx: 0.5, ry: 0.2, speedX: 0.005, speedY: -0.008, color: 'rgba(255, 157, 0, 0.8)' },
      { x: 0.18, y: 0.8, z: 42, size: 22, rx: 0.3, ry: 0.8, speedX: -0.006, speedY: 0.009, color: 'rgba(11, 42, 74, 0.9)' }
    ];

    function resize() {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        z: Math.random() * 60 + 10,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.0006,
        vy: (Math.random() - 0.5) * 0.0006,
        color: Math.random() > 0.4 ? 'rgba(255, 123, 56,' : 'rgba(80, 160, 255,'
      });
    }

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = (e.clientX - rect.left) / rect.width - 0.5;
      mouse.targetY = (e.clientY - rect.top) / rect.height - 0.5;
      mouse.isHovered = true;
    }, { passive: true });

    container.addEventListener('mouseleave', () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.isHovered = false;
      container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }, { passive: true });

    function project3D(x, y, z, rotX, rotY) {
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

      let y1 = y * cosX - z * sinX;
      let z1 = y * sinX + z * cosX;

      let x2 = x * cosY + z1 * sinY;
      let z2 = -x * sinY + z1 * cosY;

      const fov = 400;
      const scale = fov / (fov + z2 + 100);
      return {
        px: width / 2 + x2 * scale,
        py: height / 2 + y1 * scale,
        scale: scale
      };
    }

    function drawCube(px, py, size, rx, ry, color) {
      ctx.save();
      ctx.translate(px, py);
      
      const vertices = [
        [-size, -size, -size], [size, -size, -size], [size, size, -size], [-size, size, -size],
        [-size, -size, size], [size, -size, size], [size, size, size], [-size, size, size]
      ];

      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      const cosY = Math.cos(ry), sinY = Math.sin(ry);

      const projected = vertices.map(v => {
        let x = v[0], y = v[1], z = v[2];
        let y1 = y * cosX - z * sinX;
        let z1 = y * sinX + z * cosX;
        let x2 = x * cosY + z1 * sinY;
        return [x2, y1];
      });

      const edges = [
        [0,1],[1,2],[2,3],[3,0],
        [4,5],[5,6],[6,7],[7,4],
        [0,4],[1,5],[2,6],[3,7]
      ];

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.4;
      
      edges.forEach(edge => {
        const p1 = projected[edge[0]];
        const p2 = projected[edge[1]];
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
      });

      ctx.restore();
    }

    function render() {
      if (!isVisible) return;

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      if (mouse.isHovered || Math.abs(mouse.x) > 0.01 || Math.abs(mouse.y) > 0.01) {
        const tiltX = -mouse.y * 14;
        const tiltY = mouse.x * 14;
        container.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(${mouse.isHovered ? 1.015 : 1}, ${mouse.isHovered ? 1.015 : 1}, 1)`;
      }

      ctx.clearRect(0, 0, width, height);

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

      shapes.forEach(shape => {
        shape.rx += shape.speedX;
        shape.ry += shape.speedY;

        const baseX = (shape.x - 0.5) * width;
        const baseY = (shape.y - 0.5) * height;

        const projected = project3D(
          baseX + mouse.x * shape.z,
          baseY + mouse.y * shape.z,
          shape.z,
          shape.rx,
          shape.ry
        );

        drawCube(projected.px, projected.py, shape.size * projected.scale, shape.rx + mouse.y * 0.4, shape.ry + mouse.x * 0.4, shape.color);
      });

      if (isVisible) {
        animId = requestAnimationFrame(render);
      }
    }

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

    observer.observe(container);

    window.addEventListener('resize', resize, { passive: true });
    resize();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DAboutVisual);
  } else {
    init3DAboutVisual();
  }
})();
