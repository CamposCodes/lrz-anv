import { describe, it, expect } from 'vitest'
import { cenaScrub, saidaDeSecao, secaoGrudada } from './cena'

describe('cenaScrub', () => {
  it('usa o trigger informado e scrub 0.8 por padrão', () => {
    const trigger = null
    const config = cenaScrub(trigger)
    expect(config.trigger).toBe(trigger)
    expect(config.scrub).toBe(0.8)
    expect(config.start).toBe('top 85%')
  })

  it('permite sobrescrever campos via extra', () => {
    const config = cenaScrub(null, { start: 'top 50%' })
    expect(config.start).toBe('top 50%')
  })
})

describe('saidaDeSecao', () => {
  it('marca invalidateOnRefresh por padrão', () => {
    const config = saidaDeSecao(null)
    expect(config.invalidateOnRefresh).toBe(true)
    expect(config.start).toBe('bottom bottom')
    expect(config.end).toBe('bottom top')
  })
})

describe('secaoGrudada', () => {
  it('cobre a seção inteira, do topo ao fundo', () => {
    const config = secaoGrudada(null)
    expect(config.start).toBe('top top')
    expect(config.end).toBe('bottom bottom')
    expect(config.scrub).toBe(0.8)
  })
})
