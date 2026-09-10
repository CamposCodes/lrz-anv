<template>
  <!-- S4 · TRÊS LUAS — docs/prd/S4-tres-luas.md
       EXATAMENTE 3 blocos. O layout foi desenhado para quatro e o quarto vão fica vazio:
       é onde a foto respira. Inventar um quarto pilar para fechar a simetria seria a pior
       escolha do projeto (PRD §3). O id da âncora (#som) chega por fallthrough. -->
  <UiSection surface="noite" fill="solid" padding="xl">
    <template #decor>
      <!-- Exo -028 (já renomeada). Foi escolhida por três medições enquanto o acento ainda
           era ouro; a paleta de três cores matou uma delas. As duas que restam:
             estrutura 0,99           → 2,4× a da Exo -039 que estava aqui: uma foto
                                        chapada não dá o que ver num fundo que desliza
             folga de paralaxe 1,25   → o detalhe está no MEIO do quadro. A Exo -039 media
                                        0,39, com detalhe nas bordas: deslizava para fora
           O CONTRASTE deixou de ser filtro: prata e branco passam sobre qualquer foto do
           acervo, inclusive esta (prata 15,78:1 p95, branco 19,62:1 p95 — muito acima do
           piso de 4,5:1), então o argumento antigo ("poucas fotos DJ passavam no acento",
           medido em ouro esmagado) não existe mais. O que ainda prende esta foto é só a
           FOLGA e a ESTRUTURA acima. Trocar a foto continua exigindo medir a folga ≥1,2
           (docs/prd/91-assets.md §2).
           Tematicamente é um set de DJ — e é aqui que mora a vertente SOM (âncora #som).
           .jm-crush é o brightness(.40) contrast(1.15) saturate(1.2) medido. -->
      <div ref="midia" class="luas-media" aria-hidden="true">
        <NuxtImg
          src="/images/site/tres-luas.jpg"
          alt=""
          width="4000"
          height="6000"
          sizes="100vw md:100vw xl:100vw"
          format="webp"
          loading="lazy"
          decoding="async"
          class="luas-foto jm-crush"
        />
      </div>

      <!-- Selo da saída — mesmo papel do da hero e do manifesto: a última dobra da seção
           vira cor chapada em vez de foto escorregando para fora. -->
      <span ref="selo" class="selo-saida" aria-hidden="true" />
    </template>

    <UiContainer size="full" class="relative">
      <!-- Um gatilho só para a seção inteira. Os três títulos precisam de disparo COMUM:
           SOM mora numa faixa mais baixa e começaria sozinho se cada título observasse a
           si mesmo, matando o stagger de 80ms. -->
      <div ref="raiz">
        <UiEyebrow as="h2" class="luas-eyebrow">Três luas</UiEyebrow>

        <div class="luas-grid">
          <!-- Bloco inteiro é o link (PRD §8). aria-label encurta o nome acessível, que
               senão seria o parágrafo inteiro; começa pelo texto visível (WCAG 2.5.3). -->
          <a
            v-for="bloco in blocos"
            :key="bloco.n"
            :href="bloco.href"
            :aria-label="bloco.rotulo"
            class="luas-bloco"
            data-pressable
          >
            <article class="luas-artigo">
              <div class="luas-cabeca">
                <!-- .jm-mask (global) dá o overflow:hidden; o span sobe por trás dele. -->
                <h3 class="luas-titulo jm-mask">
                  <span class="luas-linha">{{ bloco.titulo }}</span>
                </h3>
                <!-- Bookend, ponta de cima: é eco, não informação — some abaixo de 768px,
                     onde título e parágrafo ficam adjacentes e repetir vira ruído.
                     Prata, não mais ouro: os números são REGISTRO (mesmo papel das fichas
                     do S1), e o destaque forte fica reservado para o hover do título. -->
                <span class="luas-num-topo font-mono text-silver" aria-hidden="true">{{ bloco.n }}</span>
              </div>

              <div class="luas-corpo">
                <p class="luas-texto font-mono text-fg/78">{{ bloco.texto }}</p>
                <!-- Ponta de baixo: esta é a que carrega o valor para o leitor de tela. -->
                <span class="luas-num-base font-mono text-silver">{{ bloco.n }}</span>
              </div>
            </article>
          </a>
        </div>
      </div>
    </UiContainer>
  </UiSection>
</template>

<script lang="ts" setup>
// As três vertentes, visíveis ao mesmo tempo — não é seção pinada e não troca de estado
// (PRD §2). Texto em caixa natural: o CAPS é presentacional (text-transform), assim
// leitor de tela e crawler de LLM recebem a frase legível.
const blocos = [
  {
    n: '01',
    titulo: 'Tarô',
    href: '#taro',
    rotulo: 'Tarô — ver o arquivo de leituras',
    texto: 'Leitura como conversa, não como sentença. A carta abre a pergunta — quem responde é você.'
  },
  {
    n: '02',
    titulo: 'Som',
    // Não há sessão dedicada ao som nesta versão: o destino é o booking, no contato (S8).
    href: '#contato',
    rotulo: 'Som — falar sobre booking',
    texto: 'Set como travessia. Jazz, eletrônico e o que mora entre os dois. Improviso com hora marcada.'
  },
  {
    n: '03',
    titulo: 'Ourives',
    href: '#joias',
    rotulo: 'Ourives — ver a coleção',
    texto: 'Metal trabalhado à mão, peça a peça. O que sobra de uma noite vira objeto.'
  }
]

const raiz = ref<HTMLElement | null>(null)
const midia = ref<HTMLElement | null>(null)
const selo = ref<HTMLElement | null>(null)

const { $gsap, $prefersReducedMotion } = useNuxtApp()
// Só o contrato de revert() interessa: evita arrastar os tipos do gsap para dentro do SFC.
let ctx: { revert: () => void } | null = null

onMounted(() => {
  const el = raiz.value
  if (!el || !$gsap) return
  const q = (sel: string) => el.querySelectorAll(sel)

  ctx = $gsap.context(() => {
    // Timeline única, ligada à rolagem (app/utils/cena.ts). A regra antiga desta seção
    // ("nada de scrub em reveal, é scrolljacking disfarçado") valia enquanto o site tinha
    // uma cena por seção disparando sozinha; a referência que o projeto agora segue é
    // scrub de ponta a ponta, e scrub só é scrolljacking quando SEQUESTRA a rolagem —
    // aqui a página continua rolando na velocidade do dedo, o que muda é só quem lê o
    // progresso. Tudo em .from(): o estado FINAL é o que o CSS/SSR já entregou.
    const tl = $gsap.timeline({ scrollTrigger: cenaScrub(el) })

    // WIPE CRUZADO — os três blocos são revelados por uma cortina, e o SENTIDO alterna:
    // ímpar de baixo para cima, par de cima para baixo. É o que a referência faz com os
    // dois cartões de filme (medido: um clipando de 303px→910px enquanto o outro ia de
    // 596px→−10px), e o cruzamento é o efeito: dois cartões abrindo no mesmo sentido
    // leriam como uma lista aparecendo, não como um par.
    //
    // Fora da timeline de reveal e com gatilho por bloco: os três estão em faixas
    // diferentes da tela e um gatilho comum abriria o terceiro antes de ele chegar.
    // (O stagger da timeline continua valendo para os TÍTULOS, que é onde ele importa.)
    if (!$prefersReducedMotion?.()) {
      q('.luas-bloco').forEach((bloco, i) => {
        const deCima = i % 2 === 0
        $gsap.fromTo(
          bloco,
          // A cortina fechada: 100% do lado por onde ela vai abrir.
          //
          // UNIDADE EXPLÍCITA NOS QUATRO COMPONENTES, DOS DOIS LADOS. `inset(0 0 100% 0)`
          // → `inset(0 0 0 0)` faz o terceiro número ir de `100%` para um zero SEM unidade,
          // e o GSAP não interpola através de troca de unidade: ele mantém a string inicial
          // o curso inteiro e troca pela final de uma vez. Medido em 2026-08-03 amostrando
          // a cada 50px de rolagem: o clip-path computado tinha só DOIS valores distintos
          // (`inset(0px 0px 100%)` e `inset(0px)`), nenhum intermediário — a cortina PULAVA
          // de fechada para aberta em vez de abrir. Mesma forma já usada em
          // S2bDuasFaces.vue e S5ArquivoTaro.vue.
          { clipPath: deCima ? 'inset(0% 0% 100% 0%)' : 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            // 0,67 de dobra de curso — os 600px medidos na referência sobre os 900 dela.
            scrollTrigger: cenaScrub(bloco as Element, { start: 'top 90%', end: 'top 23%' })
          }
        )
      })
    }

    // Movimento reduzido é MENOS movimento, não ausência dele (PRD §6): some o
    // deslocamento, fica a opacidade — 200ms, sem stagger, sem paralaxe. O scale(.97)
    // do :active sobrevive porque vive em CSS.
    if ($prefersReducedMotion?.()) {
      // fromTo e NÃO from — com DESTINO EXPLÍCITO.
      //
      // `.from({opacity: 0})` faz o GSAP LER o destino do DOM na inicialização. Medido em
      // 2026-08-03: aqui ele lia 0 (o próprio estado inicial que o tween acabara de
      // escrever) e o tween virava `0 → 0`; os três títulos, os três parágrafos e os três
      // números ficavam INVISÍVEIS para sempre, com o gatilho marcando progresso 1. É o
      // sintoma de "a animação para de funcionar depois de um tempo", e em movimento
      // reduzido — que é o caminho da maioria das máquinas com efeitos do Windows
      // desligados — significava seção em branco. Escrevendo o destino à mão não há o que
      // reler nem o que envenenar. Mesma razão pela qual S2bDuasFaces e S6Travessia já
      // usam fromTo.
      tl.fromTo(
        q('.luas-linha, .luas-num-topo, .luas-texto, .luas-num-base'),
        { opacity: 0 },
        { opacity: 1, duration: 0.2 }
      )
      return
    }

    tl
      // mask-line-up: o título sobe por trás do overflow de .jm-mask. Sem SplitText —
      // cada título é uma palavra só, logo uma linha garantida, e o par .jm-mask/.luas-linha
      // já é a máscara: dividir aqui seria mexer no DOM do <h3> para nenhum ganho.
      //
      // Os clearProps desta timeline saíram junto com o `once`: com scrub, o tween
      // "termina" toda vez que a rolagem cruza o fim do curso, e limpar o transform ali
      // deixa a subida sem nada para interpolar — o título saltaria de volta em vez de
      // descer atrás da máscara. O transform fica inline; é o preço da reversibilidade.
      // fromTo (destino explícito) em toda a cena, pelo motivo do ramo reduzido acima:
      // `.from()` relê o destino do DOM e pode gravar o próprio estado inicial como alvo.
      .fromTo(q('.luas-linha'), { yPercent: 110 }, {
        yPercent: 0,
        duration: 0.5,
        stagger: 0.08
      }, 0)
      // Números do topo entram junto do próprio título — mesmo stagger, mesma posição.
      // O PRD pede `ease` (não --ease-out) só nesta linha; power1.inOut é essa curva.
      .fromTo(q('.luas-num-topo'), { opacity: 0 }, {
        opacity: 1,
        duration: 0.3,
        stagger: 0.08,
        ease: 'power1.inOut'
      }, 0)
      // 8px é empurrãozinho, não deslocamento pelo próprio tamanho: aqui px é o certo.
      .fromTo(q('.luas-texto'), { opacity: 0, y: 8 }, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.06
      }, 0.24)
      // Fecho do bloco: os três juntos, SEM stagger entre si, bem depois dos parágrafos.
      // Parte de .86 — o número tem forma antes de ter tamanho. Nunca de 0.
      // transform-origin: left center vem do CSS; o GSAP escreve só a matriz.
      .fromTo(q('.luas-num-base'), { opacity: 0, scale: 0.86 }, {
        opacity: 1,
        scale: 1,
        duration: 0.3
      }, 0.4)

    // Paralaxe da foto de fundo — o único scrub da seção, e pela mesma razão do hero:
    // é imagem de fundo, o texto não acompanha. O recorte tem 6% de folga em cada ponta
    // (CSS), então ±4% do próprio quadro nunca descola a foto da borda.
    const box = midia.value
    const foto = box?.querySelector('img')
    if (box && foto) {
      $gsap.fromTo(
        foto,
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: 'none',
          scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
        }
      )
    }

    // A SAÍDA (app/utils/cena.ts). O afastamento vai no CONTÊINER, nunca na <img>: ela já
    // carrega o paralaxe acima, e dois ScrollTriggers escrevendo transform no mesmo
    // elemento se sobrescrevem quadro a quadro. Com a foto descendo por dentro da caixa
    // que sobe, os dois planos se afastam — que é justamente o efeito da referência.
    $gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: saidaDeSecao(el.closest('section')) })
      .to(box, {
        scale: SAIDA_FUNDO_ESCALA,
        y: () => window.innerHeight * SAIDA_FUNDO_Y,
        duration: 0.67
      }, 0)
      .to(selo.value, { opacity: 1, duration: 0.9 }, 0.1)
    // Escopo é o elemento resolvido, não a ref do Vue: o gsap.context lê .current
    // (React) ou .nativeElement (Angular), nunca .value — uma ref cairia em "Invalid
    // scope" no primeiro seletor por string.
  }, el)
})

onBeforeUnmount(() => {
  ctx?.revert()
  ctx = null
})
</script>

<style scoped>
/* ============================================================
   MÍDIA — full-bleed atrás de tudo.
   Sem z-index: a mídia é position:absolute e o conteúdo vem depois no DOM também
   posicionado, então pinta por cima por ordem de documento.
   ============================================================ */
.selo-saida {
  position: absolute;
  inset: 0;
  /* Acima da mídia, abaixo do conteúdo (UiContainer é relative): os três blocos seguem
     legíveis enquanto o fundo já está sendo coberto. */
  z-index: 1;
  background-color: var(--color-noite);
  opacity: 0;
  pointer-events: none;
}

.luas-media {
  position: absolute;
  inset: 0;
  /* Folga vertical para a SAÍDA: a caixa sobe 0,67 de dobra e encolhe a 0,94, e sem
     sobra o topo abriria uma faixa da superfície antes de o selo fechar. Lateral fica em
     0 — o movimento da saída é só no eixo Y. */
  inset-block: -12%;
  overflow: hidden;
}

.luas-foto {
  position: absolute;
  /* Folga de 6% em cada ponta: é o curso que o paralaxe consome sem descolar a foto da
     borda do recorte. Altura fixa em CSS — o que anima é transform, nunca height. */
  top: -6%;
  left: 0;
  width: 100%;
  height: 112%;
  object-fit: cover;
  /* Retrato 4000×6000 numa faixa larga: o corte é só no eixo Y. 52% mantém rosto e
     torso dentro da banda em qualquer altura de seção. */
  object-position: center 52%;
}

/* ============================================================
   GRADE — mobile primeiro: tudo empilhado (título → parágrafo → número).
   ============================================================ */
.luas-eyebrow {
  margin-bottom: clamp(2.5rem, 6vw, 5rem);
}

.luas-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  row-gap: clamp(3rem, 8vw, 4.5rem);
  column-gap: clamp(1.5rem, 3vw, 3rem);
}

.luas-bloco {
  text-decoration: none;
  /* [data-pressable] global já entrega o scale(.97) no :active. */
}

/* Sem gap aqui: o espaçamento vertical vem de margin no corpo, porque em ≥1280px este
   elemento vira subgrid e um gap próprio sobrescreveria as calhas do grid pai. */
.luas-artigo {
  display: flex;
  flex-direction: column;
}

.luas-cabeca {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  /* max-content solta o título da largura da coluna — é o que permite ele sangrar. */
  width: max-content;
}

.luas-titulo {
  /* DISPLAY (Lastik), herdado do @layer base — são títulos de escala grande, o tier de
     maior destaque. O LÍRICO fica com nome próprio de perto: os termos do
     glossário e o nome de cada item do arquivo.
     Disciplina didone: nunca abaixo de 28px, os fios capilares somem sobre escuro. */
  font-size: clamp(2rem, 7vw, 6rem);
  line-height: 1.1;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  white-space: nowrap;
}

/* O bloco que o mask-line-up sobe. Sem transform inicial e sem will-change: o estado
   inicial é do GSAP (.from) e o will-change entra e sai com o tween (force3D). */
.luas-linha {
  display: block;
}

.luas-num-topo {
  display: none; /* bookend só existe a partir de 768px (PRD §7) */
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  font-variant-numeric: tabular-nums;
}

.luas-corpo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: clamp(1rem, 2.5vw, 2rem);
}

/* REGISTRO em caixa alta. 1rem é o piso de corpo do sistema (00-indice §4); a medida
   curta é o que entrega as 3–4 linhas do PRD. */
.luas-texto {
  font-size: 1rem;
  line-height: 1.6;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  max-width: 36ch;
}

.luas-num-base {
  font-size: clamp(1.75rem, 3vw, 2.75rem);
  line-height: 1;
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
  margin-top: clamp(1.25rem, 3vw, 2rem);
  /* Cresce de onde está ancorado, não do próprio centro. Fica no CSS de propósito: o
     GSAP escreve só a matriz de transform e herda esta origem. */
  transform-origin: left center;
  /* Opacidade final é 1, não os .38 da tabela do PRD §6 — e o motivo SOBREVIVEU à troca de
     tinta, contra a intuição. Partindo de 15,78:1 chapado, .38 parece folgado; medido, não
     é: compondo prata a 38% sobre esta foto esmagada o contraste cai para 3,02:1 no p95
     (mediana 2,93 · pior caso 2,02) e reprova o critério de aceite do PRD §9 (≥4,5:1).
     A opacidade não divide o contraste, ela aproxima a tinta do fundo — e como o fundo aqui
     JÁ é escuro, 62% dele contamina a prata quase inteira. Trava em 1. */
}

/* ============================================================
   768–1279px — títulos empilhados à esquerda, 3 colunas viram 2 + 1.
   O terceiro bloco não estica: o vão que sobra é o mesmo vazio do layout grande.
   ============================================================ */
@media (min-width: 768px) {
  .luas-num-topo {
    display: inline-block;
  }

  .luas-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* ============================================================
   ≥1280px — a grade assimétrica do PRD §3.
   subgrid é o que permite o <a> envolver título e parágrafo (exigência de A11y) mesmo
   com os dois morando em faixas diferentes da mesma grade. Sem suporte, cai no layout
   2+1 de tablet: degrada, não quebra.
   ============================================================ */
@media (min-width: 1280px) {
  @supports (grid-template-rows: subgrid) {
    .luas-grid {
      grid-template-columns: repeat(12, minmax(0, 1fr));
      /* faixa de título A · faixa de título B · corpo */
      grid-template-rows: auto auto auto;
      row-gap: clamp(0.5rem, 1vw, 1rem);
    }

    .luas-bloco,
    .luas-artigo {
      display: grid;
      grid-template-columns: subgrid;
      grid-template-rows: subgrid;
    }

    .luas-bloco {
      grid-row: 1 / -1;
    }

    .luas-artigo {
      grid-row: 1 / -1;
      grid-column: 1 / -1;
    }

    /* 2 títulos à esquerda (escalonados) e 1 à direita. Os corpos ocupam as colunas
       1–3, 4–6 e 7–9: as colunas 10–12 são o lugar do quarto pilar que não existe.
       NÃO PREENCHER. */
    .luas-bloco:nth-child(1) { grid-column: 1 / 4; }
    .luas-bloco:nth-child(2) { grid-column: 4 / 7; }
    .luas-bloco:nth-child(3) { grid-column: 7 / 13; }

    .luas-cabeca {
      grid-row: 1;
      grid-column: 1 / -1;
    }

    /* SOM desce uma faixa e já começa uma coluna à direita: é o escalonamento. */
    .luas-bloco:nth-child(2) .luas-cabeca { grid-row: 2; }
    .luas-bloco:nth-child(3) .luas-cabeca { justify-self: end; }

    .luas-corpo {
      grid-row: 3;
      grid-column: 1 / -1;
      margin-top: clamp(2.5rem, 5vw, 5rem);
    }

    /* O corpo de OURIVES ocupa só o primeiro terço do próprio vão — o resto é o vazio. */
    .luas-bloco:nth-child(3) .luas-corpo { grid-column: 1 / 4; }

    /* Sangram para fora do grid: o negativo cancela exatamente o padding do container
       (md:px-8 = 2rem), então os títulos das pontas encostam na borda da viewport sem
       gerar overflow horizontal. */
    .luas-bloco:nth-child(1) .luas-cabeca { margin-left: -2rem; }
    .luas-bloco:nth-child(3) .luas-cabeca { margin-right: -2rem; }
  }
}

/* ============================================================
   MOVIMENTO — docs/prd/S4-tres-luas.md §6.
   A coreografia inteira é uma timeline GSAP (ver <script>), inclusive o caminho de
   prefers-reduced-motion. O CSS aqui guarda só o ESTADO FINAL e o que é estado de UI:
   :hover e :active. Nada de opacity:0 ou transform inicial em CSS — o servidor entrega
   o conteúdo visível e o cliente só promove.
   ============================================================ */

/* Único gesto de hover: o título acende em branco — o destaque forte que os números
   (agora prata) deixaram de carregar. Branco sobre a foto esmagada dá 19,62:1 p95
   (12,06:1 p99) aqui, folga bem maior que a do ouro que ele substitui — nada de
   opacidade, que derrubaria o contraste. Fica em CSS de propósito: estado de UI não
   é cena. */
@media (hover: hover) and (pointer: fine) {
  .luas-titulo {
    transition: color var(--dur-ui) ease;
  }

  .luas-bloco:hover .luas-titulo {
    color: var(--color-branco);
  }
}
</style>
