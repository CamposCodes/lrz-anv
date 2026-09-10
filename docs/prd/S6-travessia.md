# S6 · TRAVESSIA

**Superfície:** papel → sangue · **Frame de referência:** `08-fechamento.png` · **Sem fotografia**

A única passagem claro↔escuro do site. E ela **não pode ser uma rampa**.

---

## 1. O problema, medido

Interpolar papel → vermelho com o texto acompanhando derruba o contraste a **1,10:1** no
meio do caminho. Por dois quadros, o texto simplesmente não existe.

| Estado | Contraste do texto |
|---|---|
| início — tinta sobre papel | 19,43:1 ✅ |
| **meio da interpolação** | **1,10:1** ❌ |
| fim — branco sobre sangue | 5,57:1 ✅ |

O teto teórico de qualquer travessia com texto visível é **4,58:1** — e isso antes do grão
da textura, que derruba abaixo de 4,5.

**Nenhum easing resolve isto.** Não é problema de tempo, é problema de haver um caminho
contínuo entre duas cores em que o meio é inválido.

---

## 2. A solução: corte mascarado

Se o meio do caminho é inválido, não passe pelo meio com o texto à mostra. **Cubra, troque,
descubra.** O eclipse — que já é a assinatura da marca — ganha função.

```
FECHA (500ms)   discos --jm-noite entram de fora da tela
                --eclipse: 1.0 → 0.0, escalando até cobrir o viewport
                conteúdo antigo: opacity 1→0, translateY −40px

TROCA (0ms)     papel → sangue, sob os discos, com ZERO texto visível

ABRE (600ms)    --eclipse: 0.0 → 1.0, discos saem por lados opostos
                conteúdo novo: opacity 0→1, translateY 24px→0
```

O usuário nunca vê a troca. Vê dois discos que fecham e abrem — e a página está diferente
do outro lado. É exatamente o que um eclipse faz.

### Por que os discos são pretos

Os discos cruzam duas superfícies na mesma sequência: entram sobre papel (FECHA) e saem
sobre sangue (ABRE). Preto (`--jm-noite`) é a única tinta que funciona nas duas pontas —
**19,43:1** contra o papel na entrada, **3,72:1** contra o sangue na saída. Branco faria o
oposto: excelente contra o sangue (5,57:1), quase invisível contra o papel, que é
praticamente branco (`#FFF5FC`).

3,72:1 fica abaixo do piso de texto, mas os discos nunca carregam texto: são forma
decorativa, grande, `aria-hidden="true"`, e a tabela medida reserva essa faixa exatamente
para esse uso — **"só ≥24px / UI / fill, nunca corpo"**. Um disco que cobre o viewport
inteiro é o caso extremo desse uso.

> A antiga "vibração deliberada" — um acento propositalmente ilegível sobre vermelho
> (magenta a 1,59:1, depois ouro a 1,83:1) — não sobrevive à paleta de três cores. O par
> mais fraco possível agora é 3,72:1, e isso já é visível o bastante para deixar de ser
> tensão e virar apenas uma escolha de contraste. Os discos continuam decorativos e
> `aria-hidden`, mas não são mais ilegíveis de propósito.

---

## 3. Conteúdo

Frase de fechamento do arquivo, ponte entre S5 e S7:

> **Antes:** (papel, tinta) `Doze entradas. Nenhuma resposta pronta.`
> **Depois:** (sangue, branco) `O que sobra vira objeto.`

Ambas em **LÍRICO**. A segunda entrega o gancho de OURIVES em S7.

---

## 4. Especificação de movimento

| Fase | Propriedade | De → Para | Duração | Easing |
|---|---|---|---|---|
| FECHA | `--eclipse` | `1.0 → 0.0` | **500ms** | `--ease-drawer` |
| FECHA | conteúdo `opacity` | `1 → 0` | 240ms | `--ease-out` |
| FECHA | conteúdo `translateY` | `0 → -40px` | 240ms | `--ease-out` |
| TROCA | `data-surface` | `papel → sangue` | **0ms** | — |
| ABRE | `--eclipse` | `0.0 → 1.0` | **600ms** | `--ease-drawer` |
| ABRE | conteúdo `opacity` | `0 → 1` | 320ms, delay 160ms | `--ease-out` |
| ABRE | conteúdo `translateY` | `24px → 0` | 320ms, delay 160ms | `--ease-out` |

**Total: 1,1s.** Muito acima do teto de 300ms de UI — e correto. Isto não é interface,
é a transição narrativa da página. Roda uma vez por sessão.

`--ease-drawer` (`cubic-bezier(0.32, 0.72, 0, 1)`) é a curva de gaveta do iOS: sai rápido
e assenta longo. É a curva certa para massa grande em movimento.

### Abrir é mais lento que fechar

500ms para fechar, 600ms para abrir. **Invertido em relação à regra geral** do sistema
(saída mais rápida que entrada) — e de propósito: fechar é o sistema escondendo o truque,
e deve ser rápido; abrir é a revelação, e o usuário quer ver.

### Os discos

```css
.disco {
  transform: translateX(calc(var(--eclipse) * var(--lado) * 60vw))
             scale(calc(2.4 - var(--eclipse) * 1.4));
  transition: transform 500ms var(--ease-drawer);
}
.disco--esq { --lado: -1; }
.disco--dir { --lado:  1; }
```

Em `--eclipse: 0` os discos estão centralizados e em `scale(2.4)` — cobrindo o viewport
inteiro com folga. Em `--eclipse: 1` estão fora da tela em `scale(1)`.

**Nunca partem de `scale(0)`.** Mesmo fora da tela têm tamanho — a escala mínima é 1.

---

## 5. Movimento reduzido — continua sendo corte

```css
@media (prefers-reduced-motion: reduce) {
  /* sem discos, sem escala, sem deslocamento */
  .travessia { transition: opacity 200ms ease; }
}
```

**Corte simples de 200ms, sem discos. E continua sendo corte — nunca rampa.**

Este é o ponto que não pode ser afrouxado: alguém poderia achar que "movimento reduzido"
autoriza voltar ao cross-fade suave. Não autoriza — o cross-fade é justamente o que produz
1,10:1 no meio. Movimento reduzido remove o **movimento**, não a **correção**.

A troca de superfície acontece na metade dos 200ms, num quadro em que a opacidade do
conteúdo já é 0.

---

## 6. Implementação

- A travessia dispara por `IntersectionObserver` `{ once: true }` quando o topo da sessão
  cruza 60% da viewport. **Não** por posição contínua de scroll — scroll contínuo
  reintroduz estados intermediários, que é exatamente o que estamos evitando.
- Usar **WAAPI**, não `@keyframes`: precisamos de controle por JS com performance de CSS,
  e a sequência tem três fases encadeadas.

```js
const fecha = discos.animate(
  [{ transform: 'translateX(var(--fora)) scale(1)' },
   { transform: 'translateX(0) scale(2.4)' }],
  { duration: 500, fill: 'forwards', easing: 'cubic-bezier(0.32, 0.72, 0, 1)' }
);
await fecha.finished;
raiz.dataset.surface = 'sangue';    // troca sob o disco, zero texto visível
discos.animate(/* ... */, { duration: 600, /* ... */ });
```

- `await fecha.finished` garante que a troca só acontece com o viewport coberto. Não use
  `setTimeout` — ele não sabe se a animação foi interrompida ou throttled em aba de fundo.

---

## 7. Acessibilidade

- Discos são `aria-hidden="true"`. Não carregam informação — são forma decorativa que
  atravessa duas superfícies, por isso preto (funciona nas duas pontas), não uma tinta
  ilegível de propósito.
- O texto novo entra em `opacity 0` mas **já está no DOM** desde o SSR — leitor de tela
  não espera a animação.
- Nenhum `aria-live` aqui: a mudança é decorativa, e anunciá-la seria ruído.
- A sessão continua rolável durante a travessia. Se o usuário rolar no meio, a sequência
  termina normalmente — sem pin, sem trava (`00-indice.md §D3`).

---

## 8. Critérios de aceite

- [ ] Em nenhum quadro existe texto visível sobre superfície em transição
- [ ] Amostragem de pixel quadro a quadro nunca registra contraste de texto abaixo de 4,5:1
- [ ] A troca de `data-surface` acontece com os discos cobrindo 100% do viewport
- [ ] Fecha em 500ms, abre em 600ms
- [ ] Discos nunca em `scale(0)`
- [ ] Com `prefers-reduced-motion`: corte de 200ms, sem discos, **sem rampa**
- [ ] Dispara uma vez; rolar para trás e voltar não repete
- [ ] A troca usa `await animation.finished`, não `setTimeout`
- [ ] Página rolável durante toda a sequência
