# 91 · ASSETS — mapa medido

Cada foto deste documento foi medida, não escolhida no olho. Método no §6.

**Acervo:** `public/images/` · 763 arquivos · 5 grupos
**Medição:** 2026-08-02

---

## 1. O acervo, corrigido

`identity-analysis/00-inventory.md` está desatualizado em dois pontos que mudam o projeto:

| Afirmação do inventário | Realidade medida |
|---|---|
| "Jazz Moon (DJ) — só logos; as fotos DJ não existem mais → direção fotográfica órfã de evidência" | **99 fotos DJ entraram depois**, até 3456×5184. A direção não está órfã. |
| OURIVES: peça sobre fundo claro dá "1,22:1, a peça desaparece" — bloqueio duro | **Não se confirma.** Amostra de 36 (1 a cada 11): mediana **7,88:1**, pior caso 1,93:1, **zero** abaixo de 1,5:1. |

| grupo | n | lado curto | serve para |
|---|---|---|---|
| `DJ/` | 99 | até 3456×5184 | hero, full-bleed, fundo esmagado |
| `TAROT/Elementos/` | 52 | 2369–4898px | item de arquivo, full-bleed |
| `TAROT/Jessica/` | 131 | 1365–3266px | item de arquivo, retrato |
| `TAROT/Outras Pessoas/` | 68 | 1365px | ⚠️ **bloqueado** — ver §5 |
| `OURIVES/` | 387 | 512–1023px | **grid e card apenas** — nunca full-bleed |
| `ELEMENTOS/` | 24 | 369–500px | motivo line-art → converter para SVG inline |
| `MARCA/` | 8 | 260–4500px | logos |

> **A limitação de OURIVES é resolução, não contraste.** Todos os 387 arquivos estão
> abaixo de 1024px. Servem para card e grid; qualquer full-bleed vai borrar. Por isso
> S7 é vermelho chapado sem foto — e aí a resolução deixa de importar.

### Famílias cromáticas do acervo

Classificação por matiz dominante ponderada por saturação, 282 fotos:

| família | DJ | TARÔ | total |
|---|---|---|---|
| SANGUE (H 340–15°) | 53 | 58 | **111** |
| OURO (H 15–45°) | 23 | 88 | **111** |
| MAGENTA (H 280–340°) | 13 | 28 | **41** |
| AZUL (H 200–280°) | **7** | **0** | **7** |
| outros | 3 | 9 | 12 |

**Isto é o que decidiu o sistema de três superfícies.** O eixo azul-cobalto do doc de
identidade antigo tinha 7 fotos de sustentação em 282. NOITE · PAPEL · SANGUE descrevem
o acervo que existe; nenhuma quarta cor tem lastro fotográfico comparável.

> Esta tabela também é o que tirou o magenta do acento, por um tempo (00-indice.md
> §D5): com 41 fotos ele era o terceiro lastro, não o primeiro, e OURO empatava com
> SANGUE em 111 — sangue já era superfície, então ouro era a família mais forte do
> acervo sem função no sistema. **Isso deixou de ser argumento de paleta com D6**: a
> contagem continua sendo medição verdadeira do acervo, só não decide mais tinta
> nenhuma — não há mais acento para uma família fotográfica sustentar. As 41 fotos
> magenta e as 111 ouro continuam no site: mudou a tinta que a interface usa, não o
> assunto fotografado.

---

## 2. Mapa foto → sessão

### S1 · HERO — `DJ/IMG_2099.jpg`

3261×4599 · família MAGENTA · 92% dos pixels abaixo de L 0,25

Composição medida (median-cut, 6 cores): 40,8% `#040003` · **21,7% `#020049`** ·
13,1% `#2A1310` · 10,9% `#910101`

> O campo azul `#01004C` foi extraído desta foto, não escolhido — mas com D6 a
> primitiva `--jm-azul` sai do sistema (era a quarta cor). O valor fica só como
> registro de onde veio a leitura de cor da imagem.

**Esmagamento e teto:**

```css
.hero-media { filter: brightness(0.40) contrast(1.15) saturate(1.2); }
```

| tinta @ 0,40 | p95 | p99 | veredito |
|---|---|---|---|
| sangue `#D30000` | 3,04:1 | 2,50:1 | ❌ nunca — nem display |
| branco `#FFFFFF` | 16,96:1 | 13,93:1 | ✅ |
| prata `#EDE4EA` | 13,63:1 | 11,20:1 | ✅ |

A headline é display (cap ~139px) → o piso seria 3:1, e vermelho nem esse piso segura
no p99. Com D6 não há tinta cromática para testar aqui: a headline vai em **branco**,
que passa com folga mesmo contra o percentil 99 — acima até do piso de corpo (4,5:1).
**Use 0,40.**

> Antes de D6 este teto era escolhido em função do acento (primeiro magenta, depois
> ouro — ver histórico em D5). Sem acento, a pergunta que a tabela de brightness
> respondia deixou de existir; 0,40 permanece porque já é o valor em produção
> (`.hero-media`) e branco/prata passam nele com folga ampla.

> **Alternativas** (mesma função, se a direção mudar), remedidas em branco/prata @ 0,40:
>
> | foto | vermelho p95/p99 | branco p95/p99 | prata p95/p99 |
> |---|---|---|---|
> | `Exo -027.jpg` | 3,60 / 3,06 ❌ | 20,06 / 17,02 ✅ | 16,13 / 13,68 ✅ |
> | `Exo -039.jpg` | 3,66 / 3,08 ❌ | 20,39 / 17,15 ✅ | 16,40 / 13,79 ✅ |
>
> A comparação que D5 fazia (qual delas dava mais contraste ao ouro) ficou sem objeto:
> em branco as três candidatas passam por margem enorme e a escolha volta a ser de
> direção de arte, não de contraste.

---

### S3 · MANIFESTO — `DJ/IMG_2060.jpg`

3456×5184 · contraluz vermelho em baixa luz · **retrato inteiro, da cabeça ao quadril** —
é o que a cena de descida da seção exige (docs/prd/S3-manifesto.md §7)

Quadro majoritariamente escuro: esmagada a 0,40 a mediana de contraste da prata é 16,75:1.
O que aperta é uma região só — o facho claro à esquerda, que é onde o mínimo abaixo é
medido.

**O critério aqui é o PIOR PIXEL, não o p95**: a foto desce por baixo do texto ao longo de
350svh, então toda região do quadro passa sob ele em algum ponto do curso.

| tinta @ 0,40 | pior pixel | p99 | p95 | veredito |
|---|---|---|---|---|
| sangue `#D30000` | 1,13:1 | 1,14:1 | 1,22:1 | ❌ nem em display |
| branco `#FFFFFF` | 6,27:1 | 6,35:1 | 6,78:1 | ✅ |
| prata `#EDE4EA` | 5,04:1 | 5,10:1 | 5,45:1 | ✅ |

O manifesto é em **prata `--jm-silver`**. 0,40 é o esmagamento certo e não há folga acima
dele: a 0,45 a prata cai para 4,06:1 e reprova o registro em mono 15px.

> Substituiu a `IMG_2164` (pele quente e clara, 7,73:1 p95 em prata), que reprovava o
> vermelho por luminância alta. Esta reprova o vermelho por já SER vermelha — 1,13:1. Duas
> fotos tonalmente opostas, mesma conclusão: **sobre foto, o acento nunca é texto.**

---

### S4 · TRÊS LUAS — `DJ/Exo -039.jpg`

O doc de sessões pedia `IMG_2095.jpg`. A comparação abaixo decidia isso pela
sobrevivência do acento cromático — pergunta que D6 aposentou (`00-indice.md` §D6):
**sem acento, o filtro parou de discriminar fotos.**

| tinta @ 0,40 | p95 | p99 | veredito |
|---|---|---|---|
| sangue `#D30000` | 3,52:1 | 2,17:1 | ❌ nunca — nem display |
| branco `#FFFFFF` | 19,62:1 | 12,06:1 | ✅ |
| prata `#EDE4EA` | 15,78:1 | 9,70:1 | ✅ |

Vermelho reprova aqui como em toda foto do site (`00-indice.md` §3.3); branco e prata
passam com folga larga, igual passavam em S1 e S3. **A decisão de foto de S4 perdeu o
motivo que a justificava**: ela existia porque poucas fotos DJ aguentavam o acento
esmagado. Remedida, a comparação prova que o filtro sumiu:

| foto @ 0,40 | vermelho p95/p99 | branco p95/p99 | prata p95/p99 |
|---|---|---|---|
| `IMG_2095.jpg` (46% ouro/laranja) | 2,08 / 2,07 ❌ | 11,57 / 11,55 ✅ | 9,31 / 9,29 ✅ |
| `Exo -039.jpg` | 3,66 / 3,08 ❌ | 20,39 / 17,15 ✅ | 16,40 / 13,79 ✅ |
| `Exo -027.jpg` | 3,60 / 3,06 ❌ | 20,06 / 17,02 ✅ | 16,13 / 13,68 ✅ |

`IMG_2095` era a foto REPROVADA da comparação antiga — em ouro dava 3,20:1 e derrubava a
sessão. Em prata ela entrega 9,31:1, o dobro do piso. A foto que o sistema anterior
proibia passa hoje com folga: era o acento que não cabia nela, não ela que era ruim.

**O que ainda prende a foto de S4 é a folga de paralaxe**, não o contraste — ver o
comentário no topo de `S4TresLuas.vue`: a seção em produção usa `Exo -028` (renomeada
`site/tres-luas.jpg`), com folga de paralaxe 1,25 contra 0,39 de `Exo -039` (detalhe no
meio do quadro, não na borda, o que a paralaxe exige). É a única linha de decisão que
sobrou para esta foto; a contagem de "quantos arquivos DJ passam ≥4,5:1 esmagados" que
o comentário do componente cita (24 contra 12, medida em ouro) só ficou mais folgada
com D6 — branco e prata batem esse piso em praticamente qualquer foto do acervo.

---

### S5 · ARQUIVO DO TARÔ — 12 itens

Superfície da sessão: **papel**. Foto de cada item dentro de card **onyx**.
A coluna que decide é *vs onyx* — é o quanto a foto se descola do card.

| # | arquivo | dim | família | vs onyx |
|---|---|---|---|---|
| 01 | `TAROT/Elementos/jazz tarot_27.jpg` | 2592×3888 | MAGENTA | **8,55:1** |
| 02 | `TAROT/Elementos/jazz tarot_43.jpg` | 2592×3888 | MAGENTA | 7,53:1 |
| 03 | `TAROT/Elementos/jazzz_11.jpg` | 2369×3553 | OURO | 6,73:1 |
| 04 | `TAROT/Elementos/jazzz_24.jpg` | 2592×3888 | MAGENTA | 6,46:1 |
| 05 | `TAROT/Elementos/jazz tarot_44.jpg` | 2592×3888 | MAGENTA | 6,41:1 |
| 06 | `TAROT/Elementos/vizujazzz_40.JPG` | 4898×3265 ▭ | SANGUE | 4,67:1 |
| 07 | `TAROT/Elementos/jazz_143.jpg` | 2592×3888 | OURO | 4,64:1 |
| 08 | `TAROT/Elementos/jazz_116.jpg` | 2464×3696 | OURO | 4,63:1 |
| 09 | `TAROT/Elementos/jazzz_19.jpg` | 2592×3888 | MAGENTA | 4,59:1 |
| 10 | `TAROT/Elementos/jazzz_1.jpg` | 3805×2537 ▭ | OURO | 4,27:1 |
| 11 | `TAROT/Elementos/jazzz_6.jpg` | 2592×3888 | OURO | 3,76:1 |
| 12 | `TAROT/Jessica/jazz tarot_2.jpg` | 2592×3888 | MAGENTA | 3,43:1 |

▭ = paisagem. Os itens 06 e 10 precisam de recorte próprio no layout retrato do card.

**Reprovadas para item de arquivo** — são quase pretas e somem dentro do card onyx:

| arquivo | vs onyx | vs papel |
|---|---|---|
| `vizujazzz_25.JPG` | 1,40:1 ❌ | 18,60:1 |
| `jazz_31.jpg` | 1,43:1 ❌ | 16,35:1 |
| `vizujazzz_49.JPG` | 1,53:1 ❌ | 17,91:1 |
| `vizudecima+jazz_5.jpg` | 1,65:1 ❌ | 18,16:1 |
| `jazz_64.jpg` | 2,01:1 ❌ | 17,62:1 |

> Não são fotos ruins — são fotos de **outro uso**. A mesma escuridão que as mata dentro
> do card faz delas as melhores para full-bleed sob texto claro (17–18:1 contra papel).
> Reserve-as para fundo de sessão, nunca para item.

---

### S7 · COLEÇÃO OURIVES — **sem foto**

Vermelho `--jm-sangue` chapado. É a inversão que impede o clone: onde a referência tem
fotografia vermelha, aqui tem cor pura.

Resolve de graça o problema de resolução de OURIVES (§1) — a sessão que fala de joia é
a única que não mostra joia.

---

### S2 · S6 · S8 — sem fotografia

Tipografia, cor chapada e os discos do eclipse. Ver os PRDs respectivos.

---

## 3. Marca

| arquivo | dim | uso |
|---|---|---|
| `MARCA/DJ/jazzmoon-red.png` | 4500px | wordmark sobre papel |
| `MARCA/DJ/jazzmoon-white.png` | **399×260** ⚠️ | wordmark sobre noite — **baixa demais**, revetorizar |
| `MARCA/DJ/jazzmoon-black.png` | — | uso em claro alternativo |
| `MARCA/DJ/jazzmoon-on-red.png` | — | carimbo do lockup sobre vermelho — **decorativo, `aria-hidden`** (o lockup da marca é magenta; a interface não) |
| `MARCA/ZAMBI/zambi-wordmark.png` | 945px | selo de S7 |
| `MARCA/ZAMBI/zambi-badge.png` | 945px | selo de S7 |
| `MARCA/TAROT/11 (1).png` · `12 (1).png` | 1107px | selo do tarô — **renomear ao promover** |

**Pendências:** (a) o wordmark branco a 399×260 não serve para o rodapé edge-to-edge de
S8 — precisa vir do vetor; (b) a ligadura OO = eclipse é SVG bespoke, nunca webfont;
(c) `app/app.config.ts:6` aponta para `/images/brand/jazzmoon-white.png` e **essa pasta
não existe** — o caminho real é `/images/MARCA/DJ/`.

---

## 4. Motivos — `ELEMENTOS/` (24)

Todos PNG com alpha, 369–500px. Abaixo de 1000px: servem como motivo, **nunca como
imagem de conteúdo**. Converter para SVG inline com `stroke="currentColor"` e
`vector-effect: non-scaling-stroke` — daí cor e espessura passam a ser token.

| conjunto | arquivos | onde |
|---|---|---|
| **eclipse / luas** | `moon-realistic`, `chart-lunar-phases`, `moon-star-4pt`, `moon-star-8pt` | assinatura, S2, S6 |
| **portais** | `portal-arch-merkaba`, `portal-arch-orbit`, `portal-double-arch`, `portal-gothic` | marcação de troca de superfície |
| **sparkles** | `sparkle-*` (10 arquivos), `shooting-star`, `star-orbit-cross` | acento, `::marker` de lista |
| **sol / raiz** | `sun-flames`, `sun-rays-dotted`, `sun-rays-geometric`, `sigil-crown-minimal` | S7, âmbito Zambi |
| **estrutura** | `sphere-wireframe` | marca d'água de fundo |

Escala de opacidade já tokenizada em `tailwind.css:137-140`:
`--motif-ambient .06` · `--motif-decor .14` · `--motif-frame .30` · `--motif-accent .70`

Máximo de 1–2 sparkles por viewport. Órbitas giram em 24–40s. Todo motivo decorativo
recebe `aria-hidden="true"`.

---

## 5. Bloqueios e pendências reais

| # | Item | Natureza |
|---|---|---|
| 1 | `TAROT/Outras Pessoas/` — 68 fotos com **pessoas identificáveis** | **Jurídico/LGPD.** Autorização de uso de imagem por pessoa antes de publicar. Nenhuma entra nos PRDs até isso ser resolvido. |
| 2 | Prefixos `vizudecima` / `vizujazzz` sugerem fotógrafo(a) parceiro(a) | **Crédito e licença a confirmar.** Atinge 8 dos 12 itens de S5. |
| 3 | `jazzmoon-white.png` a 399×260 | Revetorizar antes de S8. |
| 4 | OURIVES — 387 arquivos < 1024px | Não bloqueia o site. Bloqueia qualquer full-bleed de joia no futuro. |

> **O item 1 é o único bloqueio duro do projeto** — e é jurídico, não técnico.
> O bloqueio fotográfico que o doc de sessões declarava não existe.

---

## 6. Método

Reprodutível. Números deste documento saem daqui.

- **Luminância relativa:** WCAG 2.x — linearização sRGB, `0.2126R + 0.7152G + 0.0722B`.
- **Contraste:** `(L_claro + 0,05) / (L_escuro + 0,05)`.
- **Foto vs cor:** a foto é reduzida a 150px no lado maior; usa-se o **percentil 90 ou 95**
  da luminância, não a média. A média mente — o texto colide com as áreas claras, não com
  a foto inteira. Onde o percentil 99 aparece, é o pior caso real.
- **Esmagamento:** `brightness` multiplicativo, `contrast` em torno do meio pós-brilho,
  `saturate` em torno do luma — na ordem em que o CSS aplica `filter`.
- **Família cromática:** matiz circular médio ponderado por saturação, considerando só
  pixels com S > 0,18. Pixels dessaturados não votam.
- **Peça vs fundo (OURIVES):** percentil 90 contra percentil 10 da mesma imagem.
