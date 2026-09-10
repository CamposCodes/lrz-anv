<template>
  <!-- S3 · MANIFESTO — docs/prd/S3-manifesto.md
       A seção deixou de ser um bloco de texto sobre estilhaços e virou uma CENA DE CURSO:
       a foto desce atrás de um palco grudado na dobra e a fala se escreve em cinco tempos,
       cada um apagando o anterior. É a mesma mecânica da pilha de abertura
       (app/pages/index.vue) e da referência: nada dispara e acaba, tudo é scrub e o dedo é
       o playhead nos dois sentidos.

       Por que a foto desce e não os textos: o retrato é vertical (3456×5184) e a dobra é
       horizontal — só cabe um recorte por vez. Percorrê-lo de cima a baixo é o que mostra a
       artista inteira sem nunca encolhê-la para caber. O texto fica parado no mesmo lugar
       da tela justamente para que o único movimento seja o da foto passando por trás dele.

       Estado sem JS (e em movimento reduzido): a classe .manifesto--cena nunca é adicionada,
       o palco perde a altura de curso e o sticky, e as cinco falas ficam uma DEPOIS da outra
       em fluxo normal, legíveis, sobre a foto parada. É o que o servidor entrega — o
       movimento é promoção, como no resto do site. -->
  <UiSection
    surface="noite"
    fill="solid"
    padding="none"
    aria-label="Manifesto"
  >
    <div ref="palco" class="palco">
      <!-- A moldura é quem RECORTA, não o palco: com overflow no palco, uma fala mais alta
           que a dobra (celular estreito, corpo grande) seria decapitada junto com a foto.
           Aqui o corte pega só a imagem, que é o único elemento maior que a tela. -->
      <div class="moldura" aria-hidden="true">
        <!-- IMG_2060: contraluz vermelho, quadro inteiro em baixa luz. Esmagada a 0,40
             (.jm-crush, o mesmo do resto do site) a prata mede 5,04:1 no PIOR pixel do
             quadro — p99 5,10:1, p95 5,45:1, mediana 16,75:1. Passa AA de CORPO em qualquer
             ponto do curso, que é o requisito real desta seção: com a foto descendo, o
             registro em mono 15px pode cair sobre qualquer região dela. Afrouxar para 0,45
             derruba o pior pixel para 4,06:1 e reprova o mono (o display continuaria
             passando). O teto é por foto e não se afrouxa (docs/prd/91-assets.md §2).

             sizes maior que 100vw de propósito: a imagem é DELIBERADAMENTE mais larga que a
             janela (ver .retrato) — é o que garante altura de sobra para a descida em tela
             estreita. Pedir 100vw entregaria um candidato menor que o tamanho renderizado e
             a foto sairia mole. -->
        <NuxtImg
          src="/images/site/manifesto.jpg"
          alt=""
          width="3456"
          height="5184"
          sizes="200vw md:150vw xl:100vw"
          format="webp"
          loading="lazy"
          decoding="async"
          class="retrato jm-crush"
        />
      </div>

      <UiContainer size="lg" class="relative z-10">
        <!-- Assimetria deliberada: colunas 2–8 de 12, nunca centralizado. Centralizar aqui
             produziria um bloco simétrico que compete com o glossário de S2. -->
        <div class="md:grid md:grid-cols-12">
          <div class="md:col-span-7 md:col-start-2">
            <div class="falas">
              <!-- As cinco falas existem TODAS no HTML, na ordem, como parágrafos de
                   verdade: é este bloco que o crawler lê e que um LLM cita. O que o GSAP
                   faz é só decidir qual delas está visível em cada ponto do curso. -->
              <p v-for="(fala, i) in FALAS" :key="i" class="fala">
                <!-- Tipo de tamanhos mistos inline (PRD §2 — "isto fica"): as palavras de
                     ligação em ~36% do corpo, na mesma linha das grandes.
                     OS ESPAÇOS MORAM DENTRO DAS PARTES MIÚDAS. Entre dois <span> irmãos
                     gerados por v-for não existe nó de texto nenhum, e as palavras
                     colariam; pôr o espaço no span pequeno resolve os dois lados de uma vez
                     e ainda garante que todo espaço da frase seja renderizado no corpo
                     PEQUENO — no corpo grande, entre duas palavras miúdas, ele lê como
                     espaço duplo (era o bug da versão anterior desta seção). -->
                <span v-for="(parte, j) in fala" :key="j" :class="{ ligacao: parte.miudo }">{{ parte.texto }}</span>
              </p>
            </div>

            <!-- Camada REGISTRO — não entra na cena: fica a seção inteira, é a âncora local
                 (Juiz de Fora / Minas Gerais) que sustenta o Person do JSON-LD da home.
                 Caixa alta por CSS, não no DOM: leitor de tela soletra sigla de texto todo
                 em maiúsculas. -->
            <p class="apoio">DJ, taróloga e ourives. Juiz de Fora, Minas Gerais.</p>
          </div>
        </div>
      </UiContainer>
    </div>
  </UiSection>
</template>

<script lang="ts" setup>
/**
 * A fala, dividida nos tempos em que ela respira — um por dobra de leitura.
 *
 * O corte segue a pontuação da autora, não a contagem de caracteres: cada fala é uma
 * unidade que se entende sozinha na tela, porque na cena ela aparece sozinha. A terceira
 * é a mais densa de propósito — é o centro do texto ("não sou um personagem"), e quebrá-la
 * em duas separaria a negação da lista que a justifica.
 *
 * `miudo` marca a palavra de ligação (o comentário da frase). Duas partes miúdas NUNCA
 * podem ficar adjacentes: elas carregam os espaços da frase e o resultado seria espaço
 * duplo. Por isso toda fala alterna grande/miúda.
 */
const FALAS: { texto: string, miudo?: boolean }[][] = [
  [
    { texto: 'A lua tem várias fases,' },
    { texto: ' mas no fim das contas, ', miudo: true },
    { texto: 'é uma coisa só.' }
  ],
  [
    { texto: 'Tudo isso é Jessica Americana.' },
    { texto: ' Mas a lua cheia… ', miudo: true },
    { texto: 'a lua cheia é Jazz Moon.' }
  ],
  [
    { texto: 'Não sou um personagem.' },
    { texto: ' Sou o alinhamento de quem eu sempre fui: ', miudo: true },
    { texto: 'a pulsação da música' },
    { texto: ' (DJ), ', miudo: true },
    { texto: 'a intuição do Tarot e a arte das joias.' }
  ],
  [
    { texto: 'Três ofícios,' },
    { texto: ' três maneiras de ', miudo: true },
    { texto: 'ler a mesma noite.' }
  ],
  [
    { texto: 'Cada fase é um jeito diferente' },
    { texto: ' de fazer a mesma pergunta ', miudo: true },
    { texto: 'e de não ter pressa para a resposta.' }
  ]
]

const palco = ref<HTMLElement | null>(null)

const { $gsap, $prefersReducedMotion } = useNuxtApp()

let ctx: { revert: () => void } | null = null

onMounted(() => {
  const secao = palco.value?.parentElement
  if (!$gsap || !palco.value || !secao) return

  // Movimento reduzido: a cena NÃO é criada. Não é o §12 (some o deslocamento, fica a
  // opacidade) porque aqui o deslocamento é o conteúdo — uma versão "reduzida" desta cena
  // seria cinco parágrafos piscando no mesmo lugar. Sem a classe, a seção é um bloco de
  // texto comum sobre a foto parada, que é o estado do servidor.
  if ($prefersReducedMotion?.()) return

  // A ALTURA DE CURSO — só existe se o GSAP estiver vivo. Com JS falho seriam 350svh de
  // rolagem morta com um palco grudado no topo. Mesma decisão (e mesmo lugar: quem cria a
  // cena é quem sabe que ela vai rodar) da .abertura--pilha em S1Hero.vue.
  //
  // classList e não uma classe reativa: o ScrollTrigger é criado logo abaixo, na MESMA
  // execução, e precisa medir a seção já alta. Um :class dependeria do próximo tick e ele
  // mediria os 100svh antigos.
  secao.classList.add('manifesto--cena')

  ctx = $gsap.context(() => {
    const retrato = secao.querySelector<HTMLElement>('.retrato')
    if (!retrato) return

    // start 'top top' → end 'bottom bottom' é EXATAMENTE o trecho em que o palco fica
    // grudado: ele cola quando o topo da seção encosta no topo da tela e solta quando a
    // base da seção alcança a base da tela. Amarrar a cena ao mesmo par significa que
    // mudar --curso no CSS reprograma a seção inteira sem tocar em número nenhum aqui.
    const cena = $gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: secao,
        start: 'top top',
        end: 'bottom bottom',
        // 0,8 e não true: a referência roda sob ScrollSmoother e a rolagem dela é
        // amortecida; com true a cena cola no dedo e fica seca (app/utils/cena.ts).
        scrub: 0.8,
        // O y da descida é FUNÇÃO (mede a foto renderizada) e o destino é explícito —
        // exatamente o caso em que a flag é segura e necessária: sem ela, girar o celular
        // mantém o percurso medido em retrato e a foto para de descer até o fim, ou desce
        // demais e abre a superfície embaixo. Ver o comentário longo em app/utils/cena.ts
        // sobre por que ela é PROIBIDA em cena de `.from()`.
        invalidateOnRefresh: true
      }
    })

    // A DESCIDA — a foto percorre, de cima a baixo, tudo o que sobra dela para fora da
    // dobra. A conta é a folga real (altura renderizada − altura do palco), então vale em
    // qualquer proporção de tela: no desktop a foto tem ~1,4 dobra de sobra, no celular
    // ~0,5 (ver .retrato). Nunca pixel fixo — docs/prd/90-movimento.md §4.
    cena.fromTo(retrato,
      { y: 0 },
      { y: () => palco.value!.offsetHeight - retrato.offsetHeight, duration: FALAS.length },
      0)

    // AS FALAS — uma dobra de curso cada (1 unidade da timeline = 1/5 do curso).
    // Entra em [i−0,12 · i+0,14] e sai em [i+0,74 · i+1,00]: as janelas se encavalam por
    // 0,14 e é esse encavalamento que faz uma APAGAR a outra em vez de existir um vão preto
    // entre as duas. O deslocamento de 24px é o que impede a troca de ler como piscada.
    //
    // fromTo em tudo, nunca from: com scrub, "terminar" acontece toda vez que a rolagem
    // cruza o fim, e subindo de volta um from() sem estado inicial explícito não tem o que
    // interpolar — a fala salta (o mesmo motivo documentado em S2bDuasFaces.vue).
    const falas = $gsap.utils.toArray<HTMLElement>('.fala')

    falas.forEach((fala, i) => {
      cena.fromTo(fala,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.26 },
        Math.max(0, i - 0.12))

      // A última não sai: ela segura a tela enquanto o palco se solta e a seção sobe. Uma
      // saída ali deixaria a foto sozinha por meia dobra antes da S4 — e o fecho do
      // manifesto é justamente a frase, não a imagem.
      if (i < falas.length - 1) {
        cena.to(fala, { opacity: 0, y: -24, duration: 0.26 }, i + 0.74)
      }
    })
  }, secao)
})

onBeforeUnmount(() => {
  ctx?.revert()
  ctx = null
})
</script>

<style scoped>
.palco {
  position: relative;
  display: grid;
  align-content: center;
  /* Sem cena (JS falho, movimento reduzido) o palco é uma dobra de altura MÍNIMA: o texto
     cresce à vontade e a seção acompanha. Com cena ela é travada em 100svh logo abaixo. */
  min-height: 100svh;
  padding-block: clamp(2rem, 10svh, 6rem);
}

.moldura {
  position: absolute;
  inset: 0;
  z-index: 0;
  /* O corte da foto mora AQUI, não no palco: ver o comentário no template. */
  overflow: clip;
  /* justify-items centra a foto na horizontal — ela é mais larga que a janela de
     propósito. align-content start a ancora no topo: é de lá que a descida parte. */
  display: grid;
  justify-items: center;
  align-content: start;
  pointer-events: none;
}

/* A LARGURA É QUEM DEFINE A ALTURA — e a altura é o curso da descida.
   O retrato é 2:3, então `height: auto` dá 1,5 × a largura. Em tela larga (1440×900) os
   100% já rendem 2160px de foto contra 900 de dobra: 1,4 dobra de sobra para descer. Em
   tela estreita (390×844) os mesmos 100% dariam 585px — MENOS que a dobra, e não haveria
   descida nenhuma, só uma faixa parada. O max() com 100svh força a foto a ter sempre pelo
   menos 150svh de altura (150% de sobra − 100% de dobra = meia dobra de curso), ao preço
   de ela sangrar para os lados, que o overflow da moldura corta.
   object-fit não resolveria isto: ele recorta DENTRO da caixa, e o que precisamos é de uma
   caixa maior que a tela para percorrer. */
.retrato {
  display: block;
  width: max(100%, 100svh);
  /* O preflight do Tailwind aplica `max-width: 100%` a toda <img> e ele VENCE a largura
     acima — medido em 390×844: a foto voltava para 390×585, ou seja MENOR que a dobra, e
     a descida invertia de sinal (a folga vira negativa): em vez de percorrer o retrato,
     ela deslizava para baixo abrindo uma faixa vazia no topo do palco. No desktop o bug é
     invisível, porque lá os 100% já são o maior dos dois valores. */
  max-width: none;
  height: auto;
}

.falas {
  display: grid;
  /* Sem cena, as cinco falas são uma LISTA vertical legível. Com cena elas ocupam a mesma
     célula e o gap deixa de existir (regra abaixo). */
  gap: clamp(1.5rem, 4vw, 2.5rem);
}

/* DISPLAY (Lastik) — o manifesto é um dos textos maiores do site e entra no tier de maior
   destaque, junto da headline do hero e dos títulos de seção.
   Sentence case: o manifesto é fala, não grito.
   O corpo é menor que o da versão anterior (era até 4,5rem) porque agora são CINCO falas
   no mesmo lugar e a mais longa tem de caber na dobra inteira, com o registro embaixo. */
.fala {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-synthesis: none;
  font-size: clamp(2rem, 4.6vw, 3.5rem);
  line-height: 1.06;
  letter-spacing: -0.012em;
  color: var(--color-fg);
  text-wrap: pretty;
}

/* 36% do corpo grande, com piso de 19px: abaixo disso o fio capilar da didone some e a
   ligação deixa de ser lida como texto. O em resolve contra o <p>, então a proporção segue
   valendo se o display crescer. */
.ligacao {
  font-size: max(19px, 0.36em);
  vertical-align: baseline;
  letter-spacing: 0.005em;
}

/* O acento cromático é proibido sobre esta foto, como sobre todas as fotos do acervo:
   sangue #D30000 não chega perto do piso em nenhuma delas. A prata mede 5,04:1 no pior
   pixel desta aqui, esmagada a 0,40 — passa AA de corpo, que é o piso que ESTE parágrafo
   (mono, 15px) precisa. */
.apoio {
  margin: clamp(1.75rem, 4vw, 2.75rem) 0 0;
  max-width: 54ch;
  font-family: var(--font-mono);
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.7;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--color-fg);
  opacity: 0.72;
  text-wrap: pretty;
}
</style>

<style>
/* A CENA mora fora do scoped porque a classe é adicionada na <section> pelo script, e o
   <section> é renderizado pelo UiSection — o atributo de escopo deste componente não chega
   nele. Os seletores descem a partir de .manifesto--cena, que só existe aqui.

   350svh de curso = 70svh por fala. Encurtar aqui acelera a cena inteira e é o ÚNICO
   número a mexer para isso: a timeline se amarra a 'top top' → 'bottom bottom', ou seja
   ela se reprograma sozinha para qualquer valor que estiver aqui. */
.manifesto--cena {
  height: calc(100svh + 350svh);
}

.manifesto--cena .palco {
  position: sticky;
  top: 0;
  height: 100svh;
  min-height: 0;
}

/* As cinco falas na MESMA célula da grade — é o que permite uma apagar a outra sem
   deslocamento de layout. align-self start (e não stretch) faz todas começarem na mesma
   linha de topo: com alturas diferentes, centralizar cada uma faria o bloco pular a cada
   troca. A altura da caixa passa a ser a da fala mais alta, e o registro embaixo dela fica
   parado o curso inteiro. */
.manifesto--cena .falas {
  gap: 0;
}

.manifesto--cena .fala {
  grid-area: 1 / 1;
  align-self: start;
}
</style>
