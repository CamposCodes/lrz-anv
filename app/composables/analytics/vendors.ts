export type VendorName = 'ga4' | 'clarity'

export interface VendorAdapter {
  name: VendorName
  isReady: () => boolean
  dispatch: (eventName: string, params: Record<string, unknown>) => void
}

export const ga4Adapter: VendorAdapter = {
  name: 'ga4',
  isReady: () => typeof window !== 'undefined' && typeof window.gtag === 'function',
  dispatch: (name, params) => {
    window.gtag?.('event', name, params)
  }
}

export const clarityAdapter: VendorAdapter = {
  name: 'clarity',
  isReady: () => typeof window !== 'undefined' && typeof window.clarity === 'function',
  dispatch: (name) => {
    window.clarity?.('event', name)
  }
}

export const vendors: VendorAdapter[] = [ga4Adapter, clarityAdapter]
