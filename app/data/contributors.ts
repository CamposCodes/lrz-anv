import type { Contributor } from '@/types'
import paiSegments from './transcripts/mensagem-pai.json'

// Conteúdo real chega via WhatsApp/Drive ao longo da semana — só editar este array,
// nenhuma seção precisa de markup novo por pessoa.
export const contributors: Contributor[] = [
  {
    // Teste real da legenda sincronizada (scripts/transcribe.mjs) — áudio de
    // voz de verdade (convertido de OGG/Opus pra MP3 em public/audio/), não
    // placeholder. `message` é o fallback mostrado antes do play; depois que
    // toca, o texto troca por transcriptSegments acompanhando o áudio.
    name: 'Pai',
    photo: 'https://picsum.photos/seed/lorenzo-pai/800/1000',
    audio: '/audio/mensagem-pai.mp3',
    message: paiSegments.map(s => s.text).join(' '),
    transcriptSegments: paiSegments
  },
  {
    name: 'Ana Souza',
    photo: 'https://picsum.photos/seed/lorenzo-ana/800/1000',
    audio: '/audio/placeholder-1.mp3',
    message: 'Lorenzo, foi um prazer trabalhar ao seu lado esse ano todo. Feliz aniversário!'
  },
  {
    name: 'Bruno Lima',
    photo: 'https://picsum.photos/seed/lorenzo-bruno/800/1000',
    message: 'Parabéns, Lorenzo! Que venham muitas conquistas pela frente.'
  },
  {
    name: 'Carla Mendes',
    photo: 'https://picsum.photos/seed/lorenzo-carla/800/1000',
    audio: '/audio/placeholder-2.mp3',
    message: 'Feliz aniversário! Obrigada por sempre trazer leveza pro time.'
  }
]
