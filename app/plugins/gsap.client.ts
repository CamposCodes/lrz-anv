import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { CustomEase } from 'gsap/CustomEase'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin, CustomEase, MotionPathPlugin)

  ScrollTrigger.config({ ignoreMobileResize: true })

  CustomEase.create('easeOut', 'M0,0 C0.16,1 0.3,1 1,1')
  CustomEase.create('easeInOut', 'M0,0 C0.77,0 0.175,1 1,1')
  CustomEase.create('easeDrawer', 'M0,0 C0.32,0.72 0,1 1,1')

  gsap.defaults({ ease: 'easeOut', duration: 0.5 })

  const mm = gsap.matchMedia()

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
      prefersReducedMotion: () =>
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
  }
})
