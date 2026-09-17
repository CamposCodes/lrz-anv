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
    'motion-v/nuxt', 
    '@nuxt/eslint'
  ],

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },

  routeRules: {
    '/': { prerender: true }
  },

  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  },

  features: { inlineStyles: true }
})
