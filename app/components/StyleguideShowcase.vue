<template>
  <div class="space-y-16">
    <!-- Tokens semânticos -->
    <section>
      <UiHeading :level="3" class="mb-6">Tokens semânticos</UiHeading>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        <div v-for="s in semantic" :key="s.label">
          <div :class="['h-16 rounded-[var(--radius)] border border-border', s.cls]" />
          <p class="mt-2 font-mono text-xs text-fg-subtle">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <!-- Primitivas de marca -->
    <section>
      <UiHeading :level="3" class="mb-6">Primitivas de marca</UiHeading>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        <div v-for="s in brand" :key="s.label">
          <div :class="['h-16 rounded-[var(--radius)] border border-border', s.cls]" />
          <p class="mt-2 font-mono text-xs text-fg-subtle">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <!-- Tipografia -->
    <section>
      <UiHeading :level="3" class="mb-6">Tipografia</UiHeading>
      <div class="space-y-4">
        <UiDisplay as="p">Display Lastik</UiDisplay>
        <UiHeading :level="2" as="p">Heading · voz Lua (Lastik)</UiHeading>
        <UiHeading :level="2" voice="zambi" as="p">Heading · voz Zambi</UiHeading>
        <p class="max-w-2xl text-base text-fg-muted">
          Corpo em Inter — legibilidade máxima para leitura longa e SEO. A medida ideal fica entre
          60 e 75 caracteres, com entrelinha confortável.
        </p>
        <p class="font-mono text-sm uppercase tracking-wider text-fg-subtle">Mono · JetBrains · 128 BPM · 21h00</p>
        <UiEyebrow>Eyebrow · sobrancelha mono</UiEyebrow>
      </div>
    </section>

    <!-- Botões -->
    <section>
      <UiHeading :level="3" class="mb-6">Botões</UiHeading>
      <div class="flex flex-wrap items-center gap-4">
        <UiButton variant="primary">Primary</UiButton>
        <UiButton variant="secondary">Secondary</UiButton>
        <UiButton variant="ghost">Ghost</UiButton>
        <UiButton variant="zambi">Zambi</UiButton>
        <UiButton variant="primary" disabled>Disabled</UiButton>
      </div>
      <div class="mt-4 flex flex-wrap items-center gap-4">
        <UiButton size="sm">Small</UiButton>
        <UiButton size="md">Medium</UiButton>
        <UiButton size="lg">Large</UiButton>
      </div>
    </section>

    <!-- Cards -->
    <section>
      <UiHeading :level="3" class="mb-6">Cards</UiHeading>
      <div class="grid gap-6 sm:grid-cols-3">
        <UiCard>
          <p class="font-display text-xl">Surface</p>
          <p class="mt-2 text-sm text-fg-muted">Card padrão sobre superfície elevada com borda de controle.</p>
        </UiCard>
        <UiCard hover>
          <p class="font-display text-xl">Hover vermelho</p>
          <p class="mt-2 text-sm text-fg-muted">Passe o mouse — vira vermelho sólido (sangue).</p>
        </UiCard>
        <UiCard variant="cosmic">
          <p class="font-display text-xl">Cosmic</p>
          <p class="mt-2 text-sm text-branco/80">Card vermelho fixo, independente da superfície ao redor. Link em
            <a href="#" class="underline text-branco">branco</a>.
          </p>
        </UiCard>
      </div>
    </section>

    <!-- Misc -->
    <section>
      <UiHeading :level="3" class="mb-6">Badges, links, divisor</UiHeading>
      <div class="flex flex-wrap items-center gap-4">
        <UiBadge>Novo set</UiBadge>
        <UiBadge>Ao vivo</UiBadge>
        <UiLink href="#">Um link de texto</UiLink>
      </div>
      <UiDivider class="mt-8">
        <MotifEclipse size="1.25rem" class="text-fg-subtle" />
      </UiDivider>
    </section>

    <!-- Motivos -->
    <section>
      <UiHeading :level="3" class="mb-6">Motivos (line-art recolorido)</UiHeading>
      <div class="grid grid-cols-3 gap-6 sm:grid-cols-4 lg:grid-cols-8">
        <div v-for="m in motifs" :key="m" class="flex flex-col items-center gap-2 text-center">
          <Motif :name="m" tier="accent" size="3rem" class="text-fg" />
          <p class="font-mono text-[0.65rem] leading-tight text-fg-subtle">{{ m }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
// Classes literais (Tailwind escaneia o <script> dos .vue) para gerar os utilitários.
const semantic = [
  { label: 'bg', cls: 'bg-bg' },
  { label: 'bg-2', cls: 'bg-bg-2' },
  { label: 'surface', cls: 'bg-surface' },
  { label: 'surface-2', cls: 'bg-surface-2' },
  { label: 'primary', cls: 'bg-primary' },
  { label: 'accent', cls: 'bg-accent' },
  { label: 'fg', cls: 'bg-fg' },
  { label: 'border', cls: 'bg-border' }
]

const brand = [
  { label: 'noite', cls: 'bg-noite' },
  { label: 'onyx', cls: 'bg-onyx' },
  { label: 'papel', cls: 'bg-papel' },
  { label: 'sangue', cls: 'bg-sangue' },
  { label: 'silver', cls: 'bg-silver' },
  { label: 'branco', cls: 'bg-branco' }
]

const motifs = [
  'moon-realistic',
  'sun-rays-geometric',
  'portal-arch-orbit',
  'sparkle-burst-orbit',
  'sun-flames',
  'sphere-wireframe',
  'star-orbit-cross',
  'sigil-crown-minimal'
]
</script>

<style scoped>
</style>
