<template>
  <UiSection
    surface="papel"
    fill="solid"
    padding="xl"
    aria-labelledby="arquivo-titulo"
  >
    <div ref="raiz">
      <UiContainer size="lg">
        <!-- ABERTURA — título LÍRICO em duas linhas, legendas REGISTRO nos extremos. -->
        <header class="abertura">
          <h2 id="arquivo-titulo" ref="tituloRef" class="titulo">
            <span class="titulo-linha">Cada carta é uma</span>
            <span class="titulo-linha">pergunta melhor feita</span>
          </h2>

          <p class="legendas">
            <span class="legenda">Antes de você tirar</span>
            <span class="legenda">O que você já sabe está aqui</span>
          </p>
        </header>

        <!-- CARROSSEL — sem pin, sem autoplay, sem pontinhos (docs/prd/S5 §5). -->
        <div class="palco">
          <div class="janela">
            <ul
              ref="trilha"
              class="trilha"
              role="group"
              aria-roledescription="carrossel"
              aria-label="Arquivo do tarô — doze leituras"
              tabindex="0"
              @keydown="aoTeclar"
              @focusin="aoFocarDentro"
              @dragstart.prevent
            >
              <li
                v-for="(item, i) in ITENS"
                :key="item.nome"
                class="item"
                role="group"
                aria-roledescription="item do arquivo"
                :aria-label="`${i + 1} de ${TOTAL}: ${item.nome}`"
                :inert="i !== indice || undefined"
              >
                <!-- SEM fundo: os cacos boiam sobre o papel da seção e os vãos entre eles
                     são a própria superfície — é assim que lê como fragmento. Com um card
                     escuro atrás, os quatro recortes quase ladrilhavam o retângulo e o vão
                     virava massa sólida (verificado no browser).
                     Só o primeiro caco carrega o alt — os outros são repetição visual da
                     mesma imagem e seriam ruído no leitor de tela. -->
                <figure class="carta">
                  <div
                    v-for="(recorte, e) in ESTILHACOS"
                    :key="e"
                    class="estilhaco"
                    :class="`estilhaco--${e}`"
                    :style="{ clipPath: recorte }"
                    :aria-hidden="e > 0 || undefined"
                  >
                    <NuxtImg
                      :src="item.foto"
                      :alt="e === 0 ? item.alt : ''"
                      :width="item.w"
                      :height="item.h"
                      :style="{ objectPosition: item.pos }"
                      :loading="i === 0 ? 'eager' : 'lazy'"
                      class="estilhaco-foto"
                      format="webp"
                      sizes="94vw md:90vw lg:1120px"
                      draggable="false"
                    />
                  </div>
                </figure>

                <div class="identidade">
                  <h3 class="nome">{{ item.nome }}</h3>

                  <!-- Ficha de 4 campos, sempre na mesma ordem e sempre presentes:
                       é o layout constante que faz 12 entradas lerem como catálogo. -->
                  <dl class="ficha">
                    <div v-for="(rotulo, c) in ROTULOS" :key="rotulo" class="campo">
                      <dt class="campo-rotulo">{{ rotulo }}</dt>
                      <dd class="campo-valor">{{ item.campos[c] ?? '—' }}</dd>
                    </div>
                  </dl>
                </div>
              </li>
            </ul>
          </div>

          <div class="controles">
            <div class="setas">
              <button
                type="button"
                class="seta"
                data-pressable
                aria-label="Item anterior"
                :aria-disabled="indice === 0 || undefined"
                @click="irPara(indice - 1)"
              >
                <span aria-hidden="true">‹</span>
              </button>
              <button
                type="button"
                class="seta"
                data-pressable
                aria-label="Próximo item"
                :aria-disabled="indice === TOTAL - 1 || undefined"
                @click="irPara(indice + 1)"
              >
                <span aria-hidden="true">›</span>
              </button>
            </div>

            <!-- O anúncio vive num nó sem transição: com o cross-fade visual o nó que
                 sai ficaria no DOM e a região live leria os dois números. -->
            <p class="contador">
              <span class="sr-only" aria-live="polite">Item {{ indice + 1 }} de {{ TOTAL }}</span>
              <span class="contador-visor" aria-hidden="true">
                <Transition name="cont">
                  <span :key="indice" class="contador-num">{{ contador }}</span>
                </Transition>
              </span>
            </p>
          </div>
        </div>
      </UiContainer>
    </div>
  </UiSection>
</template>

<script lang="ts" setup>
// S5 · ARQUIVO DO TARÔ — docs/prd/S5-arquivo-taro.md
//
// O carrossel é GSAP Draggable + InertiaPlugin. A versão anterior era ponteiro na mão
// porque o autor concluiu que o Draggable não expunha o que o PRD pede; expõe:
//   captura de ponteiro e proteção multi-toque → nativos do Draggable
//   atrito de borda (35% ainda passam)         → edgeResistance 0.65
//   200ms entra / 140ms sai                    → maxDuration / minDuration do arremesso
//   teclado não anima                          → $gsap.set() em vez de $gsap.to()
// A decisão de animar ou não continua nossa: o Draggable só governa o gesto de arrasto.

const TOTAL = 12
const DUR_ENTRA = 0.2 // s — um item novo entra: devagar onde o usuário decide o que olhar
const DUR_SAI = 0.14 // s — o sistema devolve o item ao lugar: saída sempre mais rápida
const ATRITO_BORDA = 0.65 // edgeResistance: 1 − 0,65 = os 35% que ainda andam além da borda
const VEL_MINIMA = 0.11 // px/ms (= 110 px/s): velocidade dispensa distância
const FRACAO_LIMIAR = 0.18 // ou 18% da largura, para o arrasto lento e longo

const ROTULOS = ['Baralho', 'Formato', 'Duração', 'Modalidade'] as const

// Quatro recortes de aresta reta ao redor de um vazio central. Os índices 0 e 3 são
// as lascas grandes: são as duas que sobrevivem abaixo de 768px.
const ESTILHACOS = [
  'polygon(0% 0%, 30% 0%, 22% 100%, 0% 100%)',
  'polygon(34% 0%, 58% 0%, 52% 34%, 30% 40%)',
  'polygon(32% 62%, 55% 56%, 60% 100%, 36% 100%)',
  'polygon(64% 6%, 100% 0%, 100% 100%, 70% 100%)'
] as const

// campos = [baralho, formato, duração, modalidade]. null vira travessão na renderização
// — o campo some do conteúdo, nunca do layout.
const ITENS: ReadonlyArray<{
  nome: string
  foto: string
  w: number
  h: number
  pos: string
  alt: string
  campos: readonly (string | null)[]
}> = [
  {
    nome: 'A Lua',
    foto: '/images/site/arquivo/01.jpg',
    w: 2592,
    h: 3888,
    pos: '50% 38%',
    alt: 'Cartas de tarô abertas sobre a mesa de leitura, banhadas em luz magenta.',
    campos: ['Rider-Waite', 'Leitura de 3 cartas', '60 min', 'Presencial']
  },
  {
    nome: 'O Sol',
    foto: '/images/site/arquivo/02.jpg',
    w: 2592,
    h: 3888,
    pos: '50% 38%',
    alt: 'Mão pousada sobre o baralho durante a leitura, em penumbra magenta.',
    campos: ['Thoth', 'Cruz celta', '90 min', 'Presencial']
  },
  {
    nome: 'A Estrela',
    foto: '/images/site/arquivo/03.jpg',
    w: 2369,
    h: 3553,
    pos: '50% 40%',
    alt: 'Cartas e velas acesas na mesa de leitura, em luz dourada.',
    campos: ['Marselha', 'Leitura de 3 cartas', '45 min', 'Online']
  },
  {
    nome: 'A Sacerdotisa',
    foto: '/images/site/arquivo/04.jpg',
    w: 2592,
    h: 3888,
    pos: '50% 38%',
    alt: 'Baralho fechado ao lado de cristais, sob iluminação magenta.',
    campos: ['Rider-Waite', 'Tiragem de ano', '120 min', 'Presencial']
  },
  {
    nome: 'O Eremita',
    foto: '/images/site/arquivo/05.jpg',
    w: 2592,
    h: 3888,
    pos: '50% 42%',
    alt: 'Uma única carta isolada sobre tecido escuro, recortada em luz magenta.',
    campos: ['Marselha', 'Carta única', '30 min', 'Online']
  },
  {
    // Paisagem dentro de card largo: o recorte sobe para não perder a mesa.
    nome: 'A Torre',
    foto: '/images/site/arquivo/06.jpg',
    w: 4898,
    h: 3265,
    pos: '50% 44%',
    alt: 'Mesa de leitura vista de cima, tomada por luz vermelha.',
    campos: ['Thoth', 'Cruz celta', '90 min', 'Híbrido']
  },
  {
    nome: 'A Roda da Fortuna',
    foto: '/images/site/arquivo/07.jpg',
    w: 2592,
    h: 3888,
    pos: '50% 38%',
    alt: 'Cartas dispostas em leque sobre madeira, em luz dourada.',
    campos: ['Rider-Waite', 'Ferradura', '75 min', 'Presencial']
  },
  {
    nome: 'A Imperatriz',
    foto: '/images/site/arquivo/08.jpg',
    w: 2464,
    h: 3696,
    pos: '50% 38%',
    alt: 'Incenso queimando ao lado das cartas durante a leitura, em tons dourados.',
    campos: ['Marselha', 'Leitura de 3 cartas', '60 min', 'Online']
  },
  {
    nome: 'O Enforcado',
    foto: '/images/site/arquivo/09.jpg',
    w: 2592,
    h: 3888,
    pos: '50% 42%',
    alt: 'Carta virada para cima projetando sombra longa, em luz magenta.',
    campos: ['Thoth', 'Carta única', '30 min', null]
  },
  {
    // Paisagem: o centro é o único enquadramento que não corta a bancada.
    nome: 'A Temperança',
    foto: '/images/site/arquivo/10.jpg',
    w: 3805,
    h: 2537,
    pos: '50% 50%',
    alt: 'Bancada da leitura em plano aberto, em luz dourada.',
    campos: ['Rider-Waite', 'Tiragem de ano', '120 min', 'Híbrido']
  },
  {
    nome: 'O Julgamento',
    foto: '/images/site/arquivo/11.jpg',
    w: 2592,
    h: 3888,
    pos: '50% 38%',
    alt: 'Cartas empilhadas junto a uma vela acesa, em luz âmbar.',
    campos: ['Marselha', 'Ferradura', '75 min', 'Presencial']
  },
  {
    nome: 'O Mundo',
    foto: '/images/site/arquivo/12.jpg',
    w: 2592,
    h: 3888,
    pos: '50% 40%',
    alt: 'Leitura em curso: mãos e cartas sobre a mesa, em luz magenta.',
    campos: ['Rider-Waite', 'Cruz celta', '90 min', 'Presencial']
  }
]

const { $gsap, $ScrollTrigger, $Draggable, $prefersReducedMotion } = useNuxtApp()

const raiz = ref<HTMLElement | null>(null)
const tituloRef = ref<HTMLElement | null>(null)
const trilha = ref<HTMLUListElement | null>(null)

useMaskReveal(tituloRef, { stagger: 0.07 })

const indice = ref(0)
const contador = computed(() => `${String(indice.value + 1).padStart(2, '0')} / ${TOTAL}`)

let ctx: gsap.Context | null = null
let arrastavel: Draggable | null = null
let reduzido = false

const limitar = (i: number) => Math.min(TOTAL - 1, Math.max(0, i))

// A trilha tem a largura de uma janela e os 12 itens transbordam dela — logo clientWidth
// é a largura de UM item, e é dela que sai toda a matemática de posição e snap.
const larguraItem = () => trilha.value?.clientWidth ?? 0

// Tweens de interação nascem depois do onMounted; ctx.add() os registra no mesmo contexto
// para que um único ctx.revert() no unmount mate tudo.
function noContexto(fn: () => void) {
  if (ctx) ctx.add(fn)
  else fn()
}

/* ---------- ESTILHAÇOS ---------- */

// A seção tem 48 estilhaços (4 × 12 itens). Um ScrollTrigger por caco seriam 48 gatilhos
// vivos para uma cena que roda uma vez por item — monta-se sob demanda, só o item que
// entra em cena, e o Set garante que ninguém remonta ao voltar.
const montados = new Set<number>()

function montarEstilhacos(i: number) {
  // Movimento reduzido: estado final direto. O CSS/SSR já entrega o caco montado, então
  // aqui não há nada a fazer — é literalmente a ausência do tween.
  if (reduzido || i < 0 || i >= TOTAL || montados.has(i)) return
  montados.add(i)

  const item = trilha.value?.children[i]
  if (!item || !$gsap) return

  noContexto(() => {
    // fromTo e não from: o valor final também é escrito à mão porque o computed do
    // clip-path volta em px e o GSAP interpola número a número usando as unidades do
    // destino — 100% viraria 100px e o caco se revelaria só na base. Ambos em %.
    // Os 1,5s são a única lentidão do sistema: o estilhaço está se montando, não
    // respondendo a você.
    $gsap.fromTo(
      item.querySelectorAll('.estilhaco-foto'),
      { clipPath: 'inset(0% 0% 100% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, stagger: 0.06 }
    )
    // O repouso de 0,5s: o caco assenta no último terço da montagem. O from() rende o
    // estado inicial já no primeiro frame (immediateRender), então o delay não produz
    // salto em t=1s — o caco nasce deslocado e só então acomoda.
    $gsap.from(item.querySelectorAll('.estilhaco'), {
      y: 8,
      scale: 0.98,
      duration: 0.5,
      delay: 1,
      // Sem isto sobra matrix() inline em até 48 divs (4 cacos × 12 itens) depois que a
      // montagem termina. O fromTo de clip-path acima não precisa: o valor final dele é
      // idêntico ao do CSS; este transform não tem contrapartida e nunca seria devolvido.
      clearProps: 'transform'
    })
  })
}

/* ---------- POSIÇÃO DA TRILHA ---------- */

// Por 200ms os dois itens se sobrepõem e o olho enxerga dois objetos; 2px de blur funde
// os dois e ele lê um movimento só. clearProps derruba a camada de composição no fim —
// nada de filter pendurado num elemento parado.
function borrar() {
  const tr = trilha.value
  // Movimento reduzido não recebe: blur é movimento disfarçado de foco.
  if (!tr || !$gsap || reduzido) return
  noContexto(() => {
    $gsap.fromTo(
      tr,
      { filter: 'blur(2px)', opacity: 0.7 },
      {
        filter: 'blur(0px)',
        opacity: 1,
        duration: DUR_ENTRA,
        // 'auto' só mata as props em conflito (filter/opacity): quem faz swipe faz três
        // seguidos e o blur precisa retargetar sem derrubar o tween de posição.
        overwrite: 'auto',
        clearProps: 'filter,opacity'
      }
    )
  })
}

function irPara(alvo: number, { animar = true } = {}) {
  const tr = trilha.value
  const i = limitar(alvo)
  const mudou = i !== indice.value
  indice.value = i
  if (!tr || !$gsap) return

  // A montagem dos estilhaços é a animação-assinatura da seção e antes só rodava no
  // arrasto: quem usava os botões ‹ ›, as setas, Home/End ou o Tab via os itens 2 a 12
  // aparecerem inteiros, porque o estado final do clip-path é o que o CSS entrega.
  //
  // SÓ o item de destino, nunca os vizinhos: aqui o item ENTRA de uma vez, então montar
  // na chegada é o que põe os 1,5s de clip-path na tela. Pré-montar vizinho faria a
  // montagem tocar fora do viewport e o item chegaria pronto — que é justamente o
  // sintoma que estamos corrigindo. A pré-montagem de vizinho continua no onPress do
  // arrasto, onde ela faz sentido: ali o caco vizinho é visível enquanto desliza.
  montarEstilhacos(i)

  const x = -i * larguraItem()

  // Ação iniciada por teclado ou foco não anima: quem navega assim repete o gesto, e
  // 200ms em ação repetida viram atraso percebido e desconexão entre tecla e resultado.
  // Mesmo componente, mesmo destino — set() em vez de to().
  if (!animar || reduzido) {
    $gsap.set(tr, { x })
    arrastavel?.update()
    return
  }

  noContexto(() => {
    $gsap.to(tr, {
      x,
      duration: mudou ? DUR_ENTRA : DUR_SAI,
      overwrite: 'auto',
      onComplete: () => arrastavel?.update()
    })
  })
  if (mudou) borrar()
}

/* ---------- ARRASTO ---------- */

let t0 = 0
let iAoPressionar = 0

const limites = () => ({ minX: -(TOTAL - 1) * larguraItem(), maxX: 0 })

function aoPressionar() {
  const tr = trilha.value
  if (!tr) return
  tr.dataset.arrastando = ''
  t0 = performance.now()
  iAoPressionar = indice.value
  // Os vizinhos entram em cena durante o arrasto: monta os cacos deles agora, para que
  // cheguem já se montando em vez de aparecerem prontos e reiniciarem na soltura.
  montarEstilhacos(iAoPressionar - 1)
  montarEstilhacos(iAoPressionar + 1)
}

// Chamada uma vez, quando o InertiaPlugin monta o arremesso na soltura. Decide o item e
// devolve o x de destino — é aqui que o índice reativo sincroniza (aria-live e inert
// reagem à soltura, não ao fim da animação).
function ondeParar() {
  const w = larguraItem()
  const dx = (arrastavel?.x ?? 0) + iAoPressionar * w
  const velocidade = Math.abs(dx) / Math.max(performance.now() - t0, 1)
  // Velocidade dispensa distância: 0,11 px/ms = 110 px/s, calibrado para que um peteleco
  // de 40px em 200ms avance. O InertiaPlugin tem a própria noção de velocidade, mas ela
  // é física pura (v²/2r) e num item de 1120px um peteleco curto não chegaria à metade —
  // quem decide o destino é este limiar, o InertiaPlugin só o executa.
  const disparou = dx !== 0
    && (Math.abs(dx) >= w * FRACAO_LIMIAR || velocidade > VEL_MINIMA)
  const alvo = limitar(iAoPressionar + (disparou ? (dx < 0 ? 1 : -1) : 0))

  if (alvo !== indice.value) {
    indice.value = alvo
    borrar()
  }
  return -alvo * w
}

// x é pixel (o Draggable move pixels, não porcentagem), então redimensionar exige
// recolocar a trilha e reavaliar os limites.
function reposicionar() {
  const tr = trilha.value
  if (!tr || !$gsap) return
  // Nunca no meio de um gesto: um gsap.set() de x pelas costas do Draggable durante o
  // arrasto ou o arremesso arranca a trilha da mão do usuário, e o tween de inércia em voo
  // termina num alvo calculado com a largura ANTIGA. O onThrowComplete abaixo chama isto de
  // novo quando o arremesso acaba, então o redimensionamento não se perde — só espera.
  if (arrastavel?.isPressed || arrastavel?.isThrowing) return
  $gsap.set(tr, { x: -indice.value * tr.clientWidth })
  arrastavel?.applyBounds(limites())
  arrastavel?.update()
}

/* ---------- TECLADO ---------- */

const PASSOS: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 }

function aoTeclar(e: KeyboardEvent) {
  const passo = PASSOS[e.key]
  if (passo !== undefined) {
    e.preventDefault()
    irPara(indice.value + passo, { animar: false })
    return
  }
  if (e.key === 'Home') {
    e.preventDefault()
    irPara(0, { animar: false })
  } else if (e.key === 'End') {
    e.preventDefault()
    irPara(TOTAL - 1, { animar: false })
  }
}

// Foco que cai dentro de um item (Tab, busca da página) sincroniza o carrossel na
// hora — pela mesma razão do teclado, sem transição.
function aoFocarDentro(e: FocusEvent) {
  const alvo = (e.target as HTMLElement | null)?.closest?.('li')
  const el = trilha.value
  if (!alvo || !el) return
  const i = [...el.children].indexOf(alvo)
  if (i >= 0 && i !== indice.value) irPara(i, { animar: false })
}

/* ---------- MONTAGEM ---------- */

onMounted(() => {
  const el = raiz.value
  const tr = trilha.value
  if (!el || !tr || !$gsap) return

  reduzido = $prefersReducedMotion?.() ?? false

  ctx = $gsap.context(() => {
    // Reveal da abertura. from() e não to(): o estado final é o que o SSR já entregou,
    // então sem JS a legenda continua legível. Com movimento reduzido sobra a opacidade
    // (200ms) — ela é o que explica que algo mudou.
    // fromTo com destino EXPLÍCITO, e sem `delay`.
    //
    // `.from({opacity: 0})` faz o GSAP ler o destino do DOM ao inicializar, e medido em
    // 2026-08-03 ele lia 0 — o próprio estado inicial recém-escrito. O tween virava
    // `0 → 0` e as duas legendas ficavam invisíveis para sempre, com o gatilho em
    // progresso 1. Destino escrito à mão não tem o que reler.
    // O `delay: 0.2` também saiu: sob scrub ele é código morto (o ScrollTrigger pausa o
    // tween e o conduz por totalProgress, que não inclui delay). Quem escalona é o stagger.
    $gsap.fromTo(
      '.legenda',
      { opacity: 0 },
      {
        opacity: 1,
        duration: reduzido ? 0.2 : 0.3,
        stagger: 0.06,
        scrollTrigger: cenaScrub(el)
      }
    )

    // Este continua `once`, e é a única exceção do site — não é reveal, é MONTAGEM de DOM.
    // Os estilhaços são 4 camadas × 12 itens; ligá-lo à rolagem faria o navegador montar e
    // desmontar 48 nós toda vez que o leitor subisse e descesse a seção. Uma vez montado,
    // o que anima ali é o arrasto, que já é reversível por natureza.
    $ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => montarEstilhacos(indice.value)
    })

    arrastavel = $Draggable.create(tr, {
      type: 'x',
      inertia: true,
      cursor: 'grab',
      activeCursor: 'grabbing',
      zIndexBoost: false,
      bounds: limites(),
      // Atrito, nunca parede: no primeiro e no último item o arrasto continua com
      // resistência crescente e volta. Coisa nenhuma no mundo real para de repente.
      edgeResistance: ATRITO_BORDA,
      // A duração é do PRD, não da física: o InertiaPlugin decide PARA ONDE ir a partir
      // do gesto, o sistema de movimento decide EM QUANTO TEMPO. Devolver ao lugar é o
      // arremesso curto (140ms), entrar um item é o longo (200ms).
      minDuration: reduzido ? 0 : DUR_SAI,
      maxDuration: reduzido ? 0 : DUR_ENTRA,
      overshootTolerance: 0,
      snap: { x: ondeParar },
      onPress: aoPressionar,
      onRelease: () => { delete tr.dataset.arrastando },
      // reposicionar() é superset de update() e cobre o resize que o guard adiou.
      onThrowComplete: reposicionar
    })[0] ?? null
  }, el)

  window.addEventListener('resize', reposicionar)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', reposicionar)
  // Um revert só: o contexto recolheu os tweens de reveal, os de interação (via
  // noContexto) e o próprio Draggable.
  ctx?.revert()
  ctx = null
  arrastavel = null
})
</script>

<style scoped>
/* ============================ ABERTURA ============================ */
.abertura {
  display: grid;
  gap: clamp(1.5rem, 3vw, 2.5rem);
}

.titulo {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(3rem, 6.5vw, 5.5rem);
  line-height: 1.02;
  text-align: center;
  /* sangue sobre papel: 5,23:1 */
  color: var(--color-primary-text);
}

.titulo-linha {
  display: block;
}

.legendas {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem 2rem;
  margin: 0;
}

/* Sem opacity: 0 aqui — o estado final é o que o servidor entrega, e o GSAP promove a
   partir dele. Sem JS o texto continua visível para crawler e leitor de tela. */
.legenda {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  /* tinta sobre papel: 19,43:1 */
  color: var(--color-fg);
}

.legenda:last-child {
  text-align: right;
}

/* ============================ CARROSSEL ============================ */
.palco {
  margin-top: clamp(3rem, 8vw, 6rem);
}

.janela {
  overflow: hidden;
}

/* O foco vive na trilha (ela é o carrossel), mas a trilha desliza para fora da janela
   — o contorno seria desenhado fora da tela. O anel vai para a moldura, que não se move. */
.janela:has(.trilha:focus-visible) {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}

.trilha:focus-visible {
  outline: none;
}

/* Sem transition e sem will-change: a posição é do GSAP agora (transition CSS e tween
   no mesmo transform brigariam por frame), e o GSAP promove a camada só enquanto anima. */
.trilha {
  display: flex;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  /* o scroll vertical da página segue livre; o horizontal é nosso */
  touch-action: pan-y;
}

/* O cursor é do Draggable (cursor/activeCursor); aqui fica só o que ele não cobre. */
.trilha[data-arrastando] {
  user-select: none;
}

.item {
  flex: 0 0 100%;
  min-width: 0;
  display: grid;
  gap: clamp(1.25rem, 3vw, 2rem);
  align-content: start;
}

/* ---------- card da foto ---------- */
.carta {
  position: relative;
  margin: 0;
  /* altura em vw (não vh): a barra de endereço do celular não mexe nela, logo não há CLS */
  height: clamp(300px, 42vw, 520px);
  overflow: hidden;
  /* SEM fundo: os cacos boiam sobre o papel da seção e os vãos entre eles são a própria
     superfície — é assim que a referência lê como fragmentos.
     Com um card escuro atrás, os quatro recortes quase ladrilham o retângulo e o vão vira
     uma forma sólida no meio, não espaço negativo. O contraste da foto contra o papel foi
     medido para os 12 itens: 4,14:1 no pior caso (docs/prd/91-assets.md §2). */
  background-color: transparent;
  user-select: none;
}

.estilhaco {
  position: absolute;
  inset: 0;
}

/* Estado final, não inicial: o clip aberto é o que o SSR entrega e o que sobra se o JS
   falhar. A montagem de 1,5s é o GSAP tirando o caco daqui e trazendo de volta. */
.estilhaco-foto {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  clip-path: inset(0% 0% 0% 0%);
}

/* ---------- nome + ficha ---------- */
.identidade {
  display: grid;
  gap: clamp(1rem, 2.5vw, 2rem);
}

.nome {
  margin: 0;
  /* LÍRICO: "A Lua", "O Sol" são nome próprio, e nome pede a serifada mais estreita.
     O tier DISPLAY (Lastik) fica com a abertura da seção, que é frase e escala
     grande — as duas convivem porque estão em degraus diferentes da hierarquia. */
  font-family: var(--font-lirico);
  font-size: clamp(2.5rem, 5vw, 4rem);
  line-height: 1.02;
  color: var(--color-primary-text);
}

.ficha {
  display: grid;
  gap: 0.65rem 1.5rem;
  margin: 0;
}

.campo {
  display: grid;
  gap: 0.15rem;
}

.campo-rotulo {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  /* 7,6:1 sobre papel */
  color: var(--color-fg-muted);
}

.campo-valor {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-fg);
}

/* ---------- controles ---------- */
.controles {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: clamp(1.5rem, 3vw, 2.5rem);
}

.setas {
  display: flex;
  gap: 0.75rem;
}

.seta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border: 1px solid var(--color-primary-text);
  border-radius: 999px;
  background: transparent;
  /* sangue sobre papel: 5,23:1 */
  color: var(--color-primary-text);
  font-family: var(--font-mono);
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  /* transform declarado aqui porque a shorthand sobrescreveria a de [data-pressable] */
  transition:
    transform var(--dur-press) var(--ease-fluid),
    background-color var(--dur-tooltip) ease,
    color var(--dur-tooltip) ease;
}

/* 0,45 e não 0,35: a 0,35 o anel de 1px sobre papel some quase por completo e o par de
   setas lê como UMA seta, não como uma seta desligada — o controle perde a forma antes de
   perder a função. Continua inequivocamente desabilitado (o par lado a lado dá a
   referência) e o alvo de 48px permanece. */
.seta[aria-disabled='true'] {
  opacity: 0.45;
  cursor: default;
}

@media (hover: hover) and (pointer: fine) {
  .seta:not([aria-disabled='true']):hover {
    background-color: var(--color-primary);
    /* única tinta permitida sobre sangue: 5,57:1 */
    color: var(--color-branco);
  }
}

.contador {
  margin: 0;
}

.contador-visor {
  position: relative;
  display: inline-block;
  min-width: 8ch;
  font-family: var(--font-mono);
  /* tinta a 50% sobre papel dá 3,68:1 — passa como texto grande e reprovaria como
     corpo, então o contador nunca desce de 24px. */
  font-size: clamp(1.5rem, 2.4vw, 1.875rem);
  letter-spacing: 0.08em;
  line-height: 1;
  text-align: right;
  color: var(--color-fg);
  opacity: 0.5;
}

.contador-num {
  display: block;
}

.cont-enter-active,
.cont-leave-active {
  transition: opacity var(--dur-tooltip) ease;
}

.cont-leave-active {
  position: absolute;
  inset: 0;
}

.cont-enter-from,
.cont-leave-to {
  opacity: 0;
}

/* ============================ RESPONSIVO ============================ */
/* < 768px: dois estilhaços em vez de quatro (sobram as duas lascas grandes). */
@media (max-width: 767px) {
  .estilhaco--1,
  .estilhaco--2 {
    display: none;
  }
}

/* 768–1279px: a ficha desce para baixo do nome, em duas colunas. */
@media (min-width: 768px) and (max-width: 1279px) {
  .ficha {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* ≥ 1280px: a ficha vira coluna à direita do nome. */
@media (min-width: 1280px) {
  .identidade {
    grid-template-columns: minmax(0, 1fr) minmax(16rem, 20rem);
    align-items: start;
  }
}

/* ======================== MOVIMENTO REDUZIDO ========================
   O resto da seção é GSAP e decide em JS ($prefersReducedMotion): trilha instantânea,
   estilhaços no estado final, blur removido. Aqui sobra o que continua em CSS. */
@media (prefers-reduced-motion: reduce) {
  /* O contador é informação, não decoração: o cross-fade fica, e o bloco global de
     tailwind.css zeraria a duração com !important. */
  .cont-enter-active,
  .cont-leave-active {
    transition-duration: var(--dur-tooltip) !important;
  }
}
</style>
