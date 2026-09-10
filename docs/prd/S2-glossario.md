# S2 · GLOSSÁRIO

**Superfície:** papel · **Frame de referência:** `02-glossario.png` · **Sem fotografia**

O nome tem duas metades. A sessão define uma de cada vez.

---

## 1. Objetivo

Transformar o nome artístico em conteúdo. Quem chega sabendo só "Jazz Moon" sai sabendo
o que cada metade quer dizer — e o site ganha um bloco de texto denso e indexável logo
depois de um hero que é quase só imagem.

Ganho colateral de AEO: é a resposta pronta para *"o que significa Jazz Moon?"*.

---

## 2. Estrutura

```
┌────────────────────────────────────────────────────────┐
│ SIGNIFICADO:                                    jm     │  REGISTRO
│                                                        │
│    Jazz              ◐    ◐              Moon          │  LÍRICO, --jm-red
│   ─────────                             ─────────      │
│   O CAOS QUE                       O SILÊNCIO QUE      │  corpo, caixa alta
│   ESCUTA. A                        ATRAVESSA. A        │
│   IMPROVISAÇÃO                     FASE QUE VOLTA      │
│   COMO MÉTODO.                     SEMPRE DIFERENTE.   │
│                                                        │
│   ritmo                                       ritual   │  REGISTRO
└────────────────────────────────────────────────────────┘
```

Duas colunas simétricas. Entre elas, **os dois discos do eclipse** — um ancorando cada
coluna, no lugar da barra diagonal da referência.

| Medida | Valor |
|---|---|
| Colunas | 2, simétricas, `gap` de 1 coluna vazia no grid de 12 |
| Termo | LÍRICO, `clamp(3.5rem, 7vw, 6.5rem)` |
| Definição | corpo, caixa alta, `tracking .04em`, máx. **4 linhas** |
| Padding vertical | ≥ 18vh — a sessão respira, é uma pausa depois do hero |

---

## 3. Conteúdo

| Elemento | Texto |
|---|---|
| Rótulo | `SIGNIFICADO:` |
| Sigla | `jm` |
| Termo esquerdo | `Jazz` |
| Definição esquerda | `O CAOS QUE ESCUTA. A IMPROVISAÇÃO COMO MÉTODO.` |
| Termo direito | `Moon` |
| Definição direita | `O SILÊNCIO QUE ATRAVESSA. A FASE QUE VOLTA SEMPRE DIFERENTE.` |
| Rodapé esquerdo | `ritmo` |
| Rodapé direito | `ritual` |

Termos em **caixa mista** (`Jazz`, não `JAZZ`) — é a única sessão do site onde o lírico
aparece em caixa mista, e é isso que faz parecer verbete de dicionário e não título.

---

## 4. Cor

| Elemento | Token | Contraste |
|---|---|---|
| Superfície | `--jm-papel #FFF5FC` | — |
| Termos | `--jm-red #D30000` | **5,23:1** ✅ AA |
| Definições, rótulos | `--jm-tinta #0A0004` | **19,43:1** ✅ AAA |
| Discos do eclipse | `--jm-red #D30000` | decorativo |

> **A proibição antiga inverteu.** Na paleta de quatro cores, o acento era ouro e reprovava
> sobre papel (2,86:1) abaixo de 24px — ou seja, em quase todo texto desta sessão, exceto
> o termo em corpo grande. Com a paleta reduzida a preto/branco/vermelho, o acento do papel
> passou a ser o próprio sangue: **5,23:1**, AA em qualquer tamanho de corpo. O termo, que
> já usava essa tinta, deixa de ser exceção — vermelho é texto válido na sessão inteira.

---

## 5. Movimento

Aqui está a única animação verdadeiramente narrativa do site: **os dois discos se aproximam
enquanto as colunas se revelam.** O nome se juntando.

### O eclipse

Uma variável, dois discos:

```css
.glossario { --eclipse: 1; }          /* 1 = oposição total, 0 = sobreposição */

.disco-jazz { transform: translateX(calc(var(--eclipse) * -1 * 6.5rem)); }
.disco-moon { transform: translateX(calc(var(--eclipse) *  1 * 6.5rem)); }
```

| Estado | `--eclipse` | Quando |
|---|---|---|
| inicial | `1.0` | antes do reveal — discos afastados |
| final | `0.4142` | depois do reveal — sobreposição parcial |

`0,4142` é √2 − 1: a razão em que dois círculos de raio igual se cruzam nos centros um do
outro. Não é número redondo por acaso — é a proporção do eclipse do wordmark.

```css
.disco { transition: transform 640ms var(--ease-in-out); }
```

`ease-in-out` porque os discos **se movem na tela**, não entram nem saem. 640ms está acima
do teto de 300ms de UI — permitido: é narrativa, roda uma vez, e o usuário está lendo.

> Atualiza-se `--eclipse` **no contêiner da sessão**, que tem 2 filhos animados. É o único
> lugar do site onde variável CSS herdada é aceitável — em lista longa isso recalcularia
> estilo de todos os filhos e seria proibido (`90-movimento.md §4`).

### Entrada das colunas

| Elemento | Movimento | Duração | Delay |
|---|---|---|---|
| Rótulo `SIGNIFICADO:` | `opacity 0→1` | 300ms | 0 |
| Termo `Jazz` | `mask-line-up` | 500ms | 80ms |
| Termo `Moon` | `mask-line-up` | 500ms | 160ms |
| Definições | `opacity 0→1`, `translateY 8px→0` | 400ms | 240ms / 300ms |
| Discos | `--eclipse: 1 → .4142` | 640ms | 200ms |
| Rodapés `ritmo`/`ritual` | `opacity 0→1` | 300ms | 400ms |

Stagger de 80ms entre os dois termos — dentro do teto do sistema. Dispara uma vez, por
`IntersectionObserver` com `{ once: true, rootMargin: '-120px' }`.

### Movimento reduzido

Discos vão direto para `0.4142` sem transição. Colunas fazem só `opacity` em 200ms.
Os termos aparecem sem máscara. **O eclipse continua existindo** — ele é informação
sobre a marca, não decoração; só não se move.

---

## 6. Responsivo

| Faixa | Comportamento |
|---|---|
| ≥ 1024px | duas colunas, discos entre elas |
| < 1024px | **empilha**: `Jazz` + definição, disco, `Moon` + definição, disco |

Empilhado, os discos ficam um acima do outro e a animação de `--eclipse` passa a mover
em `translateY`. Mesma variável, eixo trocado por media query:

```css
@media (max-width: 1023px) {
  .disco-jazz { transform: translateY(calc(var(--eclipse) * -1 * 4rem)); }
  .disco-moon { transform: translateY(calc(var(--eclipse) *  1 * 4rem)); }
}
```

---

## 7. Acessibilidade

- Marcação semântica de glossário: `<dl>` com `<dt>` para o termo e `<dd>` para a definição.
  É literalmente uma lista de definições — usar `<div>` aqui perde estrutura de graça.
- Discos são `aria-hidden="true"`.
- As definições estão em caixa alta **por CSS** (`text-transform: uppercase`), com o texto
  em caixa mista no HTML. Leitor de tela lê palavra, não sigla soletrada.
- Contraste de 19,43:1 nas definições — folga de sobra para o `tracking` aumentado.

---

## 8. Critérios de aceite

- [ ] `<dl>/<dt>/<dd>` no HTML renderizado pelo servidor
- [ ] Termos em `#D30000` medindo 5,23:1 contra `#FFF5FC`
- [ ] Acento da sessão é `--jm-red` (#D30000), medindo 5,23:1 contra o papel — nenhuma outra tinta de acento
- [ ] `--eclipse` parte de 1.0 no HTML do servidor e chega a 0.4142 após o reveal
- [ ] Discos se cruzam exatamente nos centros um do outro no estado final
- [ ] Com `prefers-reduced-motion`, os discos já nascem em 0.4142
- [ ] Reveal dispara uma vez só; rolar para trás e para frente não repete
- [ ] Empilhado abaixo de 1024px, com o eclipse no eixo vertical
