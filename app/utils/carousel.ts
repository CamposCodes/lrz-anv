export type CarouselSide = 'prev' | 'next'

export const wrapIndex = (i: number, length: number) => ((i % length) + length) % length

export const carouselWindow = (index: number, length: number, layers: number) => ({
  current: wrapIndex(index, length),
  prev: Array.from({ length: layers }, (_, k) => wrapIndex(index - k - 1, length)),
  next: Array.from({ length: layers }, (_, k) => wrapIndex(index + k + 1, length))
})

export const step = (index: number, dir: CarouselSide, length: number) =>
  wrapIndex(index + (dir === 'next' ? 1 : -1), length)
