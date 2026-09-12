import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { CustomEase } from 'gsap/CustomEase'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

// GSAP só no cliente: nada de animação no SSR — o servidor entrega o estado final
// (crawlers e leitores de tela veem o conteúdo) e o cliente promove a partir dele.
// Reveal simples continua em CSS sempre que possível: roda fora da main thread.
export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin, CustomEase, MotionPathPlugin)

  // Curvas nomeadas para os easings comuns de UI. Espelhe aqui qualquer curva
  // equivalente que você definir em CSS, para as duas linguagens ficarem em sincronia.
  //
  // Tem de ser CustomEase: gsap.parseEase('cubic-bezier(...)') retorna undefined — o
  // core não interpreta a sintaxe CSS. O path 'M0,0 C x1,y1 x2,y2 1,1' é a mesma curva
  // do cubic-bezier equivalente.
  CustomEase.create('easeOut', 'M0,0 C0.16,1 0.3,1 1,1')
  CustomEase.create('easeInOut', 'M0,0 C0.77,0 0.175,1 1,1')
  CustomEase.create('easeDrawer', 'M0,0 C0.32,0.72 0,1 1,1')

  gsap.defaults({ ease: 'easeOut', duration: 0.5 })

  // Movimento reduzido é MENOS movimento, não ausência dele. gsap.matchMedia expõe o
  // booleano para cada trecho de animação decidir sozinho o que reduzir.
  const mm = gsap.matchMedia()

  // Um ScrollTrigger calcula start/end no momento em que a seção monta. Se a webfont
  // troca depois (mudando a altura de títulos) ou uma imagem lazy decodifica abaixo da
  // dobra, o documento se desloca e as posições cacheadas ficam erradas — o gatilho pode
  // nunca mais ser cruzado, prendendo o conteúdo invisível. Prefira scrub a once nos
  // reveals: um gatilho scrub se re-sincroniza sozinho a cada refresh, então este
  // refresh() após a troca de fonte é seguro por construção.
  if (import.meta.client) {
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
