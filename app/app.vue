<template>
  <!-- MotionConfig respeita prefers-reduced-motion para todas as animações motion-v. -->
  <MotionConfig reduced-motion="user">
    <div class="flex min-h-screen flex-col font-sans antialiased text-fg">
      <!-- Cortina de abertura da home. Decide sozinha se aparece (só em /). -->
      <TheLoader />
      <!-- Atmosfera global (névoa cósmica) fixa atrás de todo o conteúdo. -->
      <TheAtmosphere />
      <NuxtRouteAnnouncer />
      <AppHeader />

      <!-- Header é absoluto no topo do documento (flutua sobre o hero e sai com a rolagem).
           O conteúdo reserva a altura do header; seções que devem passar POR BAIXO dele
           (ex.: hero) usam margin-top negativa. -->
      <div id="conteudo" tabindex="-1" class="flex-1 pt-[var(--header-h)]">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </div>

      <!-- A home traz o próprio fecho (S8 = contato + rodapé, docs/prd/S8-contato-rodape.md):
           renderizar o AppFooter global ali duplicaria links, contato e copyright. -->
      <AppFooter v-if="route.path !== '/'" />

      <ClientOnly>
        <TheLgpdBanner />
        <TheLgpdPreferences />
      </ClientOnly>
    </div>
  </MotionConfig>
</template>

<script lang="ts" setup>
// A superfície é propriedade da SEÇÃO, não do documento (docs/prd/00-indice.md §D1).
// Não há preferência de usuário a persistir → o script anti-FOUC, o cookie `jm_theme`
// e o nonce CSP que ele exigia deixaram de ser necessários. O <html> nasce em noite e
// cada <UiSection surface> re-resolve a cascata por seletor.
const route = useRoute()

// Tracking de profundidade de rolagem — guarda-se para rodar só no cliente.
useScrollDepth()

useHead({
  htmlAttrs: { lang: 'pt-BR', 'data-surface': 'noite' },
  meta: [
    { name: 'theme-color', content: '#0A0004' }
  ],
  // Fontes self-hosted via @nuxt/fonts (same-origin /_fonts) — sem preconnect Google.
  link: [
    // A Lastik é o único webfont em preload — e o único do site: ela desenha a headline do
    // hero, que É o elemento LCP. O tier LÍRICO (glossário, nomes de item) é serifada de
    // sistema, sem download, então não há segunda fonte competindo por banda com a foto.
    // crossorigin é obrigatório para fonte, mesmo same-origin.
    { rel: 'preload', href: '/font/lastik/Lastik-Regular.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
    { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'manifest', href: '/manifest.webmanifest' }
  ]
})
</script>

<style scoped>
</style>
