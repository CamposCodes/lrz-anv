import type { Contributor } from '@/types'
import paiSegments from './transcripts/mensagem-pai.json'
import vitorSegments from './transcripts/mensagem-vitor.json'
import daviSegments from './transcripts/mensagem-davi.json'
import joaoRicardoSegments from './transcripts/mensagem-joao-ricardo.json'
import arthurDexisSegments from './transcripts/mensagem-arthur-dexis.json'
import bruninhoSegments from './transcripts/mensagem-bruninho.json'
import voMaluSegments from './transcripts/mensagem-vo-malu.json'
import licurciSegments from './transcripts/mensagem-licurci.json'
import bkpSegments from './transcripts/mensagem-bkp.json'

// Versão das fotos na URL. As fotos foram reexportadas dos originais (proporção
// real, sem fundo borrado) mantendo os MESMOS nomes de arquivo — sem isso,
// navegador e CDN (netlify.toml: /images/* com cache de 1 dia + 7 de
// stale-while-revalidate) continuavam servindo as versões antigas 4:5 borradas.
// Suba o número sempre que sobrescrever uma foto com o mesmo nome.
const PHOTO_VERSION = 2
const versioned = (path: string) => `${path}?v=${PHOTO_VERSION}`

// Conteúdo real chega via WhatsApp/Drive ao longo da semana — só editar este array,
// nenhuma seção precisa de markup novo por pessoa.
const rawContributors: Contributor[] = [
  {
    // Teste real da legenda sincronizada (scripts/transcribe.mjs) — áudio de
    // voz de verdade (convertido de OGG/Opus pra MP3 em public/audio/), não
    // placeholder. `message` é o fallback mostrado antes do play; depois que
    // toca, o texto troca por transcriptSegments acompanhando o áudio.
    name: 'Pai',
    photo: '/images/pai/pai-19.webp',
    // Fotos reais (WhatsApp) na proporção original, sem corte nem
    // preenchimento (scripts/restore-original-photos.mjs) — alimentam tanto a
    // pilha desta seção quanto o mural arrastável do FinaleSection. pai-19
    // primeiro (mesma foto de `photo` acima) pra a pilha começar exatamente na
    // capa. Lista explícita (não range 01..19): pai-17 era duas fotos físicas
    // coladas numa imagem só, dividida em pai-17a/pai-17b.
    photos: [
      '/images/pai/pai-19.webp',
      ...Array.from({ length: 16 }, (_, i) => `/images/pai/pai-${String(i + 1).padStart(2, '0')}.webp`),
      '/images/pai/pai-17a.webp',
      '/images/pai/pai-17b.webp',
      '/images/pai/pai-18.webp'
    ],
    audio: '/audio/mensagem-pai.mp3',
    message: paiSegments.map(s => s.text).join(' '),
    transcriptSegments: paiSegments
  },
  {
    // Fotos reais (WhatsApp) na proporção original, mesmo tratamento do Pai.
    // Sem upscale (vitor-02/10 vieram pequenas). vitor-01 = capa.
    name: 'Vitor, Irmão',
    photo: '/images/vitor/vitor-01.webp',
    photos: Array.from({ length: 15 }, (_, i) => `/images/vitor/vitor-${String(i + 1).padStart(2, '0')}.webp`),
    audio: '/audio/mensagem-vitor.mp3',
    message: vitorSegments.map(s => s.text).join(' '),
    transcriptSegments: vitorSegments
  },
  {
    // Foto única (WhatsApp) na proporção original (9:16), sem corte.
    name: 'Davi Dooup',
    photo: '/images/davi/davi-01.webp',
    audio: '/audio/mensagem-davi.mp3',
    message: daviSegments.map(s => s.text).join(' '),
    transcriptSegments: daviSegments
  },
  {
    // Fotos do show, WebP (sharp: rotate por EXIF, resize inside 1500px,
    // quality 82 — mesmo tratamento de restore-original-photos.mjs), sem
    // corte. degrau-show-01 = capa. Áudio convertido do .ogg com ffmpeg:
    // silêncio das pontas cortado só nas pontas (via areverse, senão
    // silenceremove trunca no meio numa pausa de fala), passa-alta 70Hz,
    // loudnorm -16.5 LUFS / pico -1.5 dBTP, MP3 mono 44.1kHz 96kbps (mesmo
    // formato dos outros). Transcrição do Whisper; corrigido "Licurse"→"Licurci"
    // (nome próprio).
    name: 'Licurci MC',
    photo: '/images/degrau/degrau-show-01.webp',
    photos: Array.from({ length: 3 }, (_, i) => `/images/degrau/degrau-show-${String(i + 1).padStart(2, '0')}.webp`),
    audio: '/audio/mensagem-licurci.mp3',
    message: licurciSegments.map(s => s.text).join(' '),
    transcriptSegments: licurciSegments
  },
  {
    // Fotos reais (WhatsApp) em WebP na proporção original, sem upscale;
    // joao-ricardo-01 (abraço no show) = capa. Áudio convertido do .ogg com
    // ffmpeg: silêncio das pontas encurtado, passa-alta 70Hz, loudnorm
    // -16.5 LUFS / pico -1.5 dBTP, MP3 mono 44.1kHz 96kbps (mesmo formato dos
    // outros). Transcrição do Whisper dividida em frases e alinhada ao tempo
    // real de cada palavra (--word_timestamps); corrigidos "Vale"→"Salve",
    // "tem"→"tenho" e "Lorena"→"Lorenzo".
    name: 'João Ricardo, Cotto',
    photo: '/images/joao-ricardo/joao-ricardo-01.webp',
    photos: Array.from({ length: 4 }, (_, i) => `/images/joao-ricardo/joao-ricardo-${String(i + 1).padStart(2, '0')}.webp`),
    audio: '/audio/mensagem-joao-ricardo.mp3',
    message: joaoRicardoSegments.map(s => s.text).join(' '),
    transcriptSegments: joaoRicardoSegments
  },
  {
    // Mensagem em VÍDEO (WhatsApp, selfie 9:16, 2min22s, 17MB). Reencodado com
    // ffmpeg: 30fps constante, redução leve de ruído (hqdn3d), áudio mono
    // normalizado (-16.5 LUFS, passa-alta 70Hz), MP4 com faststart. Duas
    // versões: AV1 (7.6MB, navegadores modernos) e H.264 High (14.5MB,
    // reserva universal) — mesma qualidade (SSIM ~0.985 contra o original).
    // Capa = quadro de 74s em WebP. Transcrição: WHISPER_MODEL=medium
    // node scripts/transcribe.mjs public/video/mensagem-arthur-dexis.mp4.
    name: 'Arthur Dexis',
    photo: '/images/arthur-dexis/arthur-dexis-01.webp',
    video: {
      h264: '/video/mensagem-arthur-dexis.mp4',
      av1: '/video/mensagem-arthur-dexis.av1.mp4',
      width: 576,
      height: 1024
    },
    message: arthurDexisSegments.map(s => s.text).join(' '),
    transcriptSegments: arthurDexisSegments
  },
  {
    // Sem foto por enquanto (cartão de papel em branco com o nome). Áudio veio
    // como WAV editado; convertido pro padrão dos outros (MP3 mono 44.1kHz
    // 96kbps, loudnorm -16.5 LUFS). Transcrição: Whisper medium.
    // Quando a foto chegar: WebP em public/images/bruninho/ e preencher `photo`.
    // Fotos WhatsApp em WebP (sharp: rotate por EXIF, resize inside 1500px,
    // quality 82 — mesmo tratamento dos outros), sem corte. bruninho-01
    // (abraço em família) = capa.
    name: 'Bruninho, Sobrinho',
    photo: '/images/bruninho/bruninho-01.webp',
    photos: Array.from({ length: 4 }, (_, i) => `/images/bruninho/bruninho-${String(i + 1).padStart(2, '0')}.webp`),
    audio: '/audio/mensagem-bruninho.mp3',
    message: bruninhoSegments.map(s => s.text).join(' '),
    transcriptSegments: bruninhoSegments
  },
  {
    // Sem foto por enquanto. WAV original saturado (pico 0 dBFS) — a
    // normalização trouxe o pico pra -0.6 dB. Mesmo formato e processo do
    // Bruninho. Quando a foto chegar: public/images/vo-malu/ e preencher `photo`.
    name: 'Vó Malu',
    audio: '/audio/mensagem-vo-malu.mp3',
    message: voMaluSegments.map(s => s.text).join(' '),
    transcriptSegments: voMaluSegments
  },
  {
    // Pasta do WhatsApp com 11 fotos (scripts/restore-original-photos.mjs,
    // mesmo pipeline: rotate por EXIF, resize inside 1500px, webp quality 82,
    // sem upscale) — da infância até fotos recentes. lucas-11 (selfie atual,
    // nítida) = capa, primeiro na lista pra pilha começar nela. lucas-12..16
    // vieram depois, soltas no meio/fim da pilha. Áudio da mensagem ainda não
    // chegou: quando chegar, salvar em public/audio/mensagem-lucas.mp3 (mesmo
    // processo dos outros: ffmpeg trim de silêncio + passa-alta 70Hz +
    // loudnorm -16.5 LUFS/-1.5 dBTP + MP3 mono 44.1kHz 96kbps), rodar
    // scripts/transcribe.mjs e preencher audio/message/transcriptSegments.
    name: 'Lucas, Primo',
    photo: '/images/lucas/lucas-11.webp',
    photos: [
      '/images/lucas/lucas-11.webp',
      ...Array.from({ length: 5 }, (_, i) => `/images/lucas/lucas-${String(i + 1).padStart(2, '0')}.webp`),
      '/images/lucas/lucas-12.webp',
      ...Array.from({ length: 5 }, (_, i) => `/images/lucas/lucas-${String(i + 6).padStart(2, '0')}.webp`),
      ...Array.from({ length: 4 }, (_, i) => `/images/lucas/lucas-${String(i + 13).padStart(2, '0')}.webp`)
    ],
    message: ''
  },
  {
    // Fotos WhatsApp em WebP (sharp: rotate por EXIF, resize inside 1500px,
    // quality 82 — mesmo tratamento dos outros), sem corte. bkp-01 (foto do
    // show, still nítido) = capa. Áudio veio como .mp4/AAC; convertido pro
    // padrão dos outros com ffmpeg: silêncio das pontas cortado (areverse),
    // passa-alta 70Hz, loudnorm -16.5 LUFS / pico -1.5 dBTP, MP3 mono 44.1kHz
    // 96kbps. Transcrição: Whisper medium; corrigido "pertecente"→"pertencente"
    // (erro de reconhecimento, não da fala).
    name: 'BKP',
    photo: '/images/bkp/bkp-01.webp',
    photos: [
      '/images/bkp/bkp-01.webp',
      '/images/bkp/bkp-02.webp'
    ],
    audio: '/audio/mensagem-bkp.mp3',
    message: bkpSegments.map(s => s.text).join(' '),
    transcriptSegments: bkpSegments
  }
]

export const contributors: Contributor[] = rawContributors.map(c => ({
  ...c,
  photo: c.photo && versioned(c.photo),
  photos: c.photos?.map(versioned)
}))
