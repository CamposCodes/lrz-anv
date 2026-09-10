import type { ConsentDecision, NonEssentialCategory, PersistedConsent } from '~/types/analytics'

const STORAGE_KEY = 'app:lgpd:consent'
const SCHEMA_VERSION = 2

// Singleton em nível de módulo: todos os componentes veem o mesmo estado reativo.
// O ref interno `consent` é exposto como `readonly` pelo composable para que
// callers não consigam contornar `persistDecision`.
const consent = ref<ConsentDecision>(null)
let initialized = false

const isClient = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined'

const isPersistedConsent = (value: unknown): value is PersistedConsent => {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return v.version === SCHEMA_VERSION
    && v.essential === true
    && typeof v.analytics === 'boolean'
    && typeof v.marketing === 'boolean'
}

const parseStoredValue = (raw: string | null): ConsentDecision => {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (isPersistedConsent(parsed)) {
      return { essential: true, analytics: parsed.analytics, marketing: parsed.marketing }
    }
    return null
  } catch {
    return null
  }
}

const persistDecision = (decision: { analytics: boolean; marketing: boolean }) => {
  if (!isClient()) return
  const payload: PersistedConsent = {
    version: SCHEMA_VERSION,
    essential: true,
    analytics: decision.analytics,
    marketing: decision.marketing
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

const load = () => {
  if (!isClient()) return
  consent.value = parseStoredValue(localStorage.getItem(STORAGE_KEY))
}

const acceptAll = () => {
  consent.value = { essential: true, analytics: true, marketing: true }
  persistDecision({ analytics: true, marketing: true })
}

const acceptOnlyEssential = () => {
  consent.value = { essential: true, analytics: false, marketing: false }
  persistDecision({ analytics: false, marketing: false })
}

const setCategory = (category: NonEssentialCategory, value: boolean) => {
  const current = consent.value ?? { essential: true as const, analytics: false, marketing: false }
  const next = {
    essential: true as const,
    analytics: category === 'analytics' ? value : current.analytics,
    marketing: category === 'marketing' ? value : current.marketing
  }
  consent.value = next
  persistDecision({ analytics: next.analytics, marketing: next.marketing })
}

const reset = () => {
  consent.value = null
  initialized = false
  if (isClient()) localStorage.removeItem(STORAGE_KEY)
}

export const useLgpdConsent = () => {
  if (isClient() && !initialized) {
    initialized = true
    load()
  }

  const isDecided = computed(() => consent.value !== null)
  const isAnalyticsAllowed = computed(() => consent.value?.analytics === true)
  const isMarketingAllowed = computed(() => consent.value?.marketing === true)

  return {
    consent: readonly(consent),
    isDecided,
    isAnalyticsAllowed,
    isMarketingAllowed,
    acceptAll,
    acceptOnlyEssential,
    setCategory,
    reset,
    load
  }
}
