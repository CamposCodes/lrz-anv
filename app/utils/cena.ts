/**
 * Gatilho de cena LIGADO À ROLAGEM — descendo avança, subindo desfaz.
 *
 * É a mecânica da referência (voyeurverite.com): lá nenhuma cena "dispara e acaba", todas
 * são scrub e o dedo é o playhead nos dois sentidos. Este util existe para que a decisão
 * seja UMA, e não sete cópias de um objeto de ScrollTrigger espalhadas pelas seções.
 *
 * Substitui o antigo padrão `{ start: 'top 85%', once: true }`. O que mudou de conceito:
 * once é uma cena narrativa que acontece; scrub é uma cena que o leitor CONDUZ.
 *
 * - `start: 'top 85%'` — o mesmo ponto de antes: dispara com o bloco já dentro da leitura,
 *   não na borda da tela.
 * - `end: 'top 40%'` — 45% da dobra de curso. Medido na referência: os reveals de linha
 *   dela consomem ~200px numa dobra de 900 (22%); 45% é mais lento de propósito, porque
 *   aqui não há ScrollSmoother multiplicando o curso do dedo.
 * - `scrub: 0.8` — não `true`. A referência roda sob ScrollSmoother, que amortece toda a
 *   rolagem; com `true` a cena cola no dedo e fica seca. 0,8s de recuperação devolve a
 *   inércia sem virar animação por tempo — soltar o dedo no meio deixa a cena no meio.
 *
 * IMPORTANTE para quem usar: `clearProps` é incompatível com scrub. Ele devolve a
 * propriedade ao CSS quando o tween termina, e no scrub "terminar" acontece toda vez que
 * a rolagem cruza o fim — voltando, não há mais transform para interpolar e o elemento
 * salta. Onde havia clearProps, a propriedade fica inline mesmo.
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
  // Quase toda cena que usa este gatilho é `.from()`: o estado FINAL é o que o CSS/SSR
  // entrega e o GSAP o LÊ DO DOM ao inicializar. `invalidateOnRefresh` faz o ScrollTrigger
  // chamar `animation.revert().invalidate()` e reinicializar — e medido em 2026-08-03 o
  // revert NÃO devolvia a opacidade ao valor do CSS antes disso: a releitura pegava o
  // elemento ainda no estado inicial e gravava 0 como DESTINO. O tween virava `0 → 0` e o
  // conteúdo não aparecia mais, com o gatilho marcando progresso 1 (os três títulos e os
  // três parágrafos da S4 e as legendas da S5, permanentemente invisíveis).
  //
  // A flag só entra onde o tween tem valor em FUNÇÃO e destino explícito — ver
  // saidaDeSecao abaixo, e os gatilhos da pilha em S1/S2/S2b.
  ...extra
})

/**
 * Gatilho da SAÍDA de uma seção — a dobra em que ela deixa a tela pelo topo.
 *
 * É o outro tempo da referência, e o que dá profundidade à página: enquanto a entrada
 * revela, a saída AFASTA. Lá as três coisas acontecem juntas neste mesmo curso (medido
 * entre y=3800 e y=5400 em 1440×900, ~1 dobra por seção):
 *
 *   - a foto de fundo desescala e sobe          (scale 1 → 0,94 · y 0 → −600px)
 *   - a foto DENTRO do cartão desce em paralaxe (y 0 → +225px, sentido oposto)
 *   - um selo de cor chapada fecha por cima     (opacity 0 → 1)
 *
 * Os dois sentidos opostos são o ponto: é o afastamento entre os planos que lê como
 * profundidade — um plano só se movendo seria deslize.
 */
export const saidaDeSecao = (
  trigger: Element | null,
  extra: Record<string, unknown> = {}
) => ({
  trigger,
  // 'bottom bottom' → 'bottom top': começa quando a base da seção encosta na base da tela
  // e termina quando ela sai por cima. Exatamente uma dobra de curso, como na referência.
  start: 'bottom bottom',
  end: 'bottom top',
  scrub: 0.8,
  // Os dois consumidores deste gatilho (S3 e S4) animam `y: () => innerHeight * SAIDA_*`.
  // Valor em FUNÇÃO resolve UMA vez, no primeiro render, e fica assado no PropTween —
  // só invalidateOnRefresh manda o ScrollTrigger reavaliá-lo. Sem isto, girar o celular de
  // retrato para paisagem mantém o deslocamento medido em retrato: o fundo sobe o dobro do
  // que devia e estoura os 12% de folga do `inset-block` das duas seções, abrindo uma
  // faixa da superfície no topo antes de o selo fechar. A flag mora AQUI e não em cada
  // seção porque é propriedade da cena de saída, não de quem a usa.
  invalidateOnRefresh: true,
  ...extra
})

/** Deslocamentos da saída, em fração da DOBRA — nunca pixel fixo (docs/prd/90-movimento §4).
 *  0,67 e 0,25 são os 600px e 225px medidos, divididos pelos 900px daquela dobra. */
export const SAIDA_FUNDO_Y = -0.67
export const SAIDA_CARTAO_Y = 0.25
/** Escala final do fundo na saída. 0,94 é o valor da referência. */
export const SAIDA_FUNDO_ESCALA = 0.94
