export default defineNitroPlugin(() => {
  const cfg = useRuntimeConfig()
  const phoneRaw = String(cfg.public?.whatsappNumber || '')
  const digits = phoneRaw.replace(/\D/g, '')

  const ok = /^\d{8,15}$/.test(digits)
  if (ok) return

  // Apenas avisa no boot: não derruba o processo (nem em dev nem em deploy).
  // Um número ausente faz o app cair no fallback de useAppConfig().company.phone.
  console.warn(
    `[runtime-validate] runtimeConfig.public.whatsappNumber ausente ou inválido: "${phoneRaw}". `
    + 'Defina a variável de ambiente NUXT_PUBLIC_WHATSAPP_NUMBER (apenas dígitos).'
  )
})
