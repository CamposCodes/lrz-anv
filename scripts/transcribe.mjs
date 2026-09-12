#!/usr/bin/env node
// Gera transcriptSegments (texto + timestamp por trecho) pra um áudio, usando
// Whisper local (`pip install openai-whisper`, roda 100% offline, sem chave
// de API). Uso:
//   node scripts/transcribe.mjs public/audio/algum-audio.mp3
// Escreve o resultado em app/data/transcripts/<nome-do-arquivo>.json e
// imprime o array pronto pra colar no campo `transcriptSegments` de um
// contribuidor em app/data/contributors.ts.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, basename, extname } from 'node:path'

const audioPath = process.argv[2]
if (!audioPath) {
  console.error('Uso: node scripts/transcribe.mjs <caminho-do-audio>')
  process.exit(1)
}

const slug = basename(audioPath, extname(audioPath))
const workDir = mkdtempSync(join(tmpdir(), 'whisper-'))

console.log(`Transcrevendo ${audioPath} (modelo small, pt)...`)
execFileSync('whisper', [
  audioPath,
  '--model', 'small',
  '--language', 'Portuguese',
  '--output_format', 'json',
  '--output_dir', workDir
], { stdio: 'inherit' })

const raw = JSON.parse(readFileSync(join(workDir, `${slug}.json`), 'utf-8'))
rmSync(workDir, { recursive: true, force: true })

// Só texto + start/end por trecho (granularidade de frase) — sem os arrays de
// palavra-a-palavra do Whisper, que este site não usa (ver decisão: legenda
// troca por FRASE, não efeito karaokê palavra-a-palavra).
const segments = raw.segments.map(s => ({
  text: s.text.trim(),
  start: Math.round(s.start * 100) / 100,
  end: Math.round(s.end * 100) / 100
}))

const outDir = join(import.meta.dirname, '..', 'app', 'data', 'transcripts')
mkdirSync(outDir, { recursive: true })
const outPath = join(outDir, `${slug}.json`)
writeFileSync(outPath, JSON.stringify(segments, null, 2) + '\n')

console.log(`\nSalvo em ${outPath}`)
console.log('\nCole em contributors.ts, campo transcriptSegments:\n')
console.log(JSON.stringify(segments, null, 2))
