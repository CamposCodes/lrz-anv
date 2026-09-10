export default defineNitroPlugin(() => {
  const cfg = useRuntimeConfig()
  const enabled = Boolean(cfg.public?.analyticsEnabled)
  if (!enabled) return

  const gtagId = String(cfg.public?.gtagId || '')
  const clarityId = String(cfg.public?.clarityId || '')

  const gtagOk = /^G-[A-Z0-9]+$/i.test(gtagId)
  const clarityOk = /^[A-Za-z0-9]+$/.test(clarityId)

  if (!gtagOk) {
    console.warn('[runtime-validate] runtimeConfig.public.gtagId ausente ou inválido:', gtagId || '(vazio)')
  }
  if (!clarityOk) {
    console.warn('[runtime-validate] runtimeConfig.public.clarityId ausente ou inválido:', clarityId || '(vazio)')
  }
  // Não lança erro: analytics é opt-in por usuário; IDs ausentes apenas significam
  // que nada será carregado.
})
