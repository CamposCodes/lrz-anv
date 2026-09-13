import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  vite: {
    plugins: [tailwindcss()]
  },

  ssr: true,
  css: ['~/assets/css/tailwind.css'],
  pages: true,

  // Transição de página global — classes .page-* em tailwind.css.
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ]
    }
  },

  imports: {
    dirs: ['types/**/**.ts', 'composables/**', 'utils']
  },

  modules: [
    'shadcn-nuxt',
    '@nuxt/fonts',
    '@nuxt/scripts',
    'motion-v/nuxt', // animações (Motion for Vue)
    '@nuxt/eslint'
  ],

  // components/ui/ fica reservado para os componentes shadcn gerados pela CLI.
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },

  routeRules: {
    '/': { prerender: true }
  },

  nitro: {
    // Força preset estático puro: sem isso, na Netlify o Nitro auto-detecta
    // o ambiente e troca pro preset `netlify` (functions), que não gera
    // `.output/public` — quebra o publish directory configurado.
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  },

  // Inline do CSS crítico para FCP melhor.
  features: { inlineStyles: true }
})
