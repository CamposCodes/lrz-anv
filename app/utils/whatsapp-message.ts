// Monta a mensagem pré-preenchida enviada ao WhatsApp a partir de um formulário
// de contato genérico. Sem dados específicos de produto: apenas nome, contato,
// assunto, mensagem livre e detalhes opcionais (pares rótulo -> valor).

export interface WhatsAppMessageForm {
  name?: string
  phone?: string
  subject?: string
  message?: string
}

export type WhatsAppMessageDetails = Record<string, string>

export const buildWhatsAppMessage = (
  form: WhatsAppMessageForm = {},
  details: WhatsAppMessageDetails = {}
): string => {
  const name = (form.name || '').trim() || '-'
  const phone = (form.phone || '').trim()
  const subject = (form.subject || '').trim()
  const message = (form.message || '').trim()

  const lines: string[] = []
  lines.push(`Olá, meu nome é ${name}.`)
  if (phone) lines.push(`Meu contato é pelo número ${phone}.`)

  if (subject) {
    lines.push('')
    lines.push(`Assunto: ${subject}`)
  }

  if (message) {
    lines.push('')
    lines.push(message)
  }

  const detailEntries = Object.entries(details).filter(([, value]) => String(value).trim() !== '')
  if (detailEntries.length > 0) {
    lines.push('')
    lines.push('Detalhes:')
    for (const [label, value] of detailEntries) {
      lines.push(`- ${label}: ${value}`)
    }
  }

  lines.push('')
  lines.push('Por favor, retornar com mais informações.')

  return lines.join('\n')
}
