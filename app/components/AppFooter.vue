<template>
  <footer class="border-t border-border bg-bg-2/55 backdrop-blur-sm">
    <div class="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3">
      <div>
        <BrandWordmark height="1.75rem" />
        <p class="mt-3 text-sm text-fg-muted">{{ brand.tagline }}</p>
      </div>

      <div class="text-sm text-fg-muted">
        <p class="font-mono text-xs uppercase tracking-wider text-fg-subtle">Contato</p>
        <p class="mt-2">{{ company.email }}</p>
        <p>{{ company.phoneDisplay }}</p>
      </div>

      <div class="text-sm text-fg-muted">
        <p class="font-mono text-xs uppercase tracking-wider text-fg-subtle">Legal</p>
        <ul class="mt-2 space-y-1">
          <li><NuxtLink to="/privacidade" class="transition-colors hover:text-fg">Política de Privacidade</NuxtLink></li>
          <li><NuxtLink to="/cookies" class="transition-colors hover:text-fg">Política de Cookies</NuxtLink></li>
          <li>
            <button type="button" class="transition-colors hover:text-fg" @click="openPreferences">
              Gerenciar cookies
            </button>
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-border px-6 py-4 text-center font-mono text-xs text-fg-subtle">
      © {{ year }} {{ company.legalName }}. Todos os direitos reservados.
    </div>
  </footer>
</template>

<script lang="ts" setup>
const appConfig = useAppConfig()
const brand = computed(() => appConfig.brand)
const company = computed(() => appConfig.company)
const year = new Date().getFullYear()

// Reabre o modal de preferências LGPD (após o banner já ter sido dispensado).
const { open: openPreferences } = useLgpdPreferencesModal()
</script>

<style scoped>
</style>
