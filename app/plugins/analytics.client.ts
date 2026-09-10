// Bootstrap de analytics gated por LGPD.
// O default-deny é configurado ANTES de qualquer script de vendor carregar. Scripts
// de vendor (gtag.js, clarity.js) só carregam depois que o usuário opta explicitamente
// via TheLgpdBanner. O strict-dynamic do CSP propaga a confiança deste plugin
// (com nonce) para os scripts injetados.

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const VENDOR_SCRIPT_TIMEOUT_MS = 5000

let gtagInitialized = false
let clarityInitialized = false
let pageviewSent = false

const bootstrapGtagStub = () => {
  window.dataLayer = window.dataLayer || []
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args)
    }
  }
}

const loadVendorScript = (src: string, timeoutMs = VENDOR_SCRIPT_TIMEOUT_MS): Promise<void> =>
  new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.async = true
    script.src = src

    const state = { settled: false, timer: null as ReturnType<typeof setTimeout> | null }

    const settle = (fn: () => void) => {
      if (state.settled) return
      state.settled = true
      if (state.timer !== null) clearTimeout(state.timer)
      fn()
    }

    script.onload = () => settle(() => resolve())
    script.onerror = () => settle(() => {
      script.remove()
      reject(new Error(`Vendor script failed to load: ${src}`))
    })

    state.timer = setTimeout(() => settle(() => {
      script.remove()
      reject(new Error(`Vendor script timeout after ${timeoutMs}ms: ${src}`))
    }), timeoutMs)

    document.head.appendChild(script)
  })

const initGtag = (gtagId: string) => {
  if (gtagInitialized || !gtagId) return
  gtagInitialized = true

  // Configura primeiro; o stub enfileira até o gtag.js drenar o dataLayer ao carregar.
  window.gtag!('js', new Date())
  window.gtag!('config', gtagId, {
    send_page_view: false,
    anonymize_ip: true
  })

  loadVendorScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gtagId)}`)
    .catch((err) => console.warn('[analytics]', err))
}

const initClarity = (clarityId: string) => {
  if (clarityInitialized || !clarityId) return
  clarityInitialized = true

  if (!window.clarity) {
    const queue: unknown[] = []
    const stub = function clarity(...args: unknown[]) {
      queue.push(args)
    } as Window['clarity'] & { q?: unknown[] }
    stub!.q = queue
    window.clarity = stub
  }

  loadVendorScript(`https://www.clarity.ms/tag/${encodeURIComponent(clarityId)}`)
    .catch((err) => console.warn('[analytics]', err))
}

export default defineNuxtPlugin(() => {
  const runtime = useRuntimeConfig()
  const enabled = Boolean(runtime.public?.analyticsEnabled)
  const gtagId = String(runtime.public?.gtagId || '')
  const clarityId = String(runtime.public?.clarityId || '')

  if (!enabled) return

  // Configura dataLayer + stub do gtag imediatamente para que comandos de consentimento
  // sejam enfileirados mesmo antes do gtag.js ser baixado. O stub encaminha cada chamada
  // ao dataLayer; o gtag.js drena a fila em ordem ao carregar.
  bootstrapGtagStub()

  // Default-deny ANTES de qualquer script de vendor tocar a página.
  window.gtag!('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  })

  const consent = useLgpdConsent()
  const analytics = useAnalytics()
  const route = useRoute()
  const router = useRouter()

  const sendPageView = (path: string) => {
    if (!window.gtag) return
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title
    })
  }

  const syncConsentMode = () => {
    if (!window.gtag) return
    window.gtag('consent', 'update', {
      analytics_storage: consent.isAnalyticsAllowed.value ? 'granted' : 'denied',
      ad_storage: consent.isMarketingAllowed.value ? 'granted' : 'denied',
      ad_user_data: consent.isMarketingAllowed.value ? 'granted' : 'denied',
      ad_personalization: consent.isMarketingAllowed.value ? 'granted' : 'denied'
    })
  }

  watch(
    () => [consent.isAnalyticsAllowed.value, consent.isMarketingAllowed.value, consent.isDecided.value],
    ([analyticsAllowed, , decided]) => {
      if (analyticsAllowed) {
        if (gtagId) initGtag(gtagId)
        syncConsentMode()
        // Apenas o primeiro pageview — os seguintes vêm do router.afterEach abaixo.
        // A flag evita um pageview fantasma se o usuário alternar o consentimento off/on.
        if (!pageviewSent) {
          pageviewSent = true
          sendPageView(route.fullPath)
        }
        if (clarityId) initClarity(clarityId)
        nextTick(() => analytics.__flushBuffer())
      } else if (decided) {
        syncConsentMode()
      }
    },
    { immediate: true }
  )

  // Navegação SPA: re-emite page_view a cada troca de rota (no-op até liberar consentimento).
  router.afterEach((to, from) => {
    if (to.fullPath === from.fullPath) return
    if (!consent.isAnalyticsAllowed.value) return
    sendPageView(to.fullPath)
  })
})
