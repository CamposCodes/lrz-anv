import type { Contributor } from '@/types'
import maeSegments from './transcripts/mensagem-mae.json'
import arthurDmaSegments from './transcripts/mensagem-arthur-dma.json'
import paiSegments from './transcripts/mensagem-pai.json'
import vitorSegments from './transcripts/mensagem-vitor.json'
import daviSegments from './transcripts/mensagem-davi.json'
import joaoRicardoSegments from './transcripts/mensagem-joao-ricardo.json'
import arthurDexisSegments from './transcripts/mensagem-arthur-dexis.json'
import bruninhoSegments from './transcripts/mensagem-bruninho.json'
import voMaluSegments from './transcripts/mensagem-vo-malu.json'
import licurciSegments from './transcripts/mensagem-licurci.json'
import bkpSegments from './transcripts/mensagem-bkp.json'
import brenoSegments from './transcripts/mensagem-breno.json'
import babiSegments from './transcripts/mensagem-babi.json'
import lucasPrimoSegments from './transcripts/mensagem-lucas-primo.json'
import claudiaKaliSegments from './transcripts/mensagem-claudia-kali.json'
import gabrielVassouraSegments from './transcripts/mensagem-gabriel-vassoura.json'
import gabiSegments from './transcripts/mensagem-gabi.json'
import ronaldinhoSegments from './transcripts/mensagem-ronaldinho.json'
import tioGuSegments from './transcripts/mensagem-tio-gu.json'
import voReginaSegments from './transcripts/mensagem-vo-regina.json'
import tiaSelmaSegments from './transcripts/mensagem-tia-selma.json'
import tioRonaldoSegments from './transcripts/mensagem-tio-ronaldo.json'
import joaoGabrielSegments from './transcripts/mensagem-joao-gabriel.json'
import laraSegments from './transcripts/mensagem-lara.json'
import gabrielCamposSegments from './transcripts/mensagem-gabriel-campos.json'

const PHOTO_VERSION = 2
const versioned = (path: string) => path.includes('?') ? `${path}&v=${PHOTO_VERSION}` : `${path}?v=${PHOTO_VERSION}`

const rawContributors: Contributor[] = [
  {
    name: 'Mãe',
    photo: '/images/mae/mae-23.webp',
    photos: [
      '/images/mae/mae-23.webp',
      '/images/mae/mae-08.webp',
      '/images/mae/mae-09.webp',
      '/images/mae/mae-10.webp',
      '/images/mae/mae-12.webp',
      '/images/mae/mae-13.webp',
      '/images/mae/mae-14.webp',
      '/images/mae/mae-16.webp',
      '/images/mae/mae-18.webp',
      '/images/mae/mae-22.webp',
      '/images/mae/mae-01.webp',
      '/images/mae/mae-02.webp',
      '/images/mae/mae-03.webp',
      '/images/mae/mae-04.webp',
      '/images/mae/mae-05.webp',
      '/images/mae/mae-06.webp',
      '/images/mae/mae-07.webp',
      '/images/mae/mae-11.webp',
      '/images/mae/mae-15.webp',
      '/images/mae/mae-17.webp',
      '/images/mae/mae-19.webp',
      '/images/mae/mae-20.webp',
      '/images/mae/mae-21.webp'
    ],
    audio: '/audio/mensagem-mae.mp3',
    message: maeSegments.map(s => s.text).join(' '),
    transcriptSegments: maeSegments
  },
  {
    name: 'Pai',
    photo: '/images/pai/pai-19.webp',
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
    name: 'Vitor, Irmão',
    photo: '/images/vitor/vitor-07.webp',
    photos: [
      '/images/vitor/vitor-07.webp',
      ...Array.from({ length: 17 }, (_, i) => `/images/vitor/vitor-${String(i + 1).padStart(2, '0')}.webp`)
        .filter(p => !['/images/vitor/vitor-03.webp', '/images/vitor/vitor-07.webp', '/images/vitor/vitor-10.webp'].includes(p))
    ],
    audio: '/audio/mensagem-vitor.mp3',
    message: vitorSegments.map(s => s.text).join(' '),
    transcriptSegments: vitorSegments
  },
  {
    name: 'Lara, Namorada',
    photo: '/images/lara/lara-05.webp',
    photos: [
      '/images/lara/lara-05.webp',
      '/images/lara/lara-01.webp',
      '/images/lara/lara-02.webp',
      '/images/lara/lara-03.webp',
      '/images/lara/lara-04.webp',
      '/images/lara/lara-06.webp'
    ],
    audio: '/audio/mensagem-lara.mp3',
    message: laraSegments.map(s => s.text).join(' '),
    transcriptSegments: laraSegments
  },
  {
    name: 'Lucas, Primo',
    photo: '/images/lucas/lucas-11.webp',
    photos: [
      '/images/lucas/lucas-11.webp',
      ...Array.from({ length: 5 }, (_, i) => `/images/lucas/lucas-${String(i + 1).padStart(2, '0')}.webp`),
      '/images/lucas/lucas-12.webp',
      ...Array.from({ length: 5 }, (_, i) => `/images/lucas/lucas-${String(i + 6).padStart(2, '0')}.webp`),
      ...Array.from({ length: 5 }, (_, i) => `/images/lucas/lucas-${String(i + 13).padStart(2, '0')}.webp`),
      '/images/lucas/lucas-18.webp'
    ].filter(p => p !== '/images/lucas/lucas-07.webp'),
    audio: '/audio/mensagem-lucas-primo.mp3',
    message: lucasPrimoSegments.map(s => s.text).join(' '),
    transcriptSegments: lucasPrimoSegments
  },
  {
    name: 'Gabi, Cunhada',
    photo: '/images/gabi/gabi-01.webp',
    audio: '/audio/mensagem-gabi.mp3',
    message: gabiSegments.map(s => s.text).join(' '),
    transcriptSegments: gabiSegments
  },
  {
    name: 'Ronaldinho, Primo',
    photo: '/images/ronaldinho/ronaldinho-01.webp',
    audio: '/audio/mensagem-ronaldinho.mp3',
    message: ronaldinhoSegments.map(s => s.text).join(' '),
    transcriptSegments: ronaldinhoSegments
  },
  {
    name: 'Bruninho, Sobrinho',
    photo: '/images/bruninho/bruninho-05.webp',
    photos: [
      '/images/bruninho/bruninho-05.webp',
      ...Array.from({ length: 4 }, (_, i) => `/images/bruninho/bruninho-${String(i + 1).padStart(2, '0')}.webp`)
    ],
    audio: '/audio/mensagem-bruninho.mp3',
    message: bruninhoSegments.map(s => s.text).join(' '),
    transcriptSegments: bruninhoSegments
  },
  {
    name: 'Vó Malu',
    photo: '/images/vo-malu/vo-malu-01.webp',
    audio: '/audio/mensagem-vo-malu.mp3',
    message: voMaluSegments.map(s => s.text).join(' '),
    transcriptSegments: voMaluSegments
  },
  {
    name: 'Vó Regina',
    audio: '/audio/mensagem-vo-regina.mp3',
    message: voReginaSegments.map(s => s.text).join(' '),
    transcriptSegments: voReginaSegments
  },
  {
    name: 'Tio Gu',
    photo: '/images/tio-gu/tio-gu-01.webp',
    photos: [
      '/images/tio-gu/tio-gu-01.webp',
      '/images/tio-gu/tio-gu-02.webp'
    ],
    audio: '/audio/mensagem-tio-gu.mp3',
    message: tioGuSegments.map(s => s.text).join(' '),
    transcriptSegments: tioGuSegments
  },
  {
    name: 'Tia Claudia & Tio Kali',
    audio: '/audio/mensagem-claudia-kali.mp3',
    message: claudiaKaliSegments.map(s => s.text).join(' '),
    transcriptSegments: claudiaKaliSegments
  },
  {
    name: 'Tia Selma & Tio Ronaldo',
    voices: [
      {
        name: 'Tia Selma',
        audio: '/audio/mensagem-tia-selma.mp3',
        message: tiaSelmaSegments.map(s => s.text).join(' '),
        transcriptSegments: tiaSelmaSegments
      },
      {
        name: 'Tio Ronaldo',
        audio: '/audio/mensagem-tio-ronaldo.mp3',
        message: tioRonaldoSegments.map(s => s.text).join(' '),
        transcriptSegments: tioRonaldoSegments
      }
    ],
    message: ''
  },
  {
    name: 'Breno Prenassi',
    photo: '/images/breno/breno-03.webp',
    photos: [
      '/images/breno/breno-03.webp',
      '/images/breno/breno-01.webp',
      {
        h264: '/video/mensagem-breno.mp4',
        av1: '/video/mensagem-breno.av1.mp4',
        poster: '/images/breno/breno-video-poster.webp',
        width: 464,
        height: 832
      },
      '/images/breno/breno-02.webp',
      '/images/breno/breno-04.webp'
    ],
    audio: '/audio/mensagem-breno.mp3',
    message: brenoSegments.map(s => s.text).join(' '),
    transcriptSegments: brenoSegments
  },
  {
    name: 'Babi Lino',
    photo: '/images/babi-lino/babi-lino-01.webp',
    audio: '/audio/mensagem-babi.mp3',
    message: babiSegments.map(s => s.text).join(' '),
    transcriptSegments: babiSegments
  },
  {
    name: 'Licurci, João Paulo',
    photo: '/images/degrau/degrau-show-01.webp',
    photos: Array.from({ length: 6 }, (_, i) => `/images/degrau/degrau-show-${String(i + 1).padStart(2, '0')}.webp`),
    audio: '/audio/mensagem-licurci.mp3',
    message: licurciSegments.map(s => s.text).join(' '),
    transcriptSegments: licurciSegments
  },
  {
    name: 'Davi Dooup',
    photo: '/images/davi/davi-01.webp',
    photos: [
      '/images/davi/davi-01.webp',
      '/images/davi/davi-02.webp',
      '/images/davi/davi-03.webp'
    ],
    audio: '/audio/mensagem-davi.mp3',
    message: daviSegments.map(s => s.text).join(' '),
    transcriptSegments: daviSegments
  },
  {
    name: 'Arthur Dexis',
    photo: '/images/arthur-dexis/arthur-dexis-01.webp',
    photos: [
      '/images/arthur-dexis/arthur-dexis-01.webp',
      '/images/arthur-dexis/arthur-dexis-02.webp'
    ],
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
    name: 'Vitor, BKP',
    photo: '/images/bkp/bkp-01.webp',
    photos: [
      '/images/bkp/bkp-01.webp',
      '/images/bkp/bkp-02.webp',
      '/images/bkp/bkp-03.webp',
      '/images/bkp/bkp-04.webp'
    ],
    audio: '/audio/mensagem-bkp.mp3',
    message: bkpSegments.map(s => s.text).join(' '),
    transcriptSegments: bkpSegments
  },
  {
    name: 'Gabriel Vassoura',
    photo: '/images/gabriel-vassoura/gabriel-vassoura-01.webp',
    photos: [
      '/images/gabriel-vassoura/gabriel-vassoura-01.webp',
      '/images/gabriel-vassoura/gabriel-vassoura-02.webp'
    ],
    audio: '/audio/mensagem-gabriel-vassoura.mp3',
    message: gabrielVassouraSegments.map(s => s.text).join(' '),
    transcriptSegments: gabrielVassouraSegments
  },
  {
    name: 'Gabriel, Campos',
    photo: '/images/gabriel-campos/gabriel-campos-06.webp',
    photos: [
      '/images/gabriel-campos/gabriel-campos-06.webp',
      '/images/gabriel-campos/gabriel-campos-03.webp',
      '/images/gabriel-campos/gabriel-campos-01.webp',
      '/images/gabriel-campos/gabriel-campos-02.webp',
      '/images/gabriel-campos/gabriel-campos-04.webp',
      '/images/gabriel-campos/gabriel-campos-08.webp',
      '/images/gabriel-campos/gabriel-campos-09.webp',
      '/images/gabriel-campos/gabriel-campos-10.webp',
      '/images/gabriel-campos/gabriel-campos-11.webp',
      '/images/gabriel-campos/gabriel-campos-12.webp'
    ],
    audio: '/audio/mensagem-gabriel-campos.mp3',
    message: gabrielCamposSegments.map(s => s.text).join(' '),
    transcriptSegments: gabrielCamposSegments
  },
  {
    name: 'João Ricardo, Cotto',
    photo: '/images/joao-ricardo/joao-ricardo-01.webp',
    photos: [
      ...Array.from({ length: 7 }, (_, i) => `/images/joao-ricardo/joao-ricardo-${String(i + 1).padStart(2, '0')}.webp`),
      '/images/joao-ricardo/joao-ricardo-08.webp'
    ],
    audio: '/audio/mensagem-joao-ricardo.mp3',
    message: joaoRicardoSegments.map(s => s.text).join(' '),
    transcriptSegments: joaoRicardoSegments
  },
  {
    name: 'Arthur DMA',
    photo: '/images/arthur-dma/arthur-dma-02.webp',
    photos: [
      '/images/arthur-dma/arthur-dma-02.webp',
      '/images/arthur-dma/arthur-dma-01.webp'
    ],
    audio: '/audio/mensagem-arthur-dma.mp3',
    message: arthurDmaSegments.map(s => s.text).join(' '),
    transcriptSegments: arthurDmaSegments
  },
  {
    name: 'João Gabriel, Naipe Hom',
    photo: '/images/joao-gabriel/joao-gabriel-01.webp',
    photos: Array.from({ length: 6 }, (_, i) => `/images/joao-gabriel/joao-gabriel-${String(i + 1).padStart(2, '0')}.webp`),
    audio: '/audio/mensagem-joao-gabriel.mp3',
    message: joaoGabrielSegments.map(s => s.text).join(' '),
    transcriptSegments: joaoGabrielSegments
  },
  {
    name: 'Muay Thai',
    photo: '/images/muay-thai/muay-thai-01.webp',
    photos: [
      '/images/muay-thai/muay-thai-01.webp',
      '/images/muay-thai/muay-thai-02.webp',
      '/images/muay-thai/muay-thai-03.webp'
    ],
    message: ''
  }
]

export const contributors: Contributor[] = rawContributors.map(c => ({
  ...c,
  photo: c.photo && versioned(c.photo),
  photos: c.photos?.map(p => typeof p === 'string' ? versioned(p) : { ...p, poster: versioned(p.poster) })
}))
