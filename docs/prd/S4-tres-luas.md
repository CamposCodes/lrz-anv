# S4 · TRÊS LUAS

**Superfície:** noite · **Frame de referência:** `04-pilares.png` · **Foto:** `DJ/Exo -039.jpg`

As três vertentes, visíveis ao mesmo tempo. A referência tem quatro. Não invente a quarta.

---

## 1. Objetivo

Dizer o que ela faz — em três blocos concretos, não em valores abstratos. É a sessão que
o site inteiro serve: quem rolar até aqui já sabe quem é ela, e agora precisa saber o quê.

---

## 2. Correção de leitura da referência

O frame `04-pilares.png` **não é seção pinada** e **não troca de estado**. As quatro
colunas ficam visíveis simultaneamente sobre mídia full-bleed. Foi confirmado quadro a
quadro. Qualquer implementação com pin aqui é leitura errada da referência — e violaria
`00-indice.md §D3` de qualquer forma.

---

## 3. Estrutura — 4 vira 3

```
┌──────────────────────────────────────────────────────┐
│  TARÔ ₀₁                          OURIVES ₀₃         │  títulos sangram para
│          SOM ₀₂                                      │  fora do grid
│  ┌────────────┬────────────┬────────────┐            │
│  │ 3–4 linhas │ 3–4 linhas │ 3–4 linhas │            │
│  │            │            │            │            │
│  │ 01         │ 02         │ 03         │            │  bookend counter
│  └────────────┴────────────┴────────────┘            │
│        [ Exo -039 esmagada a 0,40 atrás ]            │
└──────────────────────────────────────────────────────┘
```

| Medida | Valor |
|---|---|
| Blocos | **3** |
| Grid de títulos | **assimétrico** — 2 à esquerda (escalonados), 1 à direita |
| Colunas de texto | 3 iguais |
| Numeração | 01–03, **duas vezes cada** (ao lado do título e no fim do parágrafo) |

**A assimetria é a decisão.** Três blocos num layout desenhado para quatro deixam um
vazio. Esse vazio é onde a imagem respira — não preencha. Um quarto pilar inventado para
fechar a simetria seria a pior escolha do projeto.

### Bookend counter

O número aparece duas vezes: pequeno ao lado do título grande, e de novo no fim do
parágrafo. É o que amarra título e texto quando eles estão em grids diferentes.

---

## 4. Conteúdo

| # | Vertente | Texto |
|---|---|---|
| 01 | **TARÔ** | `LEITURA COMO CONVERSA, NÃO COMO SENTENÇA. A CARTA ABRE A PERGUNTA — QUEM RESPONDE É VOCÊ.` |
| 02 | **SOM** | `SET COMO TRAVESSIA. JAZZ, ELETRÔNICO E O QUE MORA ENTRE OS DOIS. IMPROVISO COM HORA MARCADA.` |
| 03 | **OURIVES** | `METAL TRABALHADO À MÃO, PEÇA A PEÇA. O QUE SOBRA DE UMA NOITE VIRA OBJETO.` |

Títulos em **LÍRICO** (nome próprio é trabalho da didone). Parágrafos e números em
**REGISTRO**, caixa alta.

Cada bloco leva um link para sua sessão: `01 → S5` (arquivo do tarô), `03 → S7` (coleção).
`02 · SOM` aponta para o contato de booking em S8 — não há sessão dedicada nesta versão.

---

## 5. Cor — troca de foto obrigatória

| Elemento | Token | Contraste |
|---|---|---|
| Superfície | `--jm-noite #0A0004` | — |
| Títulos | `--jm-silver #EDE4EA` | **15,78:1** sobre a foto esmagada ✅ |
| Parágrafos | `--jm-silver` a `opacity: .78` | 12,3:1 efetivo ✅ |
| Números | `--jm-branco #FFFFFF` | **19,62:1** (p95) / **12,06:1** (p99) sobre a foto esmagada ✅ |

### Por que `Exo -039` e não `IMG_2095`

O doc de sessões pedia `IMG_2095.jpg` **com os números no acento**. Antes, essa era uma
decisão de contraste: quase nenhuma foto de DJ do acervo aguentava um acento cromático
(ouro) como texto, e `Exo -039` era a que aguentava. **Esse filtro deixou de existir.**
Prata e branco passam em qualquer foto candidata — medido a `brightness(0.40)`:

| foto | prata |
|---|---|
| `IMG_2095.jpg` | 7,85:1 ✅ |
| **`Exo -039.jpg`** | **15,78:1 ✅** (p99 9,70) |
| `Exo -027.jpg` | 15,42:1 ✅ |

Mesmo `IMG_2095`, a pior candidata, passa com folga em prata. O que ainda prende `Exo -039`
não é mais o contraste — é a **folga de paralaxe (1,25)** e a **aderência de estrutura
(0,99)**: a foto tem espaço de sobra para o deslocamento de profundidade da dobra sem
cortar o enquadramento, e sua composição encaixa no grid assimétrico dos três blocos sem
precisar realinhar. `IMG_2095` não tem essa folga.

**Trocamos a foto pela composição, não pelo contraste.**

```css
.luas-media { filter: brightness(0.40) contrast(1.15) saturate(1.2); }
```

---

## 6. Movimento

Os três títulos são o evento da sessão. Entram primeiro e sozinhos.

| Elemento | Movimento | Duração | Delay | Easing |
|---|---|---|---|---|
| Títulos (3) | `mask-line-up` | 500ms | 0 / **80** / **160**ms | `--ease-out` |
| Parágrafos (3) | `opacity 0→1`, `translateY 8px→0` | 400ms | 240 / 300 / 360ms | `--ease-out` |
| Números do topo | `opacity 0→1` | 300ms | junto do título | `ease` |
| Números da base | `scale .86→1`, `opacity 0→.38` | 300ms | **400ms**, os três juntos | `--ease-out` |

### Stagger corrigido: 120ms → 80ms

O doc de sessões pedia `0,12` (120ms) entre os títulos, argumentando que "eles são o
evento". **Reduzido para 80ms**, que é o teto do sistema (`90-movimento.md §8`).

120ms × 3 blocos = 360ms de espera antes de o terceiro título começar a se mover, e mais
500ms até ele terminar. Quase um segundo para ler três palavras. O ganho dramático não
paga o atraso — e a dramaticidade aqui já vem do tamanho do tipo, não do tempo.

### Números da base

`scale .86 → 1` com `opacity 0 → .38`. Entram por último, todos juntos, sem stagger entre
si — eles são o fecho do bloco, não uma sequência. Delay de 400ms os separa claramente
dos parágrafos.

**A escala parte de 0,86, não de 0.** O número tem forma antes de ter tamanho.

### Movimento reduzido

Títulos e parágrafos: só `opacity`, 200ms, sem stagger. Números da base aparecem em
`opacity .38` sem escala.

---

## 7. Responsivo

| Faixa | Comportamento |
|---|---|
| ≥ 1280px | layout do §3 — títulos assimétricos, 3 colunas |
| 768–1279px | títulos empilhados à esquerda; 3 colunas viram **2 + 1** |
| < 768px | tudo empilhado: título → parágrafo → número, três vezes |

No empilhado o **bookend counter perde sentido** — título e parágrafo ficam adjacentes.
Abaixo de 768px, mostre o número **só na base**. Repetir a 40px de distância vira ruído.

---

## 8. Acessibilidade

- Cada bloco é `<article>`; o título é `<h3>` dentro de uma sessão com `<h2>` implícito.
- O número do topo é `aria-hidden="true"` — está duplicado, e leitor de tela não precisa
  ouvir "zero um" duas vezes. O da base carrega o valor.
- Os 3 blocos são links inteiros (`<a>` envolvendo o `<article>`), com `:active scale(0.97)`.
- Foto `alt=""`, `aria-hidden` no contêiner de mídia.
- Prata a `opacity .78` = 12,3:1 efetivo. A opacidade é segura aqui **porque a base é
  16,64:1**; não replique o padrão sobre superfícies de menos folga.

---

## 9. Critérios de aceite

- [ ] Exatamente **3** blocos — nenhum quarto inventado
- [ ] Grid de títulos assimétrico em ≥ 1280px, com o vazio preservado
- [ ] Nenhuma seção pinada; scroll livre o tempo todo
- [ ] Números em branco ≥ 4,5:1 contra o percentil 99 da foto renderizada (medido: 12,06:1)
- [ ] Stagger dos títulos em 80ms, não 120ms
- [ ] Números da base partem de `scale(.86)`, nunca de 0
- [ ] Bookend some abaixo de 768px (só o número da base)
- [ ] Os 3 blocos são navegáveis e acionáveis por teclado
