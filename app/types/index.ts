export interface TranscriptSegment {
  text: string
  start: number
  end: number
}

export interface Contributor {
  name: string
  photo: string
  audio?: string
  message: string
  // Trechos com timestamp (gerados por scripts/transcribe.mjs) — quando presentes,
  // o player troca o texto exibido por eles em vez de mostrar `message` fixo.
  transcriptSegments?: TranscriptSegment[]
}
