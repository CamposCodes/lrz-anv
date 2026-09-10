<template>
  <!-- Onde a referência tem fotografia vermelha, aqui tem cor pura: é a inversão que
       impede o clone e, de quebra, resolve produção — as 387 fotos de OURIVES estão todas
       abaixo de 1024px e borrariam em full-bleed (docs/prd/91-assets.md §1).
       Respiro, não seção: 1 viewport exato, sem rolagem interna. -->
  <UiSection surface="sangue" fill="solid" padding="none" class="s7">
    <UiContainer size="lg">
      <div ref="raiz" class="s7__bloco">
        <h2 ref="titulo" class="s7__titulo">
          OURIVES · SÉRIE 001
        </h2>

        <!-- PEÇA ⟨CTA⟩ ÚNICA: lidas na horizontal formam "peça única" com o botão no meio —
             o botão é literalmente o que está entre você e a peça. Texto real, nunca
             ::before/::after: conteúdo em pseudo-elemento não é confiável em leitor de tela. -->
        <div class="s7__linha">
          <p class="s7__palavra">
            PEÇA
          </p>

          <!-- Sem página /ourives ainda (docs/prd/S7 §5): o destino real da coleção hoje é o
               Instagram da marca, vindo do app.config para não fixar URL em componente.
               O aria-label começa pelo rótulo visível — comando de voz precisa casar. -->
          <a
            class="s7__cta"
            :href="instagram"
            target="_blank"
            rel="noopener noreferrer"
            data-pressable
            aria-label="Ver a coleção Ourives no Instagram (abre em nova aba)"
          >VER A COLEÇÃO</a>

          <p class="s7__palavra">
            ÚNICA
          </p>
        </div>

        <!-- Zambi é a marca da ourivesaria, não mais um tema de interface (00-indice.md §D1):
             aqui ela volta ao que sempre foi, assinatura de linha de produto. O componente já
             emite aria-hidden quando não recebe label. Fica dentro do bloco (e não no slot
             #decor) para entrar no escopo do gsap.context abaixo; o posicionamento absoluto
             resolve contra a <UiSection>, que é a única ancestral com position. -->
        <BrandZambiBadge class="s7__selo" size="clamp(2.25rem, 4vw, 3.25rem)" />
      </div>
    </UiContainer>
  </UiSection>
</template>

<script lang="ts" setup>
const { $gsap, $prefersReducedMotion } = useNuxtApp()
const appConfig = useAppConfig()

const instagram = appConfig.brand.socialLinks.instagram

const raiz = ref<HTMLElement | null>(null)
const titulo = ref<HTMLElement | null>(null)

// mask-line-up do título — 500ms, sem atraso (docs/prd/90-movimento.md §7).
useMaskReveal(titulo, { start: 'top 85%' })

let ctx: { revert: () => void } | null = null

onMounted(() => {
  const el = raiz.value
  // Sem GSAP nada anima e tudo permanece no estado final — que é exatamente o que o SSR já
  // entregou. Nenhum estado escondido em CSS: a falha de JS aqui é invisível, não fatal.
  if (!el || !$gsap) return

  // Opacidade de repouso do selo: --motif-decor (0,14), NÃO 1. Lida aqui, no mount, antes
  // de qualquer tween tocar o elemento — é o destino explícito dos fromTo abaixo. `.from()`
  // releria esse destino do DOM ao inicializar e, caindo depois de o próprio tween escrever
  // o estado inicial, gravaria 0 como destino: o elemento não apareceria mais (medido em
  // S4/S5/S8 em 2026-08-03). Ler uma vez mantém o token do CSS como fonte de verdade.
  const seloRepouso = Number(getComputedStyle(el.querySelector('.s7__selo') as Element).opacity) || 1

  ctx = $gsap.context(() => {
    const gatilho = cenaScrub(el)

    // 'jmOut' é o espelho de --ease-fluid, registrado via CustomEase em
    // app/plugins/gsap.client.ts. Não usar 'expo.out' como equivalente: expo.out é
    // 1−2^(−10t), uma exponencial, e não a bezier do token — em t=0,2 vale 0,75 contra
    // ~0,86 do sistema. Nomear o ease em cada tween em vez de herdar o default global
    // mantém a curva explícita ao lado da duração que ela governa.
    const curva = 'jmOut'

    // Movimento reduzido: some o deslocamento, fica a opacidade — ela é o que explica que
    // algo mudou (§12). O :active scale(.97) do CTA sobrevive: vive em CSS e é feedback.
    if ($prefersReducedMotion?.()) {
      $gsap.fromTo('.s7__palavra, .s7__cta',
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: curva, scrollTrigger: gatilho })
      $gsap.fromTo('.s7__selo',
        { opacity: 0 },
        { opacity: seloRepouso, duration: 0.2, ease: curva, scrollTrigger: gatilho })
      return
    }

    // UMA timeline, e a cascata em POSIÇÃO — não em `delay`.
    //
    // Eram três tweens avulsos com `delay: 0.16 / 0.28 / 0.4` compartilhando o mesmo
    // gatilho scrubado. Sob scrub o `delay` é código morto: o ScrollTrigger pausa a
    // animação e a conduz por `totalProgress`, e o `_delay` de um tween avulso não entra
    // em `totalDuration()`. Os três rodavam em lockstep no mesmo curso e a cascata
    // PEÇA/ÚNICA → CTA → selo simplesmente não existia (medido: `.s7__palavra` e
    // `.s7__cta` com a MESMA sequência de opacidade ao longo da rolagem). Como posição
    // numa timeline os mesmos números voltam a valer — e de quebra três ScrollTriggers
    // idênticos viram um.
    $gsap.timeline({ scrollTrigger: gatilho, defaults: { ease: curva } })
      // PEÇA e ÚNICA entram SIMULTANEAMENTE, cada uma do seu lado. São um par: escalonar
      // as duas quebraria a leitura horizontal que forma "peça única".
      .fromTo('.s7__palavra', {
        opacity: 0,
        // Pixel, e não porcentagem, porque as duas palavras têm larguras diferentes e o
        // deslocamento precisa ser o mesmo nos dois lados. Índice par sai da esquerda.
        x: (i: number) => (i === 0 ? -12 : 12)
      }, {
        opacity: 1,
        x: 0,
        duration: 0.4
      }, 0.16)
      // Nunca a partir de scale(0): a entrada mínima do sistema é 0,95–0,96 (§5).
      //
      // clearProps saiu com o `once` — com scrub ele limparia o transform toda vez que a
      // rolagem cruzasse o fim do curso, e o botão saltaria ao subir. Isso reabre o
      // problema que ele resolvia: o transform inline do GSAP vence [data-pressable]:active
      // na cascata e mataria o feedback de pressão. Por isso o scale saiu do tween e o que
      // entra agora é só opacidade — o CTA é o alvo de clique da seção, e o feedback de
      // pressionar vale mais que 0,04 de escala na entrada.
      .fromTo('.s7__cta', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.28)
      // Entra por último e vai até --motif-decor (0,14), lido do CSS uma vez no mount
      // (seloRepouso): o tier continua definido em um lugar só, sem releitura envenenável.
      .fromTo('.s7__selo', { opacity: 0 }, { opacity: seloRepouso, duration: 0.4, ease: 'power1.inOut' }, 0.4)
  }, el)
})

onBeforeUnmount(() => {
  ctx?.revert()
  ctx = null
})
</script>

<style scoped>
/* Respiro de exatamente 1 viewport: se precisar de rolagem, virou outra coisa
   (docs/prd/S7 §2). O max-height impede que o bloco vaze para dentro de S8 em tela curta.
   O par vh/svh é fallback — onde svh não existe, vh já resolve.
   Toda a tinta desta seção é #FFFFFF por herança: a cascata [data-surface="sangue"] resolve
   fg, fg-muted e fg-subtle para branco, porque sobre sangue não existe texto secundário. */
.s7 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  min-height: 100svh;
  max-height: 100vh;
  max-height: 100svh;
  overflow: hidden;
}

.s7__bloco {
  text-align: center;
}

/* LÍRICO. O clamp é o do PRD e não o de UiDisplay: aqui o título divide a tela com o par
   de palavras e o CTA, e os três precisam caber juntos em 1 viewport. */
.s7__titulo {
  font-family: var(--font-display);
  font-size: clamp(3rem, 7vw, 6rem);
  line-height: 1;
  letter-spacing: -0.01em;
  margin-bottom: clamp(2.5rem, 6vh, 4.5rem);
  font-synthesis: none;
}

.s7__linha {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  column-gap: clamp(1.5rem, 5vw, 4rem);
  row-gap: clamp(1.5rem, 4vh, 2.5rem);
}

/* REGISTRO. Peso 500 é o topo do que a JetBrains Mono carrega neste projeto
   (nuxt.config.ts): pedir 600 aqui geraria faux-bold. */
.s7__palavra {
  font-family: var(--font-mono);
  font-size: clamp(0.875rem, 1.6vw, 1.125rem);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

/* CTA invertido — o elemento mais claro da tela e o único preenchimento branco do site.
   É o que faz ele vencer sem precisar de tamanho.
   --color-primary já resolve para branco na cascata de sangue (é o semântico, não hex cru)
   e o rótulo em sangue sobre branco mede 5,57:1 (00-indice.md §3.2).
   O anel de foco vem do :focus-visible global: 2px no token de anel (branco aqui) com
   outline-offset 2px — sem o offset o anel sumiria dentro do próprio preenchimento. */
.s7__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* Alvo de toque em qualquer largura. */
  min-height: 48px;
  padding: 0 clamp(1.5rem, 4vw, 2.75rem);
  background-color: var(--color-primary);
  color: var(--color-sangue);
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  /* O transform é o feedback de [data-pressable]; a cor é o hover. Declarados juntos porque
     o shorthand desta regra substitui o de [data-pressable] por especificidade. */
  transition:
    transform var(--dur-press) var(--ease-fluid),
    background-color var(--dur-tooltip) ease;
}

/* Abaixo de 768px: PEÇA e ÚNICA lado a lado, CTA abaixo em largura total.
   Só a ordem VISUAL muda — no DOM segue PEÇA · CTA · ÚNICA, que é a leitura pretendida, e
   o CTA é o único elemento focável da seção, então não há descompasso de tabulação. */
.s7__cta {
  order: 1;
  flex-basis: 100%;
}

@media (min-width: 768px) {
  .s7__cta {
    order: 0;
    flex-basis: auto;
  }
}

/* Hover vai para papel, nunca para cinza: cinza derrubaria o contraste do rótulo vermelho;
   #FFF5FC mantém 5,04:1 e é cor do sistema. Só em ponteiro fino — no toque o :hover dispara
   no tap e trava o estado. */
@media (hover: hover) and (pointer: fine) {
  .s7__cta:hover {
    background-color: var(--color-papel);
  }
}

/* Assinatura pequena no canto inferior, tier decor. Absoluto contra a <UiSection>, que é
   `relative isolate`; o recuo o mantém longe do overflow:hidden da seção. */
.s7__selo {
  position: absolute;
  right: clamp(1.5rem, 4vw, 3rem);
  bottom: clamp(1.5rem, 4vh, 3rem);
  opacity: var(--motif-decor);
}
</style>
