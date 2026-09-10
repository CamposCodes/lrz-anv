<template>
  <!-- absolute e não fixed: a faixa vive no TOPO do documento e sai com a rolagem. Como ela
       nunca passa sobre outra seção, não há faixa de vidro, hairline nem data-surface a
       espelhar — o header herda `noite` do <html> e fica transparente sobre a hero. -->
  <header class="absolute inset-x-0 top-0 z-50">
    <a
      href="#conteudo"
      class="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-3 focus-visible:z-10 focus-visible:rounded-[var(--radius)] focus-visible:bg-surface focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:text-fg"
    >
      Pular para o conteúdo
    </a>

    <!-- Nav simétrica com o wordmark no CENTRO MATEMÁTICO (50,0%, não centro óptico) e
         margem de 2,1% — invariante de estrutura do 00-indice.md §5.
         O grid 1fr/auto/1fr é o que garante os 50%: as duas faixas de links têm a mesma
         largura por definição, então a coluna do meio cai no centro exato,
         independentemente de quantos links existam de cada lado.

         O CICLO. Essa simetria deixou de ser só estrutural: a nav é um mês lunar lido da
         esquerda para a direita. Crescente fina → quarto crescente → [ECLIPSE DO WORDMARK,
         a cheia] → quarto minguante → minguante fina. O ponto alto do ciclo cai exatamente
         no símbolo-mestre da marca — os dois O de MOON sobrepostos —, que já estava no
         centro matemático por invariante. O sistema não foi inventado para a nav; a nav
         só passou a mostrar onde ele sempre esteve.

         E o ciclo tem para onde ir: o item sob o cursor, sob o foco, ou corrente, ENCHE
         até a lua cheia. É o retorno de hover mais barato possível — nada se desloca, nada
         reflui, e não há uma linha de JavaScript envolvida (ver §MOVIMENTO no <style>). -->
    <nav aria-label="Navegação principal" class="jm-nav py-5">
      <!-- Metade esquerda: a fase CRESCE em direção ao wordmark. -->
      <ul class="hidden items-center justify-start gap-10 md:flex">
        <li v-for="l in links.slice(0, 2)" :key="l.hash">
          <NuxtLink
            :to="`/${l.hash}`"
            class="jm-nav-link"
            :style="{ '--lua-repouso': l.fase }"
            :data-ativo="isActive(l) || undefined"
            :aria-current="isActive(l) ? 'page' : null"
            @click="closeMenu"
          >
            <MotifFase :waning="l.minguante" size="3.4em" class="jm-nav-lua" />
            <span class="jm-nav-rotulo">{{ l.label }}</span>
          </NuxtLink>
        </li>
      </ul>

      <NuxtLink to="/" aria-label="Jazz Moon — início" class="jm-nav-marca" @click="closeMenu">
        <!-- label="" — o NuxtLink que o envolve já carrega o nome acessível
             ("Jazz Moon — início"); rotular os dois faria o leitor de tela dizer o nome
             duas vezes no mesmo alvo. -->
        <BrandWordmark height="2.4rem" label="" />
      </NuxtLink>

      <!-- Metade direita: mesma sequência MINGUANDO — a lua já passou pelo wordmark. -->
      <div class="flex items-center justify-end">
        <ul class="hidden items-center gap-10 md:flex">
          <li v-for="l in links.slice(2)" :key="l.hash">
            <NuxtLink
              :to="`/${l.hash}`"
              class="jm-nav-link"
              :style="{ '--lua-repouso': l.fase }"
              :data-ativo="isActive(l) || undefined"
              :aria-current="isActive(l) ? 'page' : null"
              @click="closeMenu"
            >
              <MotifFase :waning="l.minguante" size="3.4em" class="jm-nav-lua" />
              <span class="jm-nav-rotulo">{{ l.label }}</span>
            </NuxtLink>
          </li>
        </ul>

        <button
          type="button"
          class="-mr-2 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-fg transition-[color,transform] hover:text-fg-muted active:scale-90 md:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? 'Fechar menu' : 'Abrir menu'"
          @click="toggleMenu"
        >
          <span class="burger" :class="{ open: menuOpen }">
            <span />
            <span />
          </span>
        </button>
      </div>
    </nav>

    <!-- Menu full-screen (mobile) — editorial, links grandes no tier de display. -->
    <ClientOnly>
      <AnimatePresence>
        <Motion
          v-if="menuOpen"
          id="mobile-menu"
          tag="div"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-surface="noite"
          class="fixed inset-0 z-40 bg-bg md:hidden"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: 0.25, ease: 'easeOut' }"
        >
          <Motif name="sphere-wireframe" tier="ambient" size="22rem" class="pointer-events-none absolute -right-16 top-10 text-silver" />
          <div class="relative flex h-dvh flex-col px-6 pb-12 pt-[var(--header-h)]">
            <nav aria-label="Navegação principal" class="flex flex-1 flex-col justify-center gap-1">
              <Motion
                v-for="(l, i) in links"
                :key="l.hash"
                tag="div"
                :initial="{ opacity: 0, y: 18 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ delay: 0.06 * i + 0.08, duration: 0.4, ease: 'easeOut' }"
              >
                <!-- Mesmo ciclo, em escala de display: aqui o orbe tem ~86px e os quatro
                     se TOCAM na vertical. A sobreposição não é acidente — dois discos
                     iguais se cruzando é o eclipse, o símbolo-mestre da marca
                     (identidade §1), e é o que transforma quatro itens de menu numa única
                     cadeia lunar. É também a alocação certa do orçamento de movimento
                     (docs/prd/90-movimento.md §1): a nav é vista dezenas de vezes e fica
                     contida; este painel é raro e pode encantar. -->
                <NuxtLink
                  :to="`/${l.hash}`"
                  class="jm-menu-link block py-2 font-display text-5xl leading-tight text-fg"
                  :style="{ '--lua-repouso': l.fase }"
                  :data-ativo="isActive(l) || undefined"
                  :aria-current="isActive(l) ? 'page' : null"
                  @click="closeMenu"
                >
                  <MotifFase :waning="l.minguante" size="1.8em" class="jm-menu-lua" />
                  <span class="jm-menu-rotulo">{{ l.label }}</span>
                </NuxtLink>
              </Motion>
            </nav>

            <div class="flex items-center justify-between border-t border-border pt-6">
              <BrandZambiBadge size="2.25rem" class="text-fg-subtle" />
              <span class="font-mono text-xs uppercase tracking-[0.25em] text-fg-subtle">Entre a lua e o sol</span>
            </div>
          </div>
        </Motion>
      </AnimatePresence>
    </ClientOnly>
  </header>
</template>

<script lang="ts" setup>
const route = useRoute()

// Nav de S1: os rótulos são as palavras que a pessoa procura — JOIAS, não OURIVES
// (esse é o nome da vertente e vive dentro de S4/S7). docs/prd/S1-hero.md §3.
//
// `fase` é a fração iluminada da lua do item (0 nova · 0,5 quarto · 1 cheia) e
// `minguante` diz de que limbo vem a luz. Os quatro formam um mês lunar simétrico em
// torno do eclipse do wordmark, que é a cheia:
//
//     ) TARÔ      D SOM      ((JAZZ MOON))      C JOIAS      ( CONTATO
//     0,26          0,50           1,00           0,50         0,26
//     crescente   quarto        [ECLIPSE]        quarto      minguante
//
// 0,26 e não 0,15: a 10px de diâmetro, uma fase de 0,15 deixa 1,5px de luz e lê como
// arranhão. Em 0,26 o crescente mede 2,6px e ainda é inconfundivelmente crescente contra
// o quarto ao lado. O quarto fica no 0,50 exato — meia-lua reta, a forma que menos se
// confunde com qualquer outra nesse tamanho.
const links = [
  { label: 'Tarô', hash: '#taro', fase: 0.26, minguante: false },
  { label: 'Som', hash: '#som', fase: 0.5, minguante: false },
  { label: 'Joias', hash: '#joias', fase: 0.5, minguante: true },
  { label: 'Contato', hash: '#contato', fase: 0.26, minguante: true }
]

const isActive = (l: { hash: string }) => route.path === '/' && route.hash === l.hash

// --- Menu mobile ---
const menuOpen = ref(false)

const closeMenu = () => { menuOpen.value = false }
const toggleMenu = () => { menuOpen.value = !menuOpen.value }

const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu() }

watch(menuOpen, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) document.addEventListener('keydown', onEsc)
  else document.removeEventListener('keydown', onEsc)
})

// Fecha ao trocar de rota (back/forward ou navegação).
watch(() => route.fullPath, closeMenu)

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.removeEventListener('keydown', onEsc)
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* 1fr auto 1fr: as faixas laterais são iguais por definição, então a coluna do meio
   fica no centro matemático da viewport — 50,0%, não "centro óptico".
   Margem de 2,1% da viewport, o invariante da referência. */
.jm-nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding-inline: 2.1%;
}

/* < 768px o PRD pede wordmark à esquerda e o botão à direita: some a faixa esquerda
   (os links já estão ocultos) e o grid vira duas colunas. */
@media (max-width: 767px) {
  .jm-nav {
    grid-template-columns: auto 1fr;
  }

  .jm-nav > ul:first-child {
    display: none;
  }
}

.jm-nav-marca {
  display: inline-flex;
  justify-self: center;
}

.jm-nav-link {
  position: relative;
  display: inline-block;
  padding-block: 0.25rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: var(--color-fg);
  text-decoration: none;

  /* ---------- MOVIMENTO ----------
     A opacidade do rótulo continua sendo o gesto de sempre (S1-hero §5: aqui cor animada
     não acrescenta informação). O que entrou é a FASE, e ela é geometria: a lua enche,
     nada se desloca, nada reflui, nenhuma propriedade fora de transform/opacity/clip-path
     é animada em elemento nenhum (90-movimento §4).

     Zero JavaScript, de propósito. --lua-f é uma custom property REGISTRADA
     (tailwind.css, @property), então interpola sozinha e atravessa a fronteira do
     componente por herança — MotifFase só lê. Consequências, todas de graça:
     · o estado de repouso já sai correto do HTML do servidor, sem flash de hidratação
     · :focus-visible acende exatamente como :hover, sem um segundo caminho de código
     · o bloco global de prefers-reduced-motion zera esta transição junto com as outras,
       e a fase passa a TROCAR em vez de percorrer — que é a regra do sistema (§12:
       menos movimento, não ausência), não uma exceção que alguém precisou lembrar
     Uma timeline de GSAP faria o mesmo desenho e ainda teria de reimplementar essas
     quatro linhas à mão.

     260ms para a fase contra 160ms do rótulo: dentro do teto de 300ms de UI (§3), e
     escalonado de propósito — a lua termina por último porque ela é o retorno, não o
     aviso. */
  --lua-f: var(--lua-repouso, 1);
  transition:
    --lua-f 260ms var(--ease-fluid),
    transform var(--dur-press) var(--ease-fluid);
}

/* O ORBE — o corpo, não um selo colado no rótulo.
   Fora do fluxo e centrado no rótulo: a nav mantém exatamente a métrica que tinha (nada
   de gap novo, nada de item mais largo, o wordmark não sai dos 50,0%), e mesmo assim cada
   item ganha um corpo de 38px. 3,4em do próprio rótulo — em em, não px, para o orbe
   escalar junto se a escala tipográfica mudar.

   É esta escala que torna a fase LEGÍVEL: a 10px o crescente media 2,6px e lia como
   arranhão; a 38px ele tem 10px e é inconfundível. E é ela que faz a leitura virar
   abstrata — não se vê um ícone de lua ao lado da palavra, vê-se a palavra POUSADA num
   corpo celeste. */
.jm-nav-lua {
  position: absolute;
  /* Ancorado à ESQUERDA do rótulo, nunca centrado nele. Centrar acopla o orbe à LARGURA
     da palavra, e as quatro são muito diferentes ("Som" contra "Contato"): o mesmo disco
     de 38px sobra numa e falta na outra, e a série lê como erro de alinhamento. Preso ao
     início, o orbe tem sempre o mesmo tamanho, a mesma altura e a mesma distância do
     próprio rótulo — os quatro viram uma SÉRIE, que é o que faz a nav ler como calendário
     lunar em vez de quatro selos.
     −1,5em põe o terminador (o centro do disco) 0,2em à frente da primeira letra: a
     palavra nasce exatamente na linha onde a luz começa. */
  left: -1.5em;
  top: 50%;
  translate: 0 -50%;
  /* O orbe é fundo: nunca intercepta o ponteiro, e o alvo de clique continua sendo
     exatamente a palavra. */
  pointer-events: none;
  /* Tintas da escala grande. O limbo é mais forte que o preenchimento porque é 1px de
     traço contra ~1.100px² de área: sem essa inversão o anel some e sobra uma mancha.
     0,20 sobre a foto esmagada do hero é presença, não ruído — a foto é 92% escura
     (docs/prd/91-assets.md) e o orbe lê sem competir com a headline. */
  --lua-limbo: 0.20;
  --lua-tinta: 0.13;
}

.jm-nav-rotulo {
  /* Acima do orbe: os dois são posicionados e sem z-index, então quem vem depois no DOM
     pinta por cima. Fica relative só para entrar nessa disputa. */
  position: relative;
  /* A opacidade saiu do <a> e veio para o rótulo: no <a> ela também esmaecia o orbe, e o
     orbe tem a própria escala de tinta. Composta com 0,62 a luz caía para 0,08 e sumia. */
  opacity: 0.62;
  transition: opacity var(--dur-tooltip) ease;
}

/* Item corrente: LUA CHEIA. O ciclo inteiro existe para que este estado tenha um lugar
   para onde ir, e é ele que carrega o estado sozinho desde que o risco saiu (abaixo).
   Não é só cor: a fase é FORMA, e a forma cobre WCAG 1.4.1 sem depender de matiz.
   A tinta sobe junto — em escala de orbe a fase cheia ACENDE, não só cresce. */
.jm-nav-link[data-ativo],
.jm-nav-link:focus-visible {
  --lua-f: 1;
}

.jm-nav-link[data-ativo] .jm-nav-lua,
.jm-nav-link:focus-visible .jm-nav-lua {
  --lua-tinta: 0.2;
}

.jm-nav-link[data-ativo] .jm-nav-rotulo,
.jm-nav-link:focus-visible .jm-nav-rotulo {
  opacity: 1;
}

.jm-nav-link:active {
  transform: scale(0.97);
}

/* O RISCO SAIU.
   Ele era um filete de 1px que crescia por scaleX sob o rótulo — e com o orbe atrás da
   palavra ele passou a terminar DENTRO do disco, uma reta morrendo no meio de um círculo.
   Não era só feio: era redundante. A lua cheia já diz "este" com muito mais força do que
   um fio, e diz por forma, que é o que WCAG 1.4.1 pede. A tabela de movimento do hero
   (docs/prd/S1-hero.md §5) nunca pediu sublinhado nesta nav; ela pede opacidade de rótulo
   e feedback de pressão, que continuam aqui. O foco de teclado segue com o anel global de
   :focus-visible — esse é obrigatório e não dependia do risco. */

/* No toque, :hover dispara no tap e trava o estado. */
@media (hover: hover) and (pointer: fine) {
  .jm-nav-link:hover {
    --lua-f: 1;
  }

  .jm-nav-link:hover .jm-nav-lua {
    --lua-tinta: 0.2;
  }

  .jm-nav-link:hover .jm-nav-rotulo {
    opacity: 1;
  }
}

/* ============================================================
   MENU MOBILE — o mesmo ciclo, em escala de leitura.
   Só a variável e a transição vivem aqui; layout e tipo continuam em utilitários no
   template, como no resto do arquivo.
   ============================================================ */
.jm-menu-link {
  position: relative;
  --lua-f: var(--lua-repouso, 1);
  transition: --lua-f 260ms var(--ease-fluid);
}

.jm-menu-link[data-ativo] {
  --lua-f: 1;
}

.jm-menu-link[data-ativo] .jm-menu-lua {
  --lua-tinta: 0.18;
}

/* Mesma regra do desktop, uma escala acima: preso ao início do rótulo, nunca centrado
   nele. Aqui isso rende o que a nav horizontal não podia ter — os quatro centros caem na
   MESMA vertical e a coluna vira um eixo, uma órbita vista de perfil.
   −0,4em (19px) é o máximo que cabe: o menu tem px-6 (24px) de folga e um recuo maior
   sangraria o limbo para fora da viewport, que a esta distância da borda lê como corte,
   não como decisão. */
.jm-menu-lua {
  position: absolute;
  left: -0.4em;
  top: 50%;
  translate: 0 -50%;
  pointer-events: none;
  --lua-limbo: 0.16;
  --lua-tinta: 0.1;
}

.jm-menu-rotulo {
  position: relative;
}

/* Hambúrguer minimal: duas linhas que viram X. */
.burger {
  position: relative;
  display: block;
  width: 1.25rem;
  height: 0.75rem;
}

.burger span {
  position: absolute;
  left: 0;
  display: block;
  width: 100%;
  height: 1.5px;
  background-color: currentColor;
  transition: transform 0.3s ease, opacity 0.2s ease;
}

.burger span:nth-child(1) { top: 0; }
.burger span:nth-child(2) { bottom: 0; }

.burger.open span:nth-child(1) { transform: translateY(0.375rem) rotate(45deg); }
.burger.open span:nth-child(2) { transform: translateY(-0.375rem) rotate(-45deg); }
</style>
