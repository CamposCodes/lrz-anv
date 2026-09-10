/**
 * Middleware de servidor para garantir que o site seja indexável por buscadores.
 * Remove qualquer x-robots-tag: noindex que possa ser injetado por ambientes de
 * preview de hospedagem (ex.: previews de deploy) ou por módulos de segurança.
 *
 * Isto é crítico para SEO: sem ele, o site pode ficar invisível para o Google.
 */
export default defineEventHandler((event) => {
  // Remove x-robots-tag se contiver noindex
  const existingHeader = getResponseHeader(event, 'x-robots-tag')
  if (existingHeader && String(existingHeader).includes('noindex')) {
    removeResponseHeader(event, 'x-robots-tag')
  }

  // Define explicitamente que a indexação é permitida
  setResponseHeader(event, 'x-robots-tag', 'index, follow')
})
