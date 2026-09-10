export default defineAppConfig({
  // Single Source of Truth da identidade — substitua os placeholders pela marca real.
  brand: {
    name: 'Jazz Moon',
    tagline: 'DJ e multi-artista — entre a lua e o sol.',
    // A pasta /images/brand/ não existe; os canônicos vivem em /images/MARCA/.
    // ⚠️ jazzmoon-white.png é 399×260 — baixo demais para o rodapé edge-to-edge
    // de S8. Revetorizar (docs/prd/91-assets.md §3).
    logo: '/images/MARCA/DJ/jazzmoon-white.png',
    // Alter-ego ancestral (persona Modo Sol). Ver docs/branding/identidade-jazz-moon.md.
    alterEgo: 'Zambi',
    socialLinks: {
      instagram: 'https://www.instagram.com/jazzmoon/'
    }
  },
  company: {
    name: 'Jazz Moon',
    legalName: 'Jazz Moon',
    foundingDate: '2024-01-01',
    email: 'contato@example.com',
    phone: '+5500000000000',
    phoneDisplay: '(00) 00000-0000',
    address: {
      street: 'Rua Exemplo, 000',
      neighborhood: 'Bairro',
      city: 'Cidade',
      state: 'UF',
      country: 'BR',
      postalCode: '00000-000'
    },
    dpo: {
      name: 'Encarregado de Dados (DPO)',
      email: 'dpo@example.com'
    }
  },
  // Lista pública de provedores de analytics consumida por /privacidade e /cookies.
  // Os IDs reais são configurados via env (NUXT_PUBLIC_GTAG_ID, NUXT_PUBLIC_CLARITY_ID).
  analytics: {
    providers: [
      {
        name: 'Google Analytics 4',
        vendor: 'Google LLC',
        country: 'EUA',
        purpose: 'Mensuração de audiência',
        policyUrl: 'https://policies.google.com/privacy'
      },
      {
        name: 'Microsoft Clarity',
        vendor: 'Microsoft Corporation',
        country: 'EUA',
        purpose: 'Mapas de calor e gravações de sessão',
        policyUrl: 'https://privacy.microsoft.com/pt-br/privacystatement'
      }
    ]
  }
})
