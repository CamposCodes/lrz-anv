import sharp from 'sharp'
import { readdirSync, mkdirSync } from 'node:fs'
import path from 'node:path'

const SRC_DIR = String.raw`C:\Users\gcamp\Downloads\WhatsApp Unknown 2026-09-12 at 15.17.55`
const OUT_DIR = path.resolve('public/images/pai')

mkdirSync(OUT_DIR, { recursive: true })

const files = readdirSync(SRC_DIR)
  .filter(f => f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.jpg'))
  .sort()

console.log(`${files.length} fotos encontradas`)

let i = 0
for (const file of files) {
  i++
  const inputPath = path.join(SRC_DIR, file)
  const outName = `pai-${String(i).padStart(2, '0')}.webp`
  const outPath = path.join(OUT_DIR, outName)

  const meta = await sharp(inputPath).metadata()

  await sharp(inputPath)
    .rotate() // aplica orientação EXIF antes de tudo
    .resize({ width: 1200, height: 1500, fit: 'cover', position: 'attention', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outPath)

  const outMeta = await sharp(outPath).metadata()
  console.log(`${file} (${meta.width}x${meta.height}) -> ${outName} (${outMeta.width}x${outMeta.height})`)
}

console.log('done')
