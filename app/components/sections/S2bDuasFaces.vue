<template>
  <!-- S2b · DUAS FACES — a terceira e última camada da pilha de abertura
       (app/pages/index.vue). O glossário diz o que cada metade do nome SIGNIFICA; aqui
       cada metade ganha rosto e um caminho: Jazz leva ao som, Moon leva ao ritual.
       Não é uma seção do PRD — é o fecho da cena de abertura, e por isso mora na pilha
       e não na sequência de seções.

       As duas fotos entram por sentidos opostos (uma descendo, outra subindo) e cobrem
       o verbete que acabou de convergir. O sentido cruzado é o efeito: as duas abrindo
       para o mesmo lado leriam como uma lista aparecendo, não como um par — é a mesma
       leitura registrada em S4TresLuas.vue.

       Tudo aqui nasce no estado FINAL: o servidor entrega as duas faces inteiras, com
       texto e CTA no lugar. Quem esconde e revela é o GSAP. Sem JS (ou em movimento
       reduzido) a pilha nem existe e este bloco vira uma seção comum de duas colunas. -->
  <section ref="raiz" class="faces" aria-label="As duas metades do nome">
    <article
      v-for="face in FACES"
      :key="face.termo"
      class="face"
      :class="`face--${face.chave}`"
    >
      <!-- alt="" — a foto é decorativa: quem carrega o conteúdo é o texto ao lado.
           loading lazy e NUNCA preload: o LCP é a foto da dobra (S1), e duas imagens de
           3456px disputando prioridade com ela atrasariam a métrica que o critério de
           aceite de S1-hero.md cobra. Elas só precisam estar prontas ~4 dobras depois. -->
      <NuxtImg
        :src="face.foto"
        alt=""
        :width="face.largura"
        :height="face.altura"
        sizes="100vw md:50vw"
        format="webp"
        loading="lazy"
        class="face-media jm-crush"
      />

      <div class="face-texto">
        <p class="face-registro">{{ face.registro }}</p>

        <!-- h2 e não h3: as duas faces são irmãs do rótulo do glossário na hierarquia da
             abertura. O termo repete o <dt> do verbete de propósito — lá ele é definido,
             aqui é chamado. Quem responde por "o que significa Jazz Moon" continua sendo
             o <dl> de S2, que é o que o DefinedTermSet espelha. -->
        <h2 class="face-titulo">{{ face.termo }}</h2>

        <a class="face-cta" :href="face.href" data-pressable>{{ face.cta }}</a>
      </div>
    </article>
  </section>
</template>

<script lang="ts" setup>
// Os dois destinos já existem como âncora na home (app/pages/index.vue): #som é a S4
// Três Luas e #taro é o arquivo de S5. Sem rota nova, sem página nova.
const FACES = [
  {
    chave: 'jazz',
    termo: 'Jazz',
    registro: 'som ₀₁',
    // As duas fotos não têm mais a mesma proporção, por isso a medida vem no registro e
    // não fixa no <NuxtImg>: um par width/height errado dá aspect-ratio errado no
    // placeholder e o wipe abre sobre um retângulo da altura errada.
    foto: '/images/site/face-jazz.jpg',
    largura: 3010,
    altura: 4445,
    href: '#som',
    cta: 'Escutar'
  },
  {
    chave: 'moon',
    termo: 'Moon',
    registro: 'ritual ₀₂',
    foto: '/images/site/face-moon.jpg',
    largura: 3261,
    altura: 4599,
    href: '#taro',
    cta: 'Ler'
  }
] as const

const { $gsap, $prefersReducedMotion } = useNuxtApp()

const raiz = ref<HTMLElement | null>(null)

let ctx: { revert: () => void } | null = null

onMounted(() => {
  const el = raiz.value
  if (!el || !$gsap) return

  // Movimento reduzido: a pilha nem chega a ser criada (S1Hero decide isso), então esta
  // camada já está em fluxo normal, inteira e legível. Não há o que reduzir — reduzir
  // aqui seria animar algo que não deveria estar animando.
  if ($prefersReducedMotion?.()) return

  // '.abertura--pilha' e NÃO '.abertura': o <div class="abertura"> está sempre no DOM
  // (app/pages/index.vue); quem é condicional é a classe, que a S1Hero só adiciona quando a
  // cena vai rodar. Sem esta distinção, um caso em que a pilha não é criada faria as janelas
  // abaixo (offsets em % da viewport a partir do topo do bloco) recortarem as duas faces em
  // fluxo normal — elas nasceriam invisíveis e abririam num ponto arbitrário.
  const pilha = el.closest('.abertura--pilha')
  if (!pilha) return

  ctx = $gsap.context(() => {
    // As janelas são svh do topo da pilha, como no resto da abertura. Tudo tem de caber
    // nos primeiros 460svh: a pilha mede 560svh, mas o sticky solta as camadas 100svh
    // antes do fim (ver a constante CURSO em S1Hero.vue). Uma janela que passe disso
    // anima uma camada que já está saindo da tela.
    const janela = (de: number, ate: number) => ({
      trigger: pilha,
      start: `top top-=${de}%`,
      end: `top top-=${ate}%`,
      scrub: 0.8,
      // Pelo mesmo motivo de app/utils/cena.ts: um refresh que reinicialize um tween com o
      // elemento ainda no estado inicial grava esse estado como DESTINO e a cena morre.
      // Aqui todos os tweens são fromTo (destino explícito), então é rede de segurança —
      // mas a rede custa nada e o custo de não tê-la é uma camada que some para sempre.
      invalidateOnRefresh: true
    })

    // WIPE CRUZADO (320 → 420svh) — clipPath e não transform: a foto tem de aparecer
    // parada, revelada por uma cortina, e não deslizar para dentro. Deslizar mostraria a
    // foto em movimento sobre o texto e as duas coisas competiriam; assim o único
    // movimento é a borda da cortina.
    //
    // Clipa a FACE inteira, não só a foto: empilhada por cima das outras camadas, uma
    // face com fundo próprio tapa a cena mesmo com a foto recortada. Clipando a face,
    // fundo, foto e texto aparecem juntos — e antes disso ela não existe na tela.
    //
    // ease 'none' porque é o dedo que conduz — igual a todas as cenas de scrub do site.
    //
    // UNIDADE EXPLÍCITA EM TODOS OS QUATRO COMPONENTES, dos dois lados. `inset(0 0 100% 0)`
    // → `inset(0 0 0 0)` faz o terceiro número ir de `100%` para um zero SEM unidade, e o
    // GSAP não interpola através de uma troca de unidade: ele escreve a string inicial até
    // o fim do curso e troca pela final de uma vez. Medido exatamente assim — a cortina
    // não abria, ela pulava de fechada para aberta aos 420svh. É a mesma armadilha da
    // lista de funções do `filter`. S5ArquivoTaro.vue já usa a forma com `%` em tudo.
    $gsap.fromTo(
      '.face--jazz',
      { clipPath: 'inset(0% 0% 100% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: janela(320, 420) }
    )
    $gsap.fromTo(
      '.face--moon',
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: janela(320, 420) }
    )

    // O TEXTO (400 → 460svh) — entra depois das fotos, em cascata. Stagger de 0,07 =
    // os 70ms da faixa de 30–80ms do sistema (docs/prd/90-movimento.md §8).
    //
    // fromTo e não from: com scrub, "terminar" acontece toda vez que a rolagem cruza o
    // fim, e subindo de volta um from() sem estado inicial explícito não tem o que
    // interpolar — o bloco salta.
    $gsap.fromTo(
      '.face-texto > *',
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        ease: 'none',
        stagger: 0.07,
        scrollTrigger: janela(400, 460)
      }
    )
  }, el)
})

onBeforeUnmount(() => {
  ctx?.revert()
  ctx = null
})
</script>

<style scoped>
.faces {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* svh e não vh: com a barra do Safari iOS visível, vh corta o CTA. */
  min-height: 100svh;
  /* SEM fundo aqui. Empilhada, esta camada fica por CIMA das outras duas (z-index 2 em
     app/pages/index.vue): um fundo no contêiner cobriria a cena inteira desde o scroll 0
     — a fita da hero e o verbete rodariam atrás de um retângulo preto. Quem tem fundo é
     cada face, e cada face só existe depois que a cortina dela abre. */
}

.face {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  /* Sem isto a foto absoluta escaparia por cima da face vizinha durante o wipe. */
  overflow: clip;
  padding: clamp(1.5rem, 4vw, 3rem);
  /* O fundo mora na face, não no contêiner: ele é o que sustenta a foto enquanto ela
     decodifica, e some junto com a face quando a cortina está fechada. */
  background-color: var(--color-noite);
}

.face-media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* As duas são retratos verticais em recorte de meia tela; 42% mantém o rosto acima do
     bloco de texto, que ancora na base. */
  object-position: 50% 42%;
}

.face-texto {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(0.75rem, 2svh, 1.25rem);
}

.face-registro {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  /* Prata, medida contra estas fotos esmagadas: 9,29:1 no p99 de face-jazz e 5,72:1 no
     de face-moon — as duas passam AA de corpo. */
  color: var(--color-silver);
}

.face-titulo {
  /* LÍRICO em caixa mista, como no verbete: é o mesmo termo sendo chamado de volta, e
     trocar a face aqui o faria ler como outro assunto. */
  font-family: var(--font-lirico);
  font-size: clamp(2.75rem, 6vw, 5rem);
  line-height: 1.1;
  text-transform: none;
  font-synthesis: none;
  /* BRANCO, não sangue. No verbete o termo é vermelho porque ali o fundo é papel; sobre
     estas fotos o vermelho mede 2,07:1 (jazz) e 1,28:1 (moon) e não é texto em nenhuma
     hipótese — é a regra geral que docs/prd/S3-manifesto.md §6 tira de uma medição igual
     a esta. Em branco são 11,55:1 e 7,11:1 no p99. */
  color: var(--color-branco);
}

/* CTA invertido, o mesmo dispositivo de S7: preenchimento branco com o rótulo em sangue.
   É onde o vermelho volta a ser legível (5,25:1 sobre branco) depois de reprovar sobre a
   foto. O anel de foco vem do :focus-visible global. */
.face-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* Alvo de toque em qualquer largura. */
  min-height: 48px;
  padding: 0 clamp(1.25rem, 3vw, 2rem);
  background-color: var(--color-branco);
  color: var(--color-sangue);
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  /* O transform é o feedback de [data-pressable]; declarado aqui porque o shorthand
     desta regra substituiria o de [data-pressable] por especificidade. */
  transition: transform var(--dur-press) var(--ease-fluid);
}

@media (max-width: 767px) {
  /* Duas colunas de 50vw num aparelho de 390px dariam 195px por face — a foto vira uma
     tira e o título não cabe. Empilha, cada face com meia dobra. */
  .faces {
    grid-template-columns: 1fr;
  }

  .face {
    min-height: 50svh;
  }
}
</style>
