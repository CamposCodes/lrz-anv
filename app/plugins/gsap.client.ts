import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { CustomEase } from 'gsap/CustomEase'

// GSAP só no cliente: nada de animação no SSR — o servidor entrega o estado final
// (crawlers e LLMs veem o conteúdo) e o cliente promove a partir dele.
//
// Escopo deliberadamente pequeno (docs/prd/90-movimento.md): GSAP entra onde CSS não
// alcança — SplitText (mask-line-up por linha), Draggable+Inertia (física do arrasto de
// S5) e ScrollTrigger (sequência encadeada da travessia S6). Reveal simples continua em
// CSS: roda fora da main thread e não perde frame enquanto as fotos de 3000px carregam.
//
// Bundle via Vite (import estático) → script 'self', compatível com o strict-dynamic
// do nuxt-security sem afrouxar a CSP.
export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin, CustomEase)

  // Curvas do sistema como easing nomeado, espelhando os tokens CSS
  // (--ease-fluid / --ease-in-out / --ease-drawer). Uma fonte de verdade para as duas
  // linguagens: mudou o token, muda aqui junto.
  //
  // Tem de ser CustomEase: gsap.parseEase('cubic-bezier(...)') retorna undefined — o
  // core não interpreta a sintaxe CSS. A versão anterior registrava eases que estouravam
  // em TypeError no primeiro frame e deixavam o elemento preso no estado inicial
  // (invisível). O path 'M0,0 C x1,y1 x2,y2 1,1' é a mesma curva do cubic-bezier.
  CustomEase.create('jmOut', 'M0,0 C0.16,1 0.3,1 1,1')
  CustomEase.create('jmInOut', 'M0,0 C0.77,0 0.175,1 1,1')
  CustomEase.create('jmDrawer', 'M0,0 C0.32,0.72 0,1 1,1')

  gsap.defaults({ ease: 'jmOut', duration: 0.5 })

  // Movimento reduzido é MENOS movimento, não ausência dele. gsap.matchMedia expõe o
  // booleano para cada seção decidir — a regra por seção está no PRD respectivo.
  const mm = gsap.matchMedia()

  // ---------------------------------------------------------------------------
  // REVALIDAÇÃO DE POSIÇÃO — o que conserta a âncora
  //
  // Todo reveal do site usa .from() + ScrollTrigger: o conteúdo NASCE em opacity 0 e
  // sobe quando o gatilho é cruzado. Isso é deliberado (o SSR entrega o estado final,
  // então a página é legível sem JS), mas tem uma consequência: se o ScrollTrigger
  // calcular start/end errado, o gatilho nunca é cruzado e o conteúdo fica preso
  // INVISÍVEL.
  //
  // E ele calcula errado no carregamento com âncora. A ordem dos eventos é:
  //   1. seções montam    → ScrollTrigger cacheia start/end com o scroll ainda em 0
  //   2. Lastik carrega   → a altura dos títulos muda e todo o documento se desloca
  //   3. fotos decodificam→ desloca de novo
  //   4. Nuxt rola até a âncora (#som, #taro, …)
  // No passo 4 as posições cacheadas no passo 1 já não descrevem o documento. Abrir
  // /#som direto, ou dar F5 depois de rolar, cai exatamente aí — reproduzido: os três
  // títulos de S4 ficavam em opacity 0 para sempre.
  //
  // refresh() recalcula todos os gatilhos e dispara os que já estão em vista, então o
  // conteúdo aparece mesmo tendo "pulado" a transição. Chamado nos três momentos em que
  // o layout muda depois da montagem.
  if (import.meta.client) {
    // A TRAVA MORREU JUNTO COM O ÚLTIMO `once`.
    //
    // Havia aqui um latch que desligava ScrollTrigger.refresh() a partir do evento `load`,
    // justificado assim: "os reveals usam `once: true`, e um refresh depois de o gatilho
    // morrer reaplica o estado inicial do .from()". Duas coisas estavam erradas nisso.
    //
    // 1. Um gatilho `once` já disparado é REMOVIDO de _triggers (ScrollTrigger.js:1890) e
    //    o _revertAll do refresh itera só _triggers — gatilho morto é inalcançável, nada
    //    pode reaplicar nada nele. O sintoma medido em S4 vinha de um gatilho `once` ainda
    //    VIVO (start cruzado, end não) combinado com clearProps; os dois já saíram do
    //    projeto, e o último `once` de reveal (useMaskReveal) virou scrub.
    // 2. O ScrollTrigger registra sozinho `load → _refreshAll` (ScrollTrigger.js:2146). A
    //    trava nunca chegou a impedir esse refresh — ela só bloqueava os NOSSOS.
    //
    // E cobrava caro: TODO NuxtImg abaixo da dobra é loading="lazy", ou seja decodifica
    // DEPOIS do load e desloca o layout. Com o refresh travado a partir dali, start/end de
    // todas as seções abaixo da primeira dobra ficavam desatualizados. Com tudo em scrub um
    // refresh é seguro por construção: ele recalcula start/end e o update seguinte re-deriva
    // o progresso da posição de rolagem atual — não há estado a perder.
    //
    // Troca de webfont: a Lastik desenha os títulos e muda a altura deles. É o maior
    // deslocamento de layout depois da montagem e o que mais desalinha as posições
    // cacheadas no carregamento com âncora (/#som, /#taro…).
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }

  return {
    provide: {
      gsap,
      ScrollTrigger,
      SplitText,
      Draggable,
      gsapMatchMedia: mm,
      /** true quando o usuário pediu movimento reduzido. */
      prefersReducedMotion: () =>
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
  }
})
