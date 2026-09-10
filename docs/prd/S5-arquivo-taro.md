# S5 · ARQUIVO DO TARÔ

**Superfície:** papel · **Frames:** `05-arquivo-titulo.png` · `06/07-arquivo-item.png`
**Fotos:** 12 itens de `TAROT/` — lista medida em `91-assets.md §2`

O catálogo. Layout idêntico para os 12 itens, só o conteúdo muda.

---

## 1. Objetivo

Mostrar profundidade. Doze entradas com layout constante provam acervo de um jeito que
três blocos não provam. É também a sessão mais indexável do site.

---

## 2. Mudança de escopo — de OURIVES para TARÔ

O doc de sessões catalogava peças de joalheria aqui e declarava bloqueio de produção
("regravar com fundo escuro, ganho de 8× em contraste, único bloqueio duro do projeto").

**O bloqueio não se confirma.** Amostra de 36 das 387 fotos de OURIVES: mediana **7,88:1**
de contraste peça×fundo, pior caso 1,93:1, **zero** abaixo de 1,5:1.

O motivo real da troca é **resolução**: os 387 arquivos de OURIVES estão todos abaixo de
1024px. Servem para card pequeno; não servem para o item grande que esta sessão exige.
As fotos de tarô têm 2369–4898px.

OURIVES não desaparece — ganha S7, que é vermelho chapado e não usa foto nenhuma.

---

## 3. Abertura

```
        Cada carta é uma
      pergunta melhor feita
  ANTES DE VOCÊ TIRAR              O QUE VOCÊ JÁ SABE ESTÁ AQUI
```

| Elemento | Especificação |
|---|---|
| Título | **LÍRICO**, 2 linhas, centralizado, `--jm-red` sobre papel — **5,23:1** ✅ |
| Legendas | **REGISTRO**, nos extremos opostos, `--jm-tinta` — 19,43:1 ✅ |
| Corpo | `clamp(3rem, 6.5vw, 5.5rem)`, `line-height` 1,02 |

Título em caixa mista. Legendas em caixa alta.

---

## 4. Item — layout constante

```
┌──────────────────────────────────────────────┐
│                                              │
│            ╱▚  [ ESTILHAÇOS ]                │  3–4 recortes da foto
│           ▟  ▜   sobre card --jm-onyx        │  ao redor de um vazio
│                                              │
│  A LUA          BARALHO RIDER-WAITE ·        │  nome à esq. (LÍRICO)
│                 LEITURA DE 3 CARTAS ·        │  ficha à dir. (REGISTRO)
│                 60 MIN · PRESENCIAL          │
│                                              │
│                                    03 / 12   │  contador
└──────────────────────────────────────────────┘
```

| Medida | Valor |
|---|---|
| Nome do item | LÍRICO, `clamp(2.5rem, 5vw, 4rem)`, `--jm-red` |
| Ficha | REGISTRO, caixa alta, 4 campos máximo |
| Card da foto | `--jm-onyx #12100F` |
| Contador | REGISTRO, `--jm-tinta` a `opacity .5` |

**Estrutura da ficha** — 4 campos, sempre nesta ordem, sempre presentes:
`baralho · formato · duração · modalidade`

Campo ausente vira `—`, nunca some. Layout constante é o que faz 12 itens lerem como
catálogo em vez de 12 páginas diferentes.

### As 12 fotos

Lista completa com dimensões, família cromática e contraste contra o card onyx em
`91-assets.md §2`. Resumo: 8 de `TAROT/Elementos`, 1 de `TAROT/Jessica`, todas entre
3,43:1 e 8,55:1 contra o onyx.

> Cinco fotos de tarô foram **reprovadas** para item por serem quase pretas (1,40–2,01:1
> contra onyx — somem dentro do card). Elas estão listadas em `91-assets.md` e reservadas
> para fundo full-bleed, onde são as melhores do acervo.

---

## 5. Divergências declaradas

### 🚫 Nº 1 — sem pin

A referência trava o viewport por 23,8s enquanto avança 11 itens. **Não fazemos isso.**
`00-indice.md §D3` proíbe scrolljacking. A sessão vira carrossel com scroll de página
sempre livre.

### 🚫 Nº 2 — sem pontinhos

O indicador de 12 segmentos (inativo 6px, ativo ~55px) vira **contador em REGISTRO**:
`03 / 12`. Um segundo indicador competiria com o eclipse, que é a assinatura da marca.

---

## 6. Interação do carrossel

Quatro formas de avançar. Cada uma com movimento próprio.

| Entrada | Comportamento | Anima? |
|---|---|---|
| **Swipe / arrasto** | segue o dedo, solta com inércia | ✅ 200ms entra / 140ms sai |
| **Botões ‹ ›** | avança 1 item | ✅ 200ms |
| **Setas do teclado** | avança 1 item | ❌ **instantâneo** |
| **Tab** | move o foco para o item seguinte | ❌ instantâneo |

### Por que o teclado não anima

Quem navega por teclado repete o gesto. Animação de 200ms em ação repetida vira atraso
percebido e desconexão entre tecla e resultado. Mesmo componente, mesma transição —
desligada por origem do evento:

```js
function irPara(indice, { animar = true } = {}) {
  trilha.style.transitionDuration = animar ? '200ms' : '0ms';
  trilha.style.transform = `translateX(${-indice * 100}%)`;
}
// seta do teclado:
onKeydown = e => { if (e.key === 'ArrowRight') irPara(i + 1, { animar: false }); };
```

### Arrasto

**Velocidade dispensa distância.** Um peteleco rápido basta:

```js
const velocidade = Math.abs(deslocamento) / tempoDecorrido;
if (Math.abs(deslocamento) >= LIMIAR || velocidade > 0.11) avanca();
```

**Atrito nas bordas, nunca parede.** No primeiro e no último item o arrasto continua com
resistência crescente e volta. Coisa nenhuma no mundo real para de repente.

```js
const excesso = Math.abs(dx) - limite;
const amortecido = limite + excesso * 0.35;   // quanto mais arrasta, menos anda
```

**Captura de ponteiro.** Iniciado o arrasto, o elemento captura os eventos — o gesto
continua se o dedo sair dos limites.

```js
el.setPointerCapture(e.pointerId);
```

**Proteção multi-toque.** Dedos adicionais são ignorados — sem isso, trocar de dedo no
meio faz o item pular para a nova posição.

```js
function aoPressionar(e) { if (arrastando) return; /* ... */ }
```

### Durante o arrasto: `transform` direto no elemento

**Não** escreva `--swipe-amount` no contêiner. Variável CSS é herdada — mudá-la no pai
recalcula estilo dos 12 filhos a cada frame do arrasto.

```js
// ruim
trilha.style.setProperty('--swipe', `${dx}px`);
// bom
trilha.style.transform = `translateX(${base + dx}px)`;
```

### Transição, nunca keyframe

Quem faz swipe faz três seguidos. `@keyframes` reinicia do zero a cada disparo e produz
salto; `transition` retargeta a partir da posição atual.

```css
.trilha { transition: transform 200ms var(--ease-out); }
```

---

## 7. Movimento — resumo

| Elemento | Movimento | Duração | Easing |
|---|---|---|---|
| Título de abertura | `mask-line-up`, 2 linhas | 500ms | `--ease-out` · stagger 70ms |
| Legendas | `opacity 0→1` | 300ms | `ease` · delay 200ms |
| Trilha do carrossel | `translateX` | **200ms entra / 140ms sai** | `--ease-out` |
| Estilhaços do item | `clip-path` | **1,5s** entrada, 0,5s repouso | `--ease-out` |
| Troca de conteúdo do item | `filter: blur(0→2px)`, `opacity 1→.7` | 200ms | `ease` |
| Botões ‹ › (`:active`) | `scale(0.97)` | 120ms | `--ease-out` |
| Contador | `opacity` cross-fade | 160ms | `ease` |

### O blur na troca

Trocar de item faz dois estados se sobreporem por um instante e o olho enxerga **dois
objetos**, não uma transformação. `blur(2px)` durante a troca funde os dois e o olho lê
um movimento só. Máximo de 20px — blur pesado é caro, sobretudo no Safari.

### Saída mais rápida que entrada

200ms para entrar, 140ms para sair. Devagar onde o usuário está decidindo o que olhar,
rápido onde o sistema está apenas obedecendo.

---

## 8. Movimento reduzido

- Trilha: troca instantânea, sem `translateX` animado
- Estilhaços: estado final direto
- Blur de troca: **removido** (é movimento disfarçado de foco)
- Contador: cross-fade mantido em 160ms — é informação
- `:active scale(0.97)`: **mantido** — é feedback, não decoração

---

## 9. Responsivo

| Faixa | Comportamento |
|---|---|
| ≥ 1280px | 1 item por viewport, estilhaços grandes, ficha em coluna à direita |
| 768–1279px | 1 item, estilhaços reduzidos, ficha abaixo do nome |
| < 768px | 1 item, **2 estilhaços** em vez de 4, ficha em lista de 4 linhas |

As fotos `vizujazzz_40.JPG` (4898×3265) e `jazzz_1.jpg` (3805×2537) são **paisagem**; as
outras dez são retrato. Ambas precisam de `object-position` próprio no card retrato —
está anotado em `91-assets.md`.

---

## 10. Acessibilidade

- O carrossel é uma `<ul>` com `role="group"` e `aria-roledescription="carrossel"`.
- Botões ‹ › são `<button>` reais com `aria-label` (`Item anterior` / `Próximo item`),
  nunca `<div>` com `onclick`.
- O contador vive num `<p aria-live="polite">` — quem usa leitor de tela ouve `3 de 12`
  quando o item muda. **`polite`, não `assertive`**: não interrompe leitura em curso.
- Item fora de vista recebe `inert` — sem isso o Tab entra em card invisível.
- Estilhaços `aria-hidden="true"`; a foto do item tem `alt` descritivo real (não `""` —
  aqui a foto **é** conteúdo).
- Setas do teclado funcionam com o carrossel em foco; `Home`/`End` vão ao primeiro/último.
- Sem autoplay. Nenhum. Não existe botão de pausa porque não existe o que pausar.

---

## 11. Critérios de aceite

- [ ] 12 itens com layout idêntico, ficha sempre com os 4 campos
- [ ] Scroll da página livre em qualquer momento — nenhum pin, nenhum `overflow:hidden` no `body`
- [ ] Contador `03 / 12`, sem indicador de pontinhos
- [ ] Seta do teclado troca o item **sem** transição; swipe troca **com**
- [ ] Peteleco de 40px em 200ms avança (velocidade > 0,11)
- [ ] Arrastar além do último item resiste e volta — não bate em parede
- [ ] Trocar de dedo no meio do arrasto não faz o item pular
- [ ] Nenhuma variável CSS é escrita no contêiner durante o arrasto
- [ ] `aria-live="polite"` anuncia a troca de item
- [ ] Item fora de vista tem `inert`
- [ ] Todas as 12 fotos ≥ 3:1 contra `--jm-onyx`
