<template>
  <!-- S1 · HERO — docs/prd/S1-hero.md. A foto e a headline continuam NUNCA saindo de
       opacity:1: são o LCP, nascem no estado final no HTML do servidor, e um reveal a
       partir de opacity:0 nelas é medido como atraso pelo Core Web Vitals. A ENTRADA
       (GSAP, script abaixo) existe, mas mexe só no que é seguro pro LCP: uma cortina
       decorativa por cima (opacity, nunca nos elementos reais) e um scale/filter na
       própria imagem (transform e filter não contam pro cálculo de LCP). O loop do
       traço e a SAÍDA da dobra conforme a rolagem continuam como sempre.

       A SAÍDA é a cena medida em voyeurverite.com (a referência que o cliente pediu),
       e ela não termina aqui: é o primeiro terço de uma sequência que atravessa as três
       camadas da pilha de abertura (app/pages/index.vue). A dobra se estreita numa fita
       vertical no centro, a fita gira até deitar, vira um traço vermelho e some — e o que
       fica no lugar dela é o glossário, que já estava atrás o tempo todo. Os valores da
       fase A vêm de amostragem real do site em 1440×900; do giro em diante são calibrados
       contra os quadros de referência do cliente. -->

  <UiSection surface="noite" fill="none" padding="none" class="hero">
    <div ref="campo" class="hero-campo">
      <!-- alt="" — a foto é decorativa, o conteúdo está no <h1>.
           .jm-crush DEIXOU de ser obrigatório por contraste. Com o acento cromático o
           esmagamento era o que salvava a headline (o ouro dava 2,27:1 sobre a foto crua e
           reprovava); em branco, a foto CRUA já entrega 8,26:1 no p95 e 5,27:1 no p99 —
           passa AA de corpo sem filtro nenhum. Esmagada a 0,40 vai a 16,96:1 (p99 13,93:1).
           O filtro fica por dois motivos que não são o da headline: sustenta a prata das
           fichas ao lado, cujo piso é bem mais apertado, e é invariante de direção de arte
           ("o tipo é sempre mais claro que a foto"). Ou seja: hoje é escolha, não resgate —
           afrouxá-lo não quebra mais o <h1> (docs/prd/91-assets.md §2). -->
      <NuxtImg
        src="/images/site/hero.jpg"
        alt=""
        width="3456"
        height="5184"
        sizes="100vw md:100vw xl:100vw"
        format="webp"
        preload
        loading="eager"
        fetchpriority="high"
        class="hero-media jm-crush"
      />

      <div class="hero-conteudo">
        <div class="hero-fichas">
          <!-- REGISTRO: mono, caixa alta por CSS (leitor de tela não soletra) e
               tracking .1em. Prata, não fg-muted: 12,75:1 contra a foto esmagada. -->
          <p class="font-mono text-xs font-medium uppercase tracking-[0.1em] text-silver">Multi-artista</p>
          <p class="font-mono text-xs font-medium uppercase tracking-[0.1em] text-silver">Juiz de Fora</p>
        </div>

        <!-- As quebras são autorais, não computadas: cada linha é um bloco. A caixa
             alta é literal porque a Lastik é fonte de display e o texto do <h1> é
             o que crawler e LLM leem.

             .hero-palavra--esq / --dir são só ganchos de animação: na saída as duas
             pontas da linha justificada convergem para o centro, como "THE" e "OF"
             fazem na referência. Sem classe o tween teria de depender da ordem dos
             filhos, que muda no mobile. -->
        <h1 class="hero-headline">
          <span class="hero-linha hero-linha--justa"><span class="hero-palavra--esq">A ARTE</span> <span class="hero-da hero-palavra--dir">DA</span></span> <span class="hero-linha">TRANSMUTAÇÃO</span>
        </h1>
      </div>

      <span class="hero-scroll" aria-hidden="true" />

      <!-- Cortina da ENTRADA — abre na Fase 1 e cobre/descobre de novo na Fase 3 (troca
           de grading da foto, escondida). Repouso opacity:0 igual ao .hero-selo: só
           existe se o JS rodar (ver script) — sem isso a dobra fica exatamente como o
           servidor entrega, sem cortina nenhuma tampando nada. -->
      <span class="hero-cortina" aria-hidden="true" />

      <!-- O campo da dobra em cor chapada, por cima de tudo. Entra só no fim da cena,
           quando a fita já girou: é ele que dá o "corte" final, senão a fita encolheria
           mostrando um retalho ilegível da foto até virar um ponto. -->
      <span class="hero-selo" aria-hidden="true" />

      <!-- A BRASA — acende logo depois do selo e é o que faz a fita deitada terminar
           VERMELHA, e não preta. Elemento próprio, e não uma troca de cor no selo, porque
           animar background-color de um elemento desta escala é proibido
           (docs/prd/90-movimento.md §4): aqui é opacity de uma camada que já nasce
           vermelha, que roda na GPU. -->
      <span class="hero-brasa" aria-hidden="true" />
    </div>
  </UiSection>
</template>

<script lang="ts" setup>
// Nada aqui pode DEPENDER de JS: a seção é o LCP e o servidor já entrega o estado
// final. Sem GSAP a dobra fica exatamente como está no HTML — foto no lugar, traço
// desenhado, e o curso extra da cena nem existe (a classe que o cria só é adicionada
// no onMounted). O ajuste de medida da headline continua CSS puro (container query),
// então nem um reflow no cliente.
const campo = ref<HTMLElement | null>(null)

const { $gsap, $prefersReducedMotion } = useNuxtApp()

let ctx: { revert: () => void } | null = null

onMounted(() => {
  if (!$gsap || !campo.value) return

  // Movimento reduzido: nesta seção NADA se move, incluindo a entrada nova abaixo. Não é
  // exceção à regra do §12 (some o deslocamento, fica a opacidade) — é a aplicação dela:
  // cortina, float e o loop do traço são deslocamento/opacidade transitórios que o GSAP
  // aplica via inline style — sem essas linhas rodando, cada elemento fica exatamente no
  // repouso do CSS (cortina invisível, fichas/scroll no lugar, foto no scale de sempre).
  // Não há opacidade "escondida" a preservar, então sai tudo. O :active de outros
  // componentes segue vivo porque mora no CSS.
  if ($prefersReducedMotion?.()) return

  // A PILHA — a hero e o glossário passam a ocupar o mesmo lugar na tela, e a altura
  // deste bloco vira o curso da cena (ver app/pages/index.vue). É altura de documento que
  // só faz sentido se o GSAP estiver vivo: com JS falho seriam 240svh de rolagem morta e
  // uma seção grudada sobre a outra. Por isso a classe é adicionada AQUI, por quem sabe
  // se a cena vai rodar, e não é o estado padrão do CSS.
  //
  // closest e não parentElement: entre o campo e a pilha está a própria <section> da hero.
  // O fallback cobre o caso de a hero ser usada fora da home, onde não há pilha — ali ela
  // é só uma dobra normal e a cena não roda.
  const cena = campo.value.closest('.abertura') as HTMLElement | null
  if (!cena) return
  cena.classList.add('abertura--pilha')

  // Escopo no .hero-campo: o seletor de texto dentro do context resolve só aqui dentro,
  // e o revert() no unmount desfaz tween, ScrollTrigger e listener de uma vez.
  ctx = $gsap.context((self) => {
    let obs: MutationObserver | null = null
    let flutuar: ReturnType<typeof $gsap.timeline> | null = null
    let entradaTl: ReturnType<typeof $gsap.timeline> | null = null

    // A ENTRADA — 4 fases, ~7,4s, replicando a linguagem de voyeurverite.com sem tocar
    // opacity da foto/headline (LCP, ver comentário do template). O truque é a cortina:
    // ela recebe a opacidade que pareceria estar na foto, e a foto real só ganha um
    // scale (que não conta pro LCP) e, mais tarde, um filter.
    const montarEntrada = () => {
      // NÃO tocar se a página já nasceu rolada.
      //
      // O gsap.context só captura o que é criado DENTRO da execução síncrona do callback;
      // esta função roda depois (do MutationObserver do loader). Sem este guard, um F5 com
      // scroll restaurado — ou abrir /#som direto — fazia o seguinte: a cena de saída já
      // tinha escrito o estado dela, e 2,4s depois o loader saía e a entrada rodava por
      // cima, começando por `set('.hero-cortina', { opacity: 1 })` — um retângulo preto
      // opaco (z-index 3) cobrindo a viewport inteira sobre o conteúdo que o usuário já
      // estava lendo, e a foto voltando de scale 1 para 0,95. E nenhum onUpdate novo
      // dispara enquanto ele não rolar de novo, então a cortina ficava lá.
      if (window.scrollY > 0) return

      // Cortina só existe se este código rodou — repouso no CSS é opacity:0, igual ao
      // .hero-selo. Sem isso um JS que falhasse no meio deixaria a dobra tampada.
      $gsap.set('.hero-cortina', { opacity: 1 })
      // .hero-media descansa em scale(1.05) no CSS — é o valor que a cena de SAÍDA
      // espera encontrar quando o scroll começa (ela anima 1.05 → 1 pra dar a
      // sensação de profundidade, ver mais abaixo). Puxar pra 0.95 aqui e devolver pro
      // mesmo 1.05 preserva as duas coisas em vez de fazer a saída perder o efeito.
      // O filter já nasce com blur(0px) explícito: a Fase 3 interpola pra uma string
      // com blur() — sem as duas terem a MESMA lista de funções desde o início, o GSAP
      // alinha por posição e o brightness/contrast saem errados nos primeiros quadros
      // (medido: um frame passou por brightness(0.003) sem nunca ter sido pedido).
      //
      // ZERO À DIREITA É PROIBIDO NESTAS STRINGS. `brightness(0.40)` e `brightness(0.4)`
      // são o mesmo número, mas não a mesma STRING: o Chrome normaliza o valor computado
      // para `0.4`, e quando o alvo do tween traz `0.40` o GSAP vê texto diferente, monta
      // um tween para essa função e a interpola A PARTIR DE ZERO. Medido em 2026-08-03:
      // a Fase 3 levava brightness de 0,0002 a 0,4 em lockstep com o blur — a foto do
      // hero PISCAVA PRETA por 0,7s no meio da entrada. Mesma armadilha em `contrast(1.10)`.
      // Escreva sempre a forma normalizada do Chrome (0.4, 1.1), nunca 0.40 / 1.10.
      $gsap.set('.hero-media', { scale: 0.95, filter: 'brightness(0.4) contrast(1.15) saturate(1.2) blur(0px)' })

      entradaTl = $gsap.timeline()
        // FASE 1 (0 → 1,4s) — a cortina abre e a foto assenta no zoom de repouso.
        .to('.hero-cortina', { opacity: 0, duration: 1.4 }, 0)
        .to('.hero-media', { scale: 1.05, duration: 1.4 }, 0)

        // FASE 2 (1,4s → 3,8s) — fichas e indicador de scroll entram em cascata.
        // fromTo, não from: encadeado com a Fase 4 mais abaixo (mesmos elementos), o
        // valor "de chegada" implícito de um from() fica ambíguo. .hero-scroll em
        // particular descansa em opacity:0.45 (CSS), não 1 — precisa ser explícito.
        .fromTo('.hero-fichas > *', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 }, 1.4)
        .fromTo('.hero-scroll', { opacity: 0, y: 18 }, { opacity: 0.45, y: 0, duration: 0.5 }, 1.4)

        // FASE 3 (3,8s → 5,6s) — cobre, troca o grading da foto escondida, descobre.
        // O blur vai na FOTO, não na cortina: uma cortina chapada não tem o que
        // borrar — é a foto meio-visível através da cortina translúcida, no meio do
        // cobrir/descobrir, que lê como "borrão no meio" (docs/prd/90-movimento.md §10).
        // 5px fica bem abaixo do teto de 20px do mesmo doc — nesta escala (full-bleed)
        // blur pesado é caro, sobretudo no Safari.
        .to('.hero-cortina', { opacity: 1, duration: 0.7, ease: 'jmInOut' }, 3.8)
        .to('.hero-media', { filter: 'brightness(0.4) contrast(1.15) saturate(1.2) blur(5px)', duration: 0.7, ease: 'jmInOut' }, 3.8)
        // Troca escondida: a cortina está opaca neste instante (0,7 depois de 3,8).
        .set('.hero-media', { filter: 'brightness(0.34) contrast(1.22) saturate(1.1) blur(5px)' }, 4.5)
        .to('.hero-cortina', { opacity: 0, duration: 1.1, ease: 'jmInOut' }, 4.5)
        .to('.hero-media', { filter: 'brightness(0.34) contrast(1.22) saturate(1.1) blur(0px)', duration: 1.1, ease: 'jmInOut' }, 4.5)

        // FASE 4 (5,6s → 7,4s) — mesmo padrão da Fase 2, replicado.
        .to('.hero-fichas > *', { opacity: 0, y: -10, duration: 0.3 }, 5.6)
        .to('.hero-scroll', { opacity: 0, y: -10, duration: 0.3 }, 5.6)
        .fromTo('.hero-fichas > *', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 }, 6.0)
        .fromTo('.hero-scroll', { opacity: 0, y: 18 }, { opacity: 0.45, y: 0, duration: 0.5 }, 6.0)

      // Float ambiente — começa junto da Fase 2 e não para mais sozinho; só quando o
      // scroll da cena de saída assumir (onUpdate do ScrollTrigger, mais abaixo).
      flutuar = $gsap.timeline({ repeat: -1, yoyo: true, delay: 1.4 })
        .to('.hero-media', { y: -8, duration: 2, ease: 'jmInOut' })
    }

    // self.add(null, fn) é o que ATRELA a entrada a este contexto.
    //
    // gsap.context() só mantém `_context = self` durante a execução SÍNCRONA do callback.
    // A entrada é disparada de um MutationObserver, ou seja depois — então `entradaTl` e
    // `flutuar` nasciam FORA do registro e o ctx.revert() do onBeforeUnmount não os
    // alcançava. `flutuar` é repeat:-1: sair de "/" numa navegação SPA deixava uma timeline
    // infinita animando uma <img> já destacada do documento, para sempre. E os seletores
    // por string ('.hero-cortina', '.hero-media', …) resolviam no DOCUMENTO em vez de em
    // campo.value. Pior, o defeito só existia no PRIMEIRO carregamento: no caminho SPA a
    // função era chamada de forma síncrona e era capturada — dois comportamentos diferentes
    // para o mesmo código.
    //
    // O primeiro argumento é `null` de propósito: `add(fn)` com UM argumento função executa
    // na hora e devolve o resultado; com o nome à frente ele devolve a função EMBRULHADA,
    // que é o que precisamos guardar para chamar depois (é o mesmo caminho que o próprio
    // GSAP usa internamente, gsap-core.js:3938).
    const iniciarEntrada = self.add(null, montarEntrada) as () => void

    // O loader (TheLoader.vue) é irmão desta seção na árvore, sem canal de coordenação
    // hoje — o único sinal que existe é a classe que ele mesmo remove do <html> no
    // instante em que começa a sumir (TheLoader.vue). Sem esperar por ela, a Fase 1
    // tocaria inteira atrás da cortina opaca do loader.
    if (document.documentElement.classList.contains('jm-loader-ativo')) {
      obs = new MutationObserver(() => {
        if (!document.documentElement.classList.contains('jm-loader-ativo')) {
          obs?.disconnect()
          iniciarEntrada()
        }
      })
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    } else {
      // Navegação SPA de volta pra "/" — o loader não remonta, começa na hora.
      iniciarEntrada()
    }

    // O traço se recolhe pelo topo e volta a descer — nunca seta pulando, que competiria
    // com a headline. ease 'none': é movimento constante, não entrada de elemento
    // (docs/prd/90-movimento.md §2). 1,2s + 1,2s = os 2,4s do PRD.
    const loop = $gsap.timeline({ repeat: -1, defaults: { duration: 1.2, ease: 'none' } })
      .to('.hero-scroll', { scaleY: 0.08, transformOrigin: 'top' })
      .to('.hero-scroll', { scaleY: 1 })

    // Loop rodando em aba de fundo é bateria gasta para ninguém. A chamada imediata
    // cobre o caso de a seção montar já com a aba oculta (link aberto em nova aba).
    const aoTrocarAba = () => (document.hidden ? loop.pause() : loop.play())
    aoTrocarAba()
    document.addEventListener('visibilitychange', aoTrocarAba)

    // A CENA — o scrub que a referência pede. Ele passa pelo teste da regra "sem scrub"
    // do projeto (proibido em REVEAL, porque ali o estado intermediário é conteúdo que
    // precisa ser legível e ainda não é): aqui é o inverso — o texto já foi lido e está
    // indo embora, e o intermediário é justamente isso. O LCP continua intocado: em
    // scroll 0 a timeline está em progresso 0, que é exatamente o quadro que o servidor
    // entregou.
    //
    // O gatilho é a PILHA (100svh + 240svh), não o campo: a hero é sticky e fica parada
    // na tela do início ao fim, então 'top top' → 'bottom bottom' da pilha dá exatamente
    // os 240svh de rolagem que a cena consome.
    //
    // scrub 0.8 e não `true`: a referência roda sob ScrollSmoother, que amortece toda a
    // rolagem. Com `true` a cena cola no dedo e fica seca; 0,8s de recuperação devolve a
    // inércia sem transformar a cena em animação por tempo — o dedo continua no comando,
    // e rolar para trás desfaz na mesma proporção.
    //
    // Duração total 1: com scrub o que importa é a PROPORÇÃO de cada tween dentro da
    // timeline, não o segundo — o progresso do gatilho é que empurra o playhead. As
    // posições abaixo são as frações medidas na referência, convertidas para essa base
    // (o curso dela é de 2160px numa dobra de 900 = 2,4 dobras; aqui, 2,4 → 1).
    const saida = $gsap.timeline({
      // ease 'none' em TUDO não é preguiça: amostrando a referência a cada ~150px de
      // rolagem, todos os valores (clip, opacidade, deslocamento, escala, ângulo) caem
      // em cima da reta. É movimento comandado pelo dedo, não entrada de elemento.
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: cena,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        // O deslocamento das palavras é função da viewport (abaixo): sem isto ele
        // congelaria no valor da primeira medida e o giro do celular deixaria o curso
        // descalibrado.
        invalidateOnRefresh: true,
        // Rolar antes da entrada terminar é o usuário decidindo que já viu: a timeline
        // da entrada salta pro fim (estado limpo — cortina some, filtro assenta) e o
        // float ambiente para, senão os dois brigariam com esta cena pela mesma
        // .hero-media.
        onUpdate: (self) => {
          if (self.progress > 0) {
            // pause(0) e não pause(): parar o yoyo onde ele estiver congela a foto num y
            // arbitrário entre 0 e −8px, e a cena de saída não anima y de .hero-media —
            // ela ficaria permanentemente deslocada. pause(0) busca o tempo 0 antes de
            // parar, devolvendo y: 0.
            flutuar?.pause(0)
            if (entradaTl && entradaTl.progress() < 1) entradaTl.progress(1)
          }
        }
      }
    })

    // As posições abaixo são svh do topo da pilha divididos pelo curso do gatilho. Manter
    // a conta explícita em vez de constantes decimais é o que permite ler a cena contra o
    // mapa de fases sem converter nada de cabeça — e reajustar o curso sem recalibrar sete
    // números na mão.
    //
    // 460 e não 560: a pilha mede 560svh, mas cada camada tem 100svh de altura, então o
    // sticky as solta 100svh antes do fim (é o que dá ao glossário a dobra final para ser
    // lido sozinho). Os 460 são o curso em que as três camadas estão de fato paradas na
    // tela — e é também o que 'top top' → 'bottom bottom' mede. TODA fase da cena, nas
    // três camadas, tem de caber aqui dentro; passar disso é animar algo que já saiu.
    const CURSO = 460
    const em = (svh: number) => svh / CURSO
    const dura = (svh: number) => svh / CURSO

    saida
      // FASE A · o quadro se fecha numa fita (0 → 80svh)
      //
      // O traço é a instrução "role" — e quem já está rolando não precisa mais dela.
      // Sai nos primeiros 12% da fase A, antes de qualquer outra coisa se mexer, senão
      // vira um segundo elemento competindo com a headline na saída.
      .to('.hero-scroll', { opacity: 0, duration: dura(10) }, em(0))
      // As fichas somem na METADE do curso da headline: na referência as etiquetas
      // laterais (CREATIVE / STUDIO) chegam a zero com o título ainda em 0,39. Elas são
      // legenda; sair junto do que legendam deixaria as duas coisas ilegíveis ao mesmo
      // tempo no meio do caminho.
      .to('.hero-fichas', { opacity: 0, duration: dura(44) }, em(0))
      .to('.hero-headline', { opacity: 0, duration: dura(80) }, em(0))
      // As pontas da linha justificada convergem enquanto ela apaga. 6,9% da LARGURA da
      // viewport, que é o que os 100px medidos representam nos 1440px da referência —
      // e não uma constante em pixel, que o §4 proíbe por não acompanhar o viewport.
      .to('.hero-palavra--esq', { x: () => window.innerWidth * 0.069, duration: dura(80) }, em(0))
      .to('.hero-palavra--dir', { x: () => window.innerWidth * -0.069, duration: dura(80) }, em(0))
      // A foto larga o zoom de repouso (1,05 no CSS) enquanto o quadro se fecha: os dois
      // planos indo em sentidos opostos é o que lê como profundidade. Um só se movendo
      // seria só um corte.
      .to('.hero-media', { scale: 1, duration: dura(80) }, em(0))
      // O fecho lateral em si. Custom property e não clipPath direto: assim a conta da
      // largura final da fita (64px, os 63 medidos arredondados) fica no CSS, onde ela é
      // responsiva de graça, e o GSAP só interpola um número de 0 a 1.
      .to(campo.value, { '--fenda': 1, duration: dura(80) }, em(0))

      // FASE C · a fita gira até DEITAR (80 → 210svh)
      //
      // 90°, não os 80° de antes. Os 80 vinham da cena antiga, onde a referência trava o
      // ângulo e passa a só encolher; aqui a barra precisa terminar horizontal, porque é
      // deitada que ela vira o traço da fase seguinte.
      .to(campo.value, { rotation: 90, duration: dura(130) }, em(80))
      // A fita RECOLHE enquanto tomba (110 → 150svh).
      //
      // Não é fase nova: é o mesmo encolhimento de comprimento que já existia na fase D,
      // antecipado para dentro do giro. Sem isto a barra tem os 100svh de comprimento
      // durante toda a queda e, girando em torno do centro da dobra, varre a largura
      // inteira da tela — atravessava "Moon" e as duas definições do glossário em todo
      // ângulo intermediário (medido em 1521×730: 460px de extensão horizontal aos 130svh,
      // contra 228px de corredor livre entre as colunas). Recolhida, ela cabe no corredor
      // e as duas metades do verbete continuam legíveis durante a queda.
      //
      // Começa aos 110 e não aos 80 para preservar o instante em que a fenda acaba de
      // fechar: ali a fita ainda é a coluna de altura cheia, que é o que dá o corte.
      .to(campo.value, { scaleY: 0.32, duration: dura(40) }, em(110))

      // FASE D · a barra vira um traço vermelho e some (210 → 300svh)
      //
      // O selo fecha primeiro e dá o corte: sem ele o resto da fase seria uma lasca de
      // fotografia afinando, ilegível. A brasa acende logo atrás e é o que troca a cor.
      .to('.hero-selo', { opacity: 1, duration: dura(18) }, em(210))
      .to('.hero-brasa', { opacity: 1, duration: dura(26) }, em(222))
      // Depois do giro os eixos LOCAIS continuam valendo (o GSAP compõe translate →
      // rotate → scale, então a escala age antes da rotação no espaço do elemento):
      // scaleX é a espessura da barra deitada, scaleY o comprimento dela.
      .to(campo.value, { scaleX: 0.22, duration: dura(42) }, em(228))
      // O comprimento já foi recolhido a 0,42 durante o giro (acima); aqui ele só assenta
      // no valor final do traço. Antes esta linha fazia o encolhimento inteiro, tarde
      // demais para impedir a varredura sobre o texto.
      .to(campo.value, { scaleY: 0.5, duration: dura(38) }, em(250))
      // O traço sai por opacidade e não encolhendo até zero: §5 proíbe scale(0) como
      // estado de animação, e um traço que some encolhendo volta a chamar atenção
      // justamente quando o glossário já é o assunto.
      .to(campo.value, { opacity: 0, duration: dura(12) }, em(288))

      // ESPAÇADOR até o fim do curso (300 → 460svh). Não anima nada e não é decoração:
      // o ScrollTrigger mapeia o progresso do gatilho sobre a DURAÇÃO REAL da timeline,
      // não sobre 1. Sem isto a timeline terminaria em 0,652 e todas as posições acima
      // sairiam esticadas por 1/0,652 — a fita chegaria aos 90° só lá pelos 330svh em vez
      // de 210 (medido exatamente assim antes desta linha existir). A cena da hero acaba
      // aos 300svh de propósito: os 160svh restantes são das duas faces.
      .to({}, { duration: dura(160) }, em(300))

    // Devolver função do context faz o revert() chamá-la: listener e observer saem junto.
    return () => {
      document.removeEventListener('visibilitychange', aoTrocarAba)
      obs?.disconnect()
    }
  }, campo.value)
})

onBeforeUnmount(() => {
  ctx?.revert()
  ctx = null
})
</script>

<style scoped>
.hero {
  /* A dobra. Curso da cena, recorte da fita e a margem negativa do header agora moram na
     PILHA (app/pages/index.vue): com duas seções ocupando o mesmo lugar, quem tem de
     saber a geometria é o bloco que as contém, não uma delas. Aqui fica só a altura. */
  height: 100svh;
}

.hero-campo {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  /* svh, nunca vh: com a barra do Safari iOS visível, vh corta a headline. */
  height: 100svh;
  /* Margem lateral de 2,1% (docs/prd/S1-hero.md §2). Percentagem e não vw — vw
     inclui a barra de rolagem e geraria overflow horizontal no desktop. */
  padding-inline: 2.1%;
  /* --lgpd-h é publicada pelo TheLgpdBanner (ResizeObserver) e vale 0px quando não há
     banner. Sem ela o banner de consentimento cobria a headline inteira no celular — e a
     primeira visita é sempre a visita com banner. O recuo mora AQUI, e não num
     padding no <body>, porque esta é a única seção que ancora conteúdo na base da tela:
     empurrar o documento todo daria CLS em tudo por causa de algo que some no
     primeiro clique. */
  padding-bottom: calc(clamp(2.5rem, 7svh, 4.5rem) + var(--lgpd-h, 0px));
  /* #01004C (21,7% dos pixels) continua sendo a cor dominante medida DENTRO da foto —
     essa medição não mudou. O que mudou foi a paleta: com só preto/branco/vermelho
     disponíveis não sobra um azul para casar com ela, e o fallback antes da imagem
     pintar passa a ser --color-noite, a superfície-base do sistema. */
  background-color: var(--color-noite);

  /* A FITA. --fenda 0 = quadro cheio (o que o servidor entrega e o que fica sem JS);
     --fenda 1 = uma coluna de --fenda-w no centro. A conta mora aqui e não no tween
     justamente para ser responsiva.
     64px é a medida da referência no desktop (63px em 1440) arredondada. No estreito ela
     é medida errada: 64px num aparelho de 390px são 16% da tela, contra os ~10% que a
     referência mostra no celular — e essa diferença é justamente o que fazia a fita não
     caber no corredor entre as duas metades do verbete. */
  --fenda-w: 64px;
  --fenda: 0;
  clip-path: inset(0 calc((100% - var(--fenda-w)) / 2 * var(--fenda)));

  /* Seguro para a janela de fallback da fonte: em Georgia a linha 2 pode exceder a
     coluna e, sendo palavra única, não tem onde quebrar. clip não cria scroll. */
  overflow: clip;
}

.hero-media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* A foto é 3456×5184 (retrato 2:3); no recorte paisagem do desktop a escala é pela
     LARGURA, então o corte come topo e base e a horizontal não importa — daí os 50%.
     A conta do vertical: em 1440×900 a imagem escalada mede 2160px de altura e só 900
     aparecem, ou seja 41,7%. Nesta foto o rosto ocupa de 42% a 70% da altura, centro em
     56%. Para centrar essa faixa: (0,56 − 0,417/2) / (1 − 0,417) = 0,603. Daí 60%, que
     mostra de 35% a 77% — o rosto inteiro com folga em cima e embaixo.
     Se a foto trocar, refaça a conta — 60% não é transferível. */
  object-position: 50% 60%;
  /* Repouso = levemente ampliada. É o quadro do servidor e o ponto de partida do tween
     que devolve a foto ao tamanho natural durante o fecho. 1,05 é o valor da
     referência; menos que isso e o afastamento entre os planos não se percebe. */
  transform: scale(1.05);
}

.hero-selo {
  position: absolute;
  inset: 0;
  /* Acima do conteúdo (z 1) — o selo cobre a dobra inteira, texto incluído. */
  z-index: 2;
  background-color: var(--color-noite);
  opacity: 0;
  pointer-events: none;
}

.hero-brasa {
  position: absolute;
  inset: 0;
  /* Acima de tudo (cortina em 3): quando ela acende, a fita já é só uma barra de cor e
     nada mais precisa aparecer por baixo. Repouso opacity:0 como o selo e a cortina —
     sem JS a dobra fica exatamente como o servidor entrega. */
  z-index: 4;
  background-color: var(--color-sangue);
  opacity: 0;
  pointer-events: none;
}

.hero-cortina {
  position: absolute;
  inset: 0;
  /* Acima do selo (z 2): quando ela cobre na Fase 3 da entrada (GSAP), cobre tudo. As
     duas janelas não se cruzam na prática — o selo só liga no fim da cena de saída,
     bem depois da entrada ter terminado. Repouso opacity:0, igual ao selo: some se o
     JS falhar, a dobra fica exatamente como o servidor entrega. */
  z-index: 3;
  background-color: var(--color-noite);
  opacity: 0;
  pointer-events: none;
}

.hero-conteudo {
  /* A foto é absoluta; sem contexto posicionado aqui o texto ficaria por baixo dela. */
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 2svh, 1.5rem);
  /* É contra ESTA largura (a coluna, já descontada a margem de 2,1%) que a headline
     se ajusta em cqi. Sem container query o ajuste dependeria de JS. */
  container-type: inline-size;
}

.hero-fichas {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.hero-headline {
  /* JUSTIFICAÇÃO FORÇADA — as duas linhas na mesma medida é o que faz o bloco ler
     como bloco. O ajuste é por font-size + tracking negativo, nunca por scaleX
     (escala deforma o desenho da letra).

     Números medidos no arquivo da LASTIK (upm 1000, cap 756):
     "TRANSMUTAÇÃO" avança 8,445em em 12 caracteres; com tracking -0,02em mede
     8,205em → para ocupar 95,8% da coluna, font-size = 95,8/8,205 = 11,676cqi.
     A linha 1 ("A ARTE DA", 5,214em) fica no mesmo corpo e vai a 95,5% pela
     justificação — o vão cresce entre as palavras, como na referência.

     O corpo já foi 14,374cqi, calculado para uma face 22% mais estreita (6,905em na
     mesma frase) que saiu do projeto. Trocar a fonte de display SEM refazer esta conta
     estoura a linha 2 para fora da coluna. */
  font-size: 11.676cqi;
  letter-spacing: -0.02em;
  line-height: 0.77;
  color: var(--color-branco);
  /* A cauda do Ç desce 0,219em abaixo da baseline; com line-height 0,77 a caixa da linha
     é menor que a altura do tipo, e a cauda termina 0,21em abaixo do fundo da caixa.
     Cálculo: meia-entrelinha = (0,77 − (0,976 + 0,224))/2 = −0,215em → baseline a 0,761em
     do topo da caixa → fundo da cauda a 0,980em, ou seja 0,21em fora. A folga é
     proporcional ao corpo, por isso em em e não em rem. */
  padding-bottom: 0.24em;
}

.hero-linha {
  display: block;
}

/* O invariante line-height 0,77 foi medido numa referência EM INGLÊS, que não tem
   diacrítico ascendente. Em pt-BR ele colide, e com a Lastik colide MAIS: as caixas altas
   medem 0,756em e cabem no avanço de 0,77em, mas o til do "Ã" sobe 0,993em acima da
   própria baseline — 0,223em ACIMA da baseline da linha anterior, que em caixa alta não
   tem descendente para ceder espaço.
   (Na face anterior do projeto o til subia 0,848em e a sobreposição era 0,078em: a
   Lastik é 3× pior, porque põe o acento bem mais alto.)
   A folga vai só entre linhas, nunca no line-height: mexer no 0,77 afrouxaria o bloco
   inteiro e é justamente o que a referência não faz.

   Os 0,26em anteriores vinham de uma conta com o til a 0,993em. O valor MEDIDO no arquivo
   (canvas TextMetrics) é 1,00em de ink ascent em "TRANSMUTAÇÃO" contra 0,76em de
   fontBoundingBoxAscent. Refazendo com o número real:
     meia-entrelinha = (0,77 − 0,98)/2 = −0,105em → baseline a 0,655em do topo da caixa
     topo do til    = 1,00 − 0,655 = 0,345em ACIMA da caixa da linha 2
     base da tinta da linha 1 = 0,115em acima do fundo da caixa dela (não há descendente)
     folga = margin + 0,115 − 0,345
   Com 0,26em a folga era 0,03em — 5px num corpo de 168px, ou seja zero separação óptica: o
   til encostava no "DA" e lia como se fosse acento DELE. 0,42em devolve 0,19em (~32px), que
   é o menor vão em que as duas linhas voltam a ser duas linhas. */
.hero-linha + .hero-linha {
  margin-top: 0.42em;
}

.hero-linha--justa {
  width: 95.5%;
  /* text-align-last basta: a linha justa é também a última do bloco. Onde não houver
     suporte, a linha cai para a largura natural — degrada, não quebra. */
  text-align-last: justify;
}

.hero-scroll {
  position: absolute;
  bottom: 0.75rem;
  left: calc(50% - 0.5px);
  width: 1px;
  height: 1.75rem;
  background-color: var(--color-silver);
  opacity: 0.45;
  /* Repouso = traço INTEIRO. É o que o servidor entrega e o que fica se o GSAP não
     rodar (JS falho ou movimento reduzido): some o movimento, fica a informação.
     O loop em si é GSAP — keyframe CSS ganharia do transform inline do GSAP na cascata
     e os dois brigariam pelo mesmo scaleY. */
  transform: scaleY(1);
  transform-origin: top;
}

/* A fita fecha mais fina no estreito — ver o comentário de --fenda-w acima. 1023.98 e não
   1023: é o mesmo par de breakpoints do verbete (S2Glossario.vue), e a fita e o corredor
   por onde ela desce têm de trocar de medida no MESMO ponto. */
@media (max-width: 1023.98px) {
  .hero-campo {
    --fenda-w: 40px;
  }
}

@media (max-width: 767px) {
  /* Nos extremos de uma tela de 390px as fichas ficam a 4 caracteres de distância e o
     efeito morre: empilham abaixo da headline. */
  .hero-fichas {
    order: 1;
    flex-direction: column;
    gap: 0.35rem;
  }

  /* 3 linhas: A ARTE / DA / TRANSMUTAÇÃO. Sem hifenizar e sem justificar — "A ARTE"
     esticada a 95% da coluna viraria rio de espaço. */
  .hero-linha--justa {
    width: auto;
    text-align-last: auto;
  }

  .hero-da {
    display: block;
  }
}

/* O <script> já corta a cena inteira em movimento reduzido: a classe .abertura--pilha
   nem chega a ser adicionada, então não há curso extra nem empilhamento e as duas seções
   ficam em fluxo normal. Este bloco é a rede para o caso de a preferência mudar com a
   página aberta — a dobra volta a ser um bloco de altura natural. */
@media (prefers-reduced-motion: reduce) {
  .hero,
  .hero-campo {
    min-height: 100svh;
    height: auto;
  }
}
</style>
