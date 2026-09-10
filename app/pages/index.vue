<template>
  <main>
    <!-- Sequência de superfícies em blocos longos, nunca listrada:
         noite → papel → noite → noite → papel → [travessia] → sangue → papel.
         Cada seção é um componente próprio; a especificação está em docs/prd/. -->
    <!-- PILHA DE ABERTURA — as TRÊS camadas ocupam o MESMO lugar na tela, uma sobre a
         outra, e o curso de rolagem da cena é a altura deste bloco. É a estrutura da
         referência: a camada seguinte não entra por baixo empurrando, ela já está lá
         atrás e aparece pelo recorte da que está na frente. A pilha é propriedade da
         PÁGINA, não da hero — por isso mora aqui e não dentro do componente.

         A cena atravessa as três: a hero se fecha numa fita e deixa o glossário à mostra,
         a fita gira até deitar e vira um traço vermelho, as duas metades do verbete
         convergem, e por fim as duas faces cobrem tudo trazendo os caminhos. Cada camada
         calibra a própria fase contra o mesmo curso — ver o mapa em S1Hero.vue. -->
    <div class="abertura">
      <S1Hero />
      <S2Glossario />
      <S2bDuasFaces />
    </div>

    <S3Manifesto />
    <S4TresLuas id="som" />
    <S5ArquivoTaro id="taro" />
    <S6Travessia />
    <S7ColecaoOurives id="joias" />
    <S8ContatoRodape id="contato" />
  </main>
</template>

<script lang="ts" setup>
const appConfig = useAppConfig();

useSeoMeta({
  title: "Início",
  description:
    "Jazz Moon — multi-artista em Juiz de Fora. Leitura de tarô, sets ao vivo e ourivesaria autoral. Três maneiras de ler a mesma noite.",
  ogTitle: appConfig.brand.name,
  ogDescription: appConfig.brand.tagline,
});
</script>

<style scoped>
.abertura {
  position: relative;
  /* A hero passa POR BAIXO do header fixo. A margem negativa é da PILHA e não da hero:
     com as duas seções empilhadas, aplicá-la só à hero deixaria o glossário 4,5rem
     abaixo do lugar que a hero ocupa. */
  margin-top: calc(var(--header-h) * -1);
}

/* Sem JS (ou em movimento reduzido) a classe abaixo nunca é adicionada e a pilha não
   existe: as duas seções ficam uma DEPOIS da outra, em fluxo normal, exatamente como o
   servidor entregou. É o mesmo princípio do resto do site — o movimento é promoção, e o
   estado legível não depende dele. A classe é adicionada pelo S1Hero.vue, que é quem
   sabe se a cena vai rodar. */
.abertura--pilha {
  /* 100svh da dobra + os 460svh que a cena consome. Encurtar aqui acelera a cena inteira;
     é o único número a mexer para isso — mas ele também é o denominador de todas as
     posições das três camadas (a constante CURSO em S1Hero.vue e as janelas em % das
     outras duas), então mexer aqui sem mexer lá desloca as fases umas sobre as outras. */
  height: calc(100svh + 460svh);
  /* A fita girada é MAIS LARGA e MAIS ALTA que a tela (medido: 1686×1604 num viewport de
     1440×900) e criava scroll horizontal. O corte tem de ficar AQUI, no bloco de 340svh,
     e não na hero de 100svh — ali ele decapitaria a própria fita. clip e não hidden:
     hidden criaria um scrollport e o sticky das duas seções passaria a se ancorar nele
     em vez de na janela. */
  overflow: clip;
}

.abertura--pilha :deep(.hero),
.abertura--pilha :deep(.glossario),
.abertura--pilha :deep(.faces) {
  position: sticky;
  top: 0;
}

.abertura--pilha :deep(.hero) {
  z-index: 1;
  height: 100svh;
}

/* A margem negativa traz o glossário para o mesmo lugar da hero — as duas passam a
   ocupar a primeira dobra, e o que decide qual se vê é o z-index e o recorte da hero.
   min-height 100svh: é o que faz o sticky soltar só nos últimos 100svh da pilha, ou seja
   o glossário fica na tela durante todo o curso da cena e ainda tem uma dobra sozinho
   para ser lido antes de sair. */
.abertura--pilha :deep(.glossario) {
  z-index: 0;
  margin-top: -100svh;
  min-height: 100svh;
}

/* A terceira camada, por CIMA de tudo: quando as duas faces abrem, elas cobrem a hero
   (que a essa altura já é um traço) e o verbete que acabou de convergir. Mesma margem
   negativa do glossário — é ela que traz a camada de volta para a primeira dobra em vez
   de deixá-la no fim do fluxo.

   Com os três como filhos diretos de uma pilha de 560svh e 100svh de altura cada, os três
   grudam em top:0 e soltam juntos nos últimos 100svh: não há offset a calcular. */
.abertura--pilha :deep(.faces) {
  z-index: 2;
  margin-top: -100svh;
  min-height: 100svh;
}

/* A PISTA DA FITA — a faixa central que o verbete deixa livre para a barra deitada.
   Estas regras moram AQUI, e não no <style> do S2Glossario, pelo mesmo motivo do estado
   inicial das faces logo abaixo: só valem DENTRO da pilha. Fora dela — sem JS, ou em
   movimento reduzido, quando a classe nunca é adicionada — não existe fita nenhuma
   atravessando o glossário, e o verbete fica com o espaçamento normal dele.

   A conta: a fita gira em torno do centro do .hero-campo, que é o centro da dobra. Deitada
   ela é uma faixa horizontal de 64px (a largura da fenda) centrada nesse ponto — ou seja
   ocupa `50svh ± 32px`. Abrimos 80px (`50svh ± 40px`), 8px de folga de cada lado.

   A PISTA É ANCORADA NA DOBRA, NUNCA NO FLUXO. Uma primeira versão pendurava a folga num
   `margin-top` fixo e ficava certa só na altura de janela em que foi calibrada: o padding
   da seção é `20vh` e o centro da dobra é `50svh`, então os dois andam em velocidades
   diferentes e a pista escorregava do centro conforme a janela crescia — medido, em 862px
   de altura a definição voltava a cair debaixo da fita. Por isso o padding vertical da
   seção é zerado aqui e a posição do bloco vira uma conta explícita:

     topo do bloco = 50svh − 40px (topo da pista)
                            − 12px  (altura do registro, mono 0,75rem/1)
                            − 40px  (margin-bottom do registro, 2,5rem)
                            − altura do termo

   e a altura do termo sai do próprio tipo: `--termo-fs × (--termo-lh 1,25 + padding 0,16em)`
   = `--termo-fs × 1,41`. Tudo em unidade viva, então a pista fica no centro da dobra em
   qualquer altura de janela e em qualquer corpo do termo.

   Só a partir de 1024px: no estreito o verbete empilha e a solução é outra — ver a
   DIAGONAL mais abaixo. */
@media (min-width: 1024px) {
  /* PADDING, e não margin no primeiro filho: `margin-top` no .registro-topo COLAPSA
     através do contêiner e da própria <section> (nenhum dos dois tem borda, padding ou
     contexto de formatação que o segure) — em vez de empurrar o conteúdo para baixo, ele
     deslocava a seção inteira, que é sticky, e o bloco continuava colado no topo da dobra
     (medido: registro-topo em y=0). Padding não colapsa. */
  .abertura--pilha :deep(.glossario) {
    padding-block: calc(50svh - 92px - var(--termo-fs) * 1.41) 0;
  }

  .abertura--pilha :deep(.definicao) {
    margin-top: 5rem;
  }
}

/* O CORREDOR — o vão entre as colunas é por onde a fita cai.
   Este vão largo existia antes para hospedar os discos do eclipse; com eles removidos ele
   encolheu para respiro comum (7rem) e a fita passou a esbarrar em "Moon" e no fim de
   "IMPROVISAÇÃO" durante a queda. Ele volta a ser largo — mas só DENTRO da pilha, onde
   existe fita para passar. Fora dela o verbete mantém o espaçamento normal.
   O VÃO É CONTA, NÃO CONSTANTE. A fita mede 100svh de comprimento, então a extensão
   horizontal dela durante o giro escala com a ALTURA da janela — um valor fixo em rem
   ficava certo numa altura e apertado em outra (medido: 22rem bastava a 730px de altura e
   deixava a fita esbarrar em "Moon" a 862px). Recolhida a 0,32 (ver S1Hero.vue), o
   semi-alcance dela é `0,16 × svh + 32px`, logo o vão precisa de `0,32 × svh + 64px`; os
   40px restantes são folga (medido: com 24px de folga a quina da fita ainda encostava no
   "M" de Moon no ângulo mais desfavorável, ~130svh).

   O clamp segura as duas pontas: abaixo de 14rem o vão deixa de ler como corredor, e acima
   de 24rem as colunas ficariam mais estreitas que a medida de 36ch (346px) das definições.

   A verificação que vale é colisão de POLÍGONO girado contra cada bloco de texto, varrendo
   80→300svh. Caixa envolvente dá falso positivo: a AABB de um retângulo girado a 45° é
   muito maior que o retângulo. */
.abertura--pilha :deep(.verbete) {
  column-gap: clamp(14rem, calc(32svh + 104px), 24rem);
}

/* ------------------------------------------------------------------
   A DIAGONAL — o corredor da fita no estreito.

   Abaixo de 1024px o verbete empilha e não há vão entre colunas para a fita descer. A
   saída é a mesma da referência (voyeurverite.com no celular, capturas de 2026-08-03):
   as duas metades deixam de ser uma coluna centrada e vão para CANTOS OPOSTOS — o termo
   de cima encosta à esquerda, o de baixo à direita. Isso abre um canal na diagonal
   ANTI-HORÁRIA (cima-direita → baixo-esquerda) que é exatamente por onde a fita passa: ela
   nasce vertical e gira no sentido horário (`rotation: 90` em S1Hero.vue), então o topo
   dela vai para a direita enquanto a base vai para a esquerda. Os blocos ocupam a diagonal
   oposta à do movimento, e é por isso que nenhum dos dois é atravessado.

   O `row-gap` em svh é a altura desse canal: ele escala com a dobra porque o comprimento
   da fita também escala (100svh × 0,32).

   45% de largura por bloco: mais que isso e os dois voltam a se encontrar no meio; menos e
   a definição vira uma coluna de duas palavras por linha. */
@media (max-width: 1023.98px) {
  /* Centra o conteúdo na dobra em vez de pendurá-lo no padding da seção: assim o vão
     entre as duas metades — que é a pista da fita — cai perto de 50svh, que é onde a fita
     deita. Os dois blocos não têm exatamente a mesma altura (a definição de baixo quebra
     numa linha a mais), então o vão fica ~24px acima do centro; o corredor de 18svh
     absorve isso com folga. */
  .abertura--pilha :deep(.glossario) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-block: 0;
  }

  .abertura--pilha :deep(.verbete) {
    max-width: none;
    margin-inline: 0;
    row-gap: 18svh;
  }

  .abertura--pilha :deep(.grupo) {
    max-width: 40%;
  }

  .abertura--pilha :deep(.grupo-jazz) {
    justify-self: start;
  }

  .abertura--pilha :deep(.grupo-moon) {
    justify-self: end;
  }
}

/* Empilhada por cima das outras duas, esta camada tem de NASCER fechada: sem isto ela
   cobre a cena inteira desde o scroll 0 e nada do que acontece atrás — a fita, o verbete,
   o traço vermelho — chega a ser visto (medido: a tela ficava preta o curso todo).

   O estado inicial mora aqui, e não no <style> do componente, justamente porque é
   condicional: ele só vale DENTRO da pilha. Fora dela — sem JS, ou em movimento reduzido,
   quando a classe nunca é adicionada — as duas faces ficam visíveis em fluxo normal, que
   é o estado que o servidor entrega. É a mesma lógica do resto da abertura: quem cria a
   cena é quem sabe que ela vai rodar. */
.abertura--pilha :deep(.face--jazz) {
  clip-path: inset(0% 0% 100% 0%);
}

.abertura--pilha :deep(.face--moon) {
  clip-path: inset(100% 0% 0% 0%);
}
</style>
