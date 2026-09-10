import { describe, it, expect } from 'vitest'
import { buildWhatsAppMessage } from './whatsapp-message'

describe('buildWhatsAppMessage', () => {
  it('inclui o nome e o telefone informados', () => {
    const msg = buildWhatsAppMessage({ name: 'João Silva', phone: '(32) 99999-0000' })
    expect(msg).toContain('João Silva')
    expect(msg).toContain('(32) 99999-0000')
  })

  it('usa "-" quando o nome não é informado', () => {
    const msg = buildWhatsAppMessage({})
    expect(msg).toContain('Olá, meu nome é -.')
  })

  it('omite a linha de telefone quando ausente', () => {
    const msg = buildWhatsAppMessage({ name: 'Maria' })
    expect(msg).not.toContain('Meu contato é pelo número')
  })

  it('inclui o assunto quando informado', () => {
    const msg = buildWhatsAppMessage({ name: 'Ana', subject: 'Orçamento' })
    expect(msg).toContain('Assunto: Orçamento')
  })

  it('inclui o corpo da mensagem quando informado', () => {
    const msg = buildWhatsAppMessage({ name: 'Ana', message: 'Gostaria de mais informações.' })
    expect(msg).toContain('Gostaria de mais informações.')
  })

  it('renderiza os detalhes como pares rótulo/valor', () => {
    const msg = buildWhatsAppMessage(
      { name: 'Ana' },
      { Cidade: 'São Paulo', Plano: 'Premium' }
    )
    expect(msg).toContain('Detalhes:')
    expect(msg).toContain('- Cidade: São Paulo')
    expect(msg).toContain('- Plano: Premium')
  })

  it('ignora detalhes com valor vazio', () => {
    const msg = buildWhatsAppMessage({ name: 'Ana' }, { Cidade: '', Plano: 'Premium' })
    expect(msg).not.toContain('Cidade:')
    expect(msg).toContain('- Plano: Premium')
  })

  it('não inclui a seção de detalhes quando não há detalhes', () => {
    const msg = buildWhatsAppMessage({ name: 'Ana' })
    expect(msg).not.toContain('Detalhes:')
  })

  it('termina com a linha de solicitação de retorno', () => {
    const msg = buildWhatsAppMessage({ name: 'Ana' })
    expect(msg.trim()).toMatch(/retornar com mais informações/)
  })
})
