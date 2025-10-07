import React, { useEffect, useRef } from 'react';

export default function BackgroundWarpShader({ className = '' }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const startRef = useRef(performance.now());
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: 0.0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'high-performance' });
    if (!gl) return;
    glRef.current = gl;

    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const vertSrc = `
    attribute vec2 aPosition;
    void main(){
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
    `;

    const fragSrc = `
    precision highp float;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform vec2 uMouse; // 0..1
    uniform float uActive; // 0 or 1

    // Hash and noise
    float hash(vec2 p){
      return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123);
    }
    float noise(vec2 p){
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0,0.0));
      float c = hash(i + vec2(0.0,1.0));
      float d = hash(i + vec2(1.0,1.0));
      vec2 u = f*f*(3.0-2.0*f);
      return mix(a, b, u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
    }
    float fbm(vec2 p){
      float v = 0.0;
      float a = 0.5;
      for(int i=0;i<6;i++){
        v += a*noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    vec3 hsv2rgb(vec3 c){
      vec3 p = abs(fract(c.xxx + vec3(0.0, 2.0/3.0, 1.0/3.0)) * 6.0 - 3.0);
      vec3 rgb = c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);
      return rgb;
    }

    void main(){
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      vec2 p = uv - 0.5;
      p.x *= uResolution.x / uResolution.y;

      // Mouse attractor point in NDC-like space
      vec2 m = uMouse - 0.5;
      m.x *= uResolution.x / uResolution.y;

      float t = uTime * 0.15;

      // Distance field affected by mouse
      float d = length(p - m);
      float ripple = sin(10.0 * d - uTime * 2.0);

      // Flow field
      vec2 flow = p * 1.5;
      flow += 0.35 * vec2(
        fbm(p * 2.0 + t * 2.0),
        fbm(p * 2.0 - t * 1.5)
      );
      flow += uActive * 0.8 * vec2(
        fbm((p - m) * 3.0 + t * 3.0),
        fbm((p + m) * 3.0 - t * 3.0)
      );

      float n = fbm(flow * 2.4 + ripple * 0.12);

      // Neon bands
      float bands = smoothstep(0.45, 0.9, sin(8.0 * (p.x + p.y + n * 1.8) + t * 4.0));
      float glow = smoothstep(0.0, 1.0, 1.0 - d * 1.6);
      glow = pow(glow, 1.8);

      float hue = mod(0.6 + n * 0.6 + ripple * 0.03 + t * 0.15, 1.0);
      float sat = clamp(0.75 + 0.25 * bands, 0.6, 1.0);
      float val = clamp(0.35 + 0.65 * (bands * 0.9 + glow * 0.7), 0.0, 1.0);

      vec3 color = hsv2rgb(vec3(hue, sat, val));

      // Extra additive neon around mouse
      float mouseGlow = exp(-12.0 * d) * uActive;
      color += mouseGlow * vec3(1.0, 0.5, 1.0);

      // Vignette
      float vig = smoothstep(0.95, 0.2, length(uv - 0.5));
      color *= mix(0.9, 1.2, vig);

      // Subtle film
      float grain = fract(sin(dot(gl_FragCoord.xy + uTime, vec2(12.9898,78.233))) * 43758.5453);
      color += (grain - 0.5) * 0.015;

      gl_FragColor = vec4(color, 1.0);
    }
    `;

    function createShader(type, source) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, source);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    }

    function createProgram(vsSrc, fsSrc) {
      const vs = createShader(gl.VERTEX_SHADER, vsSrc);
      const fs = createShader(gl.FRAGMENT_SHADER, fsSrc);
      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(prog));
        gl.deleteProgram(prog);
        return null;
      }
      return prog;
    }

    const program = createProgram(vertSrc, fragSrc);
    if (!program) return;
    programRef.current = program;
    gl.useProgram(program);

    // Fullscreen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const verts = new Float32Array([
      -1, -1,  1, -1, -1,  1,
       1, -1,  1,  1, -1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    const aPositionLoc = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

    const uResolutionLoc = gl.getUniformLocation(program, 'uResolution');
    const uTimeLoc = gl.getUniformLocation(program, 'uTime');
    const uMouseLoc = gl.getUniformLocation(program, 'uMouse');
    const uActiveLoc = gl.getUniformLocation(program, 'uActive');

    function resize() {
      const parent = canvas.parentElement;
      const w = parent.clientWidth || window.innerWidth;
      const h = Math.max(parent.clientHeight, 640);
      const displayW = Math.floor(w * DPR);
      const displayH = Math.floor(h * DPR);
      if (canvas.width !== displayW || canvas.height !== displayH) {
        canvas.width = displayW;
        canvas.height = displayH;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.uniform2f(uResolutionLoc, w, h);
    }

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
      mouseRef.current.active = 1.0;
    };
    const onPointerLeave = () => { mouseRef.current.active = 0.0; };

    function render() {
      const time = (performance.now() - startRef.current) / 1000;
      gl.useProgram(program);
      gl.uniform1f(uTimeLoc, time);
      gl.uniform2f(uMouseLoc, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(uActiveLoc, mouseRef.current.active);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(render);
    }

    resize();
    render();

    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('pointerdown', () => { mouseRef.current.active = 1.0; });
    canvas.addEventListener('pointerup', () => { mouseRef.current.active = 0.6; });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      if (gl) {
        const ext = gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
      }
    };
  }, []);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#07080b] to-transparent" />
    </div>
  );
}
