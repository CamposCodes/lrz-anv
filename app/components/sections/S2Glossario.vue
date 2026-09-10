<template>
  <!-- O nome tem duas metades e esta seção define uma de cada vez. É o ativo de AEO do
       site — a resposta pronta para "o que significa Jazz Moon?" — e por isso a marcação
       é <dl>/<dt>/<dd> de verdade: o DefinedTermSet publicado em app/pages/index.vue
       espelha exatamente este conteúdo, e dado estruturado sem conteúdo visível é
       penalizado. Mudou o texto aqui, muda lá junto. -->
  <UiSection
    surface="papel"
    fill="solid"
    padding="xl"
    class="glossario"
    aria-labelledby="glossario-rotulo"
  >
    <UiContainer size="lg">
      <!-- Raiz do gsap.context e gatilho do ScrollTrigger: o bloco inteiro, não o <dl>.
           Disparar pelo <dl> deixaria o rótulo na tela há ~180px de rolagem quando a cena
           começasse. -->
      <div ref="alvo">
        <div class="registro registro-topo">
          <h2 id="glossario-rotulo" class="rotulo">SIGNIFICADO:</h2>
          <p class="sigla">jm</p>
        </div>

        <dl class="verbete">
          <div class="grupo grupo-jazz">
            <dt class="termo">
              <!-- .jm-mask (global) = overflow:hidden; a linha interna sobe por trás dela.
                   A linha NÃO usa a classe .jm-mask-line: aquela é a classe que o SplitText
                   injeta e ela carrega will-change: transform permanente (tailwind.css) —
                   aqui o termo é UMA palavra, não há linha para dividir, e promover dois
                   spans a camada composta para sempre por uma animação que roda uma vez é
                   exatamente o que docs/prd/90-movimento.md proíbe. O GSAP promove sozinho
                   durante o tween (force3D) e desfaz no fim. -->
              <span class="jm-mask"><span class="termo-linha">Jazz</span></span>
            </dt>
            <dd class="definicao">
              O caos que escuta. A improvisação como método.
            </dd>
          </div>

          <div class="grupo grupo-moon">
            <dt class="termo">
              <span class="jm-mask"><span class="termo-linha">Moon</span></span>
            </dt>
            <dd class="definicao">
              O silêncio que atravessa. A fase que volta sempre diferente.
            </dd>
          </div>
        </dl>

        <div class="registro registro-base">
          <p>ritmo</p>
          <p>ritual</p>
        </div>
      </div>
    </UiContainer>
  </UiSection>
</template>

<script lang="ts" setup>
// A cena inteira em UMA timeline: os seis tempos do PRD (§5) ficam num lugar só, como
// posição absoluta na linha do tempo, em vez de sete transition-delay espalhados pelo CSS
// e um IntersectionObserver por fora para destravá-los.
//
// Tudo é .from(): o estado FINAL é o que o CSS entrega, então o HTML do servidor já sai
// legível para crawler e leitor de tela e o cliente só promove a partir dele. Se o JS
// falhar, a seção fica lida — nunca invisível.
const { $gsap, $prefersReducedMotion } = useNuxtApp()

const alvo = ref<HTMLElement | null>(null)

let ctx: { revert: () => void } | null = null
let mm: { revert: () => void } | null = null

onMounted(() => {
  const el = alvo.value
  // Sem GSAP nada anima e tudo permanece no estado final — que é o que o SSR já entregou.
  if (!el || !$gsap) return

  ctx = $gsap.context(() => {
    // O GATILHO É A PILHA, não este bloco. Empilhado atrás da hero (ver app/pages/index.vue),
    // o glossário está na tela desde o scroll 0 — 'top 85%' dispararia com ele ainda
    // inteiramente escondido pela dobra e a cena rodaria para ninguém. O que revela esta
    // seção é o recorte da hero, então é o curso DELE que tem de conduzir a cena.
    //
    // Fora da home não há pilha; ali o bloco volta a ser o próprio gatilho.
    // start/end em % da VIEWPORT contados do topo da pilha: a cena da hero gasta 240svh,
    // a fenda só termina de fechar aos 80svh e é a partir dali que este bloco começa a
    // aparecer pelo recorte. 70% → 170% = a cena inteira acontece na janela em que o
    // leitor de fato vê o glossário, e desfaz na mesma proporção ao subir.
    // '.abertura--pilha' e NÃO '.abertura': o <div class="abertura"> está sempre no DOM
    // (app/pages/index.vue); quem é condicional é a classe da pilha, adicionada pela S1Hero
    // só quando a cena vai rodar. Em movimento reduzido a S1Hero sai antes de adicioná-la e
    // esta seção volta ao fluxo normal — mas o teste antigo continuava dando verdadeiro e
    // ancorava a cena numa janela de 70%→170% da viewport contada do topo de um bloco que
    // já não empilha nada. O verbete nascia invisível e revelava num ponto sem relação com
    // onde ele está. A ordem de montagem garante que a classe já esteja lá: a S1Hero é irmã
    // anterior no template.
    const pilha = el.closest('.abertura--pilha')
    const gatilho = pilha
      // Sem invalidateOnRefresh: os tweens deste gatilho são .from() e a flag os mataria
      // (ver o comentário em app/utils/cena.ts). Nenhum deles tem valor em função — a
      // convergência, que tem, monta o próprio gatilho mais abaixo, com a flag.
      ? { trigger: pilha, start: 'top top-=70%', end: 'top top-=170%', scrub: 0.8 }
      : cenaScrub(el)

    // Movimento reduzido: some o deslocamento, fica a opacidade (200ms) — ela é o que
    // explica que algo mudou.
    if ($prefersReducedMotion?.()) {
      $gsap.fromTo('.registro > *, .termo-linha, .definicao',
        { opacity: 0 },
        { opacity: 1, duration: 0.2, scrollTrigger: gatilho })
      return
    }

    const tl = $gsap.timeline({ scrollTrigger: gatilho })

    // fromTo em vez de from em TODA cena de reveal do site.
    //
    // `.from()` faz o GSAP LER o destino do DOM ao inicializar. Se a inicialização cair num
    // instante em que o elemento já está no estado inicial que o próprio tween escreveu, o
    // destino relido é esse mesmo estado e o tween vira `0 → 0`: o conteúdo não aparece
    // mais, com o gatilho marcando progresso 1. Medido em 2026-08-03 em S4, S5 e S8 — é o
    // sintoma de "a animação para de funcionar depois de um tempo". Com o destino escrito à
    // mão não há o que reler nem o que envenenar.
    tl
      // Rótulo e sigla abrem a cena, sem atraso.
      .fromTo('.registro-topo > *', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0)
      // mask-line-up: a máscara (overflow:hidden) já está no HTML, o GSAP só sobe a linha.
      // Stagger de 0,08 = os 80ms entre Jazz e Moon, que é o teto do sistema (§8).
      //
      // clearProps SAIU junto com o `once`: ele devolve o transform ao CSS quando o tween
      // acaba, e com scrub "acabar" é só cruzar o fim do curso — subindo de volta não há
      // mais matrix para interpolar e a linha salta do lugar. O custo é o inverso do que
      // o comentário antigo dizia: o transform fica inline, e cada span segue sendo
      // contexto de empilhamento. É o preço de a cena ser reversível.
      .fromTo('.termo-linha', { yPercent: 100 }, { yPercent: 0, duration: 0.5, stagger: 0.08 }, 0.08)
      // y em pixel (e não yPercent) porque os 8px do PRD são um respiro fixo, não uma
      // fração da altura de um bloco que muda de 2 para 4 linhas conforme a largura.
      .fromTo('.definicao', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 }, 0.24)
      // Rodapés por último: o verbete já foi lido quando ritmo/ritual aparecem.
      .fromTo('.registro-base > *', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.4)

    // O ECLIPSE (dois discos vermelhos no vão entre as colunas) foi REMOVIDO a pedido —
    // template, timeline e geometria saíram juntos. O vão do .verbete deixou de ser
    // derivado do diâmetro dos discos e passou a ser espaçamento comum (ver <style>).
    mm = $gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      // ------------------------------------------------------------------
      // A CONVERGÊNCIA — as duas metades do verbete andam uma na direção da outra.
      //
      // Acontece BEM depois da cena acima (250→330svh contra 70→170svh), quando o
      // verbete já foi lido e a fita da hero já virou traço: é o último movimento antes
      // de as duas faces cobrirem a tela. Gatilho próprio e não outro tempo na timeline
      // do verbete justamente por isso — misturar as duas janelas obrigaria a esticar
      // aquela cena por 260svh de curso só para caber esta no fim.
      //
      // Só no desktop: abaixo de 1024px o glossário empilha em coluna única e as duas
      // metades já estão uma sobre a outra — não há o que aproximar, e o deslocamento
      // horizontal ali só tiraria o texto da coluna.
      if (!pilha) return

      // transformOrigin apontando para o CENTRO da tela: assim o encolhimento já puxa
      // cada bloco na direção certa, e o x só fecha o que sobra. Com origin no meio do
      // próprio bloco seria preciso quase o dobro de deslocamento para o mesmo efeito.
      const convergir = {
        scale: 0.72,
        ease: 'none',
        scrollTrigger: {
          trigger: pilha,
          start: 'top top-=250%',
          end: 'top top-=330%',
          scrub: 0.8,
          // O deslocamento é função da largura da janela (abaixo): sem isto congelaria no
          // valor da primeira medida e o giro do aparelho descalibraria a cena.
          invalidateOnRefresh: true
        }
      }

      $gsap.to('.grupo-jazz', {
        ...convergir,
        x: () => window.innerWidth * 0.06,
        transformOrigin: 'right center'
      })
      $gsap.to('.grupo-moon', {
        ...convergir,
        x: () => window.innerWidth * -0.06,
        transformOrigin: 'left center'
      })
    })
  }, el)
})

onBeforeUnmount(() => {
  // mm primeiro: ele guarda a convergência e os listeners de media query.
  mm?.revert()
  ctx?.revert()
  mm = null
  ctx = null
})
</script>

<style scoped>
/* ------------------------------------------------------------------
   Este bloco entrega o ESTADO FINAL de tudo que é texto. Quem esconde e revela é a
   timeline do <script> — o CSS não tem mais nenhum estado inicial de animação, e é isso
   que faz a seção ficar legível se o JS não rodar.
   ------------------------------------------------------------------ */
.glossario {
  --termo-fs: clamp(3.5rem, 7vw, 6.5rem);
  /* O tier lírico precisa de 1,233em de caixa (asc 1956 + desc 510 sobre upm 2000 — as
     métricas que o @font-face "Lirico Fallback" reproduz em tailwind.css) para caber
     inteiro. Abaixo disso o overflow:hidden da máscara decapita o "J" de Jazz. */
  --termo-lh: 1.25;
}

/* ------------------------------------------------------------------
   REGISTRO — rótulo, sigla e os dois rodapés
   ------------------------------------------------------------------ */
.registro {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

/* Fonte declarada no filho, não no pai: o <h2> carrega font-family: var(--font-display)
   da camada base, que ganha da herança. */
.registro > * {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.1em;
  /* Rótulo é tinta, não muted: o PRD dá 19,43:1 aos rótulos junto com as definições.
     Sigla e rodapés ficam em caixa mista como escritos — a caixa alta do REGISTRO vale
     para o rótulo, e "jm"/"ritmo"/"ritual" são assinatura, não etiqueta. */
  color: var(--color-fg);
}

.registro-topo {
  margin-bottom: 2.5rem;
}

.registro-base {
  margin-top: 4rem;
}

/* ------------------------------------------------------------------
   O VERBETE — duas colunas simétricas
   ------------------------------------------------------------------ */
.verbete {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* O vão era a largura do par de discos do eclipse (~16rem) mais 4rem de ar. Com os
     discos removidos ele deixou de ter conta a fechar e virou respiro: largo o bastante
     para as duas metades lerem como duas colunas, não como um parágrafo em duas partes. */
  column-gap: clamp(3rem, 8vw, 7rem);
}

.termo {
  /* 5,23:1 sobre papel — AA. A proibição de acento aqui morreu com o ouro: no papel o
     próprio vermelho É o acento, e ele passa como texto (5,23:1), não decoração vetada. */
  color: var(--color-sangue);
  /* LÍRICO, não DISPLAY (Lastik): aqui os termos SÃO o nome da marca sendo
     definido, e a letra tem de ser a da marca. O tier de display é para o que grita —
     este bloco sussurra um verbete. */
  font-family: var(--font-lirico);
  font-size: var(--termo-fs);
  line-height: var(--termo-lh);
  /* Caixa MISTA. É a única seção do site onde o lírico aparece assim, e é isso que faz
     ler verbete de dicionário em vez de título de seção. */
  text-transform: none;
  font-synthesis: none;

  /* O FILETE mora AQUI, e não no border-bottom da .jm-mask como antes.
     A .jm-mask é a caixa de recorte da animação (overflow:hidden, e a linha sobe de
     translateY(100%) por dentro dela), então ela tem de ficar COLADA na linha — não há
     onde pôr folga ali. Com o fio pendurado nela, ele nascia rente à cauda do "J" de Jazz
     (medido: 1px de vão numa caixa de 160px) e lia como sublinhado encostando na letra.
     No <dt> a máscara continua justa e a folga mora no padding, abaixo dela.
     width:fit-content mantém o fio na largura da palavra, como o da máscara era. */
  width: fit-content;
  padding-bottom: 0.16em;
  border-bottom: 1px solid var(--color-sangue);
}

/* display:block (e não inline-block) de propósito: um inline-block com overflow:hidden
   alinha a base pela margem inferior, o que empurraria a caixa do <dt> para baixo. */
.termo .jm-mask {
  display: block;
  width: fit-content;
}

/* Sem transform aqui: o repouso é o estado final e quem parte de translateY(100%) é o
   .from() da timeline. */
.termo-linha {
  display: block;
}

.definicao {
  margin-top: 1.5rem;
  max-width: 36ch;
  /* 19,43:1 — folga de sobra para o tracking aumentado. */
  color: var(--color-fg);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  /* Caixa alta por CSS, texto em caixa mista no HTML: o leitor de tela lê palavra, não
     sigla soletrada (docs/prd/S2-glossario.md §7). */
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-align: justify;
  text-align-last: left;
}

/* ------------------------------------------------------------------
   EMPILHADO — abaixo de 1024px o verbete vira coluna única.
   ------------------------------------------------------------------ */
@media (max-width: 1023px) {
  .verbete {
    grid-template-columns: 1fr;
    row-gap: 3rem;
    max-width: 36ch;
    margin-inline: auto;
  }

  .definicao {
    max-width: none;
  }
}

/* MOVIMENTO REDUZIDO não precisa de nada aqui: o estado de repouso no CSS já é o final, e
   o ramo reduzido da timeline faz a opacidade em 200ms. Sem transition nenhuma nesta
   seção, o bloco global de tailwind.css que zera transition-duration com !important não
   tem o que atropelar. */
</style>
