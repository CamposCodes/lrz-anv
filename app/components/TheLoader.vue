<template>
  <!-- Abertura da landing: a aura cobre a tela enquanto a home hidrata e sai em
       crossfade. Renderiza no SSR (não em <ClientOnly>) — se só montasse depois da
       hidratação, o usuário veria o hero e SÓ ENTÃO o overlay tapando: pior que
       não ter loader. O conteúdo real continua inteiro no HTML, atrás do overlay. -->
  <div v-if="visivel" class="loader" :class="{ 'loader--saindo': saindo }" role="status" aria-live="polite">
    <!-- muted é obrigatório para o autoplay passar (o arquivo TEM trilha de áudio);
         playsinline impede o iOS de abrir em tela cheia. Sem loop: o clipe tem 8s e
         o overlay nunca dura tanto. -->
    <video
      class="loader-aura"
      src="/video/jazzmoon-aura.mp4"
      autoplay
      muted
      playsinline
      preload="auto"
      aria-hidden="true"
    />
    <span class="sr-only">Carregando</span>
  </div>
</template>

<script lang="ts" setup>
// Tempo que a aura fica em tela DEPOIS de a app estar pronta. É o único número a
// mexer: abaixo de ~1,5s o clipe mal se lê, acima de ~3s vira pedágio.
const RESPIRO_MS = 2400
// Deve bater com a transição de .loader no <style>.
const FADE_MS = 600

// Avaliado UMA vez, no setup do primeiro load. Não é computed de propósito: navegar
// para /privacidade e voltar não pode reabrir a cortina.
const visivel = ref(useRoute().path === '/')
const saindo = ref(false)

if (import.meta.client && visivel.value) {
  // Sem <Transition>: o Vue remove o elemento ao ouvir transitionend, e sob
  // prefers-reduced-motion o overlay é display:none — não roda transição, o evento
  // nunca vem e o overlay ficava preso no DOM (medido). Classe + timer sempre sai.
  const fechar = () => {
    if (saindo.value) return
    saindo.value = true
    document.documentElement.classList.remove('jm-loader-ativo')
    setTimeout(() => { visivel.value = false }, FADE_MS)
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // O CSS já escondeu a cortina; desmontar aqui é o que aborta o download dos 2 MB
    // de vídeo que ninguém vai ver.
    visivel.value = false
  } else {
    // A trava de rolagem é posta e tirada pelo MESMO código. Se ela viesse no HTML do
    // servidor e o bundle nunca chegasse, a página ficaria sem rolagem para sempre —
    // e o <style> não alcança o <html> para desfazer. A janela sem trava é o intervalo
    // até a hidratação, com a cortina já cobrindo tudo.
    document.documentElement.classList.add('jm-loader-ativo')
    // onMounted = app hidratada, e é o gatilho que SEMPRE chega. onNuxtReady seria mais
    // preciso (espera a app ficar ociosa) mas pendura tudo num requestIdleCallback que
    // pode nunca vir — medido: a cortina ficou presa. O vídeo não entra na conta de
    // "pronto" de jeito nenhum: 2 MB em 3G seguraria a página por um enfeite.
    onMounted(() => setTimeout(fechar, RESPIRO_MS))
  }
}
</script>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  /* Acima de tudo: o header é z-50 e o banner LGPD também. */
  z-index: 100;
  display: grid;
  place-items: center;
  /* Preto puro, não --color-noite: o clipe é uma aura sobre fundo preto e qualquer
     diferença de matiz desenharia a borda do quadrado 1080×1080. */
  background-color: #000;
  /* Saída: só opacidade. O que estava atrás já está no lugar certo — deslocar a
     cortina daria a entender que o conteúdo se moveu. */
  transition: opacity 600ms var(--ease-fluid);
  /* TETO DE SEGURANÇA, e é CSS de propósito: um setTimeout de emergência só roda se o
     JS rodar, ou seja, justamente não roda no caso contra o qual protege (bundle que
     não chega, erro na hidratação, JS desligado). Aos 5s a cortina sai sozinha e o
     conteúdo — que sempre esteve no HTML, atrás dela — aparece. Quando o JS funciona,
     .loader--saindo já removeu o elemento muito antes desse delay vencer. */
  animation: loader-teto 400ms var(--ease-fluid) 5000ms forwards;
}

@keyframes loader-teto {
  to {
    opacity: 0;
    visibility: hidden;
  }
}

.loader--saindo {
  opacity: 0;
  /* O fade dura 600ms; o clique do usuário não pode esperar por ele. */
  pointer-events: none;
}

.loader-aura {
  width: min(72vmin, 560px);
  aspect-ratio: 1;
  object-fit: contain;
  /* ponytail: screen apaga o que sobra de quase-preto na compressão do fundo do
     clipe. Sobre o preto do overlay é operação neutra. Remover se um dia o vídeo
     trocar por um de fundo claro. */
  mix-blend-mode: screen;
}

:global(html.jm-loader-ativo),
:global(html.jm-loader-ativo body) {
  overflow: clip;
}

/* Movimento reduzido: a cortina é 100% decoração — não há informação a preservar
   (docs/prd/90-movimento.md §12), então sai inteira. Corte por CSS e não só pelo ramo
   no <script> para valer já no HTML do servidor, sem um quadro de aura antes do mount. */
@media (prefers-reduced-motion: reduce) {
  .loader {
    display: none;
  }
}
</style>
