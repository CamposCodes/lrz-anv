export interface TranscriptSegment {
  text: string
  start: number
  end: number
}

export interface Contributor {
  name: string
  // Foto "de perfil" — usada no cartão central/pilhas do ContributorSection.
  photo: string
  // Fotos extras (opcional) — quando presente, alimenta o mural arrastável do
  // FinaleSection com todas elas em vez de repetir só `photo`. Quem não tiver
  // `photos` continua contribuindo com uma única foto pro mural (fallback).
  photos?: string[]
  audio?: string
  message: string
  // Trechos com timestamp (gerados por scripts/transcribe.mjs) — quando presentes,
  // o player troca o texto exibido por eles em vez de mostrar `message` fixo.
  transcriptSegments?: TranscriptSegment[]
}
