export type WhatsAppSource = 'hero' | 'contact' | 'footer' | 'header'

export type ScrollDepthPercent = 25 | 50 | 75 | 100

export type ConsentCategory = 'essential' | 'analytics' | 'marketing'
export type NonEssentialCategory = Exclude<ConsentCategory, 'essential'>

export interface ConsentCategories {
  essential: true
  analytics: boolean
  marketing: boolean
}

export interface PersistedConsent {
  version: 2
  essential: true
  analytics: boolean
  marketing: boolean
}

export type ConsentDecision = ConsentCategories | null

export type AnalyticsEventName =
  | 'whatsapp_click'
  | 'email_click'
  | 'cta_click'
  | 'scroll_depth'

export interface AnalyticsEventPayload {
  name: AnalyticsEventName | string
  params: Record<string, unknown>
}

declare global {
  interface Window {
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] }
  }
}

export {}
