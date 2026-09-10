# S8 · CONTATO + RODAPÉ

**Superfície:** papel (formulário) → sangue (rodapé) · **Frame:** `10-contato-rodape.png`

Campo é só underline. Wordmark fecha a página de ponta a ponta.

---

## 1. Objetivo

Converter. É a única sessão do site com essa função — e por isso é a mais discreta
visualmente: papel branco, campos sem caixa, nenhuma competição pela atenção.

---

## 2. Estrutura

```
┌──────────────────────────────────────────────────────┐
│  INSTAGRAM                              TARÔ         │  papel
│                                         SOM          │
│                                         JOIAS        │
│                                                      │
│  NOME                                                │
│  ─────────────────────────────                       │  só underline
│  E-MAIL*                                             │
│  ─────────────────────────────                       │
│  O QUE VOCÊ PROCURA?                                 │
│  ─────────────────────────────                       │
│                                                      │
│   ⟨ LEITURA ⟩   ⟨ BOOKING ⟩   ⟨ JOIA ⟩               │  3 CTAs de WhatsApp
│                                                      │
├──────────────────────────────────────────────────────┤
│  ████████  J A Z Z  M O O N  ████████                │  sangue, edge-to-edge
└──────────────────────────────────────────────────────┘
```

Campos **sem caixa, sem raio, sem fundo** — apenas o underline. Wordmark gigante fechando
a página como fecho arquitetônico.

---

## 3. Campos

| Campo | Tipo | Obrigatório |
|---|---|---|
| `NOME` | `text` | não |
| `E-MAIL*` | `email` | **sim** |
| `O QUE VOCÊ PROCURA?` | `textarea`, 3 linhas | não |

```css
.campo {
  border: 0;
  border-bottom: 1px solid var(--jm-tinta);
  border-radius: 0;
  background: transparent;
  padding: 0 0 .5rem;
}
```

Rótulos em REGISTRO, caixa alta, acima do campo. **Nunca placeholder como rótulo** — o
placeholder some ao digitar e a pessoa perde a referência do que estava preenchendo.

---

## 4. Os três CTAs

O doc de sessões substitui o `SUBMIT` único da referência por **três CTAs de WhatsApp com
mensagem por contexto** — um por vertente.

| CTA | Assunto enviado |
|---|---|
| `LEITURA` | `Leitura de tarô` |
| `BOOKING` | `Booking / set` |
| `JOIA` | `Peça de ourivesaria` |

Usa o utilitário existente `app/utils/whatsapp-message.ts`:

```ts
const link = (subject: string) => {
  const numero = useRuntimeConfig().public.whatsappNumber || useAppConfig().company.phone;
  const texto = buildWhatsAppMessage(
    { name: form.nome, subject, message: form.procura },
    form.email ? { 'E-mail': form.email } : {}
  );
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
};
```

O e-mail entra em `details` porque `buildWhatsAppMessage` só tem campo próprio para
telefone (`form.phone`) — e aqui coletamos e-mail, não telefone.

> **Três CTAs lado a lado só funcionam porque são mutuamente exclusivos por intenção.**
> Não são "três formas de enviar o mesmo formulário" — são três destinos diferentes.
> Se algum dia virarem variações da mesma ação, colapse em um.

---

## 5. Cor

| Elemento | Token | Contraste |
|---|---|---|
| Superfície do formulário | `--jm-papel #FFF5FC` | — |
| Rótulos, texto digitado | `--jm-tinta #0A0004` | **19,43:1** ✅ AAA |
| Underline em repouso | `--jm-tinta` a `opacity .35` | 3,1:1 — ✅ borda de controle (piso 3:1) |
| Underline em foco | `--jm-red #D30000` | **5,23:1** ✅ |
| CTA | preenchimento `--jm-red`, rótulo `--jm-branco` | **5,57:1** ✅ |
| Rodapé | superfície `--jm-sangue` | — |
| Wordmark do rodapé | `--jm-branco #FFFFFF` | **5,57:1** ✅ legível — decorativo, `aria-hidden` |

### O wordmark do rodapé

Branco sobre vermelho mede **5,57:1** — legível, não mais uma tensão deliberada. A antiga
vibração ilegível (ouro a 1,83:1, antes dele magenta a 1,59:1) não sobrevive à paleta de
três cores: o par mais fraco possível agora é 3,72:1, e nada nessa faixa lê como "quase
invisível de propósito" (`S6 §2`).

O elemento continua decorativo e `aria-hidden="true"` — mas por outro motivo. O wordmark
aqui é textura arquitetônica que duplica um nome já dito em outro lugar (header, glossário,
`<title>`), não porque é ilegível.

**Exige duas coisas:** `aria-hidden="true"` e o nome acessível presente em outro lugar do
rodapé (o link do Instagram já resolve).

---

## 6. Detalhes que a referência não mostra e que precisam existir

```css
::selection {
  background: var(--jm-red);
  color: var(--jm-branco);          /* 5,57:1 — legível mesmo selecionado */
}

input, textarea { caret-color: var(--jm-red); }

::placeholder { color: var(--jm-tinta); opacity: .45; }
/* opacity explícita: o Firefox aplica .54 por conta própria e some no papel */

* { -webkit-tap-highlight-color: transparent; }

/* o Chrome pinta o autofill de amarelo e destrói a paleta */
input:-webkit-autofill {
  -webkit-text-fill-color: var(--jm-tinta);
  -webkit-box-shadow: 0 0 0 100px var(--jm-papel) inset;
  transition: background-color 9999s;   /* impede o flash amarelo no primeiro quadro */
}
```

São detalhes que ninguém nota — e é esse o ponto. O autofill amarelo do Chrome é o tipo
de coisa que, quando falta, faz o formulário parecer inacabado sem que a pessoa saiba dizer
por quê.

---

## 7. Movimento

### Foco de campo — o underline cresce

```css
.campo-underline {
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 240ms var(--ease-out);
}
.campo:focus-visible ~ .campo-underline { transform: scaleX(1); }
```

**Origem à esquerda**, na direção da escrita. Origem central faria a linha crescer para os
dois lados, contra o sentido do texto.

`scaleX` em vez de `width` — `width` dispara layout a cada quadro, `transform` roda na GPU.

### Resto

| Elemento | Movimento | Duração | Easing |
|---|---|---|---|
| Underline no foco | `scaleX 0→1` | **240ms** | `--ease-out` |
| Underline ao sair | `scaleX 1→0` | **160ms** | `--ease-out` |
| CTA (`:active`) | `scale(0.97)` | 120ms | `--ease-out` |
| CTA (hover) | `background` para `--jm-noite` | 160ms | `ease` |
| Rótulo de campo com erro | `opacity`, sem shake | 200ms | `ease` |
| Wordmark do rodapé | **nada** | — | — |

**Saída em 160ms, entrada em 240ms** — quem sai do campo já decidiu; quem entra está
começando.

### Sem shake no erro

Erro de validação não sacode o campo. Shake é movimento de posição, é exatamente o que
`prefers-reduced-motion` pede para remover, e não comunica *o que* está errado. A mensagem
de erro aparece por `opacity`, com ícone e texto.

### Estado de envio

Ao abrir o WhatsApp, o rótulo do CTA troca com blur:

```css
.cta-rotulo { transition: filter 200ms ease, opacity 200ms ease; }
.cta[data-enviando] .cta-rotulo { filter: blur(2px); opacity: .7; }
```

O blur funde os dois rótulos e o olho lê uma transformação em vez de duas palavras
sobrepostas.

### Movimento reduzido

Underline aparece sem `scaleX` (`transform: none`, troca de `opacity`).
Blur de envio removido. `:active scale(0.97)` **mantido**.

---

## 8. Acessibilidade

- Todo campo tem `<label for>` real. Rótulo visual **é** o label — não use `aria-label`
  com rótulo visível ao lado, isso cria dois nomes para o mesmo campo.
- `E-MAIL*` tem `required` e `aria-required="true"`; o asterisco é explicado uma vez no
  topo do formulário (`* campo obrigatório`).
- Erro: `aria-invalid="true"` + `aria-describedby` apontando para a mensagem, que vive num
  `role="alert"`.
- Underline em repouso a 3,1:1 — cumpre WCAG 1.4.11 para borda de controle. **Não baixe
  para `opacity .2`**, que dá 2,1:1 e reprova.
- Anel de foco visível **além** do underline animado: o underline é decoração de estado,
  não indicador de foco. `:focus-visible { outline: 2px solid var(--jm-red); outline-offset: 2px; }`
- Campos com PII levam `data-clarity-mask="True"` — nome, e-mail e mensagem livre.
- Wordmark do rodapé `aria-hidden="true"`; o nome acessível vem do link do Instagram.
- Os três CTAs abrem em `target="_blank"` com `rel="noopener"` e aviso de nova janela no
  nome acessível (`Abrir conversa no WhatsApp sobre leitura de tarô`).

---

## 9. Responsivo

| Faixa | Comportamento |
|---|---|
| ≥ 1024px | formulário à esquerda, links de nav à direita |
| 768–1023px | formulário em largura total, nav abaixo em linha |
| < 768px | tudo empilhado; **os 3 CTAs viram coluna**, largura total, 48px de altura |

O wordmark do rodapé é edge-to-edge em qualquer largura — é o que dá o fecho. Em telas
estreitas ele quebra em duas linhas (`JAZZ` / `MOON`), nunca reduz para caber.

---

## 10. Critérios de aceite

- [ ] Campos sem caixa, sem raio, sem fundo — só underline
- [ ] Underline em repouso ≥ 3:1 (WCAG 1.4.11)
- [ ] Underline cresce da esquerda em 240ms e recolhe em 160ms
- [ ] `scaleX`, nunca `width`
- [ ] Autofill do Chrome não pinta amarelo, nem no primeiro quadro
- [ ] `::placeholder` com opacidade explícita (não herda o padrão do Firefox)
- [ ] Os 3 CTAs geram links de WhatsApp com assuntos distintos
- [ ] Campos com PII marcados com `data-clarity-mask="True"`
- [ ] Erro não sacode o campo
- [ ] Anel de foco existe **além** do underline
- [ ] Wordmark do rodapé é `aria-hidden` e há nome acessível alternativo
- [ ] Alvo de toque dos CTAs ≥ 48px em < 768px
