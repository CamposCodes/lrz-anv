export const useIntersectionVisibility = (
  target: Ref<HTMLElement | null>,
  options: IntersectionObserverInit = { threshold: 0 }
) => {
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!target.value) return
    observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        isVisible.value = true
        observer?.disconnect()
        observer = null
      }
    }, options)
    observer.observe(target.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })

  return { isVisible }
}
