'use client';

import { useEffect, useRef } from 'react';

/* ──────────────────────────────────────────────────────────────────────
   Fundo WebGL — aurora/calor fluido no gradiente da marca, reativo ao cursor.
   • fbm com domain warping (fluxo orgânico)
   • brilho quente seguindo o mouse
   • fallback: gradiente CSS (caso WebGL/JS não rode)
   • reduced-motion: render estático (sem fluxo)
   ────────────────────────────────────────────────────────────────────── */

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;   // 0..1 (suavizado)
uniform float u_intensity;
uniform float u_subtle; // 1.0 = textura escura/discreta

vec2 hash(vec2 p){
  p = vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3)));
  return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(dot(hash(i+vec2(0,0)), f-vec2(0,0)),
                 dot(hash(i+vec2(1,0)), f-vec2(1,0)), u.x),
             mix(dot(hash(i+vec2(0,1)), f-vec2(0,1)),
                 dot(hash(i+vec2(1,1)), f-vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.55;
  for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.02; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x*aspect, uv.y);
  float t = u_time * 0.05;

  // domain warping → fluxo
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3 - t)));
  vec2 r = vec2(fbm(p + 1.7*q + vec2(1.7, 9.2) + 0.15*t),
                fbm(p + 1.7*q + vec2(8.3, 2.8) - 0.13*t));
  float f = fbm(p + 1.9*r);

  // influência quente do cursor (suave — só um leve brilho seguindo o mouse)
  vec2 m = vec2(u_mouse.x*aspect, u_mouse.y);
  float d = distance(p, m);
  float glow = smoothstep(0.45, 0.0, d);
  f += glow * 0.08 * u_intensity;

  float fv = clamp(f*1.05 + 0.46, 0.0, 1.0);

  vec3 ink   = vec3(0.043, 0.035, 0.067);
  vec3 ember = vec3(0.945, 0.145, 0.412);
  vec3 gold  = vec3(0.988, 0.616, 0.0);
  vec3 plum  = vec3(0.30, 0.06, 0.28);

  // ramp: ink → ameixa → ember → ouro (aurora mais rica)
  vec3 col = mix(ink, plum, smoothstep(0.10, 0.45, fv));
  col = mix(col, ember, smoothstep(0.38, 0.78, fv));
  col = mix(col, gold, smoothstep(0.66, 1.0, fv) * 0.9);

  // vinheta suave + teto de brilho (evita estourar pra branco e mantém o texto legível)
  float vig = smoothstep(1.25, 0.15, length(uv - 0.5) * 1.3);
  col *= mix(0.62, 0.86, vig);
  col += glow * vec3(0.05, 0.02, 0.0) * u_intensity;
  col = min(col, vec3(0.92));

  // modo sutil: puxa pro ink e escurece → textura ambiente discreta (brasa fumê)
  vec3 sub = mix(ink, col, 0.5) * 0.4;
  col = mix(col, sub, u_subtle);

  gl_FragColor = vec4(col, 1.0);
}`;

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('[shader]', gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export default function ShaderBackground({ className = '', subtle = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) return; // fallback CSS permanece

    const reduce = false; // motion sempre ligado — shader anima independente do sistema

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[shader] link', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uInt = gl.getUniformLocation(prog, 'u_intensity');
    const uSubtle = gl.getUniformLocation(prog, 'u_subtle');

    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(r.width * dpr));
      h = Math.max(1, Math.floor(r.height * dpr));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    // mouse suavizado
    const mouse = { x: 0.5, y: 0.55, tx: 0.5, ty: 0.55, intensity: 0 };
    const onMove = (e) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
      mouse.targetIntensity = 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);

    let raf;
    const start = performance.now();
    const render = (now) => {
      const time = reduce ? 8.0 : (now - start) / 1000; // estático sob reduced-motion
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      mouse.intensity += ((mouse.targetIntensity || 0) - mouse.intensity) * 0.05;
      mouse.targetIntensity = (mouse.targetIntensity || 0) * 0.96;

      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uInt, 0.25 + mouse.intensity * 0.3);
      gl.uniform1f(uSubtle, subtle ? 1.0 : 0.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (reduce) return; // 1 frame e para
      if (visible) raf = requestAnimationFrame(render);
      else raf = requestAnimationFrame(render); // continua leve mesmo fora (1 quad barato)
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      io.disconnect();
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* fallback CSS — gradiente da marca caso o WebGL não rode */}
      <div className="absolute inset-0 bg-ink" />
      <div
        className={`absolute inset-0 ${
          subtle
            ? 'bg-[radial-gradient(ellipse_at_30%_35%,rgba(241,37,105,0.12),transparent_60%),radial-gradient(ellipse_at_75%_65%,rgba(252,157,0,0.07),transparent_60%)]'
            : 'bg-[radial-gradient(ellipse_at_30%_30%,rgba(241,37,105,0.35),transparent_55%),radial-gradient(ellipse_at_75%_60%,rgba(252,157,0,0.22),transparent_55%)]'
        }`}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
