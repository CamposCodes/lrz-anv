# Jazz Moon — Identidade Visual & Sistema de Cor

> **Sistema:** três superfícies — **NOITE · PAPEL · SANGUE** — paleta reduzida a três
> cores (preto, branco, vermelho), sem acento cromático dedicado.
> A decisão, os tokens e a matriz de contraste vivem em **`docs/prd/00-indice.md`**;
> este documento é o **porquê** da marca: conceito, arquétipos, voz, motivos, fotografia.
>
> Onde os dois divergirem, o PRD vence — ele é a especificação, este é a fundamentação.

**Última revisão:** 2026-08-02 · alinhado ao acervo real medido em `docs/prd/91-assets.md`

---

## 0. O que mudou nesta revisão

Este documento descrevia até então o sistema **"Sol & Lua / Afro-Cósmico"**: dois temas de
interface (Modo Lua escuro = Jazz Moon, Modo Sol claro/terroso = Zambi) sobre tokens
semânticos compartilhados, com `#D30000` como cor-ponte.

**O sistema de dois temas foi descontinuado.** Motivo, em uma linha: o acervo fotográfico
não o sustentava.

| | Sol & Lua (descartado) | **Três superfícies (vigente)** |
|---|---|---|
| Arquitetura | 2 temas de interface | 3 superfícies editoriais |
| Eixo cromático | azul-cobalto ↔ terracota/ouro | noite ↔ papel, com sangue no meio |
| Acento | magenta `#FF009C`, depois ouro `#C8861E` | **nenhum — paleta de preto/branco/vermelho** (ver §3) |
| Zambi | tema de interface | **marca da ourivesaria** (linha de produto) |

**A evidência.** Classificação por matiz dominante de 282 fotos do acervo (99 DJ + 183 tarô):

| família | n |
|---|---|
| SANGUE (H 340–15°) | 111 |
| OURO (H 15–45°) | 111 |
| MAGENTA (H 280–340°) | 41 |
| **AZUL (H 200–280°)** | **7** |

Sete fotos em 282 sustentavam o eixo azul — e nenhuma delas na vertical do tarô. Um sistema
de cor que a fotografia própria não consegue habitar é um sistema que vive só no styleguide.

**A mesma tabela decidiu o acento — por um tempo.** Magenta tem 41 fotos; OURO e SANGUE,
111 cada. Sangue já era superfície, então das duas famílias no topo a que ainda não tinha
função virou o acento: primeiro ouro, pelo mesmo argumento que aposentou o azul — acento se
escolhe pelo que o acervo tem, não pelo que a logo tem.

**O acento ouro foi removido depois** (ver §3): a paleta caiu para três cores — preto,
branco, vermelho — e nenhuma família cromática decide mais acento nenhum, porque acento
deixou de existir. As contagens acima continuam válidas como medição do acervo; só perderam
essa função. Não são lixo, são história do argumento.

**O que sobreviveu inteiro:** o conceito de dualidade, os arquétipos, o eclipse como
símbolo-mestre, o vocabulário, o tom de voz, o sistema de motivos e a disciplina didone.
Estão abaixo, com a fundamentação preservada.

---

## 1. O conceito: a dualidade é a arquitetura

A marca não tem **uma** identidade — tem **duas faces de uma mesma criadora**, e a tensão
entre elas *é* o produto:

| | **JAZZ MOON** (a Lua) | **ZAMBI** (o Sol) |
|---|---|---|
| Papel | Persona pública, nome de palco | Alter-ego ancestral, a raiz |
| Registro | Noite, cósmico, editorial, sensual | Fogo, afro-ancestral, ritual, bruto |
| Onde aparece | o site inteiro | **assinatura da linha de ourivesaria (S7)** |
| Tipo | serifadas (Lastik no display, serifada de sistema no lírico) | Space Grotesk caixa-alta + lettering SVG |
| Motivos | luas, fases, arcos, sparkles (linha fina) | sóis, raios, sigilos (traço encorpado) |

**Metáfora-mestra:** a lua *reflete*, o sol *arde* — mesma luz, dois estados.

**Arquétipos:** a **Criadora** (Zambi/Nzambi é literalmente divindade criadora bantu) + a
**Feiticeira/Mística** (eixo Jazz Moon) + um toque de **Amante** (sensualidade editorial).

**Símbolo-mestre — o ECLIPSE:** os dois "O" de MOON se sobrepõem formando um eclipse; o "Z"
do selo Zambi é uma ampulheta de dois triângulos opostos. Eclipse (2 círculos) e ampulheta
(2 triângulos) são a **mesma ideia gráfica**: dois corpos em tensão.

O eclipse é a assinatura funcional do sistema, em três papéis:

1. **Divisor do glossário** (S2) — os dois discos ancoram as duas metades do nome e se
   aproximam para `0.4142` quando as colunas se revelam. `√2 − 1` é onde dois círculos de
   raio igual se cruzam nos centros um do outro.
2. **Máscara da travessia** (S6) — os discos cobrem o viewport, a superfície troca por baixo,
   os discos abrem. É o que torna possível a única passagem claro↔escuro do site.
3. **Marcador de seção e loader.**

> **O eclipse deixou de ser "a animação da troca de modo"** — não há mais modos a trocar.
> Ele ganhou uma função mais dura: viabilizar uma transição que, feita como rampa,
> reprovaria em contraste (`docs/prd/S6-travessia.md §1`).

**Refinamento cultural:** aposentar a palavra "tribal" do vocabulário interno e ancorar a
iconografia Zambi na **cosmologia kongo/bantu (Nzambi)** — em especial o **dikenga /
cosmograma kongo**, que já é um diagrama dos "quatro momentos do sol". Dar peso editorial
real ao material Zambi (fotografia própria, duotone) para a raiz afro não ler como figurino.

---

## 2. Cores medidas (ground truth)

Amostragem de pixel direta — **não** estimativa visual.

### Das logos

| Cor | Hex | Origem |
|---|---|---|
| 🔴 Vermelho | `#D30000` | escarlate puro (rgb 211,0,0), sem laranja |
| 🩷 Magenta | `#FF00BD` | letras sobre o vermelho no lockup — **ativo de marca, não token de interface** |
| ⚫ Preto Zambi | `#000000` | logo preta + toda a marca Zambi |
| ⚪ Branco | `#FFFFFF` | logo branca |

### Da fotografia

| Cor | Hex | Origem |
|---|---|---|
| 🔵 Azul do hero | `#01004C` | **`DJ/IMG_2099.jpg`** — 21,7% dos pixels medem `#020049` |

> **Medição verdadeira, token morto.** O campo de fundo do hero foi mesmo extraído da foto,
> não escolhido — e por um tempo isso rendeu a primitiva `--jm-azul`. Ela caiu com a redução
> a três cores: azul era uma QUARTA cor. O campo hoje é preto (`--jm-noite`), e como a foto
> cobre o campo em todo viewport pintado, o que se perde é só o quadro anterior à imagem
> carregar. A medição fica registrada porque descreve a fotografia, que não mudou.

> ⚠️ **Achado crítico:** o lockup "magenta sobre vermelho" da logo é **intencionalmente
> ilegível** (**1,59:1**). É carimbo decorativo — nunca texto, nunca UI. Sempre `aria-hidden`.
>
> **O magenta vive aqui e só aqui.** Ele é cor do arquivo da logo, que não se redesenha.
> A paleta da interface não tem magenta: nem token, nem alias (PRD §D5). Quando o carimbo
> aparece no site, é a imagem da marca sendo exibida — não a interface escolhendo uma cor.

---

## 3. Sistema de cor

Tokens, matriz de contraste completa e regras duras: **`docs/prd/00-indice.md §3`**.
Implementação: `app/assets/css/tailwind.css`.

A paleta caiu para três cores — preto, branco, vermelho. `--jm-magenta`, `--jm-ouro`,
`--jm-ouro-glow`, `--jm-bordeaux` e `--jm-azul` foram removidos: não há mais acento
cromático, nem token nem alias. Resumo das primitivas:

```css
--jm-noite:  #0A0004;  /* superfície escura, quente — não azulada */
--jm-onyx:   #12100F;  /* superfície elevada */
--jm-papel:  #FFF5FC;  /* superfície clara, rosada */
--jm-sangue: #D30000;  /* superfície de cor chapada, ação primária e único acento (decorativo) */
--jm-silver: #EDE4EA;  /* texto sobre noite */
--jm-branco: #FFFFFF;  /* única tinta sobre sangue */
--jm-tinta:  #0A0004;  /* tinta de texto sobre papel — mesmo valor de --jm-noite */
```

### As três regras que não se negociam

1. **A mais importante: vermelho sobre escuro é 3,72:1** (onyx 3,41:1) — serve para
   preenchimento, borda, ícone e display ≥24px; **nunca para corpo de texto**. É o par mais
   fraco de toda a paleta.
2. **Sobre papel, vermelho é 5,23:1** — aí sim é texto, sem restrição de tamanho. É o único
   par em que vermelho funciona como corpo.
3. **Sobre sangue só existe branco.** Prata dá 4,48:1 e reprova por 0,02. Não arredonde.
   Hierarquia sobre vermelho vem de tamanho e peso.

### As três vibrações (aposentado)

> **Conceito aposentado — motivo é aritmético.** A ideia era um acento propositalmente
> quase ilegível sobre vermelho, contado em exatamente três lugares: o carimbo da logo, os
> discos da travessia (S6) e o wordmark do rodapé (S8). Magenta dava 1,59:1 ali; ouro,
> 1,83:1 — os dois vivos só por serem tão baixos que liam como decoração, nunca texto. Com
> a paleta de três cores esse par deixou de existir: o contraste mais fraco possível agora
> é vermelho sobre escuro, **3,72:1** (regra 1 acima) — alto demais para ler como "quase
> invisível de propósito", baixo demais para texto. Não há substituto; o conceito não
> sobrevive à aritmética nova. (O magenta do carimbo da logo continua existindo como ativo
> de marca — ver §2 — só não é mais nem foi token de interface.)

---

## 4. Tipografia

Quatro vozes. A disciplina é não misturá-las.

| Camada | Papel | Fonte |
|---|---|---|
| **DISPLAY** | o que grita: headline do hero, manifesto, títulos de seção, abertura do arquivo — e o default de `h1–h4` | **Lastik** (self-hosted) |
| **LÍRICO** | o que nomeia de perto: termos do glossário (S2), nome de cada item do arquivo (S5), o wordmark | **serifada de sistema com correção métrica** (sem download; a JazzMoon que ocupava este lugar foi removida do projeto) |
| **REGISTRO** | fichas, contadores, eyebrows, rótulos | **JetBrains Mono**, caixa alta, `tracking .08–.1em` |
| Corpo | parágrafos | **Inter** 400–600, medida 60–75 caracteres |
| Voz Zambi | títulos da linha de ourivesaria | **Space Grotesk** caixa-alta, `tracking .18–.22em` |

**Duas didones, dois degraus.** Não são alternativas de gosto. DISPLAY é escala e voz
pública; LÍRICO é o nome próprio dito de perto. Onde as duas se encontram — a abertura de
S5 em Lastik sobre o nome do item em lírico — estão em degraus diferentes da hierarquia,
e é isso que as faz conviver em vez de competir.

A ligadura OO = eclipse do wordmark é **SVG bespoke**, nunca webfont.

> **A camada VINTAGE (Fraunces `SOFT 60 / WONK 1`) foi aposentada.** Era exclusiva do
> manifesto (S3), que passou ao tier de display. Uma quarta face para um bloco só não paga
> o webfont — e o eixo variável nunca chegou a funcionar: a Fraunces vinha do Google como
> instância estática, então `font-variation-settings` era inerte.

> ⚠️ **Trocar a face de display exige refazer a conta do hero.** O `font-size` de S1 é
> derivado das larguras de avanço reais da fonte. A Lastik é 22% mais larga que a face anterior
> na mesma frase (`TRANSMUTAÇÃO` = 8,445em contra 6,905em) e põe o acento mais alto (til do
> `Ã` a 0,993em contra 0,848em). Ver `docs/prd/S1-hero.md §2`.

**Disciplina didone (imposta no componente):** nunca abaixo de **28px** nem `wght < 300`
sobre escuro — os fios capilares somem. Corpo sempre ≥ 16px. Servir tudo via `@nuxt/fonts`
(self-host, `font-display: swap`, preload só do peso crítico do herói).

---

## 5. Superfícies em vez de temas

- **Três superfícies**, não dois temas: `[data-surface="noite" | "papel" | "sangue"]`.
  Noite é o padrão em `:root`.
- **A superfície é propriedade da seção**, não do documento. Não há preferência de usuário
  a persistir, nem cookie, nem toggle — o que elimina de uma vez o problema de FOUC e o
  script inline com nonce CSP que o sistema anterior exigia.
- **Alternância em blocos longos, nunca listrada.** A sequência do site é
  `noite → papel → noite → noite → papel → [travessia] → sangue → papel`.
- **Uma única passagem claro↔escuro** no site inteiro, em S6, e ela é **corte mascarado**,
  nunca rampa. Interpolar papel→sangue com texto à mostra derruba o contraste a 1,10:1.
- **Glow mínimo:** `text-shadow: 0 0 10px` só em headlines-chave, jamais como decoração geral.

---

## 6. Sistema de motivos (line-art)

Os 24 elementos de `public/images/ELEMENTOS/` viram **SVG inline** (`stroke-width: 1.5px`,
`vector-effect: non-scaling-stroke`, `stroke="currentColor"` → cor e espessura viram token),
com escala de opacidade tokenizada:

| Token | Valor | Uso |
|---|---|---|
| `--motif-ambient` | `0.06` | marca d'água full-bleed (`sphere-wireframe`, merkaba) |
| `--motif-decor` | `0.14` | divisórias, faixa de fases lunares, selo Zambi em S7 |
| `--motif-frame` | `0.30` | moldura de hero (arco-portal recortando a foto) |
| `--motif-accent` | `0.70` | sparkles |

- **`.motif` sobre noite:** traço prata/branco, `mix-blend-mode: screen` — brilha como luar.
- **`.motif` sobre papel:** traço sangue, `mix-blend-mode: multiply` — imprime.
- **`.motif` sobre sangue:** `mix-blend-mode: normal`, traço branco chapado. Screen estoura
  para branco e multiply some no vermelho — nenhum blend funciona sobre `#D30000`.
- **Arcos-portal = motivo-ponte:** marcam troca de superfície; `draw-on` via `stroke-dashoffset`.
- Bullets de lista = sparkle 4-pontas (`::marker`). Órbitas em rotação lenta 24–40s.
  Máximo 1–2 sparkles por viewport. **Todo motivo decorativo é `aria-hidden="true"`.**

> Todos os 24 arquivos estão entre 369 e 500px. Servem como motivo; **nunca** como imagem
> de conteúdo. A conversão para SVG resolve isso de vez.

---

## 7. Direção de arte fotográfica

**Master grade único — "Noite Editorial":** proteger as sombras profundas (elas emendam no
fundo noite) e travar o vermelho em `#D30000` vigiando a deriva para laranja.

> Este parágrafo pedia também "preservar o azul onde ele existe". Não pede mais: o azul saiu
> da paleta com a redução a três cores. Nas fotos que o têm ele continua lá — é a fotografia,
> não a interface —, mas não há token nem grade que o proteja como cor de sistema.

### A regra que governa tudo

**O tipo é sempre mais claro que a foto.** Toda mídia sob texto é esmagada:

```css
filter: brightness(0.40) contrast(1.15) saturate(1.2);
```

**Nunca afrouxe acima de 0,45.** E o teto é **por foto**, não global — a mesma configuração
dá 4,52:1 numa imagem e 2,29:1 em outra. Os valores medidos, foto a foto, estão em
`docs/prd/91-assets.md §2`.

### Fotos-âncora

| Foto | Papel | Nota |
|---|---|---|
| `DJ/IMG_2099.jpg` | **Hero (S1)** | 3261×4599 · 92% escura · fornece o campo de fundo `#01004C` · sangue reprova (3,04/2,50 p95/p99) — headline em branco (16,96/13,93) |
| `DJ/IMG_2164.jpg` | **Manifesto (S3)** | pele quente · sangue reprova (1,73/1,70 p95/p99) — texto em prata (7,73/7,61) |
| `DJ/Exo -039.jpg` | **Três Luas (S4)** | 98% escura · sangue ainda reprova (3,52/2,17 p95/p99) — texto em prata (15,78/9,70) |
| `TAROT/Elementos/` | **Arquivo (S5)** | 12 itens medidos, 3,43–8,55:1 contra o card onyx |

> As fotos citadas na revisão anterior deste documento (`dj-twilight-silhouette.webp` etc.)
> **não existem** no repositório e nunca existiram no formato `.webp`. `app/pages/index.vue`
> ainda aponta para sete delas — são 404 em produção hoje (`docs/prd/00-indice.md §6`).

**Texto sobreposto:** sempre com scrim (`--grad-scrim`) e o esmagamento acima. Frames são
verticais (4:5 / 9:16) → em hero desktop, recortar com `object-position` preservando o rosto.
Servir via `<NuxtImg>` com `width`/`height` declarados (CLS < 0,1). **O LCP não anima a
partir de `opacity: 0`.**

---

## 8. Aplicação

- **Hero (S1):** foto full-bleed esmagada a 0,40, campo `--jm-noite`, headline em DISPLAY
  **branco** (16,96:1 p95 · 13,93:1 p99 sobre a foto esmagada), `line-height` 0,77,
  justificação forçada nas duas linhas. Eyebrows em REGISTRO nos extremos.
  **Sem animação de entrada** — é o LCP.
  O vermelho não serve aqui: dá 3,04:1 (p99 2,50) e reprova até o piso de display.
- **Botão primário:** `bg-primary` (#D30000) + branco — 5,57:1. Foco com anel no token de
  ring e **offset de 2px**, nunca colado no vermelho.
- **CTA sobre sangue (S7):** invertido — preenchimento branco, rótulo `#D30000` (5,57:1).
  É o único preenchimento branco do site.
- **Todo pressionável:** `transform: scale(0.97)` no `:active`, 120ms. Botão, card clicável,
  seta de carrossel, CTA de WhatsApp.
- **Campo de formulário:** só underline — sem caixa, sem raio, sem fundo. Underline em
  repouso ≥ 3:1 (WCAG 1.4.11), cresce da esquerda no foco em 240ms via `scaleX`.
- **Links:** no papel, sangue (5,23:1), hover tinta (19,43:1). No noite, branco (20,70:1),
  hover prata (16,64:1). Sobre sangue, branco (5,57:1) — hover ali é sublinhado, não cor.
- **Estados funcionais:** nunca cor sozinha — sempre ícone + texto. Erro com `role="alert"`,
  visual e posicionalmente distinto do CTA vermelho.
- **Banner LGPD:** `bg-surface-2` + `border-strong`, texto ≥ 16px Inter; "Aceitar" primário;
  "Apenas essenciais" secundário; "Personalizar" ghost. Inputs com `data-clarity-mask="True"`.
- **Governança:** proibido hex cru em componente (lint/stylelint) — só `var(--jm-*)` ou o
  semântico derivado.

Movimento completo (durações, easings, stagger, gestos, reduced-motion): **`docs/prd/90-movimento.md`**.

---

## 9. SEO / AEO / GEO

- Schema `Person` / `MusicGroup` para Jazz Moon com `alternateName: "Zambi"` e `sameAs`.
- FAQ schema alimentando resposta de IA: *"Quem é Jazz Moon?"*, *"O que significa Jazz Moon?"*,
  *"O que é Zambi?"*, *"Como agendar uma leitura de tarô?"*, *"Como fazer booking de set?"*.
- **S2 · GLOSSÁRIO é o ativo de AEO do site** — é a resposta pronta e estruturada
  (`<dl>/<dt>/<dd>`) para "o que significa Jazz Moon".
- `alt-text` e nomes de arquivo em pt-BR com as palavras-chave emocionais.
- Conteúdo 100% em pt-BR com acentuação correta. Inglês só na camada REGISTRO.

---

## 10. Vocabulário de marca

**Jazz Moon:** noturno · lunar · magnético · sensual · editorial · cósmico · escarlate ·
vinil · eclipse · prata · improviso · travessia.

**Zambi:** ancestral · sagrado · fogo · raiz · terra · ouro · ritual · bruto · espiritual.

**Eixo comum:** dualidade · tensão · transmutação.

**Tom de voz (pt-BR):** poético, ritualístico, confiante e íntimo — nunca clichê de "DJ
comercial". Frases curtas, magnéticas, elegantes. No registro Zambi, mais terroso, quase
invocatório.

**As três vertentes, na voz da marca:**

| Vertente | Como ela se descreve |
|---|---|
| **TARÔ** | leitura como conversa, não como sentença |
| **SOM** | set como travessia — improviso com hora marcada |
| **OURIVES** | o que sobra de uma noite vira objeto |
