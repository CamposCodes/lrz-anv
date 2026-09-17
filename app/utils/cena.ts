export const cenaScrub = (
  trigger: Element | null,
  extra: Record<string, unknown> = {}
) => ({
  trigger,
  start: 'top 85%',
  end: 'top 40%',
  scrub: 0.8,
  ...extra
})

export const saidaDeSecao = (
  trigger: Element | null,
  extra: Record<string, unknown> = {}
) => ({
  trigger,
  start: 'bottom bottom',
  end: 'bottom top',
  scrub: 0.8,
  invalidateOnRefresh: true,
  ...extra
})

export const secaoGrudada = (
  trigger: Element | null,
  extra: Record<string, unknown> = {}
) => ({
  trigger,
  start: 'top top',
  end: 'bottom bottom',
  scrub: 0.8,
  ...extra
})
