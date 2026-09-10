import { describe, it, expect } from 'vitest'
import { cenaScrub, saidaDeSecao } from './cena'

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
