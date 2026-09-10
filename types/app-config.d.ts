import '@nuxt/schema'

declare module 'nuxt/schema' {
  interface AppConfigInput {
    brand?: {
      name?: string
      tagline?: string
      logo?: string
      socialLinks?: {
        instagram?: string
      }
    }
    company?: {
      name?: string
      legalName?: string
      foundingDate?: string
      email?: string
      phone?: string
      phoneDisplay?: string
      address?: {
        street?: string
        neighborhood?: string
        city?: string
        state?: string
        country?: string
        postalCode?: string
      }
      dpo?: {
        name?: string
        email?: string
      }
    }
    analytics?: {
      providers?: Array<{
        name: string
        vendor: string
        country: string
        purpose: string
        policyUrl: string
      }>
    }
  }

  interface BrandConfig {
    name: string
    tagline: string
    logo: string
    socialLinks: {
      instagram: string
    }
  }

  interface CompanyAddress {
    street: string
    neighborhood: string
    city: string
    state: string
    country: string
    postalCode: string
  }

  interface CompanyDpo {
    name: string
    email: string
  }

  interface CompanyConfig {
    name: string
    legalName: string
    foundingDate: string
    email: string
    phone: string
    phoneDisplay: string
    address: CompanyAddress
    dpo: CompanyDpo
  }

  interface AnalyticsProvider {
    name: string
    vendor: string
    country: string
    purpose: string
    policyUrl: string
  }

  interface AppConfig {
    brand: BrandConfig
    company: CompanyConfig
    analytics: { providers: AnalyticsProvider[] }
  }
}

export {}
