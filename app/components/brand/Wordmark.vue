<template>
  <!-- Wordmark tingido por máscara: a cor vem do background-color, a forma do canal alpha
       do PNG. Por isso a fonte da máscara é o arquivo VERMELHO (2186×1424) e não o branco
       (399×260) — a máscara ignora a cor do arquivo e só lê o alpha, então vale usar o de
       maior resolução. No fecho de S8 o wordmark sangra a largura inteira da tela e o
       asset de 399px borrava visivelmente. -->
  <!-- label="" torna o wordmark decorativo, como no ZambiBadge: usado no fecho de S8, onde
       ele vai em branco sobre sangue (5,57:1, legível — a paleta perdeu o ouro e com ele o
       conceito de textura ilegível) e o nome já foi dito em outros lugares. -->
  <span
    class="jm-wordmark"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    :style="{ height }"
  />
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  height?: string
  label?: string
}>(), { height: '2rem', label: 'Jazz Moon' })
</script>

<style scoped>
.jm-wordmark {
  display: inline-block;
  aspect-ratio: 2186 / 1424;
  background-color: var(--color-moon);
  -webkit-mask: url("/images/MARCA/DJ/jazzmoon-red.png") center / contain no-repeat;
          mask: url("/images/MARCA/DJ/jazzmoon-red.png") center / contain no-repeat;
}

/* Sobre papel o wordmark vira escarlate (5,23:1); sobre sangue, branco puro. */
[data-surface="papel"] .jm-wordmark {
  background-color: var(--color-sangue);
}

[data-surface="sangue"] .jm-wordmark {
  background-color: var(--color-branco);
}
</style>
