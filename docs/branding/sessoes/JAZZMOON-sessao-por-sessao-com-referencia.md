# JAZZ MOON — SESSÃO POR SESSÃO
### Cada frame da referência, e o que muda

**Frames extraídos de:** captura de voyeurverite.com · 54,15s · 1920×1080 · 60fps
**Recorte:** `crop=1920:904:0:176` — cromo do navegador removido, viewport puro
**Pasta:** `referencia/`

---

> ## ⚠️ ESTE DOCUMENTO É A LEITURA DA REFERÊNCIA, NÃO A ESPECIFICAÇÃO
>
> A especificação de implementação vive em **`docs/prd/`** — um PRD por sessão, com
> conteúdo real, assets nomeados, tokens, movimento e critérios de aceite.
> Este arquivo permanece como o **registro do estudo**: o que a referência faz e por quê.
>
> Onde os dois divergirem, **o PRD vence**. As divergências estão marcadas abaixo
> com 〔CORRIGIDO〕 e vieram de medição direta do acervo (método em `docs/prd/91-assets.md §6`).
>
> ### Correções aplicadas
>
> | § | O que este doc dizia | Medido | PRD |
> |---|---|---|---|
> | S1 | teto 0,45 → magenta "3,46:1" | **4,24:1** — o doc era conservador, a foto aguenta mais | `S1-hero.md` |
> | S4 | fundo `IMG_2095` **com** números em magenta | incompatível: magenta dá **2,78:1** sobre ela. Foto trocada para `Exo -039` (**5,60:1**) | `S4-tres-luas.md` |
> | S4 | stagger dos títulos `0,12` | reduzido a **0,08** — 120ms × 3 = 360ms só de espera | `90-movimento.md §8` |
> | S5 | cataloga peças de OURIVES; "bloqueio duro, regravar" | **bloqueio não existe** (mediana 7,88:1 em 36 fotos). Limitação real é resolução: 387 arquivos < 1024px. Sessão passa a catalogar **TARÔ** | `S5-arquivo-taro.md` |
> | S2 | acento do papel não especificado | magenta sobre papel é **3,29:1** → só ≥24px. No papel o acento é sangue | `00-indice.md §3.2` |
> | geral | tokens `--jm-*` soltos | formalizados e aplicados em `app/assets/css/tailwind.css` | `00-indice.md §3` |
> | **geral** | **acento `--jm-magenta #FF00BD`** | **o acento cromático deixou de existir. A paleta vigente é preto/branco/vermelho — nem magenta nem o ouro que a sucedeu sobreviveram** | `00-indice.md §D5` |
>
> ### ⚠️ Todo `--jm-magenta` (e todo `--jm-ouro`) abaixo está superado
>
> Este documento cita `--jm-magenta` em S1, S4, S6, S8 e no `::selection`. **Nenhuma dessas
> linhas vale.** Ficam como estão porque este arquivo é o registro do estudo, não a
> especificação: apagá-las falsificaria o que a leitura da referência de fato propôs.
> O acento passou por magenta e depois por ouro `#C8861E`; hoje não existe mais acento
> cromático — a paleta caiu para três cores (preto, branco, vermelho). Não converta números
> de magenta para ouro: o ouro também foi removido do sistema.
>
> **Único bloqueio duro real do projeto:** as 68 fotos de `TAROT/Outras Pessoas/` têm
> pessoas identificáveis e dependem de autorização de uso de imagem. É jurídico, não técnico.

---

## MAPA DE TRADUÇÃO

| Frame | Seção da referência | → | Seção Jazz Moon | Superfície |
|---|---|---|---|---|
| `01-hero` | Hero — rosto vermelho + headline | → | **S1 · HERO** | NOITE |
| `02-glossario` | *Meaning:* Voyeur / Vérité | → | **S2 · GLOSSÁRIO** — JAZZ / MOON | PAPEL |
| `03-statement` | Statement do estúdio | → | **S3 · MANIFESTO** | NOITE |
| `04-pilares` | 4 pilares em colunas | → | **S4 · TRÊS LUAS** (3 colunas) | NOITE |
| `05-arquivo-titulo` | Título lírico do arquivo | → | **S5 · ABERTURA DO ARQUIVO** | PAPEL |
| `06/07-arquivo-item` | Cineasta + estilhaços | → | **S5 · ITENS** — as leituras de tarô 〔CORRIGIDO〕 | PAPEL |
| `08-fechamento` | Frase de fechamento | → | **S6 · TRAVESSIA** (eclipse) | → SANGUE |
| `09-colecao` | VV Collection 001 | → | **S7 · OURIVES** | SANGUE→PAPEL |
| `10-contato-rodape` | Formulário + wordmark | → | **S8 · CONTATO + RODAPÉ** | PAPEL / SANGUE |

> **Nota estrutural:** a referência tem 4 pilares. Jazz Moon tem **3 vertentes**. Não invente uma quarta para preencher o layout — o grid de 4 vira grid de 3, e a assimetria resultante é melhor do que a simetria forçada.

---
---

# S1 · HERO
### 📎 `referencia/01-hero.png`

## O que a referência faz 〔M〕

```
┌──────────────────────────────────────────────────────────┐
│ ABOUT      PILLARS    ┌VOYEUR┐    LINEAGE      SHOP      │  nav, margem 2,1%
│                       └VÉRITÉ┘                           │  wordmark a 50,0% exato
│                                                          │
│              [ ROSTO EM CLOSE EXTREMO ]                  │
│              [ luz vermelha, sombras a #2B0001 ]         │
│                                                          │
│ CREATIVE                                        STUDIO   │  eyebrow nos extremos
│ T H E     A R T     O F                                  │  cap 139px, ocupa 95,5%
│ O B S E R V A T I O N                                    │  cap 140px, ocupa 95,8%
└──────────────────────────────────────────────────────────┘
```

| Medida | Valor |
|---|---|
| `line-height` do headline | **0,77** — vão de 8px numa caixa de 139px |
| Justificação | ambas as linhas na **mesma medida** (95,5% / 95,8%) |
| Cor do tipo | `#ED292C` — a coisa mais clara da tela |
| Sombra da imagem | `#2B0001` — esmagada |
| Face | **grotesca ultra-pesada**, contraste ~1:1 |

## ✅ O que fica
Nav simétrica com wordmark no centro exato · margem de 2,1% · `line-height` 0,77 · justificação forçada nas duas linhas · eyebrows nos extremos · **o tipo mais claro que a foto**.

## 🔄 O que muda

| | Referência | **Jazz Moon** |
|---|---|---|
| Foto | rosto anônimo em close | **IMG_2099** — ela, headphones, olhando para a câmera |
| Campo de fundo | preto esmagado | **`#01004C`** — o azul medido na foto dela |
| Cor do tipo | `#ED292C` | **`--jm-magenta #FF00BD`** |
| Texto | THE ART OF / OBSERVATION | **A ARTE DA / TRANSMUTAÇÃO** |
| Eyebrows | CREATIVE / STUDIO | **MULTI-ARTISTA / JUIZ DE FORA** |
| Nav | ABOUT PILLARS LINEAGE SHOP | **TARÔ SOM ┌JAZZ┐ JOIAS CONTATO** |

## ⚠️ Regra técnica obrigatória

Testei magenta sobre a foto crua dela: **1,97:1** — reprova. A referência resolve esmagando. Medi quanto:

```css
.hero-media { filter: brightness(0.42) contrast(1.15) saturate(1.2); }
```

> **Teto de exposição 0,45** → magenta chega a 3,46:1 (mínimo de texto grande). Mire **0,40** para folga.

〔CORRIGIDO〕 Medição direta na foto renderizada dá números melhores que a estimativa acima:
a 0,45 o magenta chega a **4,24:1** contra o percentil 95 (3,29:1 contra o p99), e a 0,40 a
**4,52:1** (p99 3,66:1). A recomendação de mirar **0,40** continua válida. Tabela completa
em `docs/prd/91-assets.md §2`.

---
---

# S2 · GLOSSÁRIO
### 📎 `referencia/02-glossario.png`

## O que a referência faz 〔M〕

```
┌──────────────────────────────────────────────┐
│ MEANING:                  vv                 │  ← rótulo em REGISTRO
│                                              │
│   Voyeur          │          Vérité          │  ← LÍRICO (didone), --accent
│   ─────────       │       ─────────          │
│   definição em    │    definição em          │  ← corpo, caixa alta
│   3 linhas        │    3 linhas              │
│                                              │
│   creative                     studio        │  ← rótulos abaixo
└──────────────────────────────────────────────┘
      superfície BONE #F5F0ED
```

Duas colunas simétricas separadas por um divisor diagonal. Os dois termos da marca, definidos um a um.

## 🎯 Este é o presente que a referência dá ao Jazz Moon

O nome tem **duas metades**, exatamente como o da referência. Nenhuma adaptação é necessária — a estrutura já serve.

```
┌──────────────────────────────────────────────┐
│ SIGNIFICADO:                        jm       │
│                                              │
│    Jazz            │            Moon         │
│   ─────────        │         ─────────       │
│   O CAOS QUE       │   O SILÊNCIO QUE        │
│   ESCUTA. A        │   ATRAVESSA. A          │
│   IMPROVISAÇÃO     │   FASE QUE VOLTA        │
│   COMO MÉTODO.     │   SEMPRE DIFERENTE.     │
│                                              │
│   ritmo                              ritual  │
└──────────────────────────────────────────────┘
      superfície PAPEL #FFF5FC
```

## 🔄 O que muda

| | Referência | **Jazz Moon** |
|---|---|---|
| Superfície | bone `#F5F0ED` | **papel `#FFF5FC`** |
| Termos | Voyeur / Vérité | **Jazz / Moon** |
| Acento | escarlate | **`--jm-red #D30000`** — 5,23:1 sobre papel ✅ |
| Divisor | barra diagonal vermelha | **os dois discos do eclipse** em `--eclipse: 1.0` (oposição), um por coluna |
| Rótulos de rodapé | creative / studio | **ritmo / ritual** |

> O divisor diagonal da referência vira o **eclipse aberto**: os dois discos separados, um ancorando cada coluna. Quando as colunas se revelam, os discos se aproximam para `0.4142` — o nome se juntando.

---
---

# S3 · MANIFESTO
### 📎 `referencia/03-statement.png`

## O que a referência faz 〔M〕

Frase única em grotesca ultra-pesada, caixa alta, centralizada sobre imagem vermelha esmagada. **As palavras de ligação ("IS", "AN") estão em ~15% do corpo, inline** com as palavras grandes.

```
        VOYEUR VÉRITÉ ᴵˢ
     ᴬᴺ INDEPENDENT,
      ARTIST-FOUNDED
          CREATIVE
           STUDIO

    parágrafo de apoio em 4 linhas,
    caixa alta, corpo pequeno, centralizado
```

## ✅ O que fica
O dispositivo do **tipo de tamanhos mistos inline** — palavras de ligação minúsculas entre palavras gigantes. É o que impede a frase de virar um bloco monótono.

## 🔄 O que muda

| | Referência | **Jazz Moon** |
|---|---|---|
| Face | grotesca ultra-pesada | **VINTAGE** — Fraunces `SOFT 60 / WONK 1` |
| Caixa | ALL CAPS | **Sentence case** — o manifesto é fala, não grito |
| Alinhamento | centralizado | **assimétrico**, col 2–8 |
| Imagem | rosto em vermelho | **IMG_2164** (olhos fechados) em estilhaços |
| Superfície | vermelha fotográfica | **NOITE `#0A0004`** |
| Tinta | branco | **`--jm-silver #EDE4EA`** — 16,64:1 ✅ |

> **Por que trocar de face aqui.** A referência usa a mesma grotesca da hero, e a repetição funciona para um estúdio. Jazz Moon é uma pessoa — o manifesto é a voz dela e precisa de outra temperatura. Fraunces com `SOFT` e `WONK` entrega o "revista antiga" que o PRD original pedia, sem introduzir família nova.

---
---

# S4 · TRÊS LUAS
### 📎 `referencia/04-pilares.png`

## O que a referência faz 〔M〕

**Correção importante:** não é seção pinada nem troca de estado. **As quatro colunas ficam visíveis ao mesmo tempo**, sobre vídeo full-bleed.

```
┌──────────────────────────────────────────────┐
│  TRUTH ₀₁                    GRIT ₀₃         │  ← títulos em pares, sangram
│  HUMILITY ₀₂              EVOLVE ₀₄          │     para fora do grid
│  ┌────────┬────────┬────────┬────────┐       │
│  │ texto  │ texto  │ texto  │ texto  │       │  ← 4 col, corpo caixa alta
│  │ 01     │ 02     │ 03     │ 04     │       │  ← bookend counter
│  └────────┴────────┴────────┴────────┘       │
│         [ vídeo full-bleed atrás ]           │
└──────────────────────────────────────────────┘
```

O número aparece **duas vezes**: pequeno ao lado do título grande, e de novo no fim do parágrafo. Isso é o *bookend counter*.

## 🔄 O que muda — **4 vira 3**

```
┌──────────────────────────────────────────────┐
│  TARÔ ₀₁                      OURIVES ₀₃     │
│         SOM ₀₂                               │
│  ┌────────────┬────────────┬────────────┐    │
│  │ 3–4 linhas │ 3–4 linhas │ 3–4 linhas │    │
│  │ 01         │ 02         │ 03         │    │
│  └────────────┴────────────┴────────────┘    │
│      [ IMG_2095 esmagada a 0,40 atrás ]      │
└──────────────────────────────────────────────┘
```

| | Referência | **Jazz Moon** |
|---|---|---|
| Blocos | 4 valores abstratos | **3 vertentes concretas** |
| Grid de títulos | 2×2 simétrico | **assimétrico** — 2 à esquerda, 1 à direita |
| Numeração | 01–04 | **01–03**, mantendo o bookend |
| Mídia de fundo | vídeo | **IMG_2095** esmagada, ou vídeo curto de set |
| Título | grotesca | **LÍRICO** (didone) — são nomes, e nome é trabalho da didone |
| Acento do número | escarlate | **`--jm-magenta`** — 5,90:1 sobre noite ✅ |

> **A assimetria é a decisão.** Três blocos num layout desenhado para quatro deixam um vazio. Esse vazio é o espaço onde a imagem respira — não preencha.

## 🎬 Coreografia
Os 3 títulos entram com `mask-line-up`, **stagger 0,12** (o maior do sistema — eles são o evento). Parágrafos depois, stagger 0,06. Números da base por último: `scale .86 → 1`, `opacity 0 → .38`, delay 0,4s.

〔CORRIGIDO〕 **Duas mudanças nesta sessão.**

**1 · A foto muda para `Exo -039.jpg`.** `IMG_2095` e números em magenta não convivem — medido a `brightness(0.40)`:

| foto | magenta | prata |
|---|---|---|
| `IMG_2095.jpg` (46% dos pixels em ouro/laranja a L 35–38) | **2,78:1** ❌ | 7,85:1 ✅ |
| **`Exo -039.jpg`** (98% escura) | **5,60:1** ✅ (p99 4,56) | 15,78:1 ✅ |

Esmagar `IMG_2095` escurece o ouro junto com o resto e o magenta nunca abre distância.
Trocamos a foto, não o acento — este é o único magenta da dobra do meio.

**2 · Stagger de 0,12 → 0,08.** 120ms × 3 blocos são 360ms de espera antes de o terceiro
título começar, mais 500ms até terminar: quase um segundo para ler três palavras. A
dramaticidade aqui já vem do tamanho do tipo. Teto do sistema é 80ms (`docs/prd/90-movimento.md §8`).

---
---

# S5 · ARQUIVO
### 📎 `referencia/05-arquivo-titulo.png` · `06-arquivo-item-a.png` · `07-arquivo-item-b.png`

## O que a referência faz 〔M〕

### Abertura (`05`)
Título lírico em **didone de contraste 5,7:1**, duas linhas, centralizado, em vermelho sobre bone. Abaixo, duas legendas em REGISTRO nos extremos opostos.

```
        Cinéma Vérité Was
      Shaped by Filmmakers
  WHO BELIEVED THE CAMERA    SHOULD BE A WITNESS RATHER THAN AN AUTHORITY
```

### Itens (`06`, `07`)
Layout **idêntico** para os 13 itens, só o conteúdo muda:

```
┌──────────────────────────────────────────────┐
│                                              │
│            ╱▚  [ ESTILHAÇOS ]                │  ← 3–4 recortes triangulares
│           ▟  ▜   da mesma foto               │     ao redor de um vazio
│                                              │
│  DZIGA          LAID THE PHILOSOPHICAL...    │  ← nome à esq. (grotesca)
│  VERTOV         ...MODERN LIFE.              │     bio à dir. (caixa alta)
│                                              │
│         · · · ▬▬▬ · · · · · · ·              │  ← 12 segmentos, ativo = pílula
└──────────────────────────────────────────────┘
      superfície BONE
```

| Medida | Valor |
|---|---|
| Indicador | **12 segmentos** · inativo 6px · **ativo ~55px** |
| Máscara | 3–4 estilhaços poligonais, **cresce 1,5s, repousa 0,5s** |
| Seção | **pinada** — viewport travado 23,8s enquanto avança 11 itens |
| Ritmo de avanço | irregular, CV **0,738** → dirigido pelo usuário, não autoplay |

## 🔄 O que muda

### 🚫 Divergência declarada nº1 — sem pin
O PRD de produto proíbe scrolljacking (§4 e §7). **A seção não é pinada.** Vira carrossel navegável por swipe, teclado e arrasto, com scroll livre.

### 🚫 Divergência declarada nº2 — sem pontinhos
`::selection` do indicador de 12 segmentos é substituído por **contador em REGISTRO**: `03 / 12`. Um segundo indicador competiria com o eclipse, que é a assinatura.

### O conteúdo

| | Referência | **Jazz Moon** |
|---|---|---|
| O que cataloga | 13 cineastas | **as peças de OURIVES** |
| Nome | DZIGA VERTOV | **nome da peça** — LÍRICO |
| Texto | bio do cineasta | **ficha:** liga · peso · pedra · tiragem — REGISTRO |
| Imagem | retrato de arquivo | **foto da peça** sobre `--jm-onyx` |
| Título de abertura | Cinéma Vérité Was... | **LÍRICO em `--jm-red`** sobre papel — 5,23:1 ✅ |

## ⚠️ Bloqueio de produção

As fotos de joia atuais **não servem**. Medi: ouro a matiz 33° sobre fundo de estúdio a matiz 34° dá **1,22:1** — a peça desaparece. Sobre `--jm-onyx` dá **10,33:1**.

> **Regravar com fundo escuro antes de construir esta seção.** Ganho de 8× em contraste. É o único bloqueio duro do projeto.

〔CORRIGIDO〕 **O bloqueio não se confirma, e esta sessão passa a catalogar TARÔ.**

Amostra de 36 das 387 fotos de OURIVES (1 a cada 11), contraste peça×fundo pelo percentil
90 contra o percentil 10 da mesma imagem:

| | valor |
|---|---|
| mediana | **7,88:1** |
| pior caso | 1,93:1 |
| abaixo de 1,5:1 ("a peça desaparece") | **0 de 36** |
| ≥ 3:1 utilizável | 32 de 36 |
| ≥ 4,5:1 | 27 de 36 |

O `1,22:1` deve ter saído de uma foto atípica. Não descreve a série.

**A limitação real de OURIVES é resolução:** os 387 arquivos estão todos abaixo de 1024px.
Servem para card e grid; não servem para o item grande que esta sessão exige. As fotos de
tarô têm 2369–4898px — por isso S5 passa a catalogar **as leituras de tarô**, com 12 itens
medidos e listados em `docs/prd/91-assets.md §2`.

OURIVES não some: ganha S7, que é vermelho chapado e não usa foto nenhuma — e aí a
resolução deixa de importar. Ver `docs/prd/S5-arquivo-taro.md` e `S7-colecao-ourives.md`.

---
---

# S6 · TRAVESSIA
### 📎 `referencia/08-fechamento.png`

## O que a referência faz 〔M〕
Frase de fechamento do arquivo, em grotesca, saindo do bone e entrando no vermelho fotográfico. É onde a página vira de claro para escuro.

## 🔄 O que muda — **aqui o eclipse ganha função**

Esta é a **única** travessia claro↔escuro do site Jazz Moon. E ela **não pode ser uma rampa**.

> **Prova 〔M〕:** interpolando papel → escuro com o texto acompanhando, o contraste cai a **1,10:1** no meio. O teto teórico de qualquer travessia sob texto é **4,58:1** — e o grain do §3 derruba isso abaixo de 4,5.

```
FECHA (500ms)   discos --jm-magenta entram de fora da tela
                --eclipse: 1.0 → 0.0, escalando até cobrir o viewport
                conteúdo antigo: opacity 1→0, y −40
TROCA           papel → sangue, sob o disco, com ZERO texto visível
ABRE (600ms)    --eclipse: 0.0 → 1.0, discos saem por lados opostos
```

Discos magenta sobre vermelho → **a vibração nº 2 de 3**.

`prefers-reduced-motion`: corte simples de 200ms, sem discos. **Continua sendo corte, nunca rampa.**

---
---

# S7 · OURIVES / COLEÇÃO
### 📎 `referencia/09-colecao.png`

## O que a referência faz 〔M〕
Bloco curto sobre imagem vermelha: `VV Collection 001` em **didone**, `LIMITED` / `DROP` em palavras separadas e grandes, e um CTA `SHOP`.

## 🔄 O que muda

| | Referência | **Jazz Moon** |
|---|---|---|
| Superfície | imagem vermelha fotográfica | **`--jm-red #D30000` chapado**, sem foto |
| Título | VV Collection 001 | **OURIVES · SÉRIE 001** — LÍRICO |
| Palavras soltas | LIMITED / DROP | **PEÇA / ÚNICA** |
| Tinta | branco | **`#FFFFFF` puro — a única tinta permitida sobre sangue** |
| CTA | SHOP | **VER A COLEÇÃO** — invertido: preench. `#FFFFFF`, rótulo `#D30000` (5,57:1) |

## ⚠️ Duas regras duras nesta seção

1. **Máximo 1 viewport.** É respiro, não seção.
2. **Sobre sangue não existe texto secundário.** Nem prata (4,48 — reprova por 0,02), nem opacidade (3,68). Hierarquia por tamanho e peso.

> A referência usa fotografia vermelha aqui. Jazz Moon usa **vermelho chapado**. É a inversão que impede o clone: onde ela tem imagem, nós temos cor.

---
---

# S8 · CONTATO + RODAPÉ
### 📎 `referencia/10-contato-rodape.png`

## O que a referência faz 〔M〕

```
┌──────────────────────────────────────────────┐
│  INSTAGRAM                        ABOUT      │
│                                   PILLARS    │
│         VV Collection 001         LINEAGE    │
│         LIMITED  ⟨SHOP⟩  DROP                │
│                                              │
│  EMAIL*                                      │
│  info@company.com ────────────────           │  ← só underline
│  MESSAGE                                     │
│  Hello! ──────────────────────────           │
│                          ⟨ SUBMIT ⟩          │
│                                              │
│  ████ VOYEUR VÉRITÉ ████  ← edge-to-edge     │
└──────────────────────────────────────────────┘
```

Campos **sem caixa, sem raio, sem fundo** — apenas o underline. Wordmark gigante fechando a página.

## ✅ O que fica
Campo = só underline · wordmark edge-to-edge como fecho arquitetônico · links de navegação repetidos no rodapé.

## 🔄 O que muda

| | Referência | **Jazz Moon** |
|---|---|---|
| Superfície do form | vermelho fotográfico | **PAPEL `#FFF5FC`** — 19,43:1 para os campos |
| Campos | EMAIL / MESSAGE | **Nome · E-mail\* · O que você procura?** |
| CTA | SUBMIT (um só) | **três CTAs de WhatsApp** com mensagem por contexto |
| Rodapé | wordmark escarlate | **wordmark `--jm-magenta` sobre `--jm-red`** → vibração nº 3 de 3 |
| Foco de campo | — | underline `scaleX 0 → 1`, origem esquerda, 400ms |

## 🎯 Detalhes que a referência não mostra e que precisam existir

```css
::selection { background: var(--jm-magenta); color: var(--jm-onyx); }
input, textarea { caret-color: var(--accent); }
::placeholder { color: var(--rule-paper); opacity: 1; }
* { -webkit-tap-highlight-color: transparent; }
input:-webkit-autofill {                          /* o Chrome pinta de amarelo */
  -webkit-text-fill-color: var(--on-surface);
  -webkit-box-shadow: 0 0 0 100px var(--surface) inset;
}
```

---
---

# RESUMO — O QUE FICA E O QUE MUDA

## Fica (é estrutura, não estilo)

- Nav simétrica, wordmark no **centro matemático**, margem 2,1%
- Headline `line-height` **0,77** com justificação forçada nas duas linhas
- **O tipo é sempre mais claro que a foto** — imagem esmagada a 0,40–0,45
- Glossário de duas colunas definindo as duas metades do nome
- Tipo de tamanhos mistos inline no manifesto
- Bookend counter — número no topo e na base do bloco
- Estilhaços poligonais de aresta reta, entrada 1,5s + repouso 0,5s
- Campo de formulário = só underline
- Wordmark edge-to-edge fechando a página
- Alternância de superfície em **blocos longos**, nunca listrada

## Muda

| Eixo | Referência | Jazz Moon |
|---|---|---|
| Superfícies | bone + vermelho fotográfico + carvão | **noite `#0A0004` · papel `#FFF5FC` · sangue `#D30000`** |
| Acento | `#EE3335` | **`#FF00BD`** em vibração deliberada |
| Blocos conceituais | 4 pilares | **3 vertentes** — a assimetria é a decisão |
| Seção pinada | sim, 23,8s | **não** — o PRD proíbe scrolljacking |
| Indicador | 12 pontinhos | **eclipse + contador `03 / 12`** |
| Travessia claro↔escuro | rampa | **corte mascarado pelo eclipse** |
| Fotografia | atores anônimos | **ela** — e a luz de chave dela já mede `#D00204` contra `#D30000` da marca |
| Idioma | inglês | **PT-BR**, inglês só na camada REGISTRO |

---

*Frames medidos com extração quadro a quadro, OCR e amostragem de pixel. Nenhum texto, imagem ou arquivo da referência é reproduzido nos entregáveis do Jazz Moon — os frames servem exclusivamente como material de estudo interno.*
