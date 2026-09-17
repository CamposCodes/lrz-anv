#!/usr/bin/env node
import sharp from 'sharp'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

const DOWNLOADS = String.raw`C:\Users\gcamp\Downloads`
const IMAGES = join(import.meta.dirname, '..', 'public', 'images')

const PAI_DIR = join(DOWNLOADS, 'WhatsApp Unknown 2026-09-12 at 15.17.55')
const VITOR_DIR = join(DOWNLOADS, 'WhatsApp Unknown 2026-09-13 at 10.19.37')
const LUCAS_DIR = join(DOWNLOADS, 'WhatsApp Unknown 2026-09-14 at 14.14.38')
const vitor = name => join(VITOR_DIR, `WhatsApp Image 2026-09-13 at ${name}.jpeg`)

const paiFiles = readdirSync(PAI_DIR).filter(f => /\.jpe?g$/i.test(f)).sort()
const lucasFiles = readdirSync(LUCAS_DIR).filter(f => /\.jpe?g$/i.test(f)).sort()

const MAP = {
  ...Object.fromEntries(paiFiles
    .map((f, i) => [`pai/pai-${String(i + 1).padStart(2, '0')}.webp`, join(PAI_DIR, f)])
    .filter(([out]) => out !== 'pai/pai-17.webp')),
  'vitor/vitor-01.webp': vitor('10.19.26'),
  'vitor/vitor-02.webp': vitor('10.19.22'),
  'vitor/vitor-03.webp': vitor('10.19.23'),
  'vitor/vitor-04.webp': vitor('10.19.24 (1)'),
  'vitor/vitor-05.webp': vitor('10.19.24'),
  'vitor/vitor-06.webp': vitor('10.19.25'),
  'vitor/vitor-07.webp': vitor('10.19.26 (1)'),
  'vitor/vitor-08.webp': vitor('10.19.26 (2)'),
  'vitor/vitor-09.webp': vitor('10.19.27 (1)'),
  'vitor/vitor-10.webp': vitor('10.19.27 (2)'),
  'vitor/vitor-12.webp': vitor('10.19.28 (1)'),
  'vitor/vitor-13.webp': vitor('10.19.28'),
  'davi/davi-01.webp': join(DOWNLOADS, 'WhatsApp Image 2026-09-11 at 16.13.55.jpeg'),
  ...Object.fromEntries(lucasFiles
    .map((f, i) => [`lucas/lucas-${String(i + 1).padStart(2, '0')}.webp`, join(LUCAS_DIR, f)]))
}

function exportWebp(image, out) {
  return image
    .resize({ width: 1500, height: 1500, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(join(IMAGES, out))
    .then(info => console.log(`${out} ${info.width}x${info.height}`))
}

for (const [out, src] of Object.entries(MAP)) {
  await exportWebp(sharp(src).rotate(), out) 
}

const pai17 = join(PAI_DIR, paiFiles[16])
const { width: w17, height: h17 } = await sharp(pai17).metadata()
await exportWebp(sharp(pai17).extract({ left: 0, top: 0, width: w17, height: 765 }), 'pai/pai-17a.webp')
await exportWebp(sharp(pai17).extract({ left: 0, top: 771, width: w17, height: h17 - 771 }), 'pai/pai-17b.webp')

await exportWebp(sharp(vitor('10.19.27')).extract({ left: 0, top: 478, width: 720, height: 720 }), 'vitor/vitor-11.webp')
