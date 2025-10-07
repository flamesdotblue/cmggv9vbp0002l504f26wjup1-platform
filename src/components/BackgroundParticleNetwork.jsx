import React, { useEffect, useRef } from 'react';

export default function BackgroundParticleNetwork({ className = '' }) {
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
      particles: [],
      hue: 260,
    };

    function resize() {
      const parent = canvas.parentElement;
      const w = parent.clientWidth || window.innerWidth;
      const h = Math.max(parent.clientHeight, 600);
      state.w = w;
      state.h = h;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function initParticles() {
      const count = Math.floor((state.w * state.h) / 18000); // scales with viewport
      state.particles = new Array(count).fill(0).map(() => ({
        x: rand(0, state.w),
        y: rand(0, state.h),
        vx: rand(-0.6, 0.6),
        vy: rand(-0.6, 0.6),
        r: rand(1.0, 2.2),
      }));
    }

    function drawBackground() {
      const g = ctx.createRadialGradient(
        state.w * 0.5,
        state.h * 0.5,
        Math.min(state.w, state.h) * 0.1,
        state.w * 0.5,
        state.h * 0.6,
        Math.max(state.w, state.h) * 0.9
      );
      g.addColorStop(0, 'rgba(10, 12, 18, 0.95)');
      g.addColorStop(1, 'rgba(7, 8, 11, 1)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, state.w, state.h);

      // subtle glow layers
      const g1 = ctx.createLinearGradient(0, 0, state.w, state.h);
      g1.addColorStop(0, 'rgba(99,102,241,0.07)'); // indigo-500
      g1.addColorStop(1, 'rgba(236,72,153,0.06)'); // pink-500
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, state.w, state.h);
    }

    function step() {
      state.hue += 0.06;
      drawBackground();

      // update
      for (let p of state.particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > state.w) { p.x = state.w; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > state.h) { p.y = state.h; p.vy *= -1; }
      }

      // draw connections
      const maxDist = Math.min(200, Math.max(120, Math.min(state.w, state.h) * 0.18));
      for (let i = 0; i < state.particles.length; i++) {
        const p1 = state.particles[i];
        for (let j = i + 1; j < state.particles.length; j++) {
          const p2 = state.particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxDist * maxDist) {
            const d = Math.sqrt(d2);
            const t = 1 - d / maxDist;
            const hue = (state.hue + (i * 3)) % 360;
            ctx.strokeStyle = `hsla(${hue}, 80%, ${40 + t * 25}%, ${0.18 + t * 0.25})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // draw particles
      for (let p of state.particles) {
        const hue = (state.hue + (p.x + p.y) * 0.02) % 360;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        grd.addColorStop(0, `hsla(${hue}, 90%, 65%, 0.9)`);
        grd.addColorStop(0.4, `hsla(${hue}, 90%, 55%, 0.6)`);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // top vignette and bottom fade to page bg
      const vg = ctx.createLinearGradient(0, 0, 0, state.h);
      vg.addColorStop(0, 'rgba(0,0,0,0.2)');
      vg.addColorStop(0.6, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(7,8,11,0.4)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, state.w, state.h);

      rafRef.current = requestAnimationFrame(step);
    }

    const handleResize = () => { resize(); initParticles(); };

    resize();
    initParticles();
    step();

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#07080b] to-transparent" />
    </div>
  );
}
