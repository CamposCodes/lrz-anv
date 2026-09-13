import type { Contributor } from '@/types'
import paiSegments from './transcripts/mensagem-pai.json'
import vitorSegments from './transcripts/mensagem-vitor.json'
import daviSegments from './transcripts/mensagem-davi.json'

// Conteúdo real chega via WhatsApp/Drive ao longo da semana — só editar este array,
// nenhuma seção precisa de markup novo por pessoa.
export const contributors: Contributor[] = [
  {
    // Teste real da legenda sincronizada (scripts/transcribe.mjs) — áudio de
    // voz de verdade (convertido de OGG/Opus pra MP3 em public/audio/), não
    // placeholder. `message` é o fallback mostrado antes do play; depois que
    // toca, o texto troca por transcriptSegments acompanhando o áudio.
    name: 'Pai',
    photo: '/images/pai/pai-19.webp',
    // Fotos reais (WhatsApp), otimizadas/convertidas pra WebP em
    // scripts/optimize-pai-photos.mjs — alimentam tanto a pilha desta seção
    // quanto o mural arrastável do FinaleSection, com variedade de verdade em
    // vez de repetir uma só foto. pai-19 primeiro (mesma foto de `photo`
    // acima) pra a pilha começar exatamente na capa. Lista explícita (não
    // mais gerada por range 01..18): pai-17 era duas fotos física coladas
    // numa imagem só (bug reportado) — scripts/fix-pai-photos.mjs dividiu em
    // pai-17a/pai-17b, quebrando a sequência numérica limpa.
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
    // Fotos reais (WhatsApp) em 4:5 WebP, mesmo tratamento do Pai: foto inteira
    // + fundo borrado dela mesma; retratos 3:4 só levam corte leve. Sem upscale
    // (vitor-02/10/11 vieram pequenas). vitor-01 = capa.
    name: 'Vitor, Irmão',
    photo: '/images/vitor/vitor-01.webp',
    photos: Array.from({ length: 13 }, (_, i) => `/images/vitor/vitor-${String(i + 1).padStart(2, '0')}.webp`),
    audio: '/audio/mensagem-vitor.mp3',
    message: vitorSegments.map(s => s.text).join(' '),
    transcriptSegments: vitorSegments
  },
  {
    // Foto única (WhatsApp) — recortada pra 4:5 (polaroid) mantendo os dois
    // rostos + skate, convertida pra WebP na resolução nativa (899px, sem upscale).
    name: 'Davi Dooup, Degrau',
    photo: '/images/davi/davi-01.webp',
    audio: '/audio/mensagem-davi.mp3',
    message: daviSegments.map(s => s.text).join(' '),
    transcriptSegments: daviSegments
  }
]
