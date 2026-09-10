<template>
  <MotionConfig reduced-motion="user">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </MotionConfig>
</template>

<script lang="ts" setup>
useHead({
  htmlAttrs: { lang: 'pt-BR' }
})
</script>
