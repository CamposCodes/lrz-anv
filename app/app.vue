<template>
  <MotionConfig reduced-motion="user">
    <NuxtRouteAnnouncer />
    <LoadingScreen v-if="showLoading" @ready="contentReady = true" @exited="showLoading = false" />
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
