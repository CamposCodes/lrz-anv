import type {
  AnalyticsEventName,
  AnalyticsEventPayload,
  ScrollDepthPercent,
  WhatsAppSource
} from '~/types/analytics'
import { vendors } from './analytics/vendors'

const BUFFER_MAX = 50
const buffer: AnalyticsEventPayload[] = []

const isClient = () => typeof window !== 'undefined'

const dispatchToVendors = (name: string, params: Record<string, unknown>) => {
  if (!isClient()) return
  for (const vendor of vendors) {
    if (!vendor.isReady()) continue
    try {
      vendor.dispatch(name, params)
    } catch {
      // Isolamento por vendor: a falha de um vendor nunca propaga nem bloqueia os demais.
    }
  }
}

const enqueue = (name: string, params: Record<string, unknown>) => {
  if (buffer.length >= BUFFER_MAX) buffer.shift()
  buffer.push({ name, params })
}

export const useAnalytics = () => {
  const consent = useLgpdConsent()
  const runtime = useRuntimeConfig()
  const enabled = computed(() => Boolean(runtime.public?.analyticsEnabled))

  const trackEvent = (
    name: AnalyticsEventName | (string & {}),
    params: Record<string, unknown> = {}
  ) => {
    if (!isClient() || !enabled.value) return
    if (consent.isAnalyticsAllowed.value) {
      dispatchToVendors(name, params)
      return
    }
    if (!consent.isDecided.value) enqueue(name, params)
  }

  const trackWhatsAppClick = (source: WhatsAppSource, phoneTarget?: string) =>
    trackEvent('whatsapp_click', {
      event_category: 'conversion',
      source,
      ...(phoneTarget ? { phone_target: phoneTarget } : {})
    })

  const trackEmailClick = () =>
    trackEvent('email_click', { event_category: 'conversion' })

  const trackCtaClick = (label?: string) =>
    trackEvent('cta_click', {
      event_category: 'engagement',
      ...(label ? { label } : {})
    })

  const trackScrollDepth = (percent: ScrollDepthPercent) =>
    trackEvent('scroll_depth', { event_category: 'engagement', percent })

  const __flushBuffer = () => {
    if (!isClient() || !consent.isAnalyticsAllowed.value) return
    while (buffer.length > 0) {
      const evt = buffer.shift()!
      dispatchToVendors(evt.name, evt.params)
    }
  }

  const __getBufferLength = () => buffer.length
  const __clearBuffer = () => { buffer.length = 0 }

  return {
    trackEvent,
    trackWhatsAppClick,
    trackEmailClick,
    trackCtaClick,
    trackScrollDepth,
    __flushBuffer,
    __getBufferLength,
    __clearBuffer
  }
}
