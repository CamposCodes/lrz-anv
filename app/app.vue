<template>
  <MotionConfig reduced-motion="user">
    <NuxtRouteAnnouncer />
    <LoadingScreen v-if="showLoading" @ready="contentReady = true" @exited="showLoading = false" />
    <!-- Só monta o resto da árvore DEPOIS que o gate do loading resolver — evita
         que CoverSection/ContributorSection/FinaleSection meçam layout (fontes,
         posições) antes de tudo estar pronto de verdade. -->
    <NuxtLayout v-if="contentReady">
      <NuxtPage />
    </NuxtLayout>
  </MotionConfig>
</template>

<script lang="ts" setup>
useHead({
  htmlAttrs: { lang: 'pt-BR' }
})

const contentReady = ref(false)
const showLoading = ref(true)
</script>
