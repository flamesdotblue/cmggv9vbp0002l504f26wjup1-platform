import React, { useEffect, useRef } from 'react';

export default function AnimatedOrbs({ className = '' }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const state = {
      w: 0,
      h: 0,
      orbs: [],
      mouse: { x: 0, y: 0 },
    };

    const colors = [
      { from: [124, 58, 237], to: [236, 72, 153] }, // indigo -> pink
      { from: [59, 130, 246], to: [56, 189, 248] }, // blue -> cyan
      { from: [16, 185, 129], to: [5, 150, 105] },  // emerald -> teal
      { from: [245, 158, 11], to: [234, 88, 12] },  // amber -> orange
      { from: [168, 85, 247], to: [99, 102, 241] }, // violet -> indigo
    ];

    function lerp(a, b, t) { return a + (b - a) * t; }
    function colorLerp(c1, c2, t) {
      return `rgba(${Math.floor(lerp(c1[0], c2[0], t))}, ${Math.floor(lerp(c1[1], c2[1], t))}, ${Math.floor(lerp(c1[2], c2[2], t))}, 0.75)`;
    }

    function resize() {
      const { clientWidth, clientHeight } = canvas.parentElement;
      state.w = Math.max(800, clientWidth);
      state.h = Math.max(600, clientHeight);
      canvas.width = state.w * DPR;
      canvas.height = state.h * DPR;
      canvas.style.width = state.w + 'px';
      canvas.style.height = state.h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function initOrbs() {
      const count = 16; // keep light for performance
      state.orbs = new Array(count).fill(0).map((_, i) => {
        const baseR = Math.min(state.w, state.h) * 0.18;
        const radius = baseR * (0.45 + Math.random() * 0.55);
        const angle = Math.random() * Math.PI * 2;
        const dist = (Math.min(state.w, state.h) * (0.15 + Math.random() * 0.4));
        const speed = (0.0012 + Math.random() * 0.0012) * (Math.random() > 0.5 ? 1 : -1);
        const color = colors[i % colors.length];
        const hueShift = Math.random();
        return { angle, dist, speed, radius, color, hueShift, t: Math.random() };
      });
    }

    function draw() {
      ctx.clearRect(0, 0, state.w, state.h);

      // subtle vignette background
      const vg = ctx.createRadialGradient(state.w * 0.5, state.h * 0.45, 10, state.w * 0.5, state.h * 0.5, Math.max(state.w, state.h) * 0.8);
      vg.addColorStop(0, 'rgba(10,11,15,0.9)');
      vg.addColorStop(1, 'rgba(7,8,11,1)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, state.w, state.h);

      // orbs layer
      ctx.globalCompositeOperation = 'lighter';
      state.orbs.forEach((o, idx) => {
        o.t += 0.0025;
        o.angle += o.speed;
        const orbitX = state.w * 0.5 + Math.cos(o.angle) * o.dist;
        const orbitY = state.h * 0.55 + Math.sin(o.angle) * o.dist * 0.55;

        const p = (Math.sin(o.t * 2 + idx) + 1) / 2;
        const c = colorLerp(o.color.from, o.color.to, p);

        const g = ctx.createRadialGradient(orbitX, orbitY, 0, orbitX, orbitY, o.radius);
        g.addColorStop(0, c);
        g.addColorStop(0.4, c);
        g.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(orbitX, orbitY, o.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = 'source-over';

      // soft horizon glow
      const hg = ctx.createLinearGradient(0, state.h * 0.75, 0, state.h);
      hg.addColorStop(0, 'rgba(255,255,255,0.06)');
      hg.addColorStop(1, 'rgba(7,8,11,0)');
      ctx.fillStyle = hg;
      ctx.fillRect(0, state.h * 0.6, state.w, state.h * 0.4);

      rafRef.current = requestAnimationFrame(draw);
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      state.mouse.x = (e.clientX - rect.left) / rect.width - 0.5;
      state.mouse.y = (e.clientY - rect.top) / rect.height - 0.5;
      // Parallax by shifting orb center subtly
      state.orbs.forEach((o) => {
        o.angle += state.mouse.x * 0.002;
        o.dist += state.mouse.y * 0.2;
      });
    }

    resize();
    initOrbs();
    draw();

    window.addEventListener('resize', () => { resize(); initOrbs(); });
    canvas.addEventListener('mousemove', onMouseMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', () => { resize(); initOrbs(); });
      canvas.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(124,58,237,0.28)_0%,rgba(29,78,216,0.18)_35%,rgba(234,88,12,0.12)_60%,rgba(7,8,11,0.9)_85%)]" />
      <div className="pointer-events-none absolute inset-0 backdrop-blur-[1px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#07080b] to-transparent" />
    </div>
  );
}
