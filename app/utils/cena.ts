/**
 * Gatilho de cena ligado à rolagem — descendo avança, subindo desfaz (scrub, não once).
 * Existe para que a decisão de timing seja UMA, e não uma cópia de objeto ScrollTrigger
 * por seção.
 *
 * - `start`/`end` — janela da rolagem em que o gatilho fica ativo.
 * - `scrub: 0.8` — não `true`. Com `true` a cena cola exatamente no dedo/mouse; 0,8s de
 *   recuperação dá uma inércia leve sem virar animação por tempo (soltar no meio deixa a
 *   cena no meio).
 *
 * IMPORTANTE: `clearProps` é incompatível com scrub. Ele devolve a propriedade ao CSS
 * quando o tween "termina", e em scrub isso acontece toda vez que a rolagem cruza o fim —
 * voltando, não há mais transform para interpolar e o elemento salta.
 */
export const cenaScrub = (
  trigger: Element | null,
  extra: Record<string, unknown> = {}
) => ({
  trigger,
  start: 'top 85%',
  end: 'top 40%',
  scrub: 0.8,
  // NUNCA PONHA invalidateOnRefresh AQUI.
  //
  // A maioria das cenas que usa este gatilho é `.from()`: o estado FINAL é o que o
  // CSS/SSR entrega e o GSAP o LÊ DO DOM ao inicializar. `invalidateOnRefresh` faz o
  // ScrollTrigger chamar `animation.revert().invalidate()` e reinicializar — se o revert
  // não devolver o valor ao CSS antes disso, a releitura pega o elemento ainda no estado
  // inicial e grava esse valor como DESTINO: o tween vira um no-op e o conteúdo não
  // aparece mais. A flag só entra onde o tween tem valor em FUNÇÃO e destino explícito
  // (ver `saidaDeSecao` abaixo).
  ...extra
})

/**
 * Gatilho da SAÍDA de uma seção — a dobra em que ela deixa a tela pelo topo. Dá
 * profundidade à página: a seção pode desescalar/subir enquanto um elemento interno
 * anda em paralaxe no sentido oposto.
 */
export const saidaDeSecao = (
  trigger: Element | null,
  extra: Record<string, unknown> = {}
) => ({
  trigger,
  // 'bottom bottom' → 'bottom top': começa quando a base da seção encosta na base da tela
  // e termina quando ela sai por cima — uma dobra de curso.
  start: 'bottom bottom',
  end: 'bottom top',
  scrub: 0.8,
  // Se a animação usa valor em FUNÇÃO (ex.: `y: () => innerHeight * fração`), o valor
  // resolve UMA vez no primeiro render e fica gravado no PropTween — só
  // invalidateOnRefresh manda o ScrollTrigger reavaliá-lo (ex.: ao girar o celular).
  invalidateOnRefresh: true,
  ...extra
})
