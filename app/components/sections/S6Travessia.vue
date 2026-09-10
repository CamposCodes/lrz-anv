<template>
  <!-- A única passagem claro↔escuro do site. Interpolar papel→sangue com o texto à mostra
       derruba o contraste a 1,10:1 no meio do caminho (docs/prd/S6-travessia.md §1): não é
       problema de tempo nem de easing, é problema de existir um meio inválido entre as duas
       cores. A solução é não passar pelo meio à mostra — cobre, troca, descobre. -->
  <div ref="raiz" :data-fase="fase">
    <UiSection :surface="superficie" padding="xl">
      <UiContainer size="md">
        <div ref="conteudo" class="frases text-center">
          <!-- As duas frases ocupam a MESMA célula do grid: a altura da seção não muda na
               troca (zero CLS) e o servidor entrega as duas no HTML. A segunda nasce em
               opacity 0, mas está no DOM e na árvore de acessibilidade desde o SSR — leitor
               de tela e crawler não esperam a animação (§7). -->
          <UiHeading as="p" :level="2" class="frase" data-quando="antes">
            Doze entradas. Nenhuma resposta pronta.
          </UiHeading>
          <UiHeading as="p" :level="2" class="frase" data-quando="depois">
            O que sobra vira objeto.
          </UiHeading>
        </div>
      </UiContainer>
    </UiSection>

    <!-- Fora da <UiSection> de propósito: ela carrega `isolate`, que abre contexto de
         empilhamento e prenderia este overlay abaixo do header (z-50). As "três vibrações"
         (acento deliberadamente ilegível sobre vermelho) morreram com o ouro: em
         preto/branco/vermelho o par mais fraco que resta é 3,72:1, longe de ilegível. Os
         discos agora são preto (--color-noite): durante o FECHA eles cobrem o papel ainda
         visível atrás, e branco ali quase desapareceria (papel é quase branco); preto dá
         19,43:1 e se vê claramente. Durante o ABRE, o mesmo preto sobre o sangue já trocado
         é o par mais fraco do sistema (3,72:1) — mas para uma forma grande e decorativa,
         não texto, isso já basta para ler como disco distinto. -->
    <div class="eclipse" aria-hidden="true">
      <span ref="discoEsq" class="disco disco--esq" />
      <span ref="discoDir" class="disco disco--dir" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { $gsap, $ScrollTrigger, $prefersReducedMotion } = useNuxtApp()

// Estado renderizado pelo servidor = estado ANTES da travessia. S7 já nasce em sangue;
// esta seção é a dobradiça que justifica a emenda.
const superficie = ref<'papel' | 'sangue'>('papel')
const fase = ref<'antes' | 'depois'>('antes')

const raiz = ref<HTMLElement | null>(null)
const conteudo = ref<HTMLElement | null>(null)
const discoEsq = ref<HTMLElement | null>(null)
const discoDir = ref<HTMLElement | null>(null)

// Marcas da sequência, em segundos. FECHA é rápido (o sistema escondendo o truque) e ABRE
// é mais lento (a revelação, que o usuário quer ver) — inversão deliberada da regra geral
// de "saída mais rápida que entrada" (docs/prd/S6-travessia.md §4).
const FECHA = 0.5
const ABRE = 0.6
// TOTAL saiu: ele só servia ao clearProps que fechava a timeline, e a marca do corte agora
// é derivada de tl.duration() — que é a mesma soma, lida do objeto em vez de recalculada.

let ctx: { revert: () => void } | null = null

// O corte — o único lugar do componente que muda a superfície. A troca é reativa e o Vue
// faz flush em microtask: ela pinta no MESMO quadro em que o callback rodou (microtask
// corre depois do rAF do GSAP e antes do paint), então em nenhum momento existe texto
// sobre superfície em transição. Fora da sequência, é chamado direto para nascer já do
// outro lado.
const troca = () => {
  superficie.value = 'sangue'
  fase.value = 'depois'
}

onMounted(() => {
  const el = raiz.value
  const bloco = conteudo.value
  if (!el || !bloco) return

  // Sem GSAP não há gatilho — entra direto no estado final para não deixar uma emenda
  // papel/sangue crua entre esta seção e S7.
  if (!$gsap || !$ScrollTrigger) {
    troca()
    return
  }

  // NÃO existe mais atalho de "nasceu abaixo da seção".
  //
  // Havia um `if (rect.top < innerHeight * 0.6) { troca(); return }` aqui, herdado de
  // quando a cena era `once`: ele evitava um eclipse de tela cheia disparando sobre
  // conteúdo já em leitura. Com scrub esse risco não existe — em progresso 0 E em
  // progresso 1 os discos estão no repouso, fora da tela, então criar o gatilho já
  // passado não pisca nada. Em compensação o atalho cobrava caro: qualquer F5 com scroll
  // restaurado abaixo de S6 (o navegador restaura ANTES da hidratação) deixava a página
  // sem gatilho nenhum pela carga inteira — subindo de volta, S5 ficava papel e S6 sangue,
  // emenda crua, e [data-fase] travado em "depois". E o limiar 0,6 caía DENTRO do curso do
  // próprio gatilho (0,85 → 0,25): montar ali matava a cena no meio dela.
  //
  // Quem sincroniza o estado inicial agora é o onRefresh do gatilho, abaixo.
  const reduzido = $prefersReducedMotion?.() ?? false

  ctx = $gsap.context(() => {
    // O CORTE é derivado do playhead da TIMELINE, não do progresso do gatilho.
    //
    // São dois relógios diferentes: `self.progress` do ScrollTrigger é a posição de
    // rolagem CRUA, e é ela que alimenta o scrub — que por definição chega atrasado (até
    // 0,8s). Lendo o gatilho, uma rolagem de roda comum (~100px num curso de ~540px = 18%
    // do curso num clique) cruzava a marca com a timeline ainda muito atrás: a página
    // virava sangue com o eclipse ainda ABERTO — exatamente o quadro inválido de 1,10:1
    // que esta seção existe para eliminar. O onUpdate da timeline renderiza também durante
    // os 0,8s de recuperação depois que o dedo para; o do gatilho, não.
    // `let` e não `const`: a marca só pode ser calculada depois de a timeline existir (ela
    // é derivada de tl.duration()), e `aplicar` é referenciada na construção dela. Começa
    // em 1 — antes de a marca real existir, nada atravessou.
    let corte = 1
    const aplicar = (p: number) => {
      const atravessou = p >= corte
      superficie.value = atravessou ? 'sangue' : 'papel'
      fase.value = atravessou ? 'depois' : 'antes'
    }

    // Uma timeline só, montada aqui (pausada) em vez de dentro do onEnter: assim ela entra
    // no registro do context e o revert() do desmonte a alcança.
    const tl = $gsap.timeline({ paused: true, onUpdate: () => aplicar(tl.progress()) })

    if (reduzido) {
      // Movimento reduzido: corte de 200ms, sem discos e sem deslocamento. E CONTINUA sendo
      // CORTE — voltar ao cross-fade aqui é justamente o que produz 1,10:1. Movimento
      // reduzido remove o movimento, não a correção (§5). A troca cai na metade dos 200ms,
      // num quadro em que a opacidade do conteúdo já é 0.
      // A troca cai na metade dos 200ms, num quadro em que a opacidade do conteúdo já é 0.
      // Ela não está aqui: mora no onUpdate do gatilho, pelo mesmo motivo do ramo normal
      // (ver comentário lá). O clearProps final também saiu — com scrub ele apagaria a
      // opacidade que a subida precisa interpolar de volta.
      tl.to(bloco, { opacity: 0, duration: 0.1, ease: 'none' })
        // fromTo e não from: o from gravaria como valor final o estado deixado pelo tween
        // anterior (opacity 0) e não animaria nada. immediateRender: false impede que ele
        // pinte o estado inicial já na montagem, com a timeline ainda pausada.
        .fromTo(bloco, { opacity: 0 }, { opacity: 1, duration: 0.1, immediateRender: false })
    }
    else {
      const discos = [discoEsq.value, discoDir.value].filter(Boolean) as HTMLElement[]

      // Posição de repouso em FUNÇÃO, não em constante.
      //
      // Era `getProperty(d, 'x')` lido uma vez na montagem — um número em pixel assado no
      // tween. `invalidateOnRefresh` reverte o inline e faz o INÍCIO do FECHA ser relido do
      // CSS (esse se cura sozinho), mas o FIM do ABRE nunca era recalculado: maximizar a
      // janela ou tirar o zoom estacionava um disco preto de 64vmax DENTRO da tela — e como
      // o overlay é `fixed` com z-index 60, ele aparecia por cima de S7 e do rodapé, não só
      // durante a travessia. Condição de quebra medida: vmax_velho / vmax_novo < 0,911.
      //
      // A função tem de derivar da GEOMETRIA (o --lado do CSS × 90vmax), nunca de
      // getProperty('x'): quando ela reinicializa em progresso 1 o FECHA já renderizou e o
      // elemento está em x = 0 — ler dali travaria os dois discos no centro da tela.
      const repousoDe = (d: HTMLElement) =>
        Number(getComputedStyle(d).getPropertyValue('--lado'))
        * 0.9 * Math.max(window.innerWidth, window.innerHeight)

      // FECHA — 500ms. x/scale são props de transform do GSAP: saem como uma matriz só,
      // na GPU. Nunca partem de scale(0): fora da tela o disco já tem tamanho (escala 1).
      discos.forEach(d => tl.to(d, { x: 0, scale: 2.4, duration: FECHA, ease: 'jmDrawer' }, 0))
      tl.to(bloco, { opacity: 0, y: -40, duration: 0.24 }, 0)

      // A TROCA saiu da timeline (era um .call em t=FECHA) e passou para o onUpdate do
      // gatilho, abaixo. Motivo: com scrub o playhead anda nos dois sentidos, e um .call
      // dispara ao cruzar a marca em qualquer direção — subindo, ele reaplicaria 'sangue'
      // em vez de desfazer, e a seção voltaria com a superfície errada. Ler o PROGRESSO e
      // derivar o estado dele é idempotente por construção: qualquer que seja a direção,
      // o lado da marca em que se está é o que manda.

      // ABRE — 600ms, discos saindo por lados opostos, cada um de volta ao seu repouso.
      discos.forEach(d =>
        tl.to(d, { x: () => repousoDe(d), scale: 1, duration: ABRE, ease: 'jmDrawer' }, FECHA))

      // O conteúdo novo entra 160ms depois de o eclipse começar a abrir. O valor final é o
      // que o SSR já entregou (opacity 1, y 0): se o JS falhar, o texto fica visível.
      tl.fromTo(
        bloco,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.32, immediateRender: false },
        FECHA + 0.16
      )

      // O clearProps que fechava a timeline saiu junto com o `once`: com scrub, "o fim" é
      // um ponto que a rolagem cruza nos dois sentidos, e devolver o transform ao CSS ali
      // deixaria os discos sem estado para interpolar na subida — a travessia quebraria
      // exatamente ao ser desfeita. O que ele protegia era o resize: sem ele os discos
      // ficam com transform inline em pixel e não reagem mais a vmax. Em troca, o
      // invalidateOnRefresh do gatilho remede o curso, e a travessia é curta o bastante
      // para que redimensionar a janela no meio dela seja caso de borda.
    }

    // Ligada à rolagem, como o resto do site. A regra antiga ("nunca scrub, o scroll
    // contínuo reintroduz os estados intermediários que esta seção existe para evitar")
    // se inverteu com a referência: aqui o estado intermediário É a travessia — o eclipse
    // fechando sobre a frase antiga e abrindo na nova. Conduzi-lo com o dedo é o efeito,
    // e subir de volta desfaz a troca. Sem pin: a página segue rolável.
    //
    // O curso é mais longo que o padrão (85% → 25% da dobra) porque são duas metades
    // encadeadas: fechar e abrir. No curso curto do cenaScrub as duas se atropelariam.
    // A marca do corte como FRAÇÃO do curso: t=FECHA (ou t=0,1 no ramo reduzido) sobre a
    // duração total da timeline. Derivada, nunca escrita à mão — mexer em FECHA/ABRE
    // continua sendo mudança num lugar só.
    corte = (reduzido ? 0.1 : FECHA) / tl.duration()

    $ScrollTrigger.create({
      ...cenaScrub(el, { start: 'top 85%', end: 'top 25%', animation: tl }),
      invalidateOnRefresh: true,
      // O corte de superfície NÃO é lido daqui — mora no onUpdate da timeline (ver acima),
      // que é o relógio que o scrub de fato move. O que sobra para o gatilho é sincronizar
      // o estado INICIAL: um gatilho de timeline adia o primeiro refresh um tick, e sem
      // isto a seção pinta papel por ~10ms antes de virar quando a página nasce rolada
      // além dela. Idempotente — subir desfaz na mesma proporção.
      onRefresh: (self: { progress: number }) => aplicar(tl.progress() || self.progress)
    })
  }, el)
})

onBeforeUnmount(() => {
  ctx?.revert()
  ctx = null
})
</script>

<style scoped>
/* As duas frases empilhadas na mesma célula: a mais longa define a altura, e a troca não
   move um pixel de layout. */
.frases {
  display: grid;
}

.frase {
  grid-area: 1 / 1;
  opacity: 0;
  /* Evita que o texto invisível seja selecionado por arrasto. */
  pointer-events: none;
}

/* Sem transition: a troca de frase é um CORTE. Qualquer interpolação aqui reintroduz o
   quadro inválido que a seção inteira existe para eliminar. */
[data-fase="antes"] .frase[data-quando="antes"],
[data-fase="depois"] .frase[data-quando="depois"] {
  opacity: 1;
  pointer-events: auto;
}

/* Overlay do eclipse. z-index acima do header (z-50) para que a cobertura seja real, e
   pointer-events: none porque a página continua rolável durante toda a sequência —
   nada de pin, nada de trava (docs/prd/00-indice.md §D3). */
.eclipse {
  position: fixed;
  inset: 0;
  z-index: 60;
  overflow: hidden;
  pointer-events: none;
}

/* Geometria dos discos, com a conta que ela precisa fechar:
   · cobertura — raio coberto = 64vmax × 2,4 / 2 = 76,8vmax; o canto mais distante do
     viewport está a no máximo √(50² + 50²) = 70,71vmax do centro. Cobre com 8,6% de folga.
   · repouso — borda interna a 90 − 32 = 58vmax do centro, contra meia-tela de no máximo
     50vmax. Sai de cena com 16% de folga.
   O PRD ilustra 60vw/scale 2,4; 60vw não fecha as duas condições ao mesmo tempo (o disco
   ou não cobre fechado, ou aparece em repouso). vmax fecha, e mantém o 2,4 do PRD.
   Este translateX é também de onde o GSAP lê a posição de repouso (getProperty 'x').
   Nunca partem de scale(0): fora da tela eles continuam tendo tamanho. */
.disco {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 64vmax;
  height: 64vmax;
  border-radius: 50%;
  background-color: var(--color-noite);
  transform: translateX(calc(var(--lado) * 90vmax)) scale(1);
}

.disco--esq {
  --lado: -1;
}

.disco--dir {
  --lado: 1;
}

/* Movimento reduzido: sem discos. O corte de 200ms roda em GSAP, que escreve estilo inline
   e não é afetado pelo bloco global que zera transition/animation-duration em tailwind.css. */
@media (prefers-reduced-motion: reduce) {
  .eclipse {
    display: none;
  }
}
</style>
