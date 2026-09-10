import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'

// === Identidade do site ===
const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com'
const SITE_NAME = 'Jazz Moon'
const SITE_DESCRIPTION = 'Jazz Moon — DJ e multi-artista. Sets, performances e a raiz ancestral Zambi, entre a lua e o sol.'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  vite: {
    plugins: [tailwindcss()]
  },

  // SSR é obrigatório para AEO/GEO: crawlers e LLMs precisam ver o conteúdo no HTML inicial.
  ssr: true,
  css: ['~/assets/css/tailwind.css'],
  pages: true,

  // Transição de página global (crossfade + deslize) — classes .page-* em tailwind.css.
  // Só roda em navegação no cliente, então não toca no LCP do hero prerenderizado.
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  // Entradas com prefixo por subárvore (específicas antes da genérica) para evitar
  // colisão de nomes sob pathPrefix:false. ui/Button → <UiButton>, brand/Wordmark →
  // <BrandWordmark>, motif/Motif → <MotifMotif>, motif/Eclipse → <MotifEclipse>.
  components: [
    { path: '~/components/ui', prefix: 'Ui', pathPrefix: false },
    { path: '~/components/brand', prefix: 'Brand', pathPrefix: false },
    { path: '~/components/motif', prefix: 'Motif', pathPrefix: false },
    { path: '~/components', pathPrefix: false }
  ],

  imports: {
    // Glob composables/** permite auto-import de subdiretórios (ui/, structured-data/, analytics/).
    dirs: ['types/**/**.ts', 'composables/**', 'utils']
  },

  modules: [
    'shadcn-nuxt',
    'nuxt-llms', // AEO/GEO: gera /llms.txt e /llms-full.txt
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/scripts',
    'motion-v/nuxt', // animações (Motion for Vue)
    'nuxt-gtag',
    'nuxt-security',
    '@nuxt/eslint'
  ],

  // components/ui/ já é usado pelos componentes de design system do projeto (Button, Card...).
  // shadcn-nuxt escreve os componentes gerados em components/shadcn/ pra não colidir.
  shadcn: {
    prefix: '',
    componentDir: './app/components/shadcn'
  },

  // AEO/GEO: llms.txt + llms-full.txt gerados pelo nuxt-llms a partir desta config.
  llms: {
    domain: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    full: {
      title: `${SITE_NAME} — Documentação completa`,
      description: 'Conteúdo completo para LLMs.'
    },
    sections: [
      {
        title: 'Páginas',
        description: 'Páginas públicas do site.',
        links: [
          { title: 'Início', href: '/', description: 'Página principal.' },
          { title: 'Política de Privacidade', href: '/privacidade', description: 'LGPD.' },
          { title: 'Política de Cookies', href: '/cookies', description: 'Cookies e consentimento.' }
        ]
      }
    ]
  },

  // Estratégia de renderização (Core Web Vitals): prerender das rotas estáticas.
  routeRules: {
    '/': { prerender: true },
    '/privacidade': { prerender: true },
    '/cookies': { prerender: true }
    // '/styleguide' não é prerenderizada — SSR sob demanda.
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/privacidade', '/cookies']
    }
  },

  runtimeConfig: {
    public: {
      whatsappNumber: process.env.NUXT_PUBLIC_WHATSAPP_NUMBER || '',
      gtagId: process.env.NUXT_PUBLIC_GTAG_ID || '',
      clarityId: process.env.NUXT_PUBLIC_CLARITY_ID || '',
      analyticsEnabled: process.env.NUXT_PUBLIC_ANALYTICS_ENABLED !== 'false'
    }
  },

  // GA4 via nuxt-gtag: boot adiado até o consentimento LGPD liberar analytics_storage.
  gtag: {
    id: process.env.NUXT_PUBLIC_GTAG_ID || undefined,
    enabled: false,
    initCommands: [
      ['consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        wait_for_update: 500
      }]
    ],
    config: { send_page_view: false }
  },

  // @nuxt/image — otimização para Core Web Vitals.
  image: {
    format: ['webp'],
    quality: 80,
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 }
  },

  // Inline do CSS crítico para FCP melhor.
  features: { inlineStyles: true },

  fonts: {
    // Self-host (provider Google) servido same-origin via /_fonts.
    defaults: { subsets: ['latin', 'latin-ext'], styles: ['normal'] },
    families: [
      // Display = Lastik, self-hosted via @font-face no tailwind.css — não passa por aqui.
      // O tier LÍRICO não tem webfont: é serifada de sistema com correção métrica (a
      // JazzMoon que ocupava esse lugar foi removida do projeto).
      // A Fraunces saiu: era exclusiva do manifesto (S3), que passou ao tier de display.
      // Uma quarta face para um bloco só não paga o webfont.
      // Corpo/UI (peso SEO/legibilidade dark-mode).
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] },
      // Dados/DJ (tracklists, BPM, datas).
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500] },
      // Voz Zambi (títulos caixa-alta do Modo Sol).
      { name: 'Space Grotesk', provider: 'google', weights: [500, 600, 700] }
    ]
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          "'nonce-{{nonce}}'",
          "'strict-dynamic'",
          // defesa em profundidade para browsers legados sem strict-dynamic
          'https://www.googletagmanager.com',
          'https://www.google-analytics.com',
          'https://*.clarity.ms'
        ],
        'connect-src': [
          "'self'",
          'https://www.google-analytics.com',
          'https://*.google-analytics.com',
          'https://*.analytics.google.com',
          'https://*.clarity.ms',
          'https://c.bing.com'
        ],
        'img-src': [
          "'self'",
          'data:',
          'https://www.google-analytics.com',
          'https://*.google-analytics.com',
          'https://*.clarity.ms',
          'https://c.bing.com'
        ],
        // 'unsafe-inline' é obrigatório aqui: features.inlineStyles (CSS crítico inline),
        // <style scoped> do Vue e os atributos style inline que o motion-v escreve.
        // Fontes self-hosted via @nuxt/fonts (/_fonts same-origin) → sem hosts do Google.
        'style-src': ["'self'", "'unsafe-inline'"],
        'font-src': ["'self'", 'data:'],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'self'"]
      },
      crossOriginEmbedderPolicy: 'unsafe-none',
      xXSSProtection: '1; mode=block',
      referrerPolicy: 'strict-origin-when-cross-origin',
      permissionsPolicy: {
        geolocation: [],
        microphone: [],
        camera: []
      }
    }
  }
})
