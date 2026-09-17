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

// Versão das fotos na URL. As fotos foram reexportadas dos originais (proporção
// real, sem fundo borrado) mantendo os MESMOS nomes de arquivo — sem isso,
// navegador e CDN (netlify.toml: /images/* com cache de 1 dia + 7 de
// stale-while-revalidate) continuavam servindo as versões antigas 4:5 borradas.
// Suba o número sempre que sobrescrever uma foto com o mesmo nome.
const PHOTO_VERSION = 2
const versioned = (path: string) => path.includes('?') ? `${path}&v=${PHOTO_VERSION}` : `${path}?v=${PHOTO_VERSION}`

// Conteúdo real chega via WhatsApp/Drive ao longo da semana — só editar este array,
// nenhuma seção precisa de markup novo por pessoa.
// Ordem: família primeiro, depois pessoal da gravadora/Degrau (Licurci, Davi,
// Arthur Dexis, BKP, Gabriel Vassoura), depois os demais.
const rawContributors: Contributor[] = [
  {
    // Fotos de infância (WhatsApp) em WebP (sharp: rotate por EXIF, resize
    // inside 1500px, quality 82 — mesmo tratamento dos outros), sem corte.
    // mae-01..06: primeira leva (enviada duas vezes — pastas duplicadas com
    // hash idêntico, usada só uma). mae-07..16: segunda leva de 11 fotos,
    // uma delas duplicada de outra da mesma leva (hash idêntico), descartada.
    // mae-17..22: mais uma leva, chegada depois. mae-23 (os dois com o
    // violão) chegou por último e virou a nova capa. Áudio veio como .ogg;
    // convertido pro padrão dos outros com ffmpeg: silêncio das pontas
    // cortado (areverse), passa-alta 70Hz, loudnorm -16.5 LUFS / pico
    // -1.5 dBTP, MP3 mono 44.1kHz 96kbps. Transcrição: Whisper medium.
    // Ordem do array `photos` (pedido explícito): capa primeiro, depois as
    // fotos onde mãe e filho aparecem JUNTOS (ordem antiga preservada entre
    // elas), e só por último as que mostram só o filho — sem a mãe.
    name: 'Mãe',
    photo: '/images/mae/mae-23.webp',
    photos: [
      // Mãe + filho juntos.
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
      // Só o filho.
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
    // Sem upscale (vitor-02 veio pequena). vitor-16/17 chegaram depois,
    // soltas na mesma leva compartilhada com Mãe/Lucas. vitor-03 removida
    // (pai, mãe e Vitor criança). vitor-07 (com o Lucas na festa) virou a
    // nova capa. vitor-10 (os três de terno) era na verdade do Lucas —
    // movida pra lucas-18, ver seção do Lucas.
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
    // Fotos do casal em WebP (sharp: rotate por EXIF, resize inside 1500px,
    // quality 82 — mesmo tratamento dos outros), sem corte. lara-05 (coração
    // com as mãos no pôr do sol) = capa, primeiro na lista pra pilha começar
    // exatamente nela. Áudio veio como .ogg; convertido pro padrão dos
    // outros com ffmpeg: silêncio das pontas cortado (areverse), passa-alta
    // 70Hz, loudnorm -16.5 LUFS / pico -1.5 dBTP, MP3 mono 44.1kHz 96kbps.
    // Transcrição: Whisper medium.
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
    // Pasta do WhatsApp com 11 fotos (scripts/restore-original-photos.mjs,
    // mesmo pipeline: rotate por EXIF, resize inside 1500px, webp quality 82,
    // sem upscale) — da infância até fotos recentes. lucas-11 (selfie atual,
    // nítida) = capa, primeiro na lista pra pilha começar nela. lucas-12..17
    // vieram depois, soltas no meio/fim da pilha (17 é da mesma leva
    // compartilhada com Mãe/Vitor). Áudio convertido do .ogg com ffmpeg:
    // silêncio das pontas cortado (areverse), passa-alta 70Hz, loudnorm
    // -16.5 LUFS / pico -1.5 dBTP, MP3 mono 44.1kHz 96kbps. Transcrição:
    // Whisper medium.
    name: 'Lucas, Primo',
    photo: '/images/lucas/lucas-11.webp',
    // lucas-07 removida (foto antiga, camisa de guitarra). lucas-18 (os três
    // de terno) estava na leva do Vitor por engano, veio pra cá.
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
    // Foto em grupo (mesma leva do Lucas, reaproveitada — já processada em
    // WebP no mesmo pipeline dos outros). Áudio veio como .ogg; convertido
    // pro padrão dos outros com ffmpeg: silêncio das pontas cortado
    // (areverse), passa-alta 70Hz, loudnorm -16.5 LUFS / pico -1.5 dBTP,
    // MP3 mono 44.1kHz 96kbps. Transcrição: Whisper medium.
    name: 'Gabi, Cunhada',
    photo: '/images/gabi/gabi-01.webp',
    audio: '/audio/mensagem-gabi.mp3',
    message: gabiSegments.map(s => s.text).join(' '),
    transcriptSegments: gabiSegments
  },
  {
    // Foto de infância (WhatsApp) em WebP (sharp: rotate por EXIF, resize
    // inside 1500px, quality 82 — mesmo tratamento dos outros), sem corte.
    // Áudio veio como .wav; convertido pro padrão dos outros com ffmpeg:
    // silêncio das pontas cortado (areverse), passa-alta 70Hz, loudnorm
    // -16.5 LUFS / pico -1.5 dBTP, MP3 mono 44.1kHz 96kbps. Transcrição:
    // Whisper medium.
    name: 'Ronaldinho, Primo',
    photo: '/images/ronaldinho/ronaldinho-01.webp',
    audio: '/audio/mensagem-ronaldinho.mp3',
    message: ronaldinhoSegments.map(s => s.text).join(' '),
    transcriptSegments: ronaldinhoSegments
  },
  {
    // Áudio veio como WAV editado; convertido pro padrão dos outros (MP3 mono
    // 44.1kHz 96kbps, loudnorm -16.5 LUFS). Transcrição: Whisper medium.
    // Fotos WhatsApp em WebP (sharp: rotate por EXIF, resize inside 1500px,
    // quality 82 — mesmo tratamento dos outros), sem corte. bruninho-05 (com
    // o pai jogando videogame) = capa, primeiro na lista pra pilha começar
    // nela; bruninho-01 (abraço em família) logo em seguida.
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
    // Foto antiga (infância do Lorenzo) em WebP (sharp: rotate por EXIF,
    // resize inside 1500px, quality 82 — mesmo tratamento dos outros), sem
    // corte. WAV original saturado (pico 0 dBFS) — a normalização trouxe o
    // pico pra -0.6 dB. Mesmo formato e processo do Bruninho.
    name: 'Vó Malu',
    photo: '/images/vo-malu/vo-malu-01.webp',
    audio: '/audio/mensagem-vo-malu.mp3',
    message: voMaluSegments.map(s => s.text).join(' '),
    transcriptSegments: voMaluSegments
  },
  {
    // Sem foto por enquanto. Áudio veio como .mp3; convertido pro padrão dos
    // outros com ffmpeg: silêncio das pontas cortado (areverse), passa-alta
    // 70Hz, loudnorm -16.5 LUFS / pico -1.5 dBTP, MP3 mono 44.1kHz 96kbps.
    // Transcrição: Whisper medium. Quando a foto chegar: WebP em
    // public/images/vo-regina/ e preencher `photo`.
    name: 'Vó Regina',
    audio: '/audio/mensagem-vo-regina.mp3',
    message: voReginaSegments.map(s => s.text).join(' '),
    transcriptSegments: voReginaSegments
  },
  {
    // tio-gu-01 (WhatsApp, pouca luz/flash) em WebP: sharp com rotate por
    // EXIF, resize inside 1500px, sharpen leve pra compensar o grão/desfoque
    // do flash, quality 82; tio-gu-02 é foto antiga (2009, data cravada na
    // própria imagem), mesmo tratamento sem sharpen (sem grão de flash pra
    // compensar). Áudio veio como .ogg; convertido pro padrão dos outros com
    // ffmpeg: silêncio das pontas cortado (areverse), passa-alta 70Hz,
    // loudnorm -16.5 LUFS / pico -1.5 dBTP, MP3 mono 44.1kHz 96kbps.
    // Transcrição: Whisper medium. Vem antes dos tios sem foto (pedido
    // explícito), pra não juntar todos os "sem foto" num bloco só.
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
    // Sem foto por enquanto. Áudio veio como .ogg; convertido pro padrão dos
    // outros com ffmpeg: silêncio das pontas cortado (areverse), passa-alta
    // 70Hz, loudnorm -16.5 LUFS / pico -1.5 dBTP, MP3 mono 44.1kHz 96kbps.
    // Transcrição: Whisper medium. Quando a foto chegar: WebP em
    // public/images/claudia-kali/ e preencher `photo`.
    name: 'Tia Claudia & Tio Kali',
    audio: '/audio/mensagem-claudia-kali.mp3',
    message: claudiaKaliSegments.map(s => s.text).join(' '),
    transcriptSegments: claudiaKaliSegments
  },
  {
    // Duas mensagens, uma seção só: cada áudio (.ogg cada, mesmo processo de
    // conversão dos outros — silêncio das pontas cortado, passa-alta 70Hz,
    // loudnorm -16.5 LUFS / pico -1.5 dBTP, MP3 mono 44.1kHz 96kbps) e
    // transcrição (Whisper medium) ficam separados em `voices`: cada um com
    // seu próprio player e legenda na mesma tela (ver ContributorSection.vue).
    // Sem foto por enquanto.
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
    // Foto original é UMA colagem 2x2 (WhatsApp, 708x708) com 4 fotos coladas
    // lado a lado — dividida em breno-01..04 com sharp (margem de 4px em cada
    // corte pra não pegar a linha branca fina do grid). breno-03 (sinal de paz)
    // = capa, primeiro na lista pra pilha começar exatamente nela. Áudio
    // convertido do .ogg/Opus com ffmpeg: silêncio das pontas cortado
    // (areverse), passa-alta 70Hz, loudnorm -16.5 LUFS / pico -1.5 dBTP, MP3
    // mono 44.1kHz 96kbps (mesmo formato dos outros). Transcrição: Whisper medium.
    // Vídeo (WhatsApp, 464x832, 37s) misturado na pilha entre as fotos: sem
    // legenda própria, dá play sozinho ao virar o item central (ver
    // ContributorSection.vue). Reencodado com ffmpeg: denoise leve (hqdn3d),
    // 30fps, áudio mono normalizado (-16.5 LUFS, passa-alta 70Hz), faststart.
    // H.264 (4.9MB) + AV1 (3.1MB, mais leve) a partir do original de 7.8MB.
    // Poster: quadro de 22s em WebP.
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
    // Foto WhatsApp em WebP (sharp: rotate por EXIF, resize inside 1500px,
    // quality 82 — mesmo tratamento dos outros), sem corte. Áudio veio como
    // .wav; convertido pro padrão dos outros com ffmpeg: silêncio das pontas
    // cortado (areverse), passa-alta 70Hz, loudnorm -16.5 LUFS / pico
    // -1.5 dBTP, MP3 mono 44.1kHz 96kbps. Transcrição: Whisper medium.
    name: 'Babi Lino',
    photo: '/images/babi-lino/babi-lino-01.webp',
    audio: '/audio/mensagem-babi.mp3',
    message: babiSegments.map(s => s.text).join(' '),
    transcriptSegments: babiSegments
  },
  {
    // Fotos do show, WebP (sharp: rotate por EXIF, resize inside 1500px,
    // quality 82 — mesmo tratamento de restore-original-photos.mjs), sem
    // corte. degrau-show-01 = capa. Áudio convertido do .ogg com ffmpeg:
    // silêncio das pontas cortado só nas pontas (via areverse, senão
    // silenceremove trunca no meio numa pausa de fala), passa-alta 70Hz,
    // loudnorm -16.5 LUFS / pico -1.5 dBTP, MP3 mono 44.1kHz 96kbps (mesmo
    // formato dos outros). Transcrição do Whisper; corrigido "Licurse"→"Licurci"
    // (nome próprio). Nome completo (João Paulo) some do menu de navegação —
    // splitName (NavMenu.vue) mostra só o antes da vírgula em destaque, o
    // resto como subtítulo, igual "Vitor, Irmão"/"Gabriel, Campos".
    name: 'Licurci, João Paulo',
    photo: '/images/degrau/degrau-show-01.webp',
    photos: Array.from({ length: 6 }, (_, i) => `/images/degrau/degrau-show-${String(i + 1).padStart(2, '0')}.webp`),
    audio: '/audio/mensagem-licurci.mp3',
    message: licurciSegments.map(s => s.text).join(' '),
    transcriptSegments: licurciSegments
  },
  {
    // Foto original (davi-01) na proporção 9:16, sem corte; davi-02/03
    // chegaram depois, foto de grupo no bar.
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
    // Mensagem em VÍDEO (WhatsApp, selfie 9:16, 2min22s, 17MB). Reencodado com
    // ffmpeg: 30fps constante, redução leve de ruído (hqdn3d), áudio mono
    // normalizado (-16.5 LUFS, passa-alta 70Hz), MP4 com faststart. Duas
    // versões: AV1 (7.6MB, navegadores modernos) e H.264 High (14.5MB,
    // reserva universal) — mesma qualidade (SSIM ~0.985 contra o original).
    // Transcrição: WHISPER_MODEL=medium node scripts/transcribe.mjs
    // public/video/mensagem-arthur-dexis.mp4.
    name: 'Arthur Dexis',
    // Capa = arthur-dexis-01 (576x1024, MESMA proporção 9:16 do vídeo —
    // arthur-dexis-02, usado antes, é uma foto solta 1500x843 (paisagem);
    // como poster ela distorcia a caixa do vídeo antes do play — via
    // posterRatio (ver ContributorSection.vue), a caixa nascia deitada e
    // "esticava" na hora de tocar, em vez de já nascer no formato 9:16 real).
    photo: '/images/arthur-dexis/arthur-dexis-01.webp',
    // photos: vídeo (mesma foto de `photo`, identifica o slot do vídeo — ver
    // ContributorSection.vue) + arthur-dexis-02 como foto lateral avulsa, pro
    // carrossel/pilha lateral funcionar igual às outras seções sem tirar o
    // vídeo do centro.
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
    // Fotos WhatsApp em WebP (sharp: rotate por EXIF, resize inside 1500px,
    // quality 82 — mesmo tratamento dos outros), sem corte. bkp-01 (foto do
    // show, still nítido) = capa. Áudio veio como .mp4/AAC; convertido pro
    // padrão dos outros com ffmpeg: silêncio das pontas cortado (areverse),
    // passa-alta 70Hz, loudnorm -16.5 LUFS / pico -1.5 dBTP, MP3 mono 44.1kHz
    // 96kbps. Transcrição: Whisper medium; corrigido "pertecente"→"pertencente"
    // (erro de reconhecimento, não da fala).
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
    // Fotos WhatsApp em WebP (sharp: rotate por EXIF, resize inside 1500px,
    // quality 82 — mesmo tratamento dos outros), sem corte; gabriel-vassoura-01
    // (manobra de skate) teve as barras pretas de letterbox cortadas com
    // sharp .trim() antes do resize. Áudio veio como .ogg; convertido pro
    // padrão dos outros com ffmpeg: silêncio das pontas cortado (areverse),
    // passa-alta 70Hz, loudnorm -16.5 LUFS / pico -1.5 dBTP, MP3 mono
    // 44.1kHz 96kbps. Transcrição: Whisper medium; corrigido "dinheiro no
    // bom"→"dinheiro no bolso" (erro de reconhecimento, não da fala).
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
    // Fotos WhatsApp em WebP (sharp: rotate por EXIF, resize inside 1500px,
    // quality 82 — mesmo tratamento dos outros), sem corte. gabriel-campos-03
    // (os dois de branco) = capa, primeiro na lista pra pilha começar
    // exatamente nela. Áudio veio como .wav (WhatsApp PTT); convertido pro
    // padrão dos outros com ffmpeg: silêncio das pontas cortado (areverse),
    // passa-alta 70Hz, loudnorm -16.5 LUFS / pico -1.5 dBTP, MP3 mono
    // 44.1kHz 96kbps. Transcrição: WHISPER_MODEL=medium node
    // scripts/transcribe.mjs public/audio/mensagem-gabriel-campos.mp3;
    // corrigido "alicece"→"alicerce" (erro de reconhecimento, não da fala).
    name: 'Gabriel, Campos',
    photo: '/images/gabriel-campos/gabriel-campos-06.webp',
    // gabriel-campos-06 (os três com sinal de rock) vira a nova capa (pedido
    // explícito). gabriel-campos-07 (grupo na rua à noite) removida.
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
    // Fotos reais (WhatsApp) em WebP na proporção original, sem upscale;
    // joao-ricardo-01 (abraço no show) = capa; 05/06 chegaram depois;
    // joao-ricardo-08 (com amigo de dreadlocks) chegou por último, só pro
    // mural final (FinaleSection). Áudio convertido do .ogg com ffmpeg:
    // silêncio das pontas encurtado,
    // passa-alta 70Hz, loudnorm -16.5 LUFS / pico -1.5 dBTP, MP3 mono
    // 44.1kHz 96kbps (mesmo formato dos outros). Transcrição do Whisper
    // dividida em frases e alinhada ao tempo real de cada palavra
    // (--word_timestamps); corrigidos "Vale"→"Fala", "tem"→"tenho" e
    // "Lorena"→"Lorenzo".
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
    // Fotos WhatsApp em WebP (sharp: rotate por EXIF, resize inside 1500px,
    // quality 82 — mesmo tratamento dos outros), sem corte. arthur-dma-02
    // (foto nítida, os dois sorrindo) = capa. Áudio veio como .ogg;
    // convertido pro padrão dos outros com ffmpeg: silêncio das pontas
    // cortado (areverse), passa-alta 70Hz, loudnorm -16.5 LUFS / pico
    // -1.5 dBTP, MP3 mono 44.1kHz 96kbps. Transcrição: Whisper medium.
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
    // Fotos WhatsApp em WebP (sharp: rotate por EXIF, resize inside 1500px,
    // quality 82 — mesmo tratamento dos outros), sem corte. joao-gabriel-01
    // = capa. Áudio veio como .ogg; convertido pro padrão dos outros com
    // ffmpeg: silêncio das pontas cortado (areverse), passa-alta 70Hz,
    // loudnorm -16.5 LUFS / pico -1.5 dBTP, MP3 mono 44.1kHz 96kbps.
    // Transcrição: Whisper medium.
    name: 'João Gabriel, Naipe Hom',
    photo: '/images/joao-gabriel/joao-gabriel-01.webp',
    photos: Array.from({ length: 6 }, (_, i) => `/images/joao-gabriel/joao-gabriel-${String(i + 1).padStart(2, '0')}.webp`),
    audio: '/audio/mensagem-joao-gabriel.mp3',
    message: joaoGabrielSegments.map(s => s.text).join(' '),
    transcriptSegments: joaoGabrielSegments
  },
  {
    // Time de Muay Thai (foto em grupo). Fotos WhatsApp em WebP (sharp:
    // rotate por EXIF, resize inside 1500px, quality 82 — mesmo tratamento
    // dos outros), sem corte. Sem áudio (mensagem coletiva, só fotos). Por
    // último na ordem (pedido explícito).
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
  // Item de vídeo (ContributorPhotoVideo) não é string — versionar só o
  // `poster` (é ele que serve de <img>/capa; h264/av1 não têm o problema de
  // cache de 1 dia do netlify.toml que motivou PHOTO_VERSION).
  photos: c.photos?.map(p => typeof p === 'string' ? versioned(p) : { ...p, poster: versioned(p.poster) })
}))
