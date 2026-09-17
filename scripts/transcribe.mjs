#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, basename, extname } from 'node:path'

const MAX_CHARS = 95
const MODEL = process.env.WHISPER_MODEL || 'small'
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
