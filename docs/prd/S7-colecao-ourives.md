# S7 · COLEÇÃO OURIVES

**Superfície:** sangue · **Frame de referência:** `09-colecao.png` · **Sem fotografia**

Onde a referência tem imagem, aqui tem cor. É a inversão que impede o clone.

---

## 1. Objetivo

Um respiro. Não é sessão de conteúdo — é a pausa entre o arquivo denso de S5 e o
formulário de S8, e o único bloco de cor chapada do site.

---

## 2. Duas regras duras

### 1. Máximo 1 viewport

É respiro, não seção. Se precisar de rolagem, virou outra coisa. `min-height: 100svh`,
`max-height: 100svh`, conteúdo centralizado.

### 2. Sobre sangue não existe texto secundário

| tinta sobre `#D30000` | ratio | veredito |
|---|---|---|
| branco `#FFFFFF` | **5,57:1** | ✅ **a única tinta permitida** |
| prata `#EDE4EA` | 4,48:1 | ❌ reprova por 0,02 |
| branco a `opacity .8` | 3,68:1 | ❌ |
| preto `--jm-noite #0A0004` | 3,72:1 | ⚠️ só decorativo/UI ≥24px, nunca texto, `aria-hidden` |

**Hierarquia aqui vem de tamanho e peso, nunca de cor ou opacidade.** Não arredonde 4,48
para cima. A prata reprova por dois centésimos e é exatamente o tipo de coisa que passa
despercebida na revisão e falha na auditoria.

---

## 3. Estrutura

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                                                      │
│              OURIVES · SÉRIE 001                     │  LÍRICO, branco
│                                                      │
│         PEÇA      ⟨ VER A COLEÇÃO ⟩      ÚNICA       │  palavras soltas + CTA
│                                                      │
│                                                      │
└──────────────────────────────────────────────────────┘
                superfície --jm-sangue #D30000
```

| Elemento | Especificação |
|---|---|
| Título | LÍRICO, `clamp(3rem, 7vw, 6rem)`, `--jm-branco` |
| Palavras soltas | REGISTRO, caixa alta, `tracking .2em`, `--jm-branco` |
| CTA | **invertido** — preenchimento `#FFFFFF`, rótulo `#D30000` (**5,57:1** ✅) |
| Altura | exatamente 1 viewport |

O CTA invertido é o elemento mais claro da tela e o único preenchimento branco do site.
É o que faz ele ganhar sem precisar de tamanho.

---

## 4. Conteúdo

| Elemento | Texto |
|---|---|
| Título | `OURIVES · SÉRIE 001` |
| Palavra esquerda | `PEÇA` |
| Palavra direita | `ÚNICA` |
| CTA | `VER A COLEÇÃO` |

`PEÇA` e `ÚNICA` ladeiam o CTA e, lidas na horizontal, formam "peça única" com o botão no
meio. O botão é literalmente o que está entre você e a peça.

---

## 5. Por que sem foto

O acervo de OURIVES tem 387 fotos. **Todas abaixo de 1024px** — servem para card e grid,
nunca para full-bleed. Qualquer foto de joia aqui borraria.

A ausência de foto não é limitação disfarçada de escolha: a referência usa fotografia
vermelha nesta posição, e repetir isso com material de menor resolução produziria a pior
versão possível. Vermelho chapado é mais forte **e** resolve o problema de produção.

> Quando houver regravação em alta resolução, ela entra numa página `/ourives` dedicada —
> não aqui. Esta sessão permanece chapada por decisão de composição, não por falta.

---

## 6. O selo Zambi

`MARCA/ZAMBI/zambi-badge.png` (945px) aparece pequeno, canto inferior, `opacity` do tier
`--motif-decor` (0.14), em branco.

Zambi é a marca da ourivesaria — **não é mais um tema da interface** (`00-indice.md §D1`).
Aqui ela aparece como assinatura de linha de produto, que é o que sempre foi.

---

## 7. Movimento

Sessão curta, movimento curto.

| Elemento | Movimento | Duração | Delay | Easing |
|---|---|---|---|---|
| Título | `mask-line-up` | 500ms | 0 | `--ease-out` |
| `PEÇA` / `ÚNICA` | `opacity 0→1`, `translateX ∓12px→0` | 400ms | 160 / 160ms | `--ease-out` |
| CTA | `opacity 0→1`, `scale .96→1` | 300ms | 280ms | `--ease-out` |
| Selo Zambi | `opacity 0→.14` | 400ms | 400ms | `ease` |

`PEÇA` e `ÚNICA` entram **simultaneamente**, cada uma do seu lado — elas são um par, não
uma sequência. Escalonar as duas quebraria a leitura horizontal.

### CTA

```css
.cta {
  transition: transform 120ms var(--ease-out), background-color 160ms ease;
}
.cta:active { transform: scale(0.97); }

@media (hover: hover) and (pointer: fine) {
  .cta:hover { background-color: #FFF5FC; }   /* papel — 5,04:1 com #D30000 ✅ */
}
```

Hover vai para papel, não para cinza. Cinza reduziria o contraste do rótulo vermelho;
papel mantém 5,04:1 e é cor do sistema.

`scale .96 → 1` na entrada — **nunca de 0**.

### Movimento reduzido

Tudo em `opacity` de 200ms, sem deslocamento e sem escala de entrada.
`:active scale(0.97)` **permanece** — é feedback.

---

## 8. Responsivo

| Faixa | Comportamento |
|---|---|
| ≥ 768px | `PEÇA ⟨CTA⟩ ÚNICA` na horizontal |
| < 768px | título, depois `PEÇA · ÚNICA` lado a lado, CTA abaixo em largura total |

Abaixo de 768px o CTA vira `width: 100%` com altura mínima de 48px — alvo de toque.

---

## 9. Acessibilidade

- O CTA é `<a>` (navega) ou `<button>` (abre painel) — nunca `<div>` com `onclick`.
- Foco visível: 2px `--jm-branco`, **offset de 2px**. Nunca colado no preenchimento
  vermelho — sem o offset, o anel some dentro do fundo.
- Selo Zambi `aria-hidden="true"`.
- `PEÇA` e `ÚNICA` são texto real, não `::before`/`::after` — conteúdo em pseudo-elemento
  não é confiável em leitor de tela.
- Alvo de toque ≥ 48×48px em qualquer largura.

---

## 10. Critérios de aceite

- [ ] Altura exata de 1 viewport; sem rolagem interna
- [ ] Nenhuma fotografia
- [ ] Todo texto em `#FFFFFF` puro — nenhuma prata, nenhuma opacidade em texto
- [ ] CTA com preenchimento branco e rótulo `#D30000` medindo 5,57:1
- [ ] Hover do CTA em `#FFF5FC` mantendo ≥ 4,5:1
- [ ] Anel de foco com offset de 2px, visível sobre o vermelho
- [ ] `PEÇA` e `ÚNICA` entram juntas, sem stagger
- [ ] CTA entra de `scale(.96)`, nunca de 0
- [ ] Alvo de toque ≥ 48px
