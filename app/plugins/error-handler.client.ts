export default defineNuxtPlugin(() => {
  window.addEventListener('error', (e) => {
    console.error('[global-error]', e.error)
  })

  window.addEventListener('unhandledrejection', (e) => {
    console.error('[unhandled-rejection]', e.reason)
  })
})
