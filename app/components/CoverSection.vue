<template>
  <section ref="sectionEl" class="scroll-scene relative flex min-h-screen items-center justify-center overflow-hidden px-8">
    <div class="pointer-events-none absolute inset-0 -z-10 bg-black" />

    <div ref="titleWrapEl" class="mx-auto max-w-4xl text-center">
      <h1 class="font-magazine-letter text-[2.5rem] uppercase leading-[1.15] tracking-tight sm:text-8xl">
        <span
          v-for="(ch, i) in Array.from('FELIZ')"
          :key="`feliz-${i}`"
          class="ransom-letter inline-block"
          :class="{ 'font-ransom': isThinGlyph(ch) }"
          :style="{ color: RANSOM_COLORS[i % RANSOM_COLORS.length] }"
        >{{ ch }}</span>
        <br>
        <span
          v-for="(ch, i) in Array.from('ANIVERSÁRIO')"
          :key="`aniversario-${i}`"
          class="ransom-letter inline-block"
          :class="{ 'font-ransom': isThinGlyph(ch) }"
          :style="{ color: RANSOM_COLORS[(i + 4) % RANSOM_COLORS.length] }"
        >{{ ch }}</span>
        <span class="font-script cover-name normal-case block text-7xl leading-none sm:text-9xl" style="color: var(--primary)">Lorenzo</span>
      </h1>
    </div>

    <div ref="hintEl" class="absolute bottom-10 flex flex-col items-center gap-1 text-white/80">
      <span class="text-sm">role para ver as mensagens</span>
      <ChevronDown class="size-5 animate-bounce" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'

// Cada letra numa "cor de papel" diferente, tipo recorte de revista de verdade —
// ordem embaralhada de propósito (não é ROYGBIV em sequência) e fixa por posição,
// nunca Math.random() (isso quebraria o hydration: servidor e cliente sorteariam
// cores diferentes pro mesmo índice).
// Todas com contraste >= 3:1 contra o fundo preto (WCAG AA pra texto grande),
// medido de verdade (luminância relativa), não no olho.
const RANSOM_COLORS = [
  '#f2b90f', // dourado (marca) — 11.72:1
  '#e63946', // vermelho — 5.04:1
  '#2a9d8f', // verde-azulado — 6.32:1
  '#f2f2f2', // quase-branco (marca) — 18.76:1
  '#9b5de5', // roxo — 5.09:1
  '#588157', // verde — 4.69:1
  '#ff8fab', // rosa — 9.77:1
  '#457b9d', // azul — 4.57:1
  '#b03a3a', // vinho (marca, clareado — #520000 puro dava só 1.36:1) — 3.51:1
  '#e9724c' // laranja — 6.98:1
]

// O "I" na Magazine Letter é só um traço fino, sem o "papel" de fundo que as
// outras letras têm. Em vez de forçar um chip artificial, usa a Pauls Ransom
// Note (a fonte anterior) só nesse caractere — ela desenha o "I" com o recorte
// de papel de verdade. Mistura as duas fontes de propósito.
const isThinGlyph = (ch: string) => ch === 'I'

const sectionEl = ref<HTMLElement | null>(null)
const titleWrapEl = ref<HTMLElement | null>(null)
const hintEl = ref<HTMLElement | null>(null)
const { $gsap, $gsapMatchMedia, $ScrollTrigger, $prefersReducedMotion } = useNuxtApp()

onMounted(() => {
  if (!$gsap || !titleWrapEl.value) return

  const letters = titleWrapEl.value.querySelectorAll<HTMLElement>('.ransom-letter')
  const nameEl = titleWrapEl.value.querySelector<HTMLElement>('.cover-name')

  // Lado de cada letra (esquerda/direita do centro do bloco), medido AGORA —
  // antes de qualquer transform de animação. getBoundingClientRect já reflete
  // a rotação estática do CSS (nth-child), então isso captura a posição de
  // repouso real; medir depois da entrada em espiral pegaria a posição
  // embaralhada de partida em vez da final.
  const wrapCenterX = titleWrapEl.value.getBoundingClientRect().left + titleWrapEl.value.getBoundingClientRect().width / 2
  const letterOffsets = Array.from(letters, (el) => {
    const r = el.getBoundingClientRect()
    return r.left + r.width / 2 - wrapCenterX
  })

  if ($prefersReducedMotion?.()) {
    $gsap.set([...letters, nameEl], { opacity: 1, rotation: 0, scale: 1 })
    return
  }

  // Lorenzo chega diferente das letras: nada de espiral. Anima o elemento direto
  // (opacity + y + rotation/scale), sem SplitText/mask — um mask com overflow:
  // clip revela a palavra deslizando através de uma janela fixa, o que SEMPRE
  // mostra o glifo cortado pela metade em algum ponto do meio da transição
  // (a cursiva conecta letra com letra, então até um único frame cortado quebra
  // o traço visualmente). Animar o elemento inteiro garante que "Lorenzo" é
  // sempre desenhado por completo — só posição/opacidade/escala mudam.

  // Assim que o scroll começa, cada letra dispersa pro seu próprio lado (usa
  // letterOffsets: quem já está mais à esquerda/direita do centro voa mais
  // longe nessa direção) enquanto encolhe e some — sem subir, é o mergulho/
  // imersão pra dentro da tela, não rolagem pra fora. Cobre exatamente os
  // 100vh do Cover (start 'top top' até end 'bottom top').
  if ($ScrollTrigger && sectionEl.value) {
    const tl = $gsap.timeline({
      scrollTrigger: {
        trigger: sectionEl.value,
        start: 'top top',
        end: 'bottom top',
        // scrub numérico (não `true`): com scroll-snap forçando o fling a
        // assentar na próxima cena quase instantaneamente, um scrub 1:1 fazia
        // essa animação inteira acontecer nesse mesmo instante — mal dava pra
        // ver as letras se dispersando. Com atraso, a timeline continua
        // "alcançando" o progresso por ~0.9s mesmo depois do scroll físico
        // já ter terminado, garantindo a cena inteira visível.
        scrub: 0.9
      }
    })

    tl.to(letters, {
      x: (i: number) => letterOffsets[i] * 2.5,
      y: () => $gsap.utils.random(-100, 100),
      rotation: () => $gsap.utils.random(-160, 160),
      scale: 0.4,
      opacity: 0,
      ease: 'none'
    }, 0)

    if (nameEl) {
      tl.to(nameEl, { y: 140, scale: 0.5, opacity: 0, ease: 'none' }, 0)
    }

    tl.to(hintEl.value, { opacity: 0, scale: 0.6, ease: 'none' }, 0)
  }

  $gsapMatchMedia.add({ isMobile: '(max-width: 639px)', isDesktop: '(min-width: 640px)' }, (context: { conditions: { isMobile: boolean } }) => {
    const { isMobile } = context.conditions
    const [minRadius, maxRadius] = isMobile ? [40, 80] : [90, 180]

    // Cada letra sorteia seu próprio ponto de partida (ângulo + raio) num círculo ao
    // redor da posição final e várias voltas de rotação — some de um giro caótico e
    // "espirala" pra dentro até pousar formando a palavra. Ângulo e raio precisam vir
    // do mesmo sorteio por letra (guardado em array) senão x/y giram de pontos
    // descolados e o efeito de espiral se perde.
    const angles = Array.from(letters, () => $gsap.utils.random(0, Math.PI * 2))
    const radii = Array.from(letters, () => $gsap.utils.random(minRadius, maxRadius))

    const tl = $gsap.timeline({ delay: 0.2 })
      .from(letters, {
        opacity: 0,
        scale: 0.3,
        x: (i: number) => Math.cos(angles[i]) * radii[i],
        y: (i: number) => Math.sin(angles[i]) * radii[i],
        rotation: () => $gsap.utils.random(-720, 720),
        duration: 1,
        ease: 'power3.out',
        stagger: { each: 0.045, from: 'random' }
      })

    if (nameEl) {
      tl.from(nameEl, {
        opacity: 0,
        y: 60,
        rotation: 6,
        scale: 0.9,
        duration: 0.9,
        ease: 'power4.out'
      }, '-=0.35')
    }

    return () => {
      tl.kill()
    }
  })
})
</script>
