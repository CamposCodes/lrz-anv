// Singleton em nível de módulo: qualquer caller (banner, link do rodapé, página)
// pode abrir o modal de preferências LGPD. O modal em si é renderizado uma única
// vez na raiz do app para sobreviver ao fechamento do TheLgpdBanner depois que o
// usuário toma uma decisão.
const isOpen = ref(false)

export const useLgpdPreferencesModal = () => {
  const open = () => { isOpen.value = true }
  const close = () => { isOpen.value = false }
  return { isOpen, open, close }
}
