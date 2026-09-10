import type { ScrollDepthPercent } from '~/types/analytics'

const PERCENTS: ScrollDepthPercent[] = [25, 50, 75, 100]
const SENTINEL_ATTR = 'data-scroll-sentinel'

export const useScrollDepth = () => {
  if (!import.meta.client) return

  const analytics = useAnalytics()
  const consent = useLgpdConsent()
  const fired = new Set<ScrollDepthPercent>()
  let sentinels: HTMLDivElement[] = []
  let observer: IntersectionObserver | null = null
  let resizeObserver: ResizeObserver | null = null

  const reposition = () => {
    const totalHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    )
    sentinels.forEach((el, idx) => {
      const percent = PERCENTS[idx]!
      // Posiciona o sentinel para que ele entre na viewport quando o usuário tiver
      // rolado o suficiente para que a base da viewport alcance `percent` da altura total.
      el.style.top = `${Math.max(0, Math.floor(totalHeight * (percent / 100)) - 1)}px`
    })
  }

  const setup = () => {
    if (sentinels.length > 0) return
    PERCENTS.forEach((percent) => {
      const el = document.createElement('div')
      el.setAttribute(SENTINEL_ATTR, String(percent))
      el.setAttribute('aria-hidden', 'true')
      el.style.cssText = 'position:absolute;left:0;width:1px;height:1px;pointer-events:none;visibility:hidden;'
      document.body.appendChild(el)
      sentinels.push(el)
    })
    reposition()

    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const percent = Number(
          (entry.target as HTMLElement).getAttribute(SENTINEL_ATTR)
        ) as ScrollDepthPercent
        if (fired.has(percent)) continue
        fired.add(percent)
        analytics.trackScrollDepth(percent)
      }
    })
    sentinels.forEach((el) => observer!.observe(el))

    resizeObserver = new ResizeObserver(() => reposition())
    resizeObserver.observe(document.body)
  }

  const teardown = () => {
    observer?.disconnect()
    observer = null
    resizeObserver?.disconnect()
    resizeObserver = null
    sentinels.forEach((el) => el.remove())
    sentinels = []
    fired.clear()
  }

  onMounted(() => {
    // Adia a criação de DOM/observers até o usuário liberar consentimento de analytics:
    // não há motivo em rastrear scroll de uma sessão cujos eventos seriam descartados
    // (rejeitados) ou bufferizados indefinidamente (sem decisão).
    if (consent.isAnalyticsAllowed.value) setup()
    watch(
      () => consent.isAnalyticsAllowed.value,
      (allowed) => {
        if (allowed && sentinels.length === 0) setup()
        else if (!allowed && sentinels.length > 0) teardown()
      }
    )
  })
  onBeforeUnmount(teardown)
}
