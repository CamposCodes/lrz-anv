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
    // acima) pra a pilha começar exatamente na capa.
    photos: ['/images/pai/pai-19.webp', ...Array.from({ length: 18 }, (_, i) => `/images/pai/pai-${String(i + 1).padStart(2, '0')}.webp`)],
    audio: '/audio/mensagem-pai.mp3',
    message: paiSegments.map(s => s.text).join(' '),
    transcriptSegments: paiSegments
  },
  {
    // Foto ainda não chegou — placeholder até o Vitor mandar as fotos reais
    // (aí processa com o mesmo pipeline de scripts/optimize-pai-photos.mjs).
    name: 'Vitor, Irmão',
    photo: 'https://picsum.photos/seed/lorenzo-vitor/800/1000',
    audio: '/audio/mensagem-vitor.mp3',
    message: vitorSegments.map(s => s.text).join(' '),
    transcriptSegments: vitorSegments
  },
  {
    // Idem — placeholder até o Davi mandar as fotos reais.
    name: 'Davi Dooup, Degrau',
    photo: 'https://picsum.photos/seed/lorenzo-davi/800/1000',
    audio: '/audio/mensagem-davi.mp3',
    message: daviSegments.map(s => s.text).join(' '),
    transcriptSegments: daviSegments
  }
]
