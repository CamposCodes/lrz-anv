<template>
  <!-- FASE DA LUA — geometria, não ícone.
       O terminador de uma lua real é uma SEMI-ELIPSE: é a borda do hemisfério iluminado
       vista de esguelha, e ela achata até virar reta no quarto. Um disco tapado por outro
       disco (o truque de CSS mais comum para "lua") acerta o crescente fino por acidente e
       erra toda a fase gibosa — por isso a máscara aqui é meia-chapa + elipse.

       UMA variável controla a fase inteira: --lua-f, a fração iluminada
       (0 = nova · 0,5 = quarto · 1 = cheia). O raio horizontal do terminador é R·|1−2f|, e
       o SINAL de (1−2f) decide o papel dele: acima do quarto a elipse SOMA à metade
       iluminada (gibosa), abaixo ela SUBTRAI (crescente). Em vez de trocar o `fill` no meio
       do caminho — o que pediria um branch em JS — são duas elipses empilhadas, cada uma
       com o rx zerado por max() fora do próprio regime. Em f = 0,5 as duas medem rx 0: a
       troca de regime acontece numa elipse de área nula e é por isso que ela é invisível.

       Consequência: a fase é CSS puro e inteiramente herdada. Quem consome só escreve
       --lua-f no ancestral (custom property atravessa fronteira de componente), e a
       transição desse número anima a lua sem uma linha de JavaScript, sem estado, e já
       correta no HTML do servidor. -->
  <svg
    class="fase"
    :class="{ 'fase--minguante': waning }"
    viewBox="0 0 100 100"
    aria-hidden="true"
    :style="{ width: size, height: size }"
  >
    <mask :id="mascara" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
      <!-- O hemisfério iluminado é SEMPRE o direito. Minguante é a mesma física
           espelhada (.fase--minguante), não um segundo desenho. -->
      <rect x="50" y="0" width="50" height="100" fill="#fff" />
      <ellipse class="fase-corte" cx="50" cy="50" ry="48" fill="#000" />
      <ellipse class="fase-soma" cx="50" cy="50" ry="48" fill="#fff" />
    </mask>

    <!-- O orbe: o disco inteiro em traço fino. Sem ele um crescente de 2,6px lê como risco
         solto — é o anel que diz "lua" e devolve a parte não iluminada ao desenho, como a
         luz cinérea devolve no céu. non-scaling-stroke trava 1px real em qualquer escala,
         a mesma regra do sistema de motivos (identidade §6). -->
    <circle class="fase-orbe" cx="50" cy="50" r="48" vector-effect="non-scaling-stroke" />
    <circle class="fase-luz" cx="50" cy="50" r="48" :mask="`url(#${mascara})`" />
  </svg>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  /** Lua minguante: espelha o desenho para o limbo esquerdo. */
  waning?: boolean
  size?: string
}>(), { waning: false, size: '1em' })

// useId é estável entre servidor e cliente — id de máscara gerado por contador próprio
// divergiria na hidratação e o url(#…) apontaria para o nada.
const mascara = `fase-${useId()}`
</script>

<style scoped>
.fase {
  display: block;
  /* O traço do orbe cavalga o raio: sem isto o browser come 0,5px do anel na borda. */
  overflow: visible;
  /* Nunca encolhe dentro do flex do item de nav — a lua tem tamanho, não proporção. */
  flex: none;
}

/* Espelhar o elemento custa uma linha; desenhar a metade esquerda custaria um segundo
   caminho de máscara para descrever exatamente a mesma física. */
.fase--minguante {
  transform: scaleX(-1);
}

/* As duas tintas são variáveis porque a lua vive em duas escalas MUITO diferentes — uma
   marca de 10px e um orbe de 40px têm ~16× de diferença de área, e a mesma opacidade que
   some numa berra na outra. Quem posiciona a lua é quem sabe o tamanho dela. */
.fase-orbe {
  fill: none;
  stroke: currentColor;
  stroke-width: 1;
  opacity: var(--lua-limbo, 0.38);
}

.fase-luz {
  fill: currentColor;
  opacity: var(--lua-tinta, 0.88);
  /* Acompanha --lua-f na mesma curva: em escala grande a fase cheia também ACENDE, não
     só cresce. É o único par de propriedades animadas do item, e as duas são das
     permitidas (docs/prd/90-movimento.md §4). */
  transition: opacity 260ms var(--ease-fluid);
}

/* rx = R·(1−2f), zerado por max() acima do quarto: SUBTRAI da metade iluminada e só
   existe entre a lua nova e o quarto. */
.fase-corte {
  rx: calc(48px * max(0, 1 - 2 * var(--lua-f, 1)));
}

/* O espelho: rx = R·(2f−1), vive do quarto à cheia e SOMA à metade iluminada. */
.fase-soma {
  rx: calc(48px * max(0, 2 * var(--lua-f, 1) - 1));
}
</style>
