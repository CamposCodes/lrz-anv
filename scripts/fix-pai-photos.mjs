#!/usr/bin/env node
// Corrige dois problemas nas fotos do Pai (bug reportado pelo usuário, ver
// conversa): (1) pai-17.webp na real é DUAS fotos coladas verticalmente (scan/
// foto de dois prints físicos) — split em duas imagens separadas; (2) a
// maioria das fotos do Pai é paisagem/quase-quadrada, mas o polaroid do site é
// SEMPRE 4:5 (retrato) — o object-cover do frontend cortava até 40% da
// largura pra caber, cortando gente fora da foto (bug reportado com pai-07 e
// pai-08). Em vez de cortar mais, preenche o espaço extra com a própria foto
// borrada/esticada de fundo (estilo Instagram) — mantém 100% do conteúdo
// visível, sem faixa sólida vazia.
//
// Uso: node scripts/fix-pai-photos.mjs
import sharp from 'sharp'
import { readdirSync, readFileSync, renameSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

const DIR = join(import.meta.dirname, '..', 'public', 'images', 'pai')
const TARGET_W = 1200
const TARGET_H = 1500
const TARGET_RATIO = TARGET_W / TARGET_H

// pai-17.webp: foto de cima (lago/grama) termina ~668px, faixa branca do
// scan até ~672px, foto de baixo (praia) começa ~678px — medido com um script
// de análise linha-a-linha (variância de cor por linha) na conversa. Margem
// de alguns px pra dentro dos dois lados evita pegar a faixa branca do scan
// em qualquer uma das duas.
const SPLIT_TOP_HEIGHT = 660
const SPLIT_BOTTOM_TOP = 678

// Preenche até 4:5 com a própria foto desfocada/esticada de fundo (fit:cover
// + blur) e a foto real inteira por cima sem cortar (fit:contain) — em vez de
// cortar mais a foto pra caber no quadro do polaroid.
async function padToPolaroid(input, outputPath) {
  const meta = await sharp(input).metadata()
  const ratio = meta.width / meta.height
  // Já bate com 4:5 (dentro de uma tolerância pequena) — nenhum preenchimento
  // necessário, só garante o tamanho final exato.
  if (Math.abs(ratio - TARGET_RATIO) < 0.02) {
    await sharp(input).resize(TARGET_W, TARGET_H, { fit: 'cover' }).webp({ quality: 82 }).toFile(outputPath)
    return
  }

  const background = await sharp(input)
    .resize(TARGET_W, TARGET_H, { fit: 'cover' })
    .blur(48)
    .modulate({ brightness: 0.72 })
    .toBuffer()

  const foreground = await sharp(input)
    .resize(TARGET_W, TARGET_H, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()

  await sharp(background)
    .composite([{ input: foreground }])
    .webp({ quality: 82 })
    .toFile(outputPath)
}

async function main() {
  const src17 = join(DIR, 'pai-17.webp')
  const topCrop = join(DIR, '__pai-17-top.png')
  const bottomCrop = join(DIR, '__pai-17-bottom.png')
  const meta17 = await sharp(src17).metadata()

  await sharp(src17).extract({ left: 0, top: 0, width: meta17.width, height: SPLIT_TOP_HEIGHT }).toFile(topCrop)
  await sharp(src17).extract({ left: 0, top: SPLIT_BOTTOM_TOP, width: meta17.width, height: meta17.height - SPLIT_BOTTOM_TOP }).toFile(bottomCrop)

  await padToPolaroid(topCrop, join(DIR, 'pai-17a.webp'))
  await padToPolaroid(bottomCrop, join(DIR, 'pai-17b.webp'))
  unlinkSync(topCrop)
  unlinkSync(bottomCrop)
  unlinkSync(src17)
  console.log('pai-17.webp dividida em pai-17a.webp + pai-17b.webp')

  // Todo o resto: preenche in-place quem precisar (fotos já ~4:5 só passam
  // pelo resize/normalização, sem preenchimento visível).
  const files = readdirSync(DIR).filter(f => f.endsWith('.webp') && f !== 'pai-17a.webp' && f !== 'pai-17b.webp')
  for (const f of files) {
    const p = join(DIR, f)
    const tmp = join(DIR, `__tmp-${f}`)
    // Lê em buffer em vez de passar o path pro sharp: no Windows, o handle de
    // leitura do arquivo original pode continuar "aberto" tempo suficiente
    // pra bloquear o rename() por cima dele logo depois (EPERM), mesmo com a
    // Promise já resolvida — ler tudo pra memória primeiro evita depender de
    // quando o handle solto pelo sharp realmente fecha.
    await padToPolaroid(readFileSync(p), tmp)
    renameSync(tmp, p)
    console.log(`ok: ${f}`)
  }
}

main()
