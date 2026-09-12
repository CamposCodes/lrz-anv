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
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  imports: {
    dirs: ['types/**/**.ts', 'composables/**', 'utils']
  },

  modules: [
    'shadcn-nuxt',
    '@nuxt/image',
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

  image: {
    format: ['webp'],
    quality: 80,
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 }
  },

  // Inline do CSS crítico para FCP melhor.
  features: { inlineStyles: true }
})
