import type { Ref } from 'vue'

/**
 * `mask-line-up` — título entra subindo por trás de uma máscara em vez de aparecer:
 * `overflow: hidden` no pai, `translateY(100%)` no filho. Funciona em SSR — o servidor
 * entrega o texto no estado final e o cliente promove a partir dele, então crawler e
 * leitor de tela nunca veem conteúdo escondido.
 *
 * Exige CSS de suporte no elemento alvo: `overflow: hidden` (a classe `mask-reveal-line`
 * abaixo só cobre a linha gerada pelo SplitText).
 */
export const useMaskReveal = (
  target: Ref<HTMLElement | null>,
  options: {
    /** intervalo entre linhas, em segundos. Teto do sistema: 0,08. */
    stagger?: number
    /** fração da altura que precisa cruzar a viewport para disparar. */
    start?: string
  } = {}
) => {
  const { stagger = 0.07, start = 'top 85%' } = options
  const { $gsap, $SplitText, $prefersReducedMotion } = useNuxtApp()

  let split: { revert: () => void } | null = null
  let ctx: { revert: () => void } | null = null

  onMounted(() => {
    const el = target.value
    if (!el || !$gsap) return

    // Movimento reduzido: só opacidade, sem máscara e sem stagger. O deslocamento é o
    // que causa enjoo; a opacidade é o que explica que algo mudou — ela fica.
    // Gatilho é scrub (não once): re-sincroniza a cada ScrollTrigger.refresh(), então um
    // refresh solto (troca de webfont, imagem lazy decodificando) nunca deixa o tween
    // preso em progresso 0. fromTo e não from: `.from()` relê o destino do DOM ao
    // inicializar e pode gravar o próprio estado inicial como alvo, deixando o elemento
    // invisível para sempre.
    if ($prefersReducedMotion?.()) {
      ctx = $gsap.context(() => {
        $gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2, scrollTrigger: cenaScrub(el, { start }) })
      }, el)
      return
    }

    ctx = $gsap.context(() => {
      split = new $SplitText(el, {
        type: 'lines',
        linesClass: 'mask-reveal-line',
        // aria-hidden no clone + texto original preservado para leitor de tela.
        autoSplit: true,
        mask: 'lines',
        // A animação nasce DENTRO do onSplit e é RETORNADA — não pode ficar depois do
        // construtor. autoSplit refaz a divisão quando a webfont termina de carregar e
        // descarta as linhas antigas: um tween criado do lado de fora fica órfão nelas, e
        // as linhas novas nascem sem estado inicial e sem gatilho. Retornar a animação é
        // o que faz o GSAP revertê-la antes de re-dividir.
        // Sem `delay`: sob scrub ele é código morto — o ScrollTrigger pausa o tween e o
        // conduz por totalProgress, que não inclui delay. Quem escalona é o stagger.
        onSplit: self => $gsap.fromTo(self.lines, { yPercent: 100 }, {
          yPercent: 0,
          duration: 0.5,
          stagger,
          ease: 'easeOut',
          scrollTrigger: cenaScrub(el, { start })
        })
      })
    }, el)
  })

  onBeforeUnmount(() => {
    split?.revert()
    ctx?.revert()
    split = null
    ctx = null
  })
}
