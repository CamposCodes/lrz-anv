/**
 * Aritmética pura do carrossel de fotos do ContributorSection.
 *
 * Tudo deriva de UM índice (`index`) no pool circular — nada de deques com cursores
 * separados por lado. Com um índice só, "avançar e voltar" é literalmente `+1` e `-1`,
 * então ir e voltar sempre traz a mesma foto, inclusive atravessando a ponta do pool.
 */

export type CarouselSide = 'prev' | 'next'

/** Módulo que sempre cai em `[0, length)`, inclusive para `i` negativo. */
export const wrapIndex = (i: number, length: number) => ((i % length) + length) % length

/**
 * Janela visível em torno de `index`: a foto central e as `layers` camadas de cada pilha,
 * da frente (índice 0) pro fundo — `next` = index+1, +2, …; `prev` = index-1, -2, ….
 * Com pool pequeno os índices simplesmente se repetem (pool de 1 → tudo 0).
 */
export const carouselWindow = (index: number, length: number, layers: number) => ({
  current: wrapIndex(index, length),
  prev: Array.from({ length: layers }, (_, k) => wrapIndex(index - k - 1, length)),
  next: Array.from({ length: layers }, (_, k) => wrapIndex(index + k + 1, length))
})

/** Um passo no sentido `dir`, já normalizado pro pool. */
export const step = (index: number, dir: CarouselSide, length: number) =>
  wrapIndex(index + (dir === 'next' ? 1 : -1), length)
