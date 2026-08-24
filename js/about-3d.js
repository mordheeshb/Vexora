/* ==========================================================================
   VEXORA — 3D Visual & Interactive Animation Engine
   Handles: 3D interactive Canvas animation, floating 3D objects,
   lighting effects, depth parallax, and smooth mouse-tracking tilt.
   ========================================================================== */

(function () {
  'use strict';

  function init3DAboutVisual() {
    const container = document.querySelector('.about-media');
    if (!container) return;

    // Check if canvas already exists
    let canvas = document.getElementById('about3dCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'about3dCanvas';
      canvas.className = 'about-3d-canvas';
      container.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false };

    // 3D Particles & Floating geometry items
    const numParticles = 35;
    const particles = [];
    
    // 3D Floating Geometry Nodes
    const shapes = [
      { x: 0.25, y: 0.3, z: 40, size: 28, rx: 0.4, ry: 0.6, speedX: 0.008, speedY: 0.012, color: 'rgba(255, 123, 56, 0.85)', type: 'cube' },
      { x: 0.78, y: 0.25, z: 60, size: 22, rx: 0.2, ry: 0.3, speedX: -0.01, speedY: 0.007, color: 'rgba(15, 118, 255, 0.85)', type: 'torus' },
      { x: 0.82, y: 0.75, z: 30, size: 32, rx: 0.5, ry: 0.2, speedX: 0.006, speedY: -0.009, color: 'rgba(255, 157, 0, 0.8)', type: 'pyramid' },
      { x: 0.18, y: 0.8, z: 50, size: 24, rx: 0.3, ry: 0.8, speedX: -0.007, speedY: 0.011, color: 'rgba(11, 42, 74, 0.9)', type: 'ring' }
    ];

    function resize() {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    }

    // Initialize ambient 3D particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        z: Math.random() * 80 + 10,
        radius: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        vx: (Math.random() - 0.5) * 0.0008,
        vy: (Math.random() - 0.5) * 0.0008,
        color: Math.random() > 0.4 ? 'rgba(255, 123, 56,' : 'rgba(80, 160, 255,'
      });
    }

    // Mouse tilt interactions
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      mouse.targetX = relX;
      mouse.targetY = relY;
      mouse.isHovered = true;
    });

    container.addEventListener('mouseleave', () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.isHovered = false;
    });

    // 3D Rendering math helpers
    function project3D(x, y, z, rotX, rotY) {
      let cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      let cosY = Math.cos(rotY), sinY = Math.sin(rotY);

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
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 12;
      ctx.shadowColor = color;
      
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
      // Smooth lerp mouse tracking
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Apply 3D CSS transform to container card for smooth tactile tilt
      const tiltX = -mouse.y * 18;
      const tiltY = mouse.x * 18;
      container.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(${mouse.isHovered ? 1.02 : 1}, ${mouse.isHovered ? 1.02 : 1}, 1)`;

      ctx.clearRect(0, 0, width, height);

      // Render 3D ambient floating particles
      particles.forEach(p => {
        p.x += p.vx + mouse.x * 0.0005;
        p.y += p.vy + mouse.y * 0.0005;

        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1;
        if (p.y > 1) p.y = 0;

        const posX = p.x * width + mouse.x * p.z * 0.5;
        const posY = p.y * height + mouse.y * p.z * 0.5;

        ctx.beginPath();
        ctx.arc(posX, posY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color + '0.8)';
        ctx.fill();
      });

      // Render 3D geometric shapes floating in perspective space
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

        drawCube(projected.px, projected.py, shape.size * projected.scale, shape.rx + mouse.y * 0.5, shape.ry + mouse.x * 0.5, shape.color);
      });

      requestAnimationFrame(render);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DAboutVisual);
  } else {
    init3DAboutVisual();
  }
})();
