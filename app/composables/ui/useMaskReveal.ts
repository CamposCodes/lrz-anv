import type { Ref } from 'vue'

export const useMaskReveal = (
  target: Ref<HTMLElement | null>,
  options: {
    stagger?: number
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
        autoSplit: true,
        mask: 'lines',
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
