<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
    <p class="mb-4 text-sm uppercase tracking-widest opacity-60">
      Erro {{ error.statusCode }}
    </p>
    <h1 class="mb-4 text-3xl font-bold">{{ title }}</h1>
    <p class="mb-8 opacity-80">{{ message }}</p>
    <button class="rounded px-4 py-2 underline" @click="handleError">Voltar para o início</button>
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
    ? 'A página que você procura não existe ou foi movida.'
    : 'Tivemos um problema ao carregar esta página. Tente novamente em alguns instantes.'
)

const handleError = () => clearError({ redirect: '/' })

useSeoMeta({
  title: () => (is404.value ? 'Página não encontrada' : 'Erro inesperado'),
  robots: 'noindex'
})
</script>
