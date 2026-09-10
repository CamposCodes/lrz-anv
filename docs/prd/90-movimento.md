# 90 · SISTEMA DE MOVIMENTO

O que anima, o que não anima, e com quais números exatos.

Regra que governa todas as outras: **toda animação responde "por que isto anima?"**.
Se a resposta é "fica bonito" e o usuário vê aquilo muitas vezes por dia, não anima.

---

## 1. A decisão de animar

Antes de escrever qualquer transição, olhe a frequência.

| Frequência | Decisão | Onde ocorre neste site |
|---|---|---|
| 100+/dia | **nunca anima** | — |
| dezenas/dia | reduzir drasticamente | hover de nav, hover de link |
| ocasional | animação padrão | carrossel S5, foco de campo S8, banner LGPD |
| raro / primeira vez | pode encantar | reveal on-scroll, travessia S6, entrada do glossário S2 |

**Ação iniciada por teclado não anima.** Setas no carrossel de S5 movem o item na hora —
sem transição de entrada. Quem navega por teclado repete o gesto; animação ali vira atraso.
Mesmo componente, gestos diferentes: **swipe e arrasto animam, seta não.**

---

## 2. Easings

Os easings nativos do CSS são fracos demais. Falta o soco que faz o movimento parecer
intencional. O sistema usa três curvas e só três.

```css
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);    /* entrada e saída de elemento */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);   /* movimento/morph na tela */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);    /* eclipse, travessia, arrasto */
```

O projeto já expõe `--ease-fluid: cubic-bezier(0.16, 1, 0.3, 1)` em `tailwind.css:123` e
componentes o consomem. **Mantenha o nome** — `--ease-fluid` é o `--ease-out` deste
sistema, só mais forte. Não renomeie o que já está ligado; adicione os outros dois.

### Como escolher

```
o elemento entra ou sai?
  sim → ease-out
  não →
    está se movendo/transformando na tela? → ease-in-out
    é hover ou mudança de cor?             → ease
    é movimento constante (marquee)?       → linear
    na dúvida                              → ease-out
```

**`ease-in` é proibido em UI.** Começa devagar, e o começo é exatamente onde o olho está.
Um dropdown com `ease-in` a 300ms *parece* mais lento que o mesmo dropdown com `ease-out`
a 300ms.

---

## 3. Durações

| Elemento | Duração |
|---|---|
| feedback de pressão (`:active`) | **120ms** |
| tooltip, popover pequeno | **160ms** |
| dropdown, select, item de carrossel | **200ms** |
| foco de campo (underline `scaleX`) | **240ms** |
| banner LGPD entrando | **280ms** |
| reveal on-scroll | **500ms** (é marketing, pode respirar) |
| travessia S6 | **500ms fecha / 600ms abre** |

**Teto de 300ms para UI.** As duas exceções acima são narrativas, não interface: o reveal
acontece uma vez por sessão e a travessia é o evento da página.

**Saída sempre mais rápida que entrada.** Devagar onde o usuário decide, rápido onde o
sistema responde. Um item de carrossel entra em 200ms e sai em 140ms.

---

## 4. O que pode ser animado

Só `transform` e `opacity`. Elas pulam layout e paint e rodam na GPU.

Proibido animar: `width`, `height`, `padding`, `margin`, `top/left`, `background-color`
em elemento grande. `clip-path` é permitido e é a ferramenta central deste site (§7).

### Percentagem em `translate`, nunca pixel

`translateY(100%)` move o elemento pela própria altura, qualquer que seja ela. Menos
propenso a erro e adapta a conteúdo variável.

### Não mexa em variável CSS herdada durante arrasto

Trocar `--swipe-amount` no contêiner recalcula estilo de todos os filhos. No arrasto do
carrossel de S5, escreva `transform` direto no elemento arrastado.

```js
// ruim — recalcula todos os filhos a cada frame
el.style.setProperty('--swipe', `${dx}px`);

// bom — só este elemento
el.style.transform = `translateX(${dx}px)`;
```

### motion-v: `x`/`y` não são aceleradas por hardware

As props curtas do Motion rodam em `requestAnimationFrame` na main thread. Sob carga —
que é exatamente o momento em que a página está carregando fotos de 3000px — elas perdem
frames. Use a string completa.

```vue
<!-- perde frame sob carga -->
<Motion :animate="{ x: 100 }" />

<!-- acelerada -->
<Motion :animate="{ transform: 'translateX(100px)' }" />
```

Para o que é predeterminado (reveal, stagger), prefira CSS puro: roda fora da main thread
e não perde frame nenhum durante o carregamento.

---

## 5. Entradas

### Nunca a partir de `scale(0)`

Nada no mundo real some por completo e reaparece. Entrada mínima é `scale(0.95)` com
`opacity: 0`. Mesmo uma escala quase invisível dá ao elemento uma forma de partida.

```css
/* proibido */
.entrando { transform: scale(0); }

/* correto */
.entrando { transform: scale(0.95); opacity: 0; }
```

### Popover nasce do gatilho

`transform-origin: center` está errado em quase todo popover — ele deve crescer de onde
foi acionado. **Modal é a exceção**: não está ancorado em gatilho nenhum, fica centralizado.

```css
.popover { transform-origin: var(--transform-origin); }
.modal   { transform-origin: center; }  /* TheLgpdPreferences */
```

### `@starting-style` em vez de flag de montagem

```css
.banner {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 280ms var(--ease-out), transform 280ms var(--ease-out);

  @starting-style {
    opacity: 0;
    transform: translateY(100%);
  }
}
```

Substitui o padrão de `onMounted(() => mounted.value = true)`.

### O LCP não anima a partir de `opacity: 0`

A foto do hero e a headline de S1 renderizam no estado final no HTML do servidor. Qualquer
reveal ali atrasa o LCP e é medido como tal.

---

## 6. Transição, não keyframe, para UI dinâmica

`transition` é interrompível e retargeta no meio do caminho. `@keyframes` reinicia do zero.

Vale para tudo que dispara rápido: o carrossel de S5 (quem faz swipe faz três seguidos),
o banner LGPD, o foco de campo.

```css
/* interrompível — para UI */
.item { transition: transform 200ms var(--ease-out); }

/* reinicia do zero — só para o que nunca é interrompido */
@keyframes desliza { from { transform: translateY(100%); } }
```

Onde precisar de controle por JS com performance de CSS, use WAAPI:

```js
el.animate(
  [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0 0)' }],
  { duration: 500, fill: 'forwards', easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }
);
```

---

## 7. `clip-path` — a ferramenta central

`inset(topo direita base esquerda)`. Cada valor come o elemento por aquele lado.

### `mask-line-up` — a entrada de todo título lírico

O título sobe por trás de uma máscara em vez de aparecer.

```css
.mask-line { overflow: hidden; }
.mask-line > span {
  display: block;
  transform: translateY(100%);
  transition: transform 500ms var(--ease-out);
}
[data-revealed] .mask-line > span { transform: translateY(0); }
```

`overflow: hidden` no pai, `translateY(100%)` no filho. Nenhum `clip-path` necessário e
funciona em SSR: o servidor entrega o estado inicial, o cliente promove.

### Reveal de imagem no scroll

```css
.reveal-img {
  clip-path: inset(0 0 100% 0);
  transition: clip-path 500ms var(--ease-out);
}
[data-revealed] .reveal-img { clip-path: inset(0 0 0 0); }
```

Dispare com `IntersectionObserver` em `{ once: true, rootMargin: '-100px' }`.
`app/composables/ui/useIntersectionVisibility.ts` já faz isso.

### Estilhaços de S5

(S3 tinha estilhaços até 2026-08-03; a seção virou cena de descida e a foto passou a
aparecer inteira — ver `S3-manifesto.md` §7.)

Os recortes poligonais usam `clip-path: polygon(...)` com aresta reta. Entrada de **1,5s**
e repouso de **0,5s** — é o único lugar do sistema onde a lentidão é o ponto: o estilhaço
está se montando, não respondendo a você.

---

## 8. Stagger

Elementos que entram juntos entram em cascata.

**Intervalo: 30–80ms.** Acima disso a interface fica lenta.

O doc de sessões pedia `0,12` (120ms) para os três títulos de S4, argumentando que "eles
são o evento". **Corrigido para 80ms** — que já é o teto do sistema. 120ms × 3 blocos são
360ms só de espera antes do último título começar; o ganho dramático não paga o atraso.

| Onde | Intervalo |
|---|---|
| títulos de S4 | **80ms** |
| parágrafos de S4 | 60ms |
| números da base (bookend) | entram por último, delay 400ms, todos juntos |
| itens de grid | 50ms, no máximo 6 escalonados — o 7º em diante entra sem delay |

Stagger é decoração. **Nunca bloqueie interação enquanto ele roda.**

```css
.item { animation: entra 300ms var(--ease-out) both; }
.item:nth-child(1) { animation-delay: 0ms; }
.item:nth-child(2) { animation-delay: 50ms; }
.item:nth-child(3) { animation-delay: 100ms; }
@keyframes entra { from { opacity: 0; transform: translateY(8px); } }
```

---

## 9. Pressão, hover, foco

### Todo elemento pressionável responde

```css
.button { transition: transform 120ms var(--ease-out); }
.button:active { transform: scale(0.97); }
```

Vale para botão, card clicável, CTA de WhatsApp, seta do carrossel. A escala fica entre
0,95 e 0,98 — o suficiente para o dedo sentir que a interface ouviu.

### Hover só em ponteiro fino

```css
@media (hover: hover) and (pointer: fine) {
  .card:hover { transform: scale(1.02); }
}
```

Sem isso, o toque no celular dispara hover e trava o estado.

### Foco

```css
:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}
```

Nunca colado no preenchimento vermelho — daí o offset.

---

## 10. Blur para mascarar troca imperfeita

Quando um crossfade continua estranho depois de você já ter tentado easings e durações,
o problema é que se enxergam **dois objetos** durante a troca. Um blur sutil funde os dois
e o olho lê uma transformação só.

```css
.trocando { filter: blur(2px); opacity: 0.7; transition: filter 200ms ease, opacity 200ms ease; }
```

Máximo de 20px. Blur pesado é caro, especialmente no Safari. Uso previsto: troca de item
no carrossel de S5 e o estado de envio do formulário de S8.

---

## 11. Gestos — carrossel de S5

### Velocidade dispensa distância

Não exija arrastar até um limiar. Um peteleco rápido basta.

```js
const velocidade = Math.abs(deslocamento) / tempoDecorrido;
if (Math.abs(deslocamento) >= LIMIAR || velocidade > 0.11) avanca();
```

### Atrito na borda, nunca parede

No primeiro e no último item, o arrasto continua acontecendo com resistência crescente,
e volta. Coisa nenhuma no mundo real para de repente.

### Captura de ponteiro

Iniciado o arrasto, o elemento captura os eventos — o gesto continua mesmo se o dedo sair
dos limites do elemento.

### Proteção multi-toque

```js
function aoPressionar() {
  if (arrastando) return;   // ignora dedos adicionais
  // ...
}
```

Sem isso, trocar de dedo no meio do arrasto faz o item pular para a posição do novo dedo.

---

## 12. `prefers-reduced-motion`

Movimento reduzido é **menos movimento e mais suave**, não ausência de movimento.
O que some é deslocamento e posição. O que fica é opacidade e cor — elas ajudam a
entender o que mudou.

| Animação | Com movimento reduzido |
|---|---|
| reveal on-scroll | só `opacity`, 200ms, sem `translateY` |
| `mask-line-up` | só `opacity`, sem máscara |
| travessia S6 | **corte de 200ms, sem discos** — continua sendo corte, nunca rampa |
| item do carrossel | troca instantânea |
| `:active scale(0.97)` | **mantém** — é feedback, não decoração |
| estilhaços | estado final direto |
| órbitas / rotação lenta | param |

O `app.vue` já envolve tudo em `<MotionConfig reduced-motion="user">`, e o `tailwind.css`
tem o bloco global de `@media (prefers-reduced-motion: reduce)`. As duas defesas ficam.

> ⚠️ O bloco global zera `transition-duration` com `!important`. Isso mata também o
> `:active scale`, que deveria sobreviver. Reintroduza o feedback de pressão dentro do
> próprio media query.

---

## 13. Como revisar

1. **Rode em câmera lenta.** 2× a 5× a duração normal, ou o painel Animations do DevTools.
   Em velocidade normal você não vê que o `transform-origin` está errado.
2. **Passo a passo por frame.** Revela dessincronia entre propriedades coordenadas.
3. **Teste no aparelho de verdade.** Gesto em simulador não conta. Celular no cabo,
   servidor de dev pelo IP, devtools remoto.
4. **Revise no dia seguinte.** Você enxerga com olho fresco o que não viu enquanto construía.

Perguntas na câmera lenta: as cores atravessam suave ou aparecem dois estados sobrepostos?
O easing começa firme? A origem da escala está no lugar certo? As propriedades terminam juntas?
