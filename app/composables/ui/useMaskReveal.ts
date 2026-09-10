import type { Ref } from 'vue'

/**
 * `mask-line-up` — a entrada de todo título lírico do sistema.
 *
 * O título sobe por trás de uma máscara em vez de aparecer: `overflow: hidden` no pai,
 * `translateY(100%)` no filho. Funciona em SSR — o servidor entrega o texto no estado
 * final e o cliente promove a partir dele, então crawler e leitor de tela nunca veem
 * conteúdo escondido.
 *
 * Ver docs/prd/90-movimento.md §7.
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
    // `once: true` SAIU dos dois ramos, e não é cosmética: era o último reveal `once` do
    // site (app/utils/cena.ts documenta `{ start, once: true }` como o padrão SUBSTITUÍDO).
    // Um gatilho `once` ainda vivo — start cruzado, end não — é revertido pelo _revertAll de
    // qualquer ScrollTrigger.refresh(), e como ele não tem scrub não há progresso a
    // re-derivar depois: o .from() fica preso em progresso 0, ou seja INVISÍVEL. Gatilho
    // scrub é re-sincronizado a cada refresh (ScrollTrigger.js:1584), então é ele que torna
    // seguro o refresh livre que o plugin passou a fazer. E de quebra o título passa a
    // desfazer na subida como o resto do site.
    // fromTo e não from nos dois ramos: `.from()` relê o destino do DOM ao inicializar e
    // pode gravar o próprio estado inicial como alvo, deixando o título invisível para
    // sempre (medido em S4/S5/S8 em 2026-08-03).
    if ($prefersReducedMotion?.()) {
      ctx = $gsap.context(() => {
        $gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2, scrollTrigger: cenaScrub(el, { start }) })
      }, el)
      return
    }

    ctx = $gsap.context(() => {
      split = new $SplitText(el, {
        type: 'lines',
        linesClass: 'jm-mask-line',
        // aria-hidden no clone + texto original preservado para leitor de tela.
        autoSplit: true,
        mask: 'lines',
        // A animação nasce DENTRO do onSplit e é RETORNADA — não pode ficar depois do
        // construtor. autoSplit refaz a divisão quando a webfont termina de carregar
        // (medido: ~35ms depois do primeiro split) e descarta as linhas antigas: um tween
        // criado do lado de fora fica órfão nelas, e as linhas novas nascem sem estado
        // inicial e sem gatilho — o título aparece pronto, sem subir. Em carga fria isso
        // acontece SEMPRE; com a fonte em cache, quase nunca. Daí a falha intermitente.
        // Retornar a animação é o que faz o GSAP revertê-la antes de re-dividir.
        // Sem `delay`: sob scrub ele é código morto — o ScrollTrigger pausa o tween e o
        // conduz por totalProgress, que não inclui delay. Quem escalona é o stagger.
        onSplit: self => $gsap.fromTo(self.lines, { yPercent: 100 }, {
          yPercent: 0,
          duration: 0.5,
          stagger,
          ease: 'jmOut',
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
