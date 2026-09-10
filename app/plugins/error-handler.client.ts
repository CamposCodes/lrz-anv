export default defineNuxtPlugin(() => {
  window.addEventListener('error', (e) => {
    console.error('[global-error]', e.error)
    // Futuro: Sentry.captureException(e.error)
  })

  window.addEventListener('unhandledrejection', (e) => {
    console.error('[unhandled-rejection]', e.reason)
    // Futuro: Sentry.captureException(e.reason)
  })
})
