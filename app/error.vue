<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center text-fg">
    <TheAtmosphere />
    <div class="max-w-md">
      <p class="mb-5 inline-block rounded-full border border-border bg-surface px-4 py-1.5 font-mono text-[0.70rem] uppercase tracking-[0.2em] text-fg-muted">
        Erro {{ error.statusCode }}
      </p>
      <UiDisplay class="mb-4">{{ title }}</UiDisplay>
      <p class="mb-8 leading-relaxed text-fg-muted">
        {{ message }}
      </p>
      <UiButton @click="handleError">Voltar para o início</UiButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}>()

const is404 = computed(() => props.error.statusCode === 404)

const title = computed(() => (is404.value ? 'Página não encontrada' : 'Algo deu errado'))
const message = computed(() =>
  is404.value
    ? 'A página que você procura não existe ou foi movida. Volte à página inicial para continuar navegando.'
    : 'Tivemos um problema ao carregar esta página. Tente novamente em alguns instantes.'
)

const handleError = () => clearError({ redirect: '/' })

useSeoMeta({
  title: () => (is404.value ? 'Página não encontrada' : 'Erro inesperado'),
  robots: 'noindex'
})
</script>

<style scoped>
</style>
