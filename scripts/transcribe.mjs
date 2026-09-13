#!/usr/bin/env node
// Gera transcriptSegments (texto + timestamp por frase) pra um áudio OU vídeo,
// usando Whisper local (`pip install openai-whisper`, roda 100% offline, sem
// chave de API). Uso:
//   node scripts/transcribe.mjs public/audio/algum-audio.mp3
//   node scripts/transcribe.mjs public/video/algum-video.mp4
// Escreve o resultado em app/data/transcripts/<nome-do-arquivo>.json.
//
// O Whisper devolve blocos de até ~30s — grandes demais pra legenda do site,
// que troca por FRASE e reserva ~4 linhas. Por isso roda com
// --word_timestamps e remonta frases de até MAX_CHARS caracteres, quebrando
// preferencialmente em pontuação, com start/end tirados do tempo REAL da
// primeira e da última palavra de cada frase (legenda sincronizada de verdade,
// não tempo estimado). Revise o texto depois: nomes próprios e gírias podem
// sair errados (ex.: "Lorena" em vez de "Lorenzo").
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, basename, extname } from 'node:path'

const MAX_CHARS = 95
// Modelo do Whisper: small é rápido; medium erra bem menos em fala informal
// (gírias, fala rápida). Ex.: WHISPER_MODEL=medium node scripts/transcribe.mjs ...
const MODEL = process.env.WHISPER_MODEL || 'small'
// Prompt inicial pontuado e no tom das mensagens: sem ele o Whisper às vezes
// devolve tudo em minúsculas e sem pontuação, e as frases quebram no meio.
const INITIAL_PROMPT = 'Feliz aniversário, Lorenzo! Tá ligado, mano? Te amo, irmão. Tudo de melhor pra você.'

const mediaPath = process.argv[2]
if (!mediaPath) {
  console.error('Uso: node scripts/transcribe.mjs <caminho-do-audio-ou-video>')
  process.exit(1)
}

const slug = basename(mediaPath, extname(mediaPath)).replace(/\.av1$/, '')
const workDir = mkdtempSync(join(tmpdir(), 'whisper-'))

console.log(`Transcrevendo ${mediaPath} (modelo ${MODEL}, pt, tempo por palavra)...`)
execFileSync('whisper', [
  mediaPath,
  '--model', MODEL,
  '--language', 'Portuguese',
  '--word_timestamps', 'True',
  '--initial_prompt', INITIAL_PROMPT,
  '--output_format', 'json',
  '--output_dir', workDir
], { stdio: 'inherit' })

const raw = JSON.parse(readFileSync(join(workDir, `${basename(mediaPath, extname(mediaPath))}.json`), 'utf-8'))
rmSync(workDir, { recursive: true, force: true })

const round = t => Math.round(t * 100) / 100
const words = raw.segments.flatMap(s => s.words ?? []).map(w => ({ text: w.word.trim(), start: w.start, end: w.end }))

// Junta palavras em frases: fecha a frase ao terminar em pontuação forte
// (. ! ?) ou quando a próxima palavra estouraria MAX_CHARS — nesse caso volta
// até a última vírgula da frase, se houver, pra não cortar no meio da ideia.
const segments = []
let current = []
const textOf = ws => ws.map(w => w.text).join(' ')
const flush = (ws) => {
  if (!ws.length) return
  segments.push({ text: textOf(ws), start: round(ws[0].start), end: round(ws[ws.length - 1].end) })
}

for (const word of words) {
  if (current.length && textOf([...current, word]).length > MAX_CHARS) {
    const lastComma = current.findLastIndex(w => /,$/.test(w.text))
    if (lastComma >= 0 && lastComma < current.length - 1) {
      flush(current.slice(0, lastComma + 1))
      current = current.slice(lastComma + 1)
    } else {
      flush(current)
      current = []
    }
  }
  current.push(word)
  if (/[.!?]$/.test(word.text)) {
    flush(current)
    current = []
  }
}
flush(current)

// Junta frases vizinhas curtas ("Te amo.", "Pra frente.") numa só quando a
// pausa entre elas é pequena e o total cabe em MAX_CHARS — sem isso a
// legenda troca a cada meio segundo e fica impossível de ler.
const MERGE_GAP = 0.8
const SHORT = 30
for (let i = 0; i < segments.length - 1;) {
  const a = segments[i]
  const b = segments[i + 1]
  const joined = `${a.text} ${b.text}`
  if (b.start - a.end < MERGE_GAP && joined.length <= MAX_CHARS && (a.text.length < SHORT || b.text.length < SHORT)) {
    segments.splice(i, 2, { text: joined, start: a.start, end: b.end })
  } else {
    i++
  }
}

const outDir = join(import.meta.dirname, '..', 'app', 'data', 'transcripts')
mkdirSync(outDir, { recursive: true })
const outPath = join(outDir, `${slug}.json`)
writeFileSync(outPath, JSON.stringify(segments, null, 2) + '\n')

console.log(`\nSalvo em ${outPath} (${segments.length} frases, ${words.length} palavras)\n`)
for (const s of segments) console.log(`${s.start.toFixed(2).padStart(6)} - ${s.end.toFixed(2).padStart(6)} | ${s.text}`)
