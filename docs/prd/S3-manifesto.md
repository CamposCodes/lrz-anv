# S3 · MANIFESTO

**Superfície:** noite · **Frame de referência:** `03-statement.png` · **Foto:** `DJ/IMG_2060.jpg`

A voz dela. Não é um grito — é uma frase dita.

> **Revisão de 2026-08-03 — a seção virou uma CENA DE CURSO.** O bloco único de texto sobre
> estilhaços saiu; entrou um palco grudado na dobra em que a foto DESCE (a artista é
> percorrida de cima a baixo) enquanto a fala se escreve em **cinco tempos**, cada um
> apagando o anterior. Mudaram a foto (§6), o conteúdo (§4), a mecânica (§7) e o movimento
> (§8). O dispositivo de tamanhos mistos inline (§2) e a assimetria de colunas (§3) ficam.

---

## 1. Objetivo

Uma declaração longa o suficiente para ter peso e curta o suficiente para ser lida inteira
de pé. É o bloco que um LLM cita quando perguntam quem ela é.

---

## 2. O dispositivo que herdamos

O frame de referência resolve o bloco de texto com **tipo de tamanhos mistos inline**: as
palavras de ligação em ~15% do corpo, na mesma linha das palavras grandes.

```
        JAZZ MOON ⁿᵃᵒ ᵉ́
     ᵘᵐ ᵖᵉʳˢᵒⁿᵃᵍᵉᵐ. ᵉ́ ᵒ
       nome que dei
      ao que já era.
```

É o que impede a frase de virar bloco monótono. **Isto fica.**

O que muda: a referência usa a mesma grotesca ultra-pesada do hero, e a repetição serve
para um estúdio. Jazz Moon é uma pessoa. O manifesto precisa de outra temperatura.

---

## 3. Estrutura

```
   seção = 100svh + 350svh de curso · palco sticky em top:0
┌──────────────────────────────────────────────────────────┐
│  [ IMG_2060 inteira, esmagada a 0,40, DESCENDO ]      ▲   │
│                                                      │   │
│   col 2 ──────────────────────── col 8               │   │
│   Fala ᵈᵃ ᵛᵉᶻ  (as 5 na mesma célula da grade,       │   │
│   uma apagando a outra)                              │   │
│                                                      │   │
│   DJ, TARÓLOGA E OURIVES. JUIZ DE FORA…  (fixo)      │   │
└──────────────────────────────────────────────────────────┘
       a foto percorre toda a folga dela para fora da dobra
```

| Medida | Valor |
|---|---|
| Alinhamento | **assimétrico**, colunas 2–8 de 12 — não centralizado |
| Caixa | **sentence case** — o manifesto é fala, não grito |
| Palavra grande | `clamp(2rem, 4.6vw, 3.5rem)` — menor que a versão de bloco único: agora são cinco falas no mesmo lugar e a mais longa tem de caber na dobra com o registro embaixo |
| Palavra de ligação | **36%** do corpo da grande, piso de 19px, `vertical-align: baseline` |
| `line-height` | 1,06 |
| Curso | **350svh** (70svh por fala) — o único número a mexer para acelerar a cena |

A assimetria é deliberada: a referência centraliza, e centralizar aqui produziria um bloco
simétrico que compete com o glossário de S2, que já é simétrico.

---

## 4. Conteúdo

Cinco falas, uma por dobra de leitura. O corte segue a pontuação da autora, não a contagem
de caracteres: cada fala tem de se entender sozinha, porque na cena ela aparece sozinha.

| # | Fala (miúdo entre `<sub>`) |
|---|---|
| 1 | A lua tem várias fases, <sub>mas no fim das contas,</sub> é uma coisa só. |
| 2 | Tudo isso é Jessica Americana. <sub>Mas a lua cheia…</sub> a lua cheia é Jazz Moon. |
| 3 | Não sou um personagem. <sub>Sou o alinhamento de quem eu sempre fui:</sub> a pulsação da música <sub>(DJ),</sub> a intuição do Tarot e a arte das joias. |
| 4 | Três ofícios, <sub>três maneiras de</sub> ler a mesma noite. |
| 5 | Cada fase é um jeito diferente <sub>de fazer a mesma pergunta</sub> e de não ter pressa para a resposta. |

A terceira é a mais densa de propósito: é o centro do texto, e quebrá-la em duas separaria
a negação da lista que a justifica.

**Duas partes miúdas nunca ficam adjacentes.** Elas carregam os espaços da frase (é assim
que o espaço sai sempre no corpo pequeno); duas seguidas dariam espaço duplo.

**Parágrafo de apoio** (REGISTRO, caixa alta) — **não entra na cena**: fica visível o curso
inteiro. É a âncora local que sustenta o `Person` do JSON-LD da home. A segunda frase da
versão antiga saiu porque a fala 5 agora diz a mesma coisa.

> `DJ, TARÓLOGA E OURIVES. JUIZ DE FORA, MINAS GERAIS.`

---

## 5. Tipografia — troca de face

| | Referência | **Jazz Moon** |
|---|---|---|
| Face | grotesca ultra-pesada | **DISPLAY** — Lastik |
| Caixa | caixa alta | **sentence case** |

O manifesto é um dos textos maiores do site (`clamp(2rem, 4.6vw, 3.5rem)`) e entra no
tier de maior destaque, junto da headline do hero e dos títulos de seção.

> **A camada VINTAGE (Fraunces `SOFT 60 / WONK 1`) foi aposentada.** Era exclusiva deste
> bloco. Uma quarta face para uma seção só não paga o webfont, e a Lastik já entrega o
> contraste de traço da didone que o "revista antiga" pedia — sem eixo variável, que aqui
> nunca chegou a funcionar de verdade (a Fraunces vinha do Google como instância estática,
> então `font-variation-settings` era inerte).

A troca de face é o que diferencia esta seção do hero. Não é a família — as duas agora são
Lastik — é a **caixa**: o hero grita em caixa alta justificada, o manifesto fala em
sentence case alinhado à esquerda, nas colunas 2–8. Mesma voz, registro diferente.

**Disciplina didone:** a proporção da referência (15%) é pequena demais para virar texto —
15% de 3,5rem dá 8,4px. A ligação sobe para **36% do corpo grande, com piso de 19px**:

```css
.ligacao { font-size: max(19px, 0.36em); }
```

O piso mudou de 28px para 19px junto com o corpo grande (era até 4,5rem, hoje 3,5rem):
manter 28px sob um display de 32px no celular apagaria a diferença de escala, que é o
dispositivo inteiro. 19px continua acima do corpo de leitura do site e o fio capilar da
didone se sustenta.

---

## 6. Cor

| Elemento | Token | Contraste |
|---|---|---|
| Superfície | `--jm-noite #0A0004` | — |
| Tinta | `--jm-silver #EDE4EA` | **16,64:1** sobre noite ✅ AAA · **5,04:1 no PIOR pixel** da foto esmagada (p99 5,10 · p95 5,45 · mediana 16,75) ✅ |
| Parágrafo de apoio | `--jm-silver` a `opacity: .72` | 11,3:1 efetivo sobre noite ✅ |

### Por que o piso aqui é o PIOR pixel, e não o p95

Nas outras seções a foto é fundo parado e o p95 basta. Aqui ela DESCE: ao longo dos 350svh
qualquer região do quadro passa por baixo do mesmo texto, inclusive o facho claro do lado
esquerdo — que é exatamente o pior pixel medido. O critério vira o mínimo absoluto.

`IMG_2060` é contraluz vermelho em baixa luz — o oposto tonal da `IMG_2164` que estava
aqui. Varredura (mínimo do quadro):

| brightness | sangue | prata | branco |
|---|---|---|---|
| 0,35 | 1,41:1 ❌ | 6,31:1 ✅ | 7,84:1 ✅ |
| **0,40** | **1,13:1** ❌ | **5,04:1** ✅ | **6,27:1** ✅ |
| 0,42 | 1,03:1 ❌ | 4,62:1 ✅ | 5,75:1 ✅ |
| 0,45 | — | 4,06:1 ❌ | 5,05:1 ✅ |

**0,40 fica**: é o valor do sistema e o único que ainda dá folga (5,04:1 contra o piso de
4,5:1 de corpo, que é o que o registro em mono 15px exige). A 0,45 a prata reprova no
registro. E o sangue reprova em qualquer esmagamento — pela razão OPOSTA à da foto antiga:
lá o problema era pele clara demais, aqui é uma cena que já é vermelha. Nos dois casos
sobra a mesma regra: **sobre foto, o acento nunca é texto.**

```css
.retrato { filter: brightness(0.40) contrast(1.15) saturate(1.2); } /* = .jm-crush */
```

---

## 7. A descida da foto

Os estilhaços saíram. A foto aparece **inteira** e é percorrida de cima a baixo: o retrato
é vertical (3456×5184) e a dobra é horizontal, então só cabe um recorte por vez —
atravessá-lo é o que mostra a artista inteira sem nunca encolhê-la para caber.

```
palco  sticky top:0, 100svh, a moldura recorta
foto   width: max(100%, 100svh) · height: auto · max-width: none
       y: 0 → (altura do palco − altura da foto)
```

| Parâmetro | Valor |
|---|---|
| Percurso | **toda a folga real** da foto para fora da dobra — nunca pixel fixo |
| Folga em 1440×900 | 1260px (foto 2160px de altura) |
| Folga em 390×844 | 422px (foto 1266px, mais larga que a janela; a moldura corta as laterais) |
| Easing | `none` — é o dedo que conduz |

O `max(100%, 100svh)` é o que garante percurso em tela estreita: só com os 100% a foto
mediria 585px numa dobra de 844 e não haveria o que percorrer. O preço é ela sangrar para
os lados, que o `overflow: clip` da moldura corta.

> `max-width: none` é obrigatório: o preflight do Tailwind aplica `max-width: 100%` a toda
> `<img>` e ele vence a largura acima. Sem isso a folga fica NEGATIVA no celular e a foto
> desliza para baixo abrindo uma faixa vazia no topo — o desktop não mostra o bug, porque
> lá os 100% já são o maior dos dois valores.

---

## 8. Movimento — uma timeline só, sob scrub

Nada dispara e acaba: a cena é `scrub: 0.8` amarrada a `top top → bottom bottom`, ou seja
exatamente ao trecho em que o palco fica grudado. Mudar os 350svh no CSS reprograma a
seção inteira sem tocar em número nenhum no script.

A timeline mede **5 unidades** (uma por fala). Posições em unidades:

| Elemento | Movimento | Entra | Sai |
|---|---|---|---|
| Foto | `y: 0 → −folga`, `ease: none` | 0 (dura as 5) | — |
| Fala *i* | `opacity 0→1`, `y 24→0` | `i − 0,12` (dura 0,26) | `i + 0,74` (dura 0,26) |
| Fala 5 | idem | `4 − 0,12` | **não sai** — segura a tela enquanto o palco se solta |
| Parágrafo de apoio | — | fixo o curso inteiro | — |

As janelas de entrada e saída se encavalam por **0,14** — é esse encavalamento que faz uma
fala APAGAR a outra em vez de existir um vão preto entre as duas. Os 24px de deslocamento
são o que impede a troca de ler como piscada.

`fromTo` em tudo, nunca `from`: sob scrub, "terminar" acontece toda vez que a rolagem cruza
o fim, e subindo de volta um `from()` sem estado inicial explícito não tem o que interpolar.

### Movimento reduzido

**A cena não é criada.** A classe `.manifesto--cena` nunca é adicionada, a seção perde a
altura de curso e o sticky, e as cinco falas ficam uma depois da outra em fluxo normal
sobre a foto parada — o estado que o servidor entrega. Não é o §12 do doc de movimento
(some o deslocamento, fica a opacidade): aqui o deslocamento É o conteúdo, e uma versão
"reduzida" seria cinco parágrafos piscando no mesmo lugar. Vale igual para JS falho.

---

## 9. Acessibilidade

- Cada fala é **um** `<p>` inteiro. As palavras de ligação são `<span>` dentro dele — não
  quebre em elementos separados, senão o leitor de tela lê frase picada.
- As cinco falas existem TODAS no HTML, na ordem, como parágrafos de verdade: é este bloco
  que o crawler lê e que um LLM cita. O GSAP só decide qual está visível — a opacidade não
  tira nada da árvore de acessibilidade.
- A moldura é `aria-hidden="true"` e a foto tem `alt=""`.
- 5,04:1 (pior pixel) é o piso medido contra a foto. Se a direção de arte trocar a foto, **remeça** —
  o número não é transferível.
- `text-wrap: balance` no manifesto para as linhas não terminarem órfãs.

---

## 10. Critérios de aceite

- [x] Manifesto renderizando em Lastik (mesma face do hero, caixa e alinhamento diferentes)
- [x] Nenhuma palavra de ligação abaixo de 19px renderizados
- [x] Prata medindo ≥ 4,5:1 contra o **pior pixel** da foto renderizada e esmagada (medido: 5,04:1 · p99 5,10 · p95 5,45)
- [x] Nenhum vermelho como texto nesta seção — sobre esta foto o acento não passa (1,13:1 no pior pixel)
- [x] A foto percorre toda a folga dela: 1260px em 1440×900, 422px em 390×844 (medido, 17 valores distintos ao longo do curso)
- [x] Subindo, a cena desfaz — scrub nos dois sentidos (medido)
- [x] Cada fala é um `<p>` inteiro no HTML, e as cinco existem sempre
- [x] Sem JS e com `prefers-reduced-motion`: sem cena, sem altura de curso, as cinco falas em fluxo normal e legíveis (medido)
