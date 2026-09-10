# S1 · HERO

**Superfície:** noite · **Frame de referência:** `01-hero.png` · **Foto:** `DJ/IMG_2099.jpg`

A primeira dobra é uma promessa tipográfica. O tipo é mais claro que a foto — sempre.

---

## 1. Objetivo

Estabelecer, sem rolagem, três coisas: quem é, onde está, e que o site tem opinião visual.
Não vende nada aqui. O CTA vive em S7 e S8.

---

## 2. Estrutura

```
┌──────────────────────────────────────────────────────────┐
│ TARÔ    SOM      ┌JAZZ MOON┐      JOIAS      CONTATO     │  margem 2,1%
│                   wordmark a 50,0% exato                 │
│                                                          │
│              [ IMG_2099 — esmagada a 0,40 ]              │
│                                                          │
│ MULTI-ARTISTA                          JUIZ DE FORA      │  eyebrows nos extremos
│ A   A R T E   D A                                        │  ocupa 95,5% da medida
│ T R A N S M U T A Ç Ã O                                  │  ocupa 95,8% da medida
└──────────────────────────────────────────────────────────┘
```

| Medida | Valor |
|---|---|
| Margem lateral | **2,1%** da viewport |
| Wordmark | centro **matemático** — 50,0%, não "centro óptico" |
| `line-height` da headline | **0,77** |
| Justificação | as duas linhas na **mesma medida** (95,5% / 95,8%) |
| Altura | `100svh` — `svh`, não `vh`, senão a barra do mobile corta a headline |

A justificação forçada é o que faz o bloco ler como bloco. Ajuste por `letter-spacing`
negativo, nunca por `transform: scaleX()` — escala deforma o desenho da letra.

---

## 3. Conteúdo

| Elemento | Texto |
|---|---|
| Nav | `TARÔ` · `SOM` · **wordmark** · `JOIAS` · `CONTATO` |
| Eyebrow esquerda | `MULTI-ARTISTA` |
| Eyebrow direita | `JUIZ DE FORA` |
| Headline linha 1 | `A ARTE DA` |
| Headline linha 2 | `TRANSMUTAÇÃO` |

Nav e eyebrows em **REGISTRO** (JetBrains Mono, caixa alta, `tracking .1em`).
Headline em **DISPLAY** (Lastik) — é o tier de maior destaque, não o lírico.

`JOIAS` na nav, não `OURIVES` — o rótulo de navegação é a palavra que a pessoa procura;
`OURIVES` é o nome da vertente e vive dentro de S4 e S7.

---

## 4. Cor

| Elemento | Token | Contraste |
|---|---|---|
| Campo de fundo | `--jm-noite #0A0004` | — |
| Headline | `--jm-branco #FFFFFF` | **16,96:1** (p95) / **13,93:1** (p99) sobre a foto esmagada ✅ passa até como corpo |
| Nav, eyebrows | `--jm-silver #EDE4EA` | **13,63:1** (p95) / **11,20:1** (p99) sobre a foto esmagada ✅ |

> `--jm-azul` (`#020049`, 21,7% dos pixels) continua **medido na própria foto** — essa
> medição não muda. O que mudou é que a paleta não comporta mais uma quarta cor: o campo
> de fundo deixa de citar o azul da imagem e vira preto (`--jm-noite`). A composição ainda
> fecha pelo mesmo motivo — fundo e imagem lêem como a mesma massa escura —, só que agora
> por proximidade tonal (preto ↔ foto quase-preta esmagada), não por igualdade de matiz.

### Esmagamento — obrigatório

```css
.hero-media { filter: brightness(0.40) contrast(1.15) saturate(1.2); }
```

**Não afrouxe abaixo de 0,45.** A tabela completa por nível está em `91-assets.md §2`.

---

## 5. Movimento

**A dobra não anima na entrada.** É o LCP.

A foto e a headline chegam no estado final no HTML do servidor. Qualquer reveal aqui
atrasa o LCP e é medido como tal pelo Core Web Vitals.

```vue
<NuxtImg
  src="/images/site/face-moon.jpg"
  width="3261" height="4599"
  sizes="100vw" format="webp" preload fetchpriority="high"
  class="hero-media"
  style="object-position: 50% 62%"
/>
```

`width`/`height` declarados travam o CLS. `object-position` a 62% preserva o rosto no
recorte paisagem do desktop — a foto é 4599px de altura contra 3261 de largura.

### O que anima

| Elemento | Movimento | Duração | Easing |
|---|---|---|---|
| Item de nav (hover) | `opacity 1 → .62` | 160ms | `ease` |
| Item de nav (`:active`) | `scale(0.97)` | 120ms | `--ease-out` |
| Wordmark | **nada** | — | — |

Hover atrás de `@media (hover: hover) and (pointer: fine)`.

O wordmark é o elemento mais visto do site — ele aparece em toda rolagem, em toda página.
**Não anima.** O que se vê dezenas de vezes por dia não pode custar espera.

### Indicador de rolagem

Se existir, é um traço de 1px com `scaleY` em loop de 2,4s, `linear`, `transform-origin: top`.
Nunca uma seta pulando — pulo compete com a headline pela atenção e a headline tem que ganhar.

---

## 6. Responsivo

| Faixa | Comportamento |
|---|---|
| ≥ 1280px | layout acima, headline em 2 linhas |
| 768–1279px | nav colapsa em `TARÔ · SOM · [wordmark] · MENU`; headline continua 2 linhas |
| < 768px | wordmark à esquerda, botão de menu à direita; headline em **3 linhas** (`A ARTE / DA TRANS- / MUTAÇÃO` — **não** hifenize: quebre em `A ARTE / DA / TRANSMUTAÇÃO`) |

Eyebrows nos extremos viram empilhadas abaixo da headline em < 768px — nos extremos de
uma tela de 390px elas ficam a 4 caracteres de distância e o efeito morre.

---

## 7. Acessibilidade

- `alt=""` na foto — é decorativa, o conteúdo está no `<h1>`. A headline É o `<h1>`.
- A headline não é imagem, é texto. Sem `background-clip: text`, sem SVG de texto.
- Nav é `<nav>` com `<ul>`; o item ativo carrega `aria-current="page"`.
- Foco visível em cada item de nav: 2px `--jm-branco`, offset 2px.
- A headline em branco passa com folga de corpo (13,93:1 no p99), não só de display — é a
  margem que o vermelho não teria aqui (sangue sobre esta mesma foto reprova, 2,50:1 no
  p99). Ainda assim, texto pequeno sobre foto vai a prata: o piso do p99 é média de
  percentil, não garantia por pixel.

---

## 8. Critérios de aceite

- [ ] LCP < 2,5s em 4G simulado; o elemento LCP é a foto do hero
- [ ] CLS < 0,1 — `width`/`height` presentes
- [ ] Nenhuma animação de entrada na dobra
- [ ] Wordmark a 50,0% ± 0,2% da largura da viewport
- [ ] As duas linhas da headline com largura entre 95,0% e 96,5% da coluna
- [ ] Amostragem de pixel confirma a headline em branco ≥ 4,5:1 contra o percentil 99 da foto renderizada (medido: 13,93:1)
- [ ] `100svh` — sem corte de headline no Safari iOS com barra visível
- [ ] Navegação por teclado percorre nav → headline → indicador, nessa ordem
