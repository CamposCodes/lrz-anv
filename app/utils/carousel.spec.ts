import { describe, it, expect } from 'vitest'
import { carouselWindow, step, wrapIndex } from './carousel'

describe('wrapIndex', () => {
  it('dá a volta nas duas pontas', () => {
    expect(wrapIndex(-1, 20)).toBe(19)
    expect(wrapIndex(20, 20)).toBe(0)
    expect(wrapIndex(-41, 20)).toBe(19)
  })
})

describe('carouselWindow', () => {
  it('pilha next é current+1..+3 e prev é current-1..-3, sem pular fotos', () => {
    expect(carouselWindow(0, 20, 3)).toEqual({ current: 0, prev: [19, 18, 17], next: [1, 2, 3] })
    expect(carouselWindow(5, 20, 3)).toEqual({ current: 5, prev: [4, 3, 2], next: [6, 7, 8] })
  })

  it('pool de 1 foto repete sempre a mesma', () => {
    expect(carouselWindow(0, 1, 3)).toEqual({ current: 0, prev: [0, 0, 0], next: [0, 0, 0] })
  })

  it('pool menor que 2*camadas+1 repete índices em ordem circular', () => {
    expect(carouselWindow(0, 2, 3)).toEqual({ current: 0, prev: [1, 0, 1], next: [1, 0, 1] })
    expect(carouselWindow(1, 4, 3)).toEqual({ current: 1, prev: [0, 3, 2], next: [2, 3, 0] })
  })
})

describe('step', () => {
  it('avançando, a frente da pilha next vira a atual e a atual vira a frente da prev', () => {
    const before = carouselWindow(7, 20, 3)
    const after = carouselWindow(step(7, 'next', 20), 20, 3)
    expect(after.current).toBe(before.next[0])
    expect(after.prev[0]).toBe(before.current)
    expect(after.prev.slice(1)).toEqual(before.prev.slice(0, 2))
  })

  it('ir e voltar (e voltar e ir) traz exatamente a mesma foto, atravessando a ponta', () => {
    for (const length of [1, 2, 5, 20]) {
      for (let i = 0; i < length; i++) {
        expect(step(step(i, 'next', length), 'prev', length)).toBe(i)
        expect(step(step(i, 'prev', length), 'next', length)).toBe(i)
      }
    }
  })

  it('sequência next,next,prev,prev volta ao início e percorre o pool em ordem', () => {
    const seen: number[] = []
    let index = 18
    for (const dir of ['next', 'next', 'prev', 'prev'] as const) {
      index = step(index, dir, 20)
      seen.push(index)
    }
    expect(seen).toEqual([19, 0, 19, 18])
  })
})
