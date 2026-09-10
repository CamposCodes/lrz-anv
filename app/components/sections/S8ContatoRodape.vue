<template>
  <!-- A única seção do site com função de conversão — e por isso a mais discreta:
       papel, campos sem caixa, nada competindo pela atenção (docs/prd/S8 §1). -->
  <footer class="s8">
    <UiSection surface="papel" fill="solid" padding="lg" as="div">
      <UiContainer size="lg">
        <div class="s8__grade">
          <!-- Coluna do formulário -->
          <div ref="col" class="s8__form-col">
            <!-- O REGISTRO que faltava. Era a única seção do site sem rótulo: quem clica
                 CONTATO no header aterrissava com "* campo obrigatório" como primeira
                 palavra da tela — uma nota de rodapé abrindo a seção, e nenhum destino
                 visível para a âncora. É o mesmo componente e o mesmo tier de S2
                 ("SIGNIFICADO:") e S4 ("TRÊS LUAS"), então não compete com nada: a
                 discrição pedida pelo PRD §1 é sobre os CAMPOS, não sobre a orientação. -->
            <UiEyebrow as="h2" class="s8__rotulo-secao">Contato</UiEyebrow>

            <p id="s8-obrigatorio" class="s8__nota">
              * campo obrigatório
            </p>

            <!-- Sem action/method: os três CTAs abrem conversas distintas no WhatsApp, não
                 há submit para servidor. O @submit.prevent existe só para o Enter dentro de
                 um campo não recarregar a página. -->
            <form
              class="s8__form"
              novalidate
              @submit.prevent
              @focusin="aoFocar($event, true)"
              @focusout="aoFocar($event, false)"
            >
              <div class="s8__campo">
                <label class="s8__rotulo" for="s8-nome">Nome</label>
                <input
                  id="s8-nome"
                  v-model="form.nome"
                  type="text"
                  name="nome"
                  autocomplete="name"
                  class="s8__input"
                  data-clarity-mask="True"
                >
                <span class="s8__underline" aria-hidden="true" />
              </div>

              <div class="s8__campo">
                <label class="s8__rotulo" for="s8-email">E-mail*</label>
                <input
                  id="s8-email"
                  v-model="form.email"
                  type="email"
                  name="email"
                  required
                  autocomplete="email"
                  class="s8__input"
                  data-clarity-mask="True"
                  :aria-invalid="erro ? 'true' : undefined"
                  aria-describedby="s8-obrigatorio s8-erro"
                  @input="erro = ''"
                >
                <span class="s8__underline" aria-hidden="true" />
              </div>

              <div class="s8__campo">
                <label class="s8__rotulo" for="s8-procura">O que você procura?</label>
                <textarea
                  id="s8-procura"
                  v-model="form.procura"
                  name="procura"
                  rows="3"
                  class="s8__input s8__input--area"
                  data-clarity-mask="True"
                />
                <span class="s8__underline" aria-hidden="true" />
              </div>

              <!-- Erro por opacidade (fade GSAP de 200ms, no watch de `erro`), com ícone +
                   texto. NÃO sacode o campo: shake é movimento de posição (o primeiro a sair
                   em reduced-motion) e não diz o que está errado. role="alert" faz o leitor
                   de tela anunciar na hora — a opacidade não interfere no anúncio. -->
              <p id="s8-erro" ref="erroEl" class="s8__erro" role="alert">
                <template v-if="erro">
                  <svg class="s8__erro-ico" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5" />
                    <path d="M8 4.5v4.2M8 11.2v.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                  {{ erro }}
                </template>
              </p>

              <!-- Três CTAs lado a lado só funcionam porque são mutuamente exclusivos por
                   INTENÇÃO — três destinos, não três formas de enviar a mesma coisa
                   (docs/prd/S8 §4). Se virarem variações da mesma ação, colapsar em um.
                   O rótulo vive num <span> porque é ELE que recebe o blur de envio: filter
                   no <a> borraria junto o retângulo vermelho e viraria mancha. -->
              <div class="s8__ctas">
                <a
                  v-for="c in ctas"
                  :key="c.assunto"
                  :href="href(c.assunto)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="s8__cta"
                  data-pressable
                  :aria-label="`Abrir conversa no WhatsApp sobre ${c.acessivel} (abre em nova aba)`"
                  @click="aoAcionar($event)"
                ><span class="s8__cta-rotulo">{{ c.rotulo }}</span></a>
              </div>
            </form>
          </div>

          <!-- Coluna de links: repetidos no rodapé, como na referência. -->
          <nav class="s8__nav" aria-label="Rodapé">
            <a
              class="s8__link"
              :href="instagram"
              target="_blank"
              rel="noopener noreferrer"
              data-hoverable
            >Instagram</a>
            <a
              v-for="l in navLinks"
              :key="l.hash"
              class="s8__link"
              :href="l.hash"
              data-hoverable
            >{{ l.rotulo }}</a>
          </nav>
        </div>
      </UiContainer>
    </UiSection>

    <!-- Fecho arquitetônico: wordmark de ponta a ponta sobre sangue.
         A "vibração ilegível de propósito" (S6 §2) morreu com o ouro: em
         preto/branco/vermelho não existe mais nada abaixo de 2:1 para criar essa textura.
         O wordmark vai para branco — 5,57:1, legível, e é a única tinta que a regra dura
         do sistema permite sobre sangue. Continua decorativo (aria-hidden): o nome já foi
         dito no header, no glossário e no <title>, e o nome acessível vem do link do
         Instagram acima — só deixou de ser ilegível. -->
    <UiSection surface="sangue" fill="solid" padding="none" as="div" class="s8__fecho">
      <div class="s8__meta">
        <p class="s8__copy">© {{ ano }} {{ marca }}</p>
        <NuxtLink class="s8__meta-link" to="/privacidade" data-hoverable>Privacidade</NuxtLink>
        <NuxtLink class="s8__meta-link" to="/cookies" data-hoverable>Cookies</NuxtLink>
      </div>
      <BrandWordmark class="s8__wordmark" height="auto" label="" />
    </UiSection>
  </footer>
</template>

<script lang="ts" setup>
const { $gsap, $prefersReducedMotion } = useNuxtApp()
const appConfig = useAppConfig()
const runtime = useRuntimeConfig()

const marca = appConfig.brand.name
const instagram = appConfig.brand.socialLinks.instagram
// Estampado no servidor: prerender fixaria o ano do build, mas a página é regerada a
// cada deploy e um ano defasado no rodapé é erro visível.
const ano = new Date().getFullYear()

const navLinks = [
  { rotulo: 'Tarô', hash: '#taro' },
  { rotulo: 'Som', hash: '#som' },
  { rotulo: 'Joias', hash: '#joias' }
]

const ctas = [
  { rotulo: 'Leitura', assunto: 'Leitura de tarô', acessivel: 'leitura de tarô' },
  { rotulo: 'Booking', assunto: 'Booking / set', acessivel: 'booking de set' },
  { rotulo: 'Joia', assunto: 'Peça de ourivesaria', acessivel: 'peça de ourivesaria' }
]

const form = reactive({ nome: '', email: '', procura: '' })
const erro = ref('')

const col = ref<HTMLElement | null>(null)
const erroEl = ref<HTMLElement | null>(null)

let ctx: { revert: () => void, add: (fn: () => void) => unknown } | null = null

// Animação disparada por evento (foco, envio, erro) tem de NASCER dentro do contexto: o
// GSAP só registra o tween se o contexto estiver ativo no momento da criação, e é esse
// registro que faz o ctx.revert() do unmount limpar também o que veio depois do mount.
// Antes do mount vira no-op — e no servidor nada disso roda.
const noCtx = (fn: () => void) => ctx?.add(fn)

// .env → runtimeConfig → fallback no app.config (CLAUDE.md). Só dígitos: a wa.me rejeita
// espaço, parêntese e traço.
const numero = computed(() =>
  (runtime.public.whatsappNumber || appConfig.company.phone || '').replace(/\D/g, '')
)

// buildWhatsAppMessage tem campo próprio para TELEFONE (form.phone); aqui coletamos
// e-mail, então ele entra em `details` para não ser rotulado como número de contato.
const href = (assunto: string) => {
  const texto = buildWhatsAppMessage(
    { name: form.nome, subject: assunto, message: form.procura },
    form.email.trim() ? { 'E-mail': form.email.trim() } : {}
  )
  return `https://wa.me/${numero.value}?text=${encodeURIComponent(texto)}`
}

// O e-mail é obrigatório, mas não existe submit que o `required` possa bloquear — a
// validação tem de acontecer no clique do CTA, antes de abrir a aba.
const aoAcionar = (e: MouseEvent) => {
  const valor = form.email.trim()
  if (!valor) {
    e.preventDefault()
    erro.value = 'Informe seu e-mail para que eu consiga retornar.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) {
    e.preventDefault()
    erro.value = 'Esse e-mail parece incompleto. Confere?'
  } else {
    // Clique válido limpa a mensagem anterior: sem isso um erro sobreviveria a um autofill
    // que não dispara `input`.
    erro.value = ''
  }

  if (erro.value) {
    document.getElementById('s8-email')?.focus()
    return
  }

  // Estado de envio: o blur de 2px funde os dois rótulos e o olho lê UMA transformação em
  // vez de duas palavras sobrepostas (docs/prd/90-movimento.md §10). yoyo+repeat porque a
  // aba do WhatsApp abre por cima e a página continua viva atrás — o rótulo volta sozinho.
  // Em movimento reduzido o blur sai: é decoração, não informação.
  const rotulo = (e.currentTarget as HTMLElement).querySelector('.s8__cta-rotulo')
  if (!rotulo || $prefersReducedMotion?.()) return
  noCtx(() => {
    // fromTo com blur(0px) explícito: o valor computado em repouso é `none`, e interpolar a
    // partir de `none` não tem número para o GSAP animar.
    $gsap.fromTo(rotulo, { filter: 'blur(0px)' }, {
      filter: 'blur(2px)',
      opacity: 0.7,
      duration: 0.2,
      ease: 'jmOut',
      yoyo: true,
      repeat: 1,
      // O <a> é [data-pressable]; devolver as props ao CSS no fim evita que o inline do
      // GSAP dispute com as regras de estado.
      clearProps: 'filter,opacity'
    })
  })
}

// Underline do foco: cresce da ESQUERDA, no sentido da escrita — origem central cresceria
// para os dois lados, contra a leitura. Entra em 240ms e recolhe em 160ms: quem sai do
// campo já decidiu, quem entra está começando. scaleX, nunca width.
//
// Delegação por focusin/focusout (que borbulham) em vez de @focus/@blur em cada campo: um
// par de listeners no <form> resolve os três. O ANEL de foco continua em CSS — :focus-visible
// é estado de UI, não cena.
const aoFocar = (e: FocusEvent, entrando: boolean) => {
  const alvo = e.target as HTMLElement | null
  // focusin borbulha: os CTAs dentro do form também passam por aqui.
  if (!alvo?.classList.contains('s8__input')) return
  const linha = alvo.nextElementSibling
  if (!linha) return

  noCtx(() => {
    // Movimento reduzido: some o DESLOCAMENTO (scaleX vai direto para 1) e fica a
    // OPACIDADE, em 200ms. É o que explica que algo mudou sem mover nada.
    if ($prefersReducedMotion?.()) {
      $gsap.fromTo(
        linha,
        { scaleX: 1, opacity: entrando ? 0 : 1 },
        { opacity: entrando ? 1 : 0, duration: 0.2, ease: 'jmOut', overwrite: true }
      )
      return
    }
    $gsap.to(linha, {
      scaleX: entrando ? 1 : 0,
      duration: entrando ? 0.24 : 0.16,
      ease: 'jmOut',
      // Tabulação rápida troca de campo antes de o tween anterior terminar.
      overwrite: true
    })
  })
}

// O fade do erro. Sem shake: shake é movimento de posição, é o primeiro a sair em
// reduced-motion e não diz O QUE está errado — por isso a opacidade não tem ramo reduzido,
// ela já É o comportamento reduzido. flush 'post': o texto já está no DOM quando anima.
watch(erro, (v) => {
  const el = erroEl.value
  if (!v || !el) return
  noCtx(() => {
    $gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power1.inOut' })
  })
}, { flush: 'post' })

onMounted(() => {
  const el = col.value
  // Sem GSAP nada anima e tudo permanece no estado final — que é exatamente o que o SSR já
  // entregou. Nenhum estado escondido em CSS: falha de JS aqui é invisível, não fatal.
  if (!el || !$gsap) return

  ctx = $gsap.context(() => {
    const gatilho = cenaScrub(el)

    // fromTo (destino explícito) em toda a cena de reveal.
    //
    // `.from()` faz o GSAP LER o destino do DOM ao inicializar. Se a inicialização cair num
    // instante em que o elemento já está no estado inicial que o próprio tween escreveu, o
    // destino relido é esse mesmo estado: o tween vira `0 → 0` e o bloco não aparece mais,
    // com o gatilho marcando progresso 1. Medido nesta seção em 2026-08-03 (os campos do
    // formulário presos em `transform: translate(0px, 10px); opacity: 0` com o gatilho no
    // fim) — é o sintoma de "a animação para de funcionar depois de um tempo".
    if ($prefersReducedMotion?.()) {
      $gsap.fromTo('.s8__nota, .s8__campo, .s8__ctas',
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: 'jmOut', scrollTrigger: gatilho })
      return
    }

    // Discreto de propósito: é um formulário, não um hero. 8–10px de deslocamento, sem
    // escala. .from() e não .to(): o valor final é o que o servidor já entregou, o cliente
    // só promove a partir dele.
    $gsap.timeline({ scrollTrigger: gatilho, defaults: { ease: 'jmOut' } })
      .fromTo('.s8__nota', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 })
      .fromTo('.s8__campo', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.05 }, '-=0.25')
      // O contêiner, e não cada .s8__cta: o CTA carrega `transition: transform` em CSS para
      // o :active scale(.97), e um tween de y no MESMO elemento brigaria com a transition
      // quadro a quadro. Animando o grupo, o feedback de pressão fica intacto e nenhum
      // transform inline sobra em [data-pressable].
      //
      // clearProps saiu com o `once`: com scrub ele limparia o transform toda vez que a
      // rolagem cruzasse o fim do curso e o grupo saltaria na subida. O que ele protegia
      // continua protegido pela decisão acima — o tween é no CONTÊINER, e o transform
      // inline que sobra fica nele, não em [data-pressable].
      .fromTo('.s8__ctas', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
  }, el)
})

onBeforeUnmount(() => {
  ctx?.revert()
  ctx = null
})
</script>

<style scoped>
.s8__grade {
  display: grid;
  gap: clamp(3rem, 8vh, 5rem);
}

@media (min-width: 1024px) {
  .s8__grade {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: clamp(3rem, 8vw, 8rem);
  }
}

.s8__form-col {
  max-width: 34rem;
}

/* O rótulo é o abre da seção; a nota deixa de ser. Os 0,75rem entre os dois amarram o par
   (rótulo + nota são a mesma camada de registro) e os 2,5rem da nota continuam separando
   esse par do primeiro campo. */
.s8__rotulo-secao {
  margin-bottom: 0.75rem;
}

.s8__nota {
  margin-bottom: 2.5rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-fg-subtle);
}

.s8__form {
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
}

/* Campo = só underline. Sem caixa, sem raio, sem fundo (docs/prd/S8 §2). */
.s8__campo {
  position: relative;
}

.s8__rotulo {
  display: block;
  margin-bottom: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-fg-muted);
  cursor: pointer;
}

.s8__input {
  width: 100%;
  border: 0;
  border-radius: 0;
  background: transparent;
  padding: 0 0 0.5rem;
  font-family: var(--font-sans);
  /* 16px é o piso: abaixo disso o Safari iOS dá zoom no foco. */
  font-size: 1rem;
  line-height: 1.5;
  color: var(--color-fg);
  /* O foco é comunicado pelo underline animado + o anel global; o outline padrão do
     browser sobre um campo sem caixa fica solto no meio do nada. */
  outline: none;
}

.s8__input--area {
  resize: vertical;
  min-height: 4.5rem;
}

/* A linha em repouso: 1px sólido a 3,1:1 contra papel — cumpre WCAG 1.4.11 para borda de
   controle. NÃO baixar para opacity .2, que dá 2,1:1 e reprova. */
.s8__campo::after {
  content: "";
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--color-fg);
  opacity: 0.35;
}

/* A linha de foco cresce POR CIMA da de repouso, da esquerda — no sentido da escrita.
   Estado de REPOUSO apenas: quem anima o scaleX é o GSAP, no focusin/focusout (240ms
   entrando / 160ms saindo). Sem `transition` aqui de propósito — duas engines no mesmo
   transform brigariam quadro a quadro.
   Sem JS o underline não cresce, e isso é aceitável: o foco continua comunicado pelo anel
   :focus-visible abaixo e pela linha de repouso, que são CSS puro. */
.s8__underline {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--color-primary-text);
  transform: scaleX(0);
  transform-origin: left;
}

/* O anel de foco existe ALÉM do underline: o underline é decoração de estado, não
   indicador de foco. Sem isso, quem navega por teclado não tem alvo confiável. */
.s8__input:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 4px;
}

/* Opacidade explícita: o Firefox aplica .54 por conta própria e o placeholder some
   no papel. */
.s8__input::placeholder {
  color: var(--color-fg);
  opacity: 0.45;
}

/* O Chrome pinta o autofill de amarelo e destrói a paleta. O transition absurdo impede o
   flash amarelo no primeiro quadro, antes de o box-shadow assumir. */
.s8__input:-webkit-autofill,
.s8__input:-webkit-autofill:hover,
.s8__input:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--color-fg);
  -webkit-box-shadow: 0 0 0 100px var(--color-bg) inset;
  transition: background-color 9999s;
}

/* Reserva a altura sempre: sem isso, o erro aparecendo empurra os CTAs para baixo
   (deslocamento de layout no exato momento em que a pessoa vai clicar).
   O fade de 200ms é do GSAP — a transition CSS anterior nunca disparava, porque o conteúdo
   entra por v-if e não por troca de opacidade. */
.s8__erro {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 1.25rem;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--color-danger);
}

.s8__erro-ico {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.s8__ctas {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .s8__ctas {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }
}

.s8__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* Alvo de toque. */
  min-height: 48px;
  padding: 0 1.75rem;
  background-color: var(--color-primary);
  color: var(--color-branco);
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  /* Declarado junto porque este shorthand substitui o de [data-pressable]. */
  transition:
    transform var(--dur-press) var(--ease-fluid),
    background-color var(--dur-tooltip) ease;
}

@media (hover: hover) and (pointer: fine) {
  .s8__cta:hover {
    background-color: var(--color-noite);
  }
}

.s8__nav {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

/* ALVO DE TOQUE. Medido num 390×844: estes links têm 17px de altura — reprovam até o
   piso AA de 24px do WCAG 2.5.8, e o sistema já exige 48px nos CTAs (.s8__cta, .s7__cta).
   O padding entra só em ponteiro grosso, do mesmo jeito que o :hover só entra em ponteiro
   fino: no desktop o ritmo da coluna fica idêntico ao que era.
   O gap vai a zero junto porque os alvos passam a encostar — 17+24 = 41px de passo contra
   os 31px de antes, e sem faixa morta entre um link e o outro. */
@media (pointer: coarse) {
  .s8__link,
  .s8__meta-link {
    padding-block: 0.75rem;
  }

  .s8__nav {
    gap: 0;
  }
}

@media (min-width: 1024px) {
  .s8__nav {
    align-items: flex-end;
    text-align: right;
  }
}

/* SEM text-decoration: none aqui. Ele tem a MESMA especificidade que [data-hoverable]
   (uma classe contra um atributo) e é declarado depois — o scoped do componente vem
   depois do global —, então vencia por ordem de cascata e matava o sublinhado de hover.
   Quem governa a decoração destes links é [data-hoverable] no tailwind.css: underline
   com text-decoration-color transparent em repouso, que pinta igual a `none`. */
.s8__link {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-fg);
}

/* ---- Fecho em sangue ---- */

.s8__fecho {
  overflow: hidden;
}

.s8__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.75rem clamp(1.5rem, 4vw, 3rem) 1rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  /* Sobre sangue só existe #FFFFFF: prata dá 4,48:1 e reprova por 0,02, e opacidade em
     texto dá 3,68:1. A herança de [data-surface="sangue"] já resolve fg para branco. */
  color: var(--color-fg);
}

/* Mesmo motivo de .s8__link: o `none` daqui vencia [data-hoverable] por ordem. O <p> do
   copyright não é link e não tem decoração para herdar, então sai da regra sem efeito. */
.s8__copy,
.s8__meta-link {
  color: inherit;
}

/* Fecho arquitetônico. O invariante "wordmark edge-to-edge" veio de uma referência com
   LOGOTIPO DE UMA LINHA: ali largura total dá uma faixa de ~150px. O wordmark daqui é
   empilhado em duas linhas (proporção 1,535), então largura total renderiza 1021px num
   viewport de 698px — a linha JAZZ sai da tela e o bloco deixa de ler como fecho.
   Por isso o teto de altura: a marca continua dominante e sangra até onde a proporção
   permite, mas cabe na tela inteira. */
.s8__wordmark {
  display: block;
  width: 100%;
  max-height: min(56vh, 430px);
  margin-bottom: -1.5%;
}

/* A antiga "vibração nº 3 de 3" (ouro sobre vermelho, 1,83:1, ilegível de propósito) foi
   aposentada junto com o acento cromático. Branco é a única tinta que a regra dura do
   sistema permite sobre sangue (5,57:1, legível) — o mesmo valor que [data-surface="sangue"]
   .jm-wordmark já cascateia de Wordmark.vue; a regra fica aqui explícita, e não implícita
   por herança, porque este é o único lugar do site onde o wordmark sangra a tela inteira.
   :deep porque .jm-wordmark vive no escopo do BrandWordmark. */
.s8__wordmark :deep(.jm-wordmark),
.s8__wordmark.jm-wordmark {
  background-color: var(--color-branco);
}

/* Sem bloco de prefers-reduced-motion aqui: não sobrou transition de CENA em CSS para
   desligar. O ramo reduzido agora é explícito no JS ($prefersReducedMotion) e o bloco
   global do tailwind.css continua como rede de segurança. O :active scale(.97) dos CTAs
   é feedback, não decoração — e por isso fica em CSS, onde sobrevive aos dois. */
</style>
