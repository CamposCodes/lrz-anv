# JAZZ MOON — PRD do site

Índice, registro de decisão e invariantes. Todo PRD de sessão herda deste arquivo.

**Status:** especificação fechada · pronta para implementação
**Última medição do acervo:** 2026-08-02

---

## 1. Os arquivos

| Arquivo | O que define |
|---|---|
| `00-indice.md` | este arquivo — decisões, tokens, invariantes |
| `S1-hero.md` | hero, nav, headline |
| `S2-glossario.md` | JAZZ / MOON — as duas metades do nome |
| `S3-manifesto.md` | a voz dela, tipo de tamanhos mistos |
| `S4-tres-luas.md` | as 3 vertentes: TARÔ · SOM · OURIVES |
| `S5-arquivo-taro.md` | carrossel do arquivo — as leituras |
| `S6-travessia.md` | a única passagem claro↔escuro, mascarada pelo eclipse |
| `S7-colecao-ourives.md` | respiro em vermelho chapado |
| `S8-contato-rodape.md` | formulário + wordmark de fecho |
| `90-movimento.md` | sistema de movimento (durações, easings, stagger, reduced-motion) |
| `91-assets.md` | mapa foto→sessão, medido arquivo por arquivo |

**Fonte de referência estrutural:** `docs/branding/sessoes/` (10 frames + leitura sessão a sessão).
Os frames são material de estudo interno. Nada da referência é reproduzido nos entregáveis.

---

## 2. Registro de decisão

### D1 · O sistema de cor é o de três superfícies

O repositório tinha **dois sistemas concorrentes**. Resolvido a favor do doc de sessões:

| | descartado | **adotado** |
|---|---|---|
| Arquitetura | 2 temas: Modo Lua × Modo Sol | **3 superfícies: NOITE · PAPEL · SANGUE** |
| Prefixo | `--color-*` | **`--jm-*`** para primitivas |
| Acento | magenta `#FF009C` / `#FF00BD` | **nenhum** — vermelho acumula o papel (ver D6) |
| Claro | areia `#FAF7F5` | **papel `#FFF5FC`** |
| Escuro | cosmos `#07090F` (azulado) | **noite `#0A0004`** (quente) |

**Modo Sol / tema Zambi deixa de ser tema.** Zambi permanece como marca da ourivesaria
(`S7`), não como estado da interface. Consequências de código em §6.

**Por quê.** O acervo real não sustentava o eixo azul: das 282 fotos classificadas
(99 DJ + 183 tarô), **7 são de família azul** — todas em DJ, nenhuma em tarô. As famílias
dominantes são SANGUE (111), OURO (111) e MAGENTA (41). O sistema de três superfícies
descreve o que as fotos já são; o de dois temas descrevia o que elas não eram.

### D2 · TARÔ é a vertente 01, OURIVES entra em S7

O doc de sessões catalogava peças de joalheria em S5 e declarava bloqueio de produção.

**O bloqueio não existe** — medição em §4. O motivo real da troca é **resolução**:

| vertical | n | lado curto | serve para |
|---|---|---|---|
| TARÔ | 251 | 1365–3266px | full-bleed, hero, item de arquivo |
| OURIVES | 387 | 512–1023px | grid e card apenas |
| DJ | 99 | até 3456×5184 | full-bleed, hero |

S5 cataloga **as leituras de tarô**. OURIVES ganha S7 — que é vermelho chapado e
**não usa foto nenhuma**, então a resolução deixa de importar.

### D3 · Sem scrolljacking

Nenhuma seção é pinada. O carrossel de S5 avança por swipe, teclado, arrasto e botões,
com scroll da página sempre livre. Herdado do PRD de produto (§4 e §7).

### D4 · Sem indicador de pontinhos

O indicador de 12 segmentos da referência vira **contador em registro** (`03 / 12`).
Um segundo indicador competiria com o eclipse, que é a assinatura da marca.

### D5 · O acento é OURO. Magenta saiu do sistema — SUPERADA POR D6

> **Superada.** Durou poucas horas. O acento ouro que esta decisão instaura foi
> removido em seguida — ver D6: a paleta final não tem acento cromático nenhum. O
> raciocínio abaixo (por que ouro venceu magenta) fica como registro da trilha de
> decisão, não como estado do sistema. Onde D5 e D6 conflitam, **D6 vale**.

O acento passa de magenta `#FF00BD` para **ouro `#C8861E`**. Magenta não foi depreciado
— foi **removido**. Não existe `--jm-magenta`, `--color-magenta`, `--color-fuchsia` nem
`--color-fuchsia-soft`. Reintroduzir qualquer um destes nomes é reabrir esta decisão.

**Por quê — o acervo.** Magenta era o acento com o terceiro lastro fotográfico, não o
primeiro: MAGENTA tem **41** fotos contra **111** de OURO e **111** de SANGUE. Sangue já
era superfície; das duas famílias empatadas no topo, a que não tinha função no sistema era
ouro. O acento passou a ser a família que o acervo mais tem e que nada ainda usava.

**Por quê — o contraste.** Sobre fundo escuro a troca é ganho puro. A razão
ouro/magenta é constante em **1,150** (é razão de luminância: vale para qualquer fundo
mais escuro que as duas tintas), então toda medição já publicada converte sem remedir:

| | magenta | **ouro** |
|---|---|---|
| sobre noite | 5,90:1 | **6,79:1** |
| sobre azul `#01004C` (campo do hero) | 5,41:1 | **6,22:1** |
| sobre a foto do hero esmagada a 0,40 | 4,52:1 (p99 3,66) | **5,20:1** (p99 **4,21**) |
| fotos DJ que passam ≥4,5:1 esmagadas | 12 | **24** |

O único recuo é sobre papel — **2,86:1 contra 3,29:1** — e ali o acento já resolvia para
sangue desde o D1. O efeito é fechar uma brecha, não abrir um problema: ver §3.3.

**O que a troca NÃO muda.** Nenhuma decisão de foto vira. S3 continua sem acento sobre
pele quente (2,63:1, ainda reprova) e S4 continua trocando a foto e não o acento
(`IMG_2095` = 3,20:1, ainda reprova). As três vibrações deliberadas sobrevivem, agora a
1,83:1 em vez de 1,59:1 — mais fundas que o piso de informação por larga margem.

> **As fotos continuam magenta, e isso está certo.** 41 arquivos do acervo são de família
> magenta e vários são usados no site — os `alt` de S5 dizem "luz magenta" porque é o que
> a fotografia é. O que saiu foi a **tinta**, não o assunto. Descrição de imagem descreve
> a imagem; paleta é o que a interface escolhe pintar.

### D6 · A paleta é preto, branco e vermelho. O acento cromático deixa de existir

Decisão de cliente/direção, poucas horas depois de D5: nenhuma cor além de preto,
branco e vermelho entra na interface. **Ouro sai do mesmo jeito que magenta saiu em
D5** — não fica depreciado ao lado da primitiva, é removido. Some junto o azul
`--jm-azul #01004C` (o campo extraído da foto do hero, ver S1 em `91-assets.md`): era
a quarta cor do sistema e não sobrevive à paleta de três.

**Por quê.** Desta vez não é argumento de acervo — é decisão de marca. O vermelho já
era superfície (D1); sem acento cromático, ele passa a acumular também o papel de
acento pontual, diferenciado por superfície: preenchimento/borda/ícone sobre escuro
(3,72:1), texto sobre papel (5,23:1). Não sobra uma segunda tinta de destaque — ver
§3.3.

**O que morre com D6:**

- **O acento em si.** Não há substituto para ouro; a cor de destaque passa a ser o
  vermelho que já existia como superfície. Onde D5 media "ouro contra fundo", a
  pergunta deixa de existir — não há segunda tinta para medir.
- **As semânticas funcionais success/warning/info** (verde/âmbar/azul no doc de
  sessões, nunca chegaram a ser usadas no código). Numa paleta de três cores não
  sobra matiz para distingui-las. Só `danger` sobrevive, porque já resolve para
  vermelho: `--color-danger` `#B91C1C` sobre papel **6,08:1**, `--color-danger-dark`
  `#F87171` sobre noite **7,48:1** — ver §3.2.
- **As três vibrações deliberadas de D5** (carimbo da logo, discos de S6, wordmark do
  rodapé de S8). O efeito dependia de um acento ilegível de propósito sobre vermelho
  (magenta 1,59:1 → ouro 1,83:1). Com três cores o par mais fraco do sistema é
  3,72:1: não existe mais combinação ilegível o bastante para produzir a vibração. O
  conceito foi aposentado, não substituído — não há acento para vibrar.
- **Vermelho como texto sobre foto.** Nenhuma das três fotos do site (hero, manifesto,
  três luas) sustenta vermelho como tinta — pior caso passa o piso de 3:1 só no p95,
  nunca no p99 (medição em `91-assets.md` §2). Sobre foto, a tinta é sempre branco ou
  prata.

**O que D6 NÃO muda.** O sistema de três superfícies (D1), TARÔ como vertente 01 (D2),
a ausência de scrolljacking (D3) e o contador em registro (D4) seguem de pé — D6 mexe
só na camada de tinta. Consequências de código em §6.

---

## 3. Tokens

### 3.1 Primitivas

```css
/* SUPERFÍCIES */
--jm-noite:   #0A0004;  /* base escura, quente — não azulada */
--jm-onyx:    #12100F;  /* superfície elevada sobre noite (cards, item de arquivo) */
--jm-papel:   #FFF5FC;  /* base clara, rosada */
--jm-sangue:  #D30000;  /* superfície de cor chapada */

/* TINTA */
--jm-silver:  #EDE4EA;  /* texto sobre noite */
--jm-branco:  #FFFFFF;  /* tinta máxima — única tinta permitida sobre sangue */
--jm-tinta:   #0A0004;  /* texto sobre papel (mesmo valor de noite) */
```

Sete primitivas, não onze. Quatro superfícies e três tintas — nenhuma quarta cor.

> **Não existe primitiva de acento.** Ver D5 e D6. Ouro, magenta e o eixo inteiro que
> orbitava em torno dele (fuchsia, fuchsia-soft, ouro-glow, bordeaux) saíram do
> sistema — não estão depreciados em algum canto esperando volta. O mesmo vale para
> `--jm-azul #01004C`: era o campo extraído da foto do hero (ver `91-assets.md` §2),
> não sobrevive à paleta de três cores.

### 3.2 Matriz de contraste — medida, não estimada

| tinta | fundo | ratio | veredito |
|---|---|---|---|
| silver `#EDE4EA` | noite `#0A0004` | **16,64:1** | ✅ AAA — texto de corpo |
| noite `#0A0004` | papel `#FFF5FC` | **19,43:1** | ✅ AAA — texto de corpo |
| branco `#FFFFFF` | noite | **20,70:1** | ✅ AAA |
| branco `#FFFFFF` | onyx `#12100F` | **18,97:1** | ✅ AAA |
| branco `#FFFFFF` | sangue | **5,57:1** | ✅ AA |
| sangue `#D30000` | papel | **5,23:1** | ✅ AA |
| danger `#B91C1C` | papel | **6,08:1** | ✅ AA |
| danger-dark `#F87171` | noite | **7,48:1** | ✅ AAA |
| sangue `#D30000` | noite | **3,72:1** | ⚠️ só ≥24px / UI / fill — NUNCA corpo |
| noite `#0A0004` | sangue | **3,72:1** | ⚠️ mesma faixa |
| sangue `#D30000` | onyx `#12100F` | **3,41:1** | ⚠️ mesma faixa, ainda mais justo |
| silver `#EDE4EA` | sangue | **4,48:1** | ❌ reprova por 0,02 — proibido |

> **Três linhas que valem regra:**
> `sangue sobre noite` (e `noite sobre sangue`) é **3,72:1** — vermelho é superfície e
> preenchimento sobre escuro, nunca tinta de corpo nem link pequeno. Sobre onyx cai
> ainda mais, para 3,41:1. Ver piso exato em §3.3.
> `sangue sobre papel` é **5,23:1** — aqui, e só aqui, vermelho é texto.
> `silver sobre sangue` reprova por margem de 0,02 — não arredonde para cima; sobre
> vermelho não existe texto secundário, nem em prata.

### 3.3 Regras duras

1. **Vermelho sobre escuro é 3,72:1** (3,41:1 sobre onyx) — serve para preenchimento,
   borda, ícone e display **≥24px**. Nunca corpo, nunca link pequeno. Sobre papel é
   **5,23:1**: aí, e só aí, vermelho é texto. Esta é a regra mais importante do
   sistema — a única tinta de destaque que sobra depois de D6 é o vermelho, e ela
   muda de função conforme a superfície.
2. **Sobre sangue não existe texto secundário.** Nem prata (4,48:1, reprova por
   0,02), nem opacidade. Hierarquia sobre vermelho vem de tamanho e peso, nunca de
   cor.
3. **Vermelho não sobrevive a foto nenhuma.** Nas três fotos do site (hero,
   manifesto, três luas) o p99 reprova sempre — no manifesto reprova até o p95.
   Sobre foto, a tinta é sempre branco ou prata. Medição em `91-assets.md` §2.
4. **Proibido hex cru em componente.** Só `var(--jm-*)` ou o semântico derivado.
5. **Não existe acento cromático.** Ouro, magenta e azul saíram do sistema — não há
   token, alias nem escape hatch para nenhum dos três. Ver D5 e D6.

### 3.4 Semânticos

A camada semântica existente (`--color-bg`, `--color-fg`, `--color-primary`…) **permanece
com os mesmos nomes** e passa a apontar para as primitivas novas. É o que mantém os
componentes `Ui*` funcionando sem reescrita — 90% do uso deles já é semântico
(`text-fg`, `bg-surface`, `border-border`).

```css
:root, [data-surface="noite"] {
  --color-bg:            var(--jm-noite);
  --color-bg-2:          var(--jm-onyx);
  --color-surface:       var(--jm-onyx);
  --color-fg:            var(--jm-silver);
  --color-primary:       var(--jm-sangue);    /* fill */
  --color-primary-text:  var(--jm-branco);
  --color-accent:        var(--jm-sangue);    /* decorativo só: 3,72:1 */
  --color-link:          var(--jm-branco);
  --color-link-hover:    var(--jm-silver);    /* acende esmaecendo */
  --color-ring:          var(--jm-branco);
  color-scheme: dark;
}

[data-surface="papel"] {
  --color-bg:            var(--jm-papel);
  --color-fg:            var(--jm-tinta);
  --color-primary:       var(--jm-sangue);
  --color-primary-text:  var(--jm-sangue);    /* 5,23:1 — aqui vermelho É texto */
  --color-accent:        var(--jm-sangue);
  --color-link:          var(--jm-sangue);    /* 5,23:1 */
  --color-link-hover:    var(--jm-tinta);     /* acende escurecendo, não clareando */
  --color-ring:          var(--jm-sangue);
  color-scheme: light;
}

[data-surface="sangue"] { /* tudo branco */
  --color-bg:            var(--jm-sangue);
  --color-fg:            var(--jm-branco);
  --color-primary:       var(--jm-branco);    /* CTA invertido: fill branco, rótulo vermelho */
  --color-primary-text:  var(--jm-branco);
  --color-accent:        var(--jm-branco);
  --color-link:          var(--jm-branco);
  --color-link-hover:    var(--jm-branco);    /* hover é sublinhado, não cor */
  --color-ring:          var(--jm-branco);
  color-scheme: light;
}
```

> **`--color-link-hover` continua sendo token, mas perdeu o par "glow/bordeaux".** Na
> versão D5 o hover acendia para uma tinta própria por superfície (`ouro-glow` no
> escuro, `bordeaux` no papel). Sem acento, hover volta a resolver dentro do par
> tinta/fundo que já existe — silver sobre noite, tinta sobre papel — em vez de uma
> terceira cor dedicada. Antes disso, num sistema ainda mais antigo, o hover era
> `fuchsia-soft` fixo em 20 templates, que sobre papel dava **2,38:1**: bug, não
> escolha. A cascata por `[data-surface]` é o que impede essa classe de erro voltar.

`[data-surface]` substitui `[data-theme]`. A cascata é bidirecional: uma sessão papel
dentro de um documento noite re-resolve por seletor.

---

## 4. Tipografia

Três camadas, e a disciplina é não misturar as vozes.

| Camada | Papel | Fonte |
|---|---|---|
| **DISPLAY** | o tier de maior destaque: headline do hero, manifesto, títulos de seção, abertura do arquivo — e o default de `h1–h4` | **Lastik** (self-hosted) |
| **LÍRICO** | nome próprio de perto: os termos do glossário (S2), o título das duas faces (S2b), o nome de cada item do arquivo (S5), o wordmark | **serifada de sistema com correção métrica** (`Lirico Fallback` → Georgia; sem download) |
| **REGISTRO** | fichas, contadores, eyebrows, rótulos | JetBrains Mono, caixa alta, `tracking .08–.1em` |
| Corpo | parágrafos | Inter 400–600, medida 60–75 caracteres |

> **Duas serifadas, dois degraus.** Não são alternativas de gosto: DISPLAY é o que grita,
> LÍRICO é o que nomeia. Onde as duas aparecem juntas — a abertura de S5 em Lastik sobre o
> nome do item em lírico — elas estão em degraus diferentes da hierarquia, e é isso que
> as faz conviver em vez de competir.
>
> O lírico já teve webfont próprio (a JazzMoon), removido do projeto. O tier continua
> existindo e renderiza o mesmo desenho de sempre: os `@font-face` de fallback métrico em
> `tailwind.css` reproduzem a caixa de linha daquela face. **A Lastik é o único webfont do
> site.**
>
> **A camada VINTAGE (Fraunces) foi aposentada.** Era exclusiva do manifesto de S3, que
> passou ao tier de display: uma quarta face para um bloco só não paga o webfont, e a
> Lastik já entrega o contraste de traço da didone que o "revista antiga" pedia.
>
> ⚠️ **Trocar a fonte de display exige refazer a conta do hero.** O `font-size` de S1 é
> derivado das larguras de avanço reais da face. A Lastik é 22% mais larga que a face
> anterior na mesma frase (`TRANSMUTAÇÃO` = 8,445em contra 6,905em), o que levou o corpo de
> 14,374cqi a **11,676cqi**. Trocar a face sem refazer isso estoura a linha para fora da
> coluna. Ver `S1-hero.md §2`.

**Disciplina didone:** nunca abaixo de 28px nem `wght < 300` sobre escuro — os fios
capilares somem. Corpo sempre ≥ 16px.

---

## 5. Invariantes de estrutura

Herdados da leitura da referência. Valem em todas as sessões.

- Nav simétrica, wordmark no **centro matemático**, margem 2,1%
- Headline `line-height` **0,77**, justificação forçada nas duas linhas
  — ⚠️ **não sobrevive ao pt-BR sem folga entre linhas.** Verificado no browser: as caixas
  altas da face anterior mediam 0,7em e cabiam no avanço de 0,77em, mas o til do `Ã` sobe 0,848em
  acima da própria baseline e invade a linha anterior (61px de sobreposição a 262px de
  corpo). A referência é em inglês e não tem diacrítico ascendente. A folga vai entre
  linhas (`margin-top: 0.12em`), nunca no `line-height` — mexer no 0,77 afrouxaria o bloco
  inteiro, que é o oposto do efeito.
- **O tipo é sempre mais claro que a foto** — mídia esmagada, teto por foto em `91-assets.md`
- Bookend counter — o número aparece no topo e na base do bloco
- Estilhaços poligonais de aresta reta
- Campo de formulário = só underline, sem caixa, sem raio, sem fundo
- Wordmark fechando a página
  — ⚠️ **o "edge-to-edge" não transfere para marca empilhada.** A referência usa logotipo
  de UMA linha: largura total vira uma faixa de ~10% da altura da viewport. O wordmark daqui
  é empilhado em duas linhas (proporção 1,535), então largura total renderiza 1021px de altura — deixa de
  ler como fecho e vira seção. Vale a **proporção**, não o toque literal nas bordas:
  teto de altura em `min(56vh, 430px)`.
- Alternância de superfície em **blocos longos**, nunca listrada
- Idioma pt-BR. Inglês só na camada REGISTRO.

---

## 6. Consequências de código

Decorrem de D1. Não estão aplicadas — são o backlog de implementação.

| # | Arquivo | O que muda |
|---|---|---|
| 1 | `app/assets/css/tailwind.css` | bloco `@theme` reescrito nas primitivas `--jm-*`; cascata `[data-theme]` → `[data-surface]` |
| 2 | `app/composables/useTheme.ts` | Modo Sol deixa de existir; vira leitura de superfície de sessão ou é removido |
| 3 | `app/components/TheThemeToggle.vue` | sem alternância de tema — remover |
| 4 | `app/components/StyleguideShowcase.vue` | lista as primitivas antigas uma a uma; reescrever na paleta nova |
| 5 | `app/app.config.ts:6` | `logo: '/images/brand/jazzmoon-white.png'` → **404**, a pasta `brand/` não existe. Apontar para `/images/MARCA/DJ/jazzmoon-white.png` |
| 6 | `app/pages/index.vue:14,135-157` | 7 referências a `/images/dj/*.webp` → **todas 404**. Nenhum `.webp` existe no repositório. Substituir pelos assets de `91-assets.md` |
| 7 | ~~`nuxt.config.ts:156` — reintroduzir Fraunces~~ | **resolvido de outro jeito:** o manifesto passou ao tier de display (Lastik) e a Fraunces saiu do projeto |
| 8 | ~~eixo magenta em `tailwind.css` + 20 templates~~ | **aplicado (D5):** `--color-magenta`/`--color-fuchsia`/`--color-fuchsia-soft` removidos; `--color-ouro`/`--color-ouro-glow` criados; `--color-link-hover` novo substitui `hover:text-fuchsia-soft` fixo em 20 templates; `--grad-eclipse` e `--grad-brasa` no eixo quente; névoa de `TheAtmosphere` de `#241220` para `#2A1310` |
| 9 | ~~eixo ouro em `tailwind.css`~~ | **aplicado (D6):** `--color-ouro`/`--color-ouro-glow`/`--color-bordeaux`/`--jm-azul` removidos; `--color-accent` passa a resolver para `--color-sangue` em todas as superfícies; `--color-link-hover` volta a reusar silver/tinta em vez de tinta própria; semânticas funcionais `success`/`warning`/`info` removidas (nunca usadas); `--color-danger`/`--color-danger-dark` sobrevivem por já resolverem para vermelho |

> **Itens 5 e 6 são quebra em produção hoje**, independentes desta especificação: o hero
> não tem imagem e o LCP não resolve. Corrigir antes de qualquer coisa cosmética.

---

## 7. Acessibilidade — piso não negociável

- Toda animação respeita `prefers-reduced-motion`. Regra de tradução em `90-movimento.md`.
- Foco visível em tudo que recebe foco: 2px no token de anel, **offset de 2px** — nunca
  colado no preenchimento vermelho.
- Motivo decorativo sempre `aria-hidden="true"`.
- Estado nunca é comunicado só por cor.
- O carrossel de S5 é operável por teclado, com `aria-live` no contador.
- Fotos de `TAROT/Outras Pessoas/` (68 arquivos) têm **pessoas identificáveis** —
  autorização de uso de imagem verificada antes de publicar. Ver `91-assets.md`.
