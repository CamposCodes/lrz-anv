<template>
  <!-- Atmosfera global: névoa cósmica atrás de TODO o conteúdo (z-index negativo).
       Fica ATRÁS do texto (nunca por cima) → contraste de leitura sempre preservado.
       Decorativa: aria-hidden + pointer-events-none. -->
  <div class="atmosphere" aria-hidden="true">
    <!-- Fallback estático (SSR, sem WebGL, prefers-reduced-motion): nebulosa em CSS+SVG. -->
    <div class="atmosphere-fallback" />
    <!-- Canvas WebGL: monta no cliente, faz fade-in sobre o fallback. -->
    <canvas ref="canvasEl" class="atmosphere-canvas" :class="{ 'is-ready': ready }" />
  </div>
</template>

<script lang="ts" setup>
// Névoa volumétrica via fragment shader (fBm + domain warping). Renderizada em buffer
// reduzido (<=1100px) e escalada por CSS — a névoa é suave, então o upscale é invisível
// e o custo de GPU fica baixo. Pausa com a aba oculta; congela em reduced-motion.
const canvasEl = ref<HTMLCanvasElement | null>(null)
const ready = ref(false)

// Paletas espelham os tokens (Lua/Sol). Componentes RGB normalizados 0..1.
const hex = (h: string): [number, number, number] => {
  const n = parseInt(h.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}
type Palette = {
  base: [number, number, number]
  fog: [number, number, number]
  glow1: [number, number, number]
  glow2: [number, number, number]
  intensity: number
}
// A atmosfera só aparece atrás de seções NOITE com fill="transparent" — papel e sangue
// pintam por cima. Por isso uma paleta só, e agora reduzida ao eixo preto/vermelho: o
// ouro e o eixo quente-ameixa (magenta) saíram junto com o acento cromático removido da
// paleta. Nada de azul: 7 fotos do acervo em 282 (docs/prd/91-assets.md §1).
// Os quatro tons vêm direto dos tokens do contrato, sem hex novo inventado: --color-noite
// para a base, --color-danger para a névoa (vermelho mais escuro e opaco que o sangue, dá
// profundidade sem competir com as brasas) e --color-sangue / --color-danger-dark para as
// duas brasas — a segunda mais clara, para gradação em vez de um vermelho só chapado.
const PALETTE: Palette = {
  base: hex('#0A0004'),
  fog: hex('#B91C1C'),
  glow1: hex('#D30000'),
  glow2: hex('#F87171'),
  intensity: 0.55
}

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_base;
uniform vec3 u_fog;
uniform vec3 u_glow1;
uniform vec3 u_glow2;
uniform float u_intensity;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y) * 2.4;
  float t = u_time * 0.025;

  // domain warping em duas camadas → fluxo orgânico de fumaça
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3 - t)));
  vec2 r = vec2(
    fbm(p + 3.4 * q + vec2(1.7, 9.2) + 0.4 * t),
    fbm(p + 3.4 * q + vec2(8.3, 2.8) - 0.4 * t)
  );
  float f = clamp(fbm(p + 3.6 * r) * 1.15, 0.0, 1.0);

  vec3 col = u_base;
  col = mix(col, u_fog, smoothstep(0.18, 0.95, f) * u_intensity);

  // brasas cósmicas ancoradas, moldadas pelo próprio fluxo
  float g1 = smoothstep(0.62, 0.0, distance(uv, vec2(0.24, 0.78))) * (0.4 + 0.6 * r.x);
  float g2 = smoothstep(0.70, 0.0, distance(uv, vec2(0.82, 0.22))) * (0.4 + 0.6 * q.y);
  col += u_glow1 * g1 * 0.10 * u_intensity;
  col += u_glow2 * g2 * 0.085 * u_intensity;

  // vinheta para profundidade
  float vig = smoothstep(1.25, 0.35, length(uv - 0.5));
  col *= mix(0.80, 1.0, vig);

  gl_FragColor = vec4(col, 1.0);
}
`

let gl: WebGLRenderingContext | null = null
let program: WebGLProgram | null = null
let rafId = 0
let elapsed = 0
let lastTs = 0
let running = false
let reduced = false
const uni: Record<string, WebGLUniformLocation | null> = {}

function compile(type: number, src: string): WebGLShader | null {
  if (!gl) return null
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh)
    return null
  }
  return sh
}

function setup(): boolean {
  const canvas = canvasEl.value
  if (!canvas) return false
  try {
    gl = (canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, powerPreference: 'low-power' })
      || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
  } catch {
    gl = null
  }
  if (!gl) return false

  const vs = compile(gl.VERTEX_SHADER, VERT)
  const fs = compile(gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return false

  program = gl.createProgram()
  if (!program) return false
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false
  gl.useProgram(program)

  // triângulo fullscreen
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(program, 'a_pos')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  for (const name of ['u_res', 'u_time', 'u_base', 'u_fog', 'u_glow1', 'u_glow2', 'u_intensity']) {
    uni[name] = gl.getUniformLocation(program, name)
  }

  canvas.addEventListener('webglcontextlost', onContextLost, false)
  return true
}

function applyPalette() {
  if (!gl) return
  const p = PALETTE
  gl.uniform3fv(uni.u_base, p.base)
  gl.uniform3fv(uni.u_fog, p.fog)
  gl.uniform3fv(uni.u_glow1, p.glow1)
  gl.uniform3fv(uni.u_glow2, p.glow2)
  gl.uniform1f(uni.u_intensity, p.intensity)
}

function resize() {
  const canvas = canvasEl.value
  if (!gl || !canvas) return
  const w = window.innerWidth
  const h = window.innerHeight
  const s = Math.min(1, 1100 / Math.max(w, h)) // buffer reduzido (teto 1100px) → GPU leve
  const cw = Math.max(2, Math.round(w * s))
  const ch = Math.max(2, Math.round(h * s))
  if (canvas.width !== cw || canvas.height !== ch) {
    canvas.width = cw
    canvas.height = ch
  }
  gl.viewport(0, 0, cw, ch)
  gl.uniform2f(uni.u_res, cw, ch)
}

function drawFrame() {
  if (!gl) return
  gl.uniform1f(uni.u_time, elapsed)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}

function loop(ts: number) {
  if (!running) return
  rafId = requestAnimationFrame(loop)
  if (ts - lastTs < 33) return // ~30fps: névoa é lenta, não precisa de 60
  elapsed += Math.min(ts - lastTs, 100) / 1000
  lastTs = ts
  drawFrame()
}

function start() {
  if (running || reduced) return
  running = true
  lastTs = performance.now()
  rafId = requestAnimationFrame(loop)
}
function stop() {
  running = false
  if (rafId) cancelAnimationFrame(rafId)
  rafId = 0
}

function onVisibility() {
  if (document.hidden) stop()
  else start()
}
function onResize() {
  resize()
  if (reduced) drawFrame() // mantém o frame estático nítido após resize
}
function onContextLost(e: Event) {
  e.preventDefault()
  stop()
  ready.value = false
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // Respeita economia de dados → fica só no fallback CSS.
  const saveData = (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData
  if (saveData) return
  if (!setup()) return

  applyPalette()
  resize()
  ready.value = true

  if (reduced) {
    elapsed = 14 // um frame "respirado" e estático
    drawFrame()
  } else {
    start()
  }

  window.addEventListener('resize', onResize, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)
})

onBeforeUnmount(() => {
  stop()
  if (import.meta.client) {
    window.removeEventListener('resize', onResize)
    document.removeEventListener('visibilitychange', onVisibility)
    canvasEl.value?.removeEventListener('webglcontextlost', onContextLost)
  }
  if (gl) {
    const ext = gl.getExtension('WEBGL_lose_context')
    ext?.loseContext()
    gl = null
  }
})
</script>

<style scoped>
.atmosphere {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  background-color: var(--color-bg);
}

.atmosphere-fallback,
.atmosphere-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.atmosphere-canvas {
  opacity: 0;
  transition: opacity 1.2s ease;
}
.atmosphere-canvas.is-ready {
  opacity: 1;
}

/* Nebulosa estática (sempre presente): brilhos de marca + base profunda. */
.atmosphere-fallback {
  background:
    radial-gradient(55% 45% at 22% 22%, color-mix(in oklab, var(--color-accent) 14%, transparent), transparent 70%),
    radial-gradient(55% 45% at 82% 80%, color-mix(in oklab, var(--color-primary) 12%, transparent), transparent 72%),
    radial-gradient(120% 100% at 50% 50%, var(--color-surface) 0%, var(--color-bg) 62%);
  filter: blur(8px) saturate(115%);
}

/* Grão de fumaça (turbulência SVG) — bem sutil, para textura realista no fallback. */
.atmosphere-fallback::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px 180px;
  opacity: 0.04;
  mix-blend-mode: screen;
}
[data-surface="papel"] .atmosphere-fallback::after {
  mix-blend-mode: multiply;
  opacity: 0.05;
}
</style>
