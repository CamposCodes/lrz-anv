export interface TranscriptSegment {
  text: string
  start: number
  end: number
}

export interface ContributorPhotoVideo {
  h264: string
  av1?: string
  poster: string
  width: number
  height: number
}

export interface ContributorVoice {
  name: string
  audio: string
  message: string
  transcriptSegments?: TranscriptSegment[]
}

export interface Contributor {
  name: string
  photo?: string
  photos?: (string | ContributorPhotoVideo)[]
  audio?: string
  video?: {
    h264: string
    av1?: string
    width: number
    height: number
  }
  message: string
  transcriptSegments?: TranscriptSegment[]
  voices?: ContributorVoice[]
}
