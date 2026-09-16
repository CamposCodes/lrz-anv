export interface TranscriptSegment {
  text: string
  start: number
  end: number
}

// Vídeo dentro da pilha de fotos (ContributorSection): mesma pose que um item
// `photos` normal, mas troca a foto pelo vídeo quando vira o item central —
// `poster` é a capa usada nas pilhas/mural e como poster do <video>.
export interface ContributorPhotoVideo {
  h264: string
  av1?: string
  poster: string
  width: number
  height: number
}

// Mais de uma pessoa gravou separado, mas divide a mesma seção/tela (ex.:
// "Tia Selma & Tio Ronaldo") — cada uma com seu próprio player e legenda,
// tocando/pausando de forma independente (useAudioPlayer já garante que só
// um áudio da página toca por vez). Usado no lugar de `audio`/`message`
// únicos quando a seção é de duas pessoas, não uma.
export interface ContributorVoice {
  name: string
  audio: string
  message: string
  transcriptSegments?: TranscriptSegment[]
}

export interface Contributor {
  name: string
  // Foto "de perfil" — usada no cartão central/pilhas do ContributorSection.
  // Opcional enquanto a foto não chega: a seção mostra um papel fotográfico
  // em branco com o nome, e a galeria final/loading simplesmente a ignoram.
  photo?: string
  // Fotos extras (opcional) — quando presente, alimenta o mural arrastável do
  // FinaleSection com todas elas em vez de repetir só `photo`. Quem não tiver
  // `photos` continua contribuindo com uma única foto pro mural (fallback).
  // Um item pode ser um vídeo (ContributorPhotoVideo) em vez de uma foto —
  // aparece misturado na pilha e dá play sozinho ao virar o item central,
  // sem legenda própria (a legenda continua sendo a transcrição do `audio`).
  photos?: (string | ContributorPhotoVideo)[]
  audio?: string
  // Mensagem em vídeo (no lugar do áudio): aparece no cartão central com
  // `photo` como capa, e o mesmo player da onda controla o vídeo. `av1` é a
  // versão leve (navegadores modernos); `h264` é a reserva universal.
  // width/height = dimensões reais, pro cartão reservar a proporção certa
  // antes do vídeo carregar (sem pular de tamanho nem cortar).
  video?: {
    h264: string
    av1?: string
    width: number
    height: number
  }
  message: string
  // Trechos com timestamp (gerados por scripts/transcribe.mjs) — quando presentes,
  // o player troca o texto exibido por eles em vez de mostrar `message` fixo.
  transcriptSegments?: TranscriptSegment[]
  // Duas (ou mais) pessoas na mesma seção, cada uma com seu áudio/legenda
  // própria — usado NO LUGAR de `audio`/`message`/`transcriptSegments`
  // únicos (ver ContributorVoice). `message` continua '' nesse caso: não há
  // uma mensagem central pra virar a foto e ler.
  voices?: ContributorVoice[]
}
