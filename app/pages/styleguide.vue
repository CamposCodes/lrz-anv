<template>
  <main>
    <!-- ============ SUPERFÍCIE NOITE ============ -->
    <UiSection surface="noite" fill="transparent" padding="md">
      <UiContainer>
        <UiEyebrow class="mb-4">Referência de design · uso interno</UiEyebrow>
        <UiDisplay as="h1">Styleguide</UiDisplay>
        <p class="mt-4 max-w-2xl text-lg text-fg-muted">
          Tokens e componentes da identidade Jazz Moon × Zambi. Esta página dogfooda a cascata
          bidirecional: o bloco abaixo está em <strong class="text-fg">Modo Lua</strong>; mais adiante,
          o mesmo conteúdo em <strong class="text-fg">Modo Sol</strong> — independente do tema global.
        </p>

        <!-- Marca -->
        <div class="mt-12 flex flex-wrap items-center gap-8">
          <BrandWordmark height="2.25rem" />
          <BrandZambiBadge size="3rem" class="text-accent" />
          <MotifEclipse size="2.25rem" class="text-accent" />
        </div>

        <UiDivider class="my-12">
          <Motif name="sparkle-clean-4pt" tier="accent" size="1rem" class="text-fg-subtle" />
        </UiDivider>

        <StyleguideShowcase />
      </UiContainer>
    </UiSection>

    <!-- ============ SUPERFÍCIE PAPEL — prova da cascata bidirecional ============ -->
    <UiSection surface="papel" fill="solid" padding="md">
      <UiContainer>
        <UiEyebrow class="mb-4">Mesmo conteúdo · Modo Sol</UiEyebrow>
        <UiHeading :level="2" voice="zambi">Mundo Zambi</UiHeading>
        <p class="mt-4 max-w-2xl text-lg text-fg-muted">
          Os mesmos tokens semânticos, remapeados para preto, branco e vermelho.
        </p>

        <UiDivider class="my-12">
          <Motif name="sun-rays-geometric" tier="accent" size="1.25rem" class="text-accent" />
        </UiDivider>

        <StyleguideShowcase />
      </UiContainer>
    </UiSection>
  </main>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'Styleguide',
  robots: 'noindex, nofollow'
})
</script>

<style scoped>
</style>
