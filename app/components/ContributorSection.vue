<template>
  <section ref="sectionEl" class="scroll-scene relative" style="min-height: 200dvh">
    <div ref="stageEl" class="sticky top-0 h-dvh overflow-hidden px-6">
      <!-- Luz de segurança da câmara escura: brilho vinho atrás da cópia
           central. Acende piscando na entrada (lâmpada ligando) e fica acesa. -->
      <div ref="safelightEl" class="safelight pointer-events-none absolute inset-0 opacity-0" />

      <!-- Entrada alterna por seção (ENTRANCES): chuva de letras "recorte de
           revista", cópias passando ou confete caindo. Letras e confete são
           peças `absolute` com x/y própria via GSAP (setupScene), não flex/gap —
           é isso que espalha pela largura. overflow-hidden no stageEl já esconde
           a queda fora da tela (entra por cima, sai por baixo). -->
      <div v-if="entrance === 'letters'" ref="rainEl" class="pointer-events-none absolute inset-0 font-magazine-letter text-7xl">
        <span v-for="(ch, i) in tickerLetters" :key="i" class="rain-piece absolute left-0 top-0 inline-block" :style="{ color: TICKER_COLORS[i % TICKER_COLORS.length] }">{{ ch }}</span>
      </div>
      <div v-else-if="entrance === 'confetti'" ref="rainEl" class="pointer-events-none absolute inset-0">
        <span v-for="i in CONFETTI_COUNT" :key="i" class="rain-piece absolute left-0 top-0 block h-3 w-2 rounded-[1px]" :style="{ backgroundColor: TICKER_COLORS[i % TICKER_COLORS.length] }" />
      </div>

      <!-- Cópias da entrada: fotos do pool atravessando a tela rápido antes das
           reais formarem o carrossel (ver setupScene). Só enfeite — aria-hidden,
           alt vazio. Sem loading lazy: nascem fora da tela e entrariam como
           moldura sem foto. -->
      <template v-if="entrance === 'reel'">
        <div
          v-for="(photo, k) in reelPhotos"
          :key="`reel-${k}`"
          class="reel-print print pointer-events-none absolute left-1/2 w-max top-[38%] z-0 sm:top-1/2 opacity-0"
          aria-hidden="true"
        >
          <img :src="photo.photo" alt="" draggable="false" decoding="async" class="max-h-[40dvh] max-w-[min(48vw,28rem)] sm:max-h-[64dvh] sm:max-w-[min(62vw,28rem)]">
        </div>
      </template>

      <!-- Pilhas físicas nos cantos — cópias já reveladas secando, jogadas umas
           sobre as outras. Cada camada é a MESMA caixa (mesmo tamanho/moldura do
           cartão central) só que posicionada/escalada pro canto via GSAP
           transform (xPercent/yPercent centra, x/y/scale/rotation aparcam no
           canto) — assim, na troca, uma foto pode percorrer de verdade a
           distância entre pilha e centro sem precisar trocar de elemento no meio
           do caminho (ver commitStackTransition). -->
      <div
        v-for="(photo, i) in prevDeque"
        v-show="hasCarousel"
        :key="`prev-stack-${i}`"
        :ref="(el) => setStackRef('prev', i, el)"
        class="print pointer-events-none absolute left-1/2 w-max top-[38%] z-0 sm:top-1/2 opacity-0"
      >
        <img :src="photo?.photo || undefined" :alt="photo?.name" loading="lazy" draggable="false" class="max-h-[40dvh] max-w-[min(48vw,28rem)] sm:max-h-[64dvh] sm:max-w-[min(62vw,28rem)]">
      </div>

      <div
        v-for="(photo, i) in nextDeque"
        v-show="hasCarousel"
        :key="`next-stack-${i}`"
        :ref="(el) => setStackRef('next', i, el)"
        class="print pointer-events-none absolute left-1/2 w-max top-[38%] z-0 sm:top-1/2 opacity-0"
      >
        <img :src="photo?.photo || undefined" :alt="photo?.name" loading="lazy" draggable="false" class="max-h-[40dvh] max-w-[min(48vw,28rem)] sm:max-h-[64dvh] sm:max-w-[min(62vw,28rem)]">
      </div>

      <!-- Viajantes: mesma caixa das pilhas e do cartão central, ficam
           invisíveis em repouso. Na troca (commitStackTransition) eles é que
           percorrem de verdade o trajeto pilha↔centro — o cartão central e a
           camada de topo da pilha de destino somem por baixo enquanto isso, e
           voltam a aparecer já no estado final quando o trajeto termina.
           travelInEl (vira a nova principal) precisa de z MAIOR que
           travelOutEl (vai pro bolo) — com z-index igual, o DOM decidia
           (travelOutEl vinha depois, então pintava por cima, exatamente o
           inverso do pedido: a foto que está saindo cobrindo a que está
           virando principal). z-31 > z-30 resolve sem depender de ordem. -->
      <div ref="travelInEl" class="print pointer-events-none absolute left-1/2 w-max top-[38%] z-[31] sm:top-1/2 opacity-0">
        <img ref="travelInImgEl" draggable="false" loading="lazy" class="max-h-[40dvh] max-w-[min(48vw,28rem)] sm:max-h-[64dvh] sm:max-w-[min(62vw,28rem)]">
      </div>
      <div ref="travelOutEl" class="print pointer-events-none absolute left-1/2 w-max top-[38%] z-30 sm:top-1/2 opacity-0">
        <img ref="travelOutImgEl" draggable="false" loading="lazy" class="max-h-[40dvh] max-w-[min(48vw,28rem)] sm:max-h-[64dvh] sm:max-w-[min(62vw,28rem)]">
      </div>

      <!-- Coluna central: só a foto arrastável (reta, sem giro estático). No mobile
           ela e as pilhas/viajantes (top-[38%] acima, em vez de top-1/2) sobem pro
           terço superior do stage — libera uma faixa inferior genuinamente livre
           pro captionEl full-width (ver comentário dele). `photoStageEl` já nasce
           absolute/centrado (left-1/2+top-[38%]+translate -50%/-50%, mesmo padrão
           das pilhas) em vez do wrapper flex `h-full` de antes — um nível a menos
           de DOM, e sendo z-20 continua sempre por cima do captionEl (z-index:auto)
           mesmo depois dele no DOM, então o clique do botão/seek do
           AudioMessagePlayer (visualmente abaixo) não é roubado. O drag continua
           igual: pointer handler no próprio photoStageEl. -->
      <!-- Toque/clique sem arrastar (ver onPointerUp) ou Enter/Espaço abre a foto
           em tela cheia. -->
      <div
        ref="photoStageEl"
        class="pointer-events-auto absolute left-1/2 top-[38%] z-20 w-max -translate-x-1/2 -translate-y-1/2 touch-pan-y select-none outline-offset-8 sm:top-1/2"
        :class="isDragging ? 'cursor-grabbing' : hasCarousel ? 'cursor-grab' : canZoom ? 'cursor-zoom-in' : 'cursor-default'"
        :role="canZoom ? 'button' : undefined"
        :tabindex="canZoom ? 0 : undefined"
        :aria-label="canZoom ? `Ampliar foto de ${contributor.name}` : undefined"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @keydown.enter.prevent="openLightbox"
        @keydown.space.prevent="openLightbox"
      >
        <div ref="photoCardEl" class="flip-3d">
          <!-- `overflow-hidden` NUNCA pode dividir elemento com `preserve-3d`
               (a caixa aqui, sem overflow) — por spec, overflow != visible
               força transform-style:flat no MESMO elemento, achatando os
               filhos e quebrando o cálculo de backface-visibility deles
               (era exatamente esse bug: as duas faces ficavam sempre
               visíveis/planas). Por isso `overflow-hidden` desceu pra cada
               FACE individualmente (folhas, sem preserve-3d próprio — não
               conflita), e este nível intermediário só tem `position` +
               `preserve-3d`, sem overflow. -->
          <div class="relative flip-3d">
            <!-- Frente: a cópia com moldura. Fica EM FLUXO (não absolute) —
                 é ela quem define o tamanho do cartão (foto na proporção real + margem da
                 moldura), e o verso absolute copia essa caixa. Com um
                 aspect fixo no wrapper, a margem espremeria a foto e o
                 object-cover cortaria. -->
            <div class="print print--lifted flip-face">
              <!-- Mensagem em vídeo: `photo` vira a capa (poster). preload
                   metadata baixa só o cabeçalho (MP4 com faststart) — o vídeo
                   em si só é baixado no play. AV1 primeiro (bem menor), H.264
                   de reserva. Sem controles nativos: quem toca/pausa/avança é
                   o player da onda na legenda. -->
              <video
                v-if="current?.video"
                ref="photoImgEl"
                class="print-video"
                :style="{ '--video-ratio': current.video.height / current.video.width }"
                :poster="current?.photo"
                :aria-label="`Mensagem em vídeo de ${contributor.name}`"
                playsinline
                preload="metadata"
              >
                <source v-if="current.video.av1" :src="current.video.av1" type="video/mp4; codecs=av01.0.05M.08">
                <source :src="current.video.h264" type="video/mp4">
              </video>
              <img
                v-else-if="current?.photo"
                ref="photoImgEl"
                :src="current.photo"
                :alt="current.name"
                loading="lazy"
                draggable="false"
                class="max-h-[40dvh] max-w-[min(48vw,28rem)] sm:max-h-[64dvh] sm:max-w-[min(62vw,28rem)]"
              >
              <!-- Foto ainda não chegou: papel fotográfico em branco (mesma
                   moldura) com o nome — a seção funciona inteira sem ela. -->
              <div
                v-else
                ref="photoImgEl"
                class="print-empty flex items-center justify-center p-6 text-center font-script text-5xl leading-none sm:text-7xl"
                style="color: var(--primary)"
                role="img"
                :aria-label="`${contributor.name} (foto em breve)`"
              >
                {{ contributor.name.split(',')[0] }}
              </div>

              <!-- Controle PRÓPRIO do vídeo-recordação (Breno/Vitor/Lucas):
                   overlay DENTRO da moldura (`.print` já é `position:
                   relative`), ancorado no canto do VÍDEO (bottom/right
                   compensando `--frame`, o padding da moldura) em vez de
                   `top-full` abaixo do cartão inteiro — essa posição antiga
                   dependia de quanto espaço sobrava até a legenda, que no
                   mobile é uma faixa full-width no rodapé: com um vídeo alto
                   (Breno, 9:16-ish) ou tela baixa, o botão caía em cima do
                   nome/texto da legenda (bug reportado). Como overlay, nunca
                   mais depende desse espaço, em nenhum breakpoint.
                   pointerdown/click.stop: o pai (photoStageEl) escuta esses
                   mesmos eventos pra arrastar/abrir lightbox — sem parar a
                   propagação, o clique no botão também contaria como toque
                   no cartão. -->
              <button
                v-if="isStackVideo"
                type="button"
                class="absolute bottom-[calc(var(--frame)+0.5rem)] right-[calc(var(--frame)+0.5rem)] z-10 flex size-11 items-center justify-center rounded-full border-0 bg-black/45 text-white outline-offset-4 backdrop-blur-sm transition-transform duration-150 ease-out motion-reduce:transition-none active:scale-90"
                :aria-label="stackVideoPlaying ? 'Pausar vídeo' : 'Tocar vídeo'"
                :aria-pressed="stackVideoPlaying"
                @pointerdown.stop
                @click.stop="toggleStackVideo"
              >
                <Pause v-if="stackVideoPlaying" fill="currentColor" class="size-5" />
                <Play v-else fill="currentColor" class="size-5 translate-x-px" />
              </button>
            </div>
            <!-- Verso: mesma caixa, pré-girado 180° (estático) — só aparece
                 quando o pai (photoCardEl) gira e o backface-visibility do
                 lado oposto (a foto) esconde a si mesmo. Verso de papel
                 fotográfico (`.print-back`: marca-d'água de laboratório), pra
                 ler como o verso físico da mesma cópia. SEM `flex items-
                 center` aqui: centralizar verticalmente um texto mais alto
                 que a caixa faz o overflow "vazar" pros dois lados igual,
                 mas scrollTop nunca é negativo — a metade de cima do
                 transbordo fica cortada e IMPOSSÍVEL de rolar até ela (era
                 o bug reportado). Bloco normal + scroll do topo resolve:
                 scrollTop=0 já mostra o início de verdade, dá pra rolar até
                 o fim, nada fica inacessível. -->
            <div class="print-back print--lifted flip-face flip-face--back absolute inset-0 overflow-y-auto p-[8%]">
              <!-- `contributor.message`, não `current.message`: o carrossel
                   cicla a FOTO em exibição por qualquer contribuidor via
                   drag, mas áudio/nome/transcrição no captionEl SEMPRE são
                   do dono desta seção (props.contributor) — o verso segue a
                   mesma regra, senão virar a foto numa seção mostra a
                   mensagem de outra pessoa (bug reportado: "mensagem que
                   aparece não é a completa, é um mock" — na real era a
                   mensagem de quem estivesse `current` no momento). -->
              <p class="font-instrument-serif text-center text-base leading-snug tracking-tight text-[#2a2220] sm:text-lg">
                {{ contributor.message }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Ícone + rótulo de virar foto — canto superior-esquerdo do stage
           (fixo mesmo com o cartão se movendo/arrastando, porque vive fora
           de photoStageEl). z-40 > z-20 do photoStageEl. Os dois formam UM
           bloco só: opacity/pointer-events no CONTAINER (não em cada filho
           separado) faz ícone e texto aparecerem juntos, no mesmo instante
           — antes disso o ícone nem é clicável (pointer-events-none no
           grupo inteiro). Em seções com áudio, só depois que ele começa a
           tocar (showFlipHint); sem áudio não há "início" pra esperar,
           então o bloco já nasce visível. Some de novo assim que a foto já
           foi virada uma vez. gap-1.5 (era gap-2) pra ler como uma etiqueta
           única grudada no ícone, não dois elementos soltos lado a lado. -->
      <!-- Sem mensagem (contribuidor cujo áudio ainda não chegou) não há verso
           pra ler — o botão de virar nem existe. -->
      <div
        v-if="contributor.message"
        class="absolute left-1 top-6 z-40 flex items-center transition-opacity duration-500 motion-reduce:transition-none"
        :class="showFlipHint ? 'opacity-100' : 'pointer-events-none opacity-0'"
      >
        <button
          type="button"
          class="flex size-11 shrink-0 items-center justify-center rounded-full border-0 bg-transparent text-white/80 outline-offset-4 transition-transform duration-150 ease-out motion-reduce:transition-none active:scale-90"
          :aria-label="isFlipped ? 'Mostrar foto' : 'Virar foto e ler a mensagem'"
          :aria-pressed="isFlipped"
          @click="toggleFlip"
        >
          <RotateCcw class="size-6" />
        </button>
        <!-- O botão em si é size-11 (44px, alvo de toque) mas o ícone dentro
             é só size-6 (24px) centralizado — sobra ~10px de "padding
             invisível" do próprio botão antes do texto começar. -ml compensa
             esse vão, senão o gap parece grande mesmo com gap:0 no pai. -->
        <span class="-ml-2 text-xs tracking-wide text-white/70">{{ flipHintLabel }}</span>
      </div>

      <!-- Legenda: texto puro, sem borda/fundo/caixa. No mobile virou uma faixa
           FULL-WIDTH no rodapé (left-6/right-6/bottom-6) em vez da coluna estreita
           (w-[4.75rem]) de uma correção anterior — aquela coluna consertou a
           sobreposição com a pilha PREV, mas sufocava o AudioMessagePlayer (~28px
           de waveform útil, ilegível). A correção definitiva não é apertar a
           legenda pro lado, é abrir espaço embaixo: todo o conjunto foto+pilhas+
           viajantes subiu pro anchor top-[38%] (era top-1/2) e STACK_OFFSET_Y_MOBILE
           caiu de 0.36 pra 0.18 (ver script), então mesmo a camada mais funda da
           pilha (que mais "espia" pro canto) não desce além de ~y=527 num stage de
           844px — sobra ≈95px de respiro antes do topo da legenda (~y=620,
           definido pelo conteúdo + bottom-6) e ainda folga pra um arrasto vertical
           realista do cartão central (testado com chrome-devtools: pointerdown/
           move/up sintéticos, rápido e devagar, os dois lados, em Ana Souza e
           Carla Mendes — zero overlap de bounding box em repouso e durante o
           arrasto/transição). `break-words` é rede de segurança pra nomes/
           mensagens longos. Ordem mensagem → áudio → nome: a assinatura fecha o
           bloco. `isolate` + `.caption-fade` (tailwind.css) dão o fade preto
           radial de contraste atrás do texto, sem virar caixa/borda/blur — é um
           ::before do próprio captionEl, herda a opacity animada pelo GSAP. No
           desktop nada muda: sm:* restaura a coluna lateral original
           (right-10/top-[58%]/max-w-xs/text-right), inclusive o sm:top-[58%] que
           já corrigia a pilha NEXT encostando no topo da legenda em repouso. -->
      <div
        ref="captionEl"
        class="caption-fade absolute left-6 right-6 bottom-6 isolate text-center opacity-0 sm:left-auto sm:right-10 sm:w-auto sm:bottom-auto sm:top-[58%] sm:max-w-xs sm:text-right sm:-translate-y-1/2"
      >
        <!-- Ordem: assinatura → player → transcrição. De quem é a mensagem
             vem primeiro, o player logo abaixo (o que se toca), e só depois
             o texto do trecho que está tocando. Sem o truque de sobreposição
             (-mb puxando o próximo bloco) que existia quando a assinatura
             ficava colada na transcrição — aqui embaixo dela vem o PLAYER,
             não texto, e a assinatura dourada por cima dos controles ficaria
             confusa/ilegível em vez de bonita; margem normal em vez disso. -->
        <h3
          class="relative z-10 mb-3 break-words font-script text-5xl leading-none sm:mb-4 sm:text-8xl"
          style="color: var(--primary); text-shadow: -2px -2px 3px #000, 2px -2px 3px #000, -2px 2px 3px #000, 2px 2px 3px #000, 0 0 3px #000, 0 6px 18px rgba(0,0,0,0.95)"
        >
          {{ contributor.name }}
        </h3>

        <!-- `contributor.video` (fixo, não `current.video`): controla o vídeo
             SÓ quando ele é a própria mensagem (Arthur Dexis, sem `photos`).
             Um vídeo dentro da pilha (Breno/Vitor/Lucas) não deve tomar conta
             deste player — ele toca junto de `contributor.audio` sempre, e o
             vídeo ganha um controle próprio abaixo da moldura (ver botão em
             photoStageEl); a única regra entre os dois é não tocar ao mesmo
             tempo (garantida pelo `activeAudio` de useAudioPlayer.ts, que os
             dois players compartilham). -->
        <AudioMessagePlayer
          v-if="contributor.audio || contributor.video"
          :src="contributor.audio ?? contributor.video?.h264 ?? ''"
          :media="topVideoEl"
          @timeupdate="onAudioTime"
        />

        <!-- Quando há áudio, o texto É a transcrição do que a pessoa fala nele
             (mesmo campo `contributor.message`, sem duplicar dado). Se o
             contribuidor tem `transcriptSegments` (gerados por
             scripts/transcribe.mjs), o texto exibido troca de trecho em trecho
             acompanhando `audioTime` (ver @timeupdate no player acima) — uma
             legenda de verdade, do repouso em diante, não uma transcrição
             estática. Sem segments, mostra `contributor.message` inteiro,
             igual sempre foi. -->
        <!-- min-h em `em` (relativo ao próprio font-size do parágrafo, então
             escala sozinho entre o text-3xl do mobile e o sm:text-4xl do
             desktop) reserva altura fixa pro texto — medido de verdade no
             browser: o trecho mais longo desta transcrição quebra em 4
             linhas em 390px (3.45em/3 linhas não bastava, sobrava um trecho
             de 138px contra 103.5px reservados, e a caixa ainda encolhia/
             crescia 1 linha inteira entre trocas). 4.6em (4 linhas) cobre o
             pior caso atual; se um contribuidor futuro tiver um trecho ainda
             mais longo, ajuste este valor de novo medindo a altura real. Sem
             isso, o bloco (ancorado por baixo, `bottom-6`, no mobile) subia/
             descia a cada troca, empurrando player/assinatura/fotos junto —
             exatamente o "aumentando e diminuindo" reportado. -->
        <Transition name="caption-swap" mode="out-in">
          <p
            v-if="displayedMessage"
            :key="displayedMessage"
            class="relative break-words font-instrument-serif text-3xl leading-[1.15] tracking-tight text-white sm:text-4xl"
            :class="{ 'mt-5 min-h-[4.6em] sm:mt-6': contributor.audio || contributor.video }"
          >
            {{ displayedMessage }}
          </p>
        </Transition>
      </div>
    </div>

    <!-- Foto em tela cheia: a cópia central maior, na moldura e proporção real
         (sem corte), com X pra fechar. Teleport pro body: a seção tem
         `contain: paint`/isolation (tailwind.css), que recortaria um fixed. -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="lightboxOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-10"
          role="dialog"
          aria-modal="true"
          :aria-label="current?.video ? `Vídeo de ${contributor.name}` : `Foto de ${contributor.name}`"
          @click.self="closeLightbox"
        >
          <div
            v-if="current?.video"
            class="lightbox-photo flex flex-col items-center gap-4"
            @click.self="closeLightbox"
          >
            <div class="print print--lifted [--frame:clamp(10px,1.6vmin,18px)]">
              <!-- Vídeo grande SEM controles nativos: quem toca/pausa/avança é o
                   mesmo player de onda da seção, logo abaixo, com a legenda. -->
              <video
                ref="lightboxVideoEl"
                class="lightbox-video"
                :style="{ '--video-ratio': current.video.height / current.video.width }"
                :poster="current?.photo"
                playsinline
                preload="metadata"
              >
                <source v-if="current.video.av1" :src="current.video.av1" type="video/mp4; codecs=av01.0.05M.08">
                <source :src="current.video.h264" type="video/mp4">
              </video>
            </div>
            <div class="w-full max-w-md">
              <AudioMessagePlayer
                :src="current.video.h264"
                :media="lightboxVideoEl"
                @timeupdate="onAudioTime"
              />
            </div>
            <p
              v-if="displayedMessage"
              class="max-w-xl text-center font-instrument-serif text-xl leading-snug text-white sm:text-2xl"
              aria-live="off"
            >
              {{ displayedMessage }}
            </p>
          </div>
          <div v-else class="lightbox-photo print print--lifted [--frame:clamp(10px,1.6vmin,18px)]">
            <img
              :src="current?.photo"
              :alt="current?.name"
              draggable="false"
              class="max-h-[80dvh] max-w-[calc(100vw-4rem)] sm:max-h-[84dvh] sm:max-w-[calc(100vw-10rem)]"
            >
          </div>
          <button
            ref="lightboxCloseEl"
            type="button"
            class="absolute right-3 top-3 flex size-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-150 hover:bg-white/20 sm:right-6 sm:top-6"
            :aria-label="contributor.video ? 'Fechar vídeo' : 'Fechar foto'"
            @click="closeLightbox"
          >
            <X class="size-7" />
          </button>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { RotateCcw, X, Play, Pause } from '@lucide/vue'
import type { Contributor } from '@/types'
import { carouselWindow, step, wrapIndex } from '@/utils/carousel'

const props = defineProps<{ contributor: Contributor, index: number }>()

// Entrada alterna entre as seções pra variar a dinâmica: 1ª letras, 2ª cópias
// passando, 3ª confete, e repete. Sem foto não há cópias pra passar: quem cairia
// em 'reel' ganha confete no lugar.
const ENTRANCES = ['letters', 'reel', 'confetti'] as const
const rotated = ENTRANCES[props.index % ENTRANCES.length]!
const entrance = rotated === 'reel' && !props.contributor.photo ? 'confetti' : rotated

// Pool da pilha: só as fotos DESTE contribuidor — cada seção mostra somente
// as próprias fotos, nunca as de outra pessoa (antes o pool misturava todo
// mundo; era por isso que a pilha do Pai mostrava Ana/Bruno/Carla no bolo).
// Quem só tem uma foto (`photo`, sem `photos`) cicla nela mesma — a pilha
// simplesmente não varia, o que já era o caso antes de existir `photos`.
// Cada entrada é um clone RASO do contribuidor com `photo` trocada: nome/
// mensagem/áudio/transcrição continuam vindo sempre de `props.contributor`
// no template (nunca de `current`), então a legenda nunca muda ao ciclar.
const photoPool = computed(() => {
  // Sem foto nenhuma ainda: pool de 1 entrada vazia (sem carrossel; o cartão
  // central vira papel em branco com o nome, ver template).
  const items = props.contributor.photos?.length ? props.contributor.photos : [props.contributor.photo ?? '']
  // Item de vídeo (ContributorPhotoVideo) vira a foto central quando é a vez
  // dele: `photo` recebe o poster (usado nas pilhas/mural/mesmo antes do play)
  // e `video` o próprio vídeo — o template troca <img> por <video> conforme
  // `current.video` (mesmo mecanismo do vídeo de topo do Arthur Dexis).
  return items.map(item => typeof item === 'string'
    ? { ...props.contributor, photo: item }
    : { ...props.contributor, photo: item.poster, video: item })
})

// Com uma foto só não há carrossel: os bolos laterais somem (v-show, o DOM
// continua pra entrada/refs não quebrarem) e arrastar só devolve a foto ao centro.
const hasCarousel = computed(() => photoPool.value.length > 1)

// Foto em tela cheia (toque sem arrastar, Enter ou Espaço na foto central).
const lightboxOpen = ref(false)
const lightboxCloseEl = ref<HTMLButtonElement | null>(null)
const lightboxVideoEl = ref<HTMLVideoElement | null>(null)

function onLightboxKey(e: KeyboardEvent) {
  if (e.key === 'Escape') closeLightbox()
}

// Sem foto nem vídeo não há o que ampliar.
const canZoom = computed(() => !!(current.value?.video || current.value?.photo))

function openLightbox() {
  if (lightboxOpen.value || isFlipped.value || !canZoom.value) return
  // Vídeo: a reprodução passa do cartão pro vídeo grande, do mesmo ponto —
  // se estava tocando, continua tocando (o toque do usuário libera o play).
  const card = videoEl.value
  const resumeAt = card?.currentTime ?? 0
  const wasPlaying = !!card && !card.paused
  card?.pause()
  lightboxOpen.value = true
  // Trava a rolagem da página (scroll-snap) enquanto a foto está aberta.
  document.documentElement.style.overflow = 'hidden'
  window.addEventListener('keydown', onLightboxKey)
  nextTick(() => {
    lightboxCloseEl.value?.focus()
    const big = lightboxVideoEl.value
    if (!big) return
    big.currentTime = resumeAt
    if (wasPlaying) big.play().catch(() => {})
  })
}

function closeLightbox() {
  if (!lightboxOpen.value) return
  // E volta: o cartão retoma do ponto em que o vídeo grande parou.
  const big = lightboxVideoEl.value
  const card = videoEl.value
  if (big && card) {
    const wasPlaying = !big.paused
    big.pause()
    card.currentTime = big.currentTime
    if (wasPlaying) card.play().catch(() => {})
  }
  lightboxOpen.value = false
  document.documentElement.style.overflow = ''
  window.removeEventListener('keydown', onLightboxKey)
  // Foco volta pra foto que abriu o visualizador.
  photoStageEl.value?.focus()
}

// Legenda sincronizada: já nasce mostrando o trecho correspondente a
// audioTime=0 (o primeiro segmento), não a mensagem inteira — antes era
// "mensagem completa até o play, aí pula pra trecho curto", o que dava um
// salto de tamanho feio bem no momento em que o usuário clica em play. Com
// segments, SEMPRE mostra o trecho ativo, do repouso em diante; sem segments
// (contribuidor sem transcrição sincronizada), continua mostrando a
// mensagem inteira, como sempre foi.
const audioTime = ref(0)

function onAudioTime(t: number) {
  audioTime.value = t
}

// Segmentos do Whisper têm GAPS entre um e outro (silêncio/pausa na fala) —
// `find` por `t >= start && t < end` retorna undefined bem nesses intervalos.
// O fallback antigo pulava direto pro ÚLTIMO segmento do áudio nesse
// momento (bug reportado: depois de "Te desejo tudo de melhor nessa vida."
// aparecia o trecho final do áudio por ~1s, antes de "corrigir" pro trecho
// certo) — porque `active ?? segments[length-1]` não distingue "ainda não
// comecei" de "estou num intervalo entre falas". Fix: manter mostrando o
// ÚLTIMO segmento que já começou (varre em ordem, guarda o mais recente com
// start <= t) — nos gaps, a legenda simplesmente continua na fala anterior
// até a próxima começar, sem pular pro fim.
const activeSegmentText = computed(() => {
  const segments = props.contributor.transcriptSegments
  if (!segments?.length) return null
  let candidate = segments[0]!
  for (const segment of segments) {
    if (audioTime.value >= segment.start) candidate = segment
    else break
  }
  return candidate.text
})

// Legenda sempre acompanha `contributor.audio` (via activeSegmentText,
// alimentado por audioTime do player principal) — nunca zera por causa do
// vídeo-recordação na pilha (Breno/etc): esse vídeo tem controle próprio
// (toggleStackVideo) e nunca alimenta audioTime, então mostrar a legenda
// junto dele não dessincroniza nada. O pedido é explícito: sempre que o
// áudio tocar, a transcrição aparece — independente do que estiver no centro
// do carrossel.
const displayedMessage = computed(() => {
  if (activeSegmentText.value) return activeSegmentText.value
  return props.contributor.message
})

const sectionEl = ref<HTMLElement | null>(null)
const stageEl = ref<HTMLElement | null>(null)
const rainEl = ref<HTMLElement | null>(null)
const photoStageEl = ref<HTMLElement | null>(null)
const photoCardEl = ref<HTMLElement | null>(null)
const photoImgEl = ref<HTMLElement | null>(null)
// Mensagem em vídeo: o mesmo ref do cartão central é o <video> (ver template).
// `current.video` cobre tanto o vídeo de topo (Arthur Dexis, único item do
// pool) quanto um vídeo dentro da pilha de fotos (item central mudando) —
// usado pelo lightbox e por canZoom/toggleFlip, que tratam os dois tipos
// igual (ampliar/girar independem de quem controla o play).
const videoEl = computed(() => current.value?.video ? photoImgEl.value as HTMLVideoElement | null : null)
// Vídeo de TOPO (Arthur Dexis): `contributor.video` é fixo, não muda com o
// carrossel (ele nem tem `photos`) — é o único caso em que o AudioMessagePlayer
// da legenda deve controlar o <video> (ver template). Um vídeo dentro da
// pilha nunca cai aqui, mesmo sendo `current`.
const topVideoEl = computed(() => props.contributor.video ? photoImgEl.value as HTMLVideoElement | null : null)
const safelightEl = ref<HTMLElement | null>(null)
const travelInEl = ref<HTMLElement | null>(null)
const travelInImgEl = ref<HTMLImageElement | null>(null)
const travelOutEl = ref<HTMLElement | null>(null)
const travelOutImgEl = ref<HTMLImageElement | null>(null)
const captionEl = ref<HTMLElement | null>(null)

// Chuva de letras "recorte de revista" (mesma linguagem do Cover) que cai antes
// das fotos aparecerem — eco do Cover se dispersando, não caracteres aleatórios
// genéricos. Quantidade alta (48) pra tela ficar visivelmente cheia, tipo chuva
// de verdade — compensado com stagger pequeno no tween pra não esticar a entrada.
const TICKER_POOL = Array.from('FELIZANIVERSARIOLORENZO')
const TICKER_COLORS = ['#f2b90f', '#e63946', '#2a9d8f', '#f2f2f2', '#9b5de5', '#e9724c']
const TICKER_LENGTH = 48
const CONFETTI_COUNT = 70

// Placeholder determinístico no SSR (nunca Math.random aqui — quebraria o
// hydration); sorteia de verdade só depois de montado, quando a fila ainda
// está fora da tela e invisível pro usuário.
const tickerLetters = ref(Array.from({ length: TICKER_LENGTH }, (_, i) => TICKER_POOL[i % TICKER_POOL.length]!))

// Pilhas físicas: cada lado mostra LAYER_COUNT fotos (frente..fundo, índice 0
// = a próxima a assentar no centro). Tudo deriva de UM índice no pool circular
// (app/utils/carousel.ts): next = índice+1..+3, prev = índice−1..−3. Antes eram
// deques com cursores separados por lado — a pilha next nascia em pool[3..5]
// (pulando 1 e 2), a foto que saía do centro ia pro FUNDO da pilha oposta e os
// cursores nunca recuavam, então avançar e voltar trazia outra foto. Com um
// índice só, avançar leva a antiga atual pro TOPO da prev e voltar a traz de
// volta, sempre.
const LAYER_COUNT = 3
const currentIndex = ref(0)
const carousel = computed(() => carouselWindow(currentIndex.value, photoPool.value.length, LAYER_COUNT))
const current = computed(() => photoPool.value[carousel.value.current]!)

// Vídeo-recordação (dentro de `photos`, ex. Breno/Vitor/Lucas): tem controle
// PRÓPRIO (botão abaixo da moldura, ver template) em vez de tomar conta do
// player da legenda — esse continua sempre tocando `contributor.audio`.
const isStackVideo = computed(() => !!(current.value?.video && props.contributor.photos))
const stackVideoEl = computed(() => isStackVideo.value ? photoImgEl.value as HTMLVideoElement | null : null)
const {
  audioRef: stackVideoRef,
  isPlaying: stackVideoPlaying,
  toggle: toggleStackVideo,
  play: playStackVideo
} = useAudioPlayer()
// `audioRef` do composable é um ref simples (não computed) — precisa ser
// sincronizado manualmente sempre que o elemento de vídeo mudar (troca de
// item central, ou o <video> sendo criado/destruído pelo v-if do template).
watch(stackVideoEl, (el) => { stackVideoRef.value = el }, { immediate: true })
// Mesmos eventos que o <audio> interno do AudioMessagePlayer escuta —
// registrados manualmente aqui porque este <video> nunca passa pela prop
// `media` dele (é controlado pelo botão próprio, não pelo player da legenda).
const STACK_VIDEO_EVENTS = [
  ['play', () => { stackVideoPlaying.value = true }],
  ['pause', () => { stackVideoPlaying.value = false }],
  ['ended', () => { stackVideoPlaying.value = false }]
] as const
watch(stackVideoEl, (el, _old, onCleanup) => {
  if (!el) return
  STACK_VIDEO_EVENTS.forEach(([name, handler]) => el.addEventListener(name, handler))
  onCleanup(() => STACK_VIDEO_EVENTS.forEach(([name, handler]) => el.removeEventListener(name, handler)))
}, { immediate: true })

// Vídeo dentro da pilha: dá play sozinho ao virar o item central (ex.: Breno
// Prenassi). Só na troca de verdade — nunca na entrada da seção, que não é um
// gesto do usuário e o navegador bloquearia o autoplay com som mesmo assim
// (é mudo de qualquer forma, mas o gesto continua sendo a troca de carrossel,
// não o carregamento da seção). `playStackVideo` (não `.play()` direto):
// mesma regra dos dois controles desta seção nunca tocarem juntos — assume o
// vídeo como `activeAudio` e pausa `contributor.audio` se estiver tocando.
// Sair do vídeo não precisa de pausa explícita: o <video> desmonta (v-if do
// template troca pra <img>) assim que `current.video` deixa de ser dele.
watch(current, (item) => {
  if (!item?.video || !props.contributor.photos) return
  nextTick(() => playStackVideo())
})

const prevDeque = computed(() => carousel.value.prev.map(i => photoPool.value[i]!))
const nextDeque = computed(() => carousel.value.next.map(i => photoPool.value[i]!))
// Fotos das cópias que passam na entrada: as que vêm ANTES da pilha prev na
// sequência, da mais antiga (passa primeiro) até índice−4 (passa por último),
// então a passagem lê em ordem até a foto atual.
const reelPhotos = computed(() => Array.from({ length: REEL_COUNT }, (_, k) =>
  photoPool.value[wrapIndex(currentIndex.value - LAYER_COUNT - REEL_COUNT + k, photoPool.value.length)]!))

const prevStackEls: (HTMLElement | null)[] = Array(LAYER_COUNT).fill(null)
const nextStackEls: (HTMLElement | null)[] = Array(LAYER_COUNT).fill(null)

function setStackRef(side: 'prev' | 'next', index: number, el: unknown) {
  const arr = side === 'prev' ? prevStackEls : nextStackEls
  arr[index] = el instanceof HTMLElement ? el : null
}

// Pose de repouso de cada camada, em transform puro (x/y/rotation/scale) —
// nunca width/height (gsap-performance): a mesma caixa do cartão central,
// só "arcada" pro canto. stageWidth/stageHeight vêm do onMounted (ver mais
// abaixo) e alimentam tanto a entrada quanto o cálculo do trajeto na troca.
let stageWidth = 0
let stageHeight = 0
const STACK_SCALE = 0.36
const STACK_SCALE_STEP = 0.025
const STACK_OFFSET_X = 0.30
// Y de repouso das pilhas — menor no mobile (definido no onMounted, abaixo,
// conforme stageWidth) que no desktop, apesar do nome sugerir o contrário:
// o mobile precisa COMPACTAR a pilha verticalmente porque o anchor do grupo
// inteiro (template: top-[38%] nas pilhas/viajantes/photoStageEl, em vez de
// top-1/2) subiu pro terço superior do stage, abrindo uma faixa inferior
// livre pro captionEl full-width. 0.18 (era 0.36, valor herdado de quando a
// legenda vivia numa coluna lateral e não precisava dessa faixa) faz a camada
// mais funda da pilha (a que mais "espia" pro canto) parar em ~y=527 num
// stage de 844px — a legenda começa perto de y=620, sobra ~95px de respiro
// mesmo com o arrasto do cartão central. No desktop sobra largura de sobra
// pros lados (legenda é coluna lateral, não faixa inferior), então o valor
// original permanece. Só o VALOR muda por breakpoint, a fórmula em
// stackPose() continua igual.
const STACK_OFFSET_Y_DESKTOP = 0.27
const STACK_OFFSET_Y_MOBILE = 0.18
let STACK_OFFSET_Y = STACK_OFFSET_Y_DESKTOP
// Cada camada mais funda "espia" um pouco mais pra fora do canto, sempre na
// MESMA diagonal da camada da frente — é o que lê como pilha de verdade em
// perspectiva (fotos alinhadas, uma atrás da outra) em vez de leque
// espalhado: nada de camada nenhuma migrando de volta pro centro.
const STACK_LAYER_PEEK = 15
const STACK_ROTATION = { prev: -12, next: 9 }
const STACK_ROTATION_STEP = 3
// Fotos físicas empilhadas são opacas — profundidade vem do deslocamento/
// rotação/escala (stackPose), não de transparência. 0.6/0.4 (valores
// antigos) faziam a pilha parecer vidro/fantasma, cada camada deixando ver a
// de trás através dela — o oposto do "foto atrás da outra" real. Só a mais
// funda perde um pouquinho de opacidade (0.94), sutil o bastante pra não
// competir visualmente com a de cima sem parecer transparente.
const STACK_LAYER_OPACITY = [1, 0.97, 0.94]

function stackPose(side: 'prev' | 'next', layerIndex: number) {
  const dir = side === 'prev' ? -1 : 1
  const peek = layerIndex * STACK_LAYER_PEEK
  return {
    x: dir * stageWidth * STACK_OFFSET_X + dir * peek,
    y: (side === 'prev' ? 1 : -1) * (stageHeight * STACK_OFFSET_Y + peek * 0.6),
    rotation: STACK_ROTATION[side] + dir * layerIndex * STACK_ROTATION_STEP,
    scale: STACK_SCALE - layerIndex * STACK_SCALE_STEP,
    // Todas as camadas de uma pilha têm o mesmo z-0 (classe no template) —
    // sem isso, o navegador desempata por ordem no DOM (mesmo bug já
    // corrigido entre travelInEl/travelOutEl, ver comentário no template),
    // e a camada MAIS FUNDA (última do v-for) pintava por cima da mais rasa.
    // Resultado: a foto "da frente" que o usuário via já era a errada, e na
    // troca a foto certa (layerIndex 0) parecia surgir do nada crescendo, e a
    // que saía do centro parecia ir pra FRENTE do bolo em vez de pro fundo.
    // zIndex decrescente com a profundidade resolve nos dois pontos.
    zIndex: LAYER_COUNT - layerIndex
  }
}

function setStackPose(el: HTMLElement | null, side: 'prev' | 'next', layerIndex: number, opacity: number) {
  if (!el) return
  const pose = stackPose(side, layerIndex)
  $gsap.set(el, { xPercent: -50, yPercent: -50, x: pose.x, y: pose.y, rotation: pose.rotation, scale: pose.scale, zIndex: pose.zIndex, opacity })
}

function poseFromDataset(target: Element, key: string): number {
  return Number((target as HTMLElement).dataset[key] ?? 0)
}

const { $gsap, $prefersReducedMotion } = useNuxtApp()

// gsap.context escopa os seletores ao componente e junta TODO tween/
// ScrollTrigger criado no setup — onBeforeUnmount reverte tudo de uma vez.
let ctx: { revert: () => void } | null = null

onMounted(() => {
  if (!$gsap || !sectionEl.value) return
  ctx = $gsap.context(setupScene, sectionEl.value)
})

// Entrada simples: cópias com fotos do pool atravessam a tela da
// direita pra esquerda, uma atrás da outra, rápido; logo atrás delas as 7
// cópias reais entram pela direita e param nas poses do carrossel (pilhas +
// cópia central). Só x/y/rotation/scale/opacity — sem motionPath, que deixava
// a escala final das cópias reais em 0 e escondia a foto central.
const REEL_COUNT = 8 // cópias com foto que passam antes das reais
const PASS_SCALE_DESKTOP = 0.5
const PASS_SCALE_MOBILE = 0.55
const PASS_TILT_DEG = 3 // cópias levemente tortas, alternando, como papel de verdade
const PASS_DURATION = 0.9 // tempo de cada cópia atravessar a tela inteira
const PASS_STAGGER = 0.08 // intervalo entre uma cópia e a próxima
const FORM_DURATION = 0.9 // tempo das reais da borda direita até a pose
const FORM_STAGGER = 0.06
const RAIN_FORM_AT = 0.55 // início da formação nas entradas sem passagem (letras/confete)

function setupScene() {
  if (!sectionEl.value || !photoCardEl.value || !photoImgEl.value || !photoStageEl.value
    || !safelightEl.value || !travelInEl.value || !travelOutEl.value || !captionEl.value
    || prevStackEls.some(el => !el) || nextStackEls.some(el => !el)) return

  stageWidth = stageEl.value?.clientWidth ?? window.innerWidth
  stageHeight = stageEl.value?.clientHeight ?? window.innerHeight
  // Breakpoint mobile = mesmo `sm` (640px) que já rege o resto do layout da
  // legenda no template — abaixo dele as pilhas ganham mais respiro vertical.
  STACK_OFFSET_Y = stageWidth < 640 ? STACK_OFFSET_Y_MOBILE : STACK_OFFSET_Y_DESKTOP

  // Sorteio de verdade só depois de montado (client-only) — a fila começa fora
  // da tela (ver gsap.set abaixo), então trocar o texto aqui não pisca nada.
  tickerLetters.value = Array.from({ length: TICKER_LENGTH }, () => TICKER_POOL[$gsap.utils.random(0, TICKER_POOL.length - 1, 1)]!)

  // gsap.quickTo em vez de gsap.set a cada pointermove — reaproveita um único
  // tween por propriedade (recomendação oficial do GSAP pra followers de
  // ponteiro em alta frequência). Precisa existir mesmo com prefers-reduced-
  // motion: o arrasto continua sendo o mecanismo de entrada (não é a entrada
  // decorativa que é pulada), só a animação de troca de pilha simplifica.
  cardXTo = $gsap.quickTo(photoCardEl.value, 'x', { duration: 0.3, ease: 'power3' })
  cardYTo = $gsap.quickTo(photoCardEl.value, 'y', { duration: 0.3, ease: 'power3' })
  cardRotTo = $gsap.quickTo(photoCardEl.value, 'rotation', { duration: 0.35, ease: 'power3' })

  // Perspectiva pro flip 3D (toggleFlip) ler como um cartão físico girando no
  // espaço, não um achatamento/esmagamento — aplicado uma vez aqui, convive
  // sem conflito com x/y/rotation(Z)/scale que o resto do componente já
  // anima no mesmo elemento (rotationY é um eixo independente).
  // rotationY:0 explícito (não só "confiar" no default do navegador): a
  // seção sempre nasce com a FOTO na frente, nunca o verso — isFlipped já
  // começa false, mas garantir aqui remove qualquer ambiguidade de estado
  // inicial entre o CSS estático das faces e o primeiro gsap.set do ciclo
  // de vida do componente.
  $gsap.set(photoCardEl.value, { transformPerspective: 1200, rotationY: 0 })
  isFlipped.value = false

  // Movimento reduzido: pula direto pro estado final, sem entrada animada.
  if ($prefersReducedMotion?.()) {
    if (rainEl.value) $gsap.set(rainEl.value, { autoAlpha: 0 })
    $gsap.set(safelightEl.value, { opacity: 1 })
    $gsap.set(photoCardEl.value, { opacity: 1, scale: 1 })
    prevStackEls.forEach((el, i) => setStackPose(el, 'prev', i, STACK_LAYER_OPACITY[i] ?? 0.4))
    nextStackEls.forEach((el, i) => setStackPose(el, 'next', i, STACK_LAYER_OPACITY[i] ?? 0.4))
    $gsap.set([travelInEl.value, travelOutEl.value], { opacity: 0 })
    $gsap.set(captionEl.value, { opacity: 1 })
    return
  }

  // Entrada: fila de letras atravessa a tela, depois cartão principal, cantos e
  // legenda nascem fechados/invisíveis e assentam. toggleActions (em vez de
  // once) faz a entrada TOCAR AO CONTRÁRIO quando o scroll volta pra cima —
  // fotos/legenda somem e a fila de letras atravessa de novo, na direção oposta.
  const rainPieces = Array.from(rainEl.value?.querySelectorAll<HTMLElement>('.rain-piece') ?? [])
  // Cada peça ganha x espalhado pela largura toda, y de partida próprio (alturas
  // diferentes acima do topo, não uma fileira única) e rotação aleatória (letras:
  // recorte torto, mesma ideia do .ransom-letter do Cover). Só client-side, sem
  // problema de hydration. Pré-posicionadas fora da tela pra não piscar no canto
  // superior esquerdo (posição natural do span) um frame antes do scroll disparar.
  $gsap.set(rainPieces, {
    x: () => $gsap.utils.random(0, stageWidth),
    y: () => -stageHeight * $gsap.utils.random(0.2, 1.2),
    rotation: () => entrance === 'confetti' ? $gsap.utils.random(0, 360) : $gsap.utils.random(-35, 35)
  })
  $gsap.set(safelightEl.value, { opacity: 0 })

  const isMobile = stageWidth < 640
  const passScale = isMobile ? PASS_SCALE_MOBILE : PASS_SCALE_DESKTOP
  const reelEls = Array.from(stageEl.value!.querySelectorAll<HTMLElement>('.reel-print'))
  // Todos esses elementos têm origem no centro da cena, então "fora da tela"
  // é meia largura do stage + a maior largura possível de uma cópia (mesmo
  // max-w do <img>: min(48vw|62vw, 28rem)).
  const maxPrintWidth = Math.min(window.innerWidth * (isMobile ? 0.48 : 0.62), 448)
  const offRight = stageWidth / 2 + maxPrintWidth
  const offLeft = -offRight
  // Cópias passam numa faixa próxima ao centro, com leve variação
  // de altura pra não parecer uma régua.
  const passY = (k: number) => [0, -0.06, 0.05, -0.03, 0.07, -0.05, 0.02, -0.07][k % 8]! * stageHeight

  // Pose de repouso das pilhas guardada em dataset pra o tween com stagger
  // usar valor-por-alvo quando as reais formam o carrossel. zIndex já nasce
  // no valor de repouso e NUNCA muda: pirâmide (centro z-20 no photoStageEl,
  // camada 0 = 3, camada 2 = 1).
  ;(['prev', 'next'] as const).forEach((side) => {
    const els = side === 'prev' ? prevStackEls : nextStackEls
    els.forEach((el, i) => {
      if (!el) return
      const pose = stackPose(side, i)
      el.dataset.poseX = String(pose.x)
      el.dataset.poseY = String(pose.y)
      el.dataset.poseRotation = String(pose.rotation)
      el.dataset.poseScale = String(pose.scale)
      el.dataset.poseOpacity = String(STACK_LAYER_OPACITY[i] ?? 0.4)
      $gsap.set(el, { xPercent: -50, yPercent: -50, zIndex: pose.zIndex })
    })
  })
  // Cópias esperando além da borda direita.
  $gsap.set(reelEls, {
    xPercent: -50,
    yPercent: -50,
    x: offRight,
    y: (k: number) => passY(k),
    rotation: (k: number) => (k % 2 ? -1 : 1) * PASS_TILT_DEG,
    scale: passScale,
    opacity: 0
  })
  // Reais esperando além da borda direita, já na altura da própria pose.
  // Pré-decodifica as fotos: sem isso o navegador decodificava cada uma no
  // quadro em que entrava na tela.
  const stackFormEls = [2, 1, 0].flatMap(i => [nextStackEls[i], prevStackEls[i]]) as HTMLElement[]
  ;[...reelEls, ...stackFormEls, photoCardEl.value].forEach(el => el.querySelector('img')?.decode().catch(() => {}))
  $gsap.set(stackFormEls, {
    x: offRight,
    y: (_i: number, target: Element) => poseFromDataset(target, 'poseY'),
    rotation: (_i: number, target: Element) => poseFromDataset(target, 'poseRotation'),
    scale: (_i: number, target: Element) => poseFromDataset(target, 'poseScale'),
    opacity: 0
  })
  $gsap.set(photoCardEl.value, { x: offRight, y: 0, rotation: PASS_TILT_DEG, scale: passScale, opacity: 0 })
  // Sem arrasto até a fila se desfazer: o drag usa quickTo em x/y/rotation do
  // mesmo cartão que a timeline anima — liberar só no fim garante que o
  // quickTo sempre parte de x:0/y:0/rotation:0. A timeline devolve 'none' no reverse.
  $gsap.set(photoStageEl.value, { pointerEvents: 'none' })
  $gsap.set([travelInEl.value, travelOutEl.value], { xPercent: -50, yPercent: -50, opacity: 0 })
  $gsap.set(captionEl.value, { opacity: 0, y: 16 })

  // 'top top' faz essa entrada disparar exatamente quando o Cover (100vh, sem
  // pin) termina de rolar pra fora — o mesmo ponto de scroll em que o texto do
  // Cover (CoverSection.vue) termina de encolher/sumir. Handoff sincronizado
  // sem precisar acoplar os dois componentes diretamente.
  const tl = $gsap.timeline({
    scrollTrigger: {
      trigger: sectionEl.value,
      // 'top 2px' (não 'top top' exato): no celular (DPR 3) o scroll-snap
      // assenta exatamente no offset da seção, e o start fracionário do
      // ScrollTrigger às vezes fica um subpixel além — a entrada não disparava.
      start: 'top 2px',
      toggleActions: 'play reverse play reverse'
    }
  })

  if (entrance === 'letters') {
    // Queda reta (y) com leve deriva lateral (x relativo) e rotação contínua
    // somada à inicial (tombando/rodopiando, não só caindo reto). stagger "from:
    // random" + duration por letra tira a sincronia, tipo chuva de verdade.
    // Curta (0.7–1.1s) e atrás das cópias (z auto < z das pilhas).
    tl.to(rainPieces, {
      y: () => stageHeight * 1.3,
      x: () => `+=${$gsap.utils.random(-50, 50)}`,
      rotation: () => `+=${$gsap.utils.random(-40, 40)}`,
      duration: () => $gsap.utils.random(0.7, 1.1),
      ease: 'power1.in',
      stagger: { each: 0.008, from: 'random' }
    }, 0)
  } else if (entrance === 'confetti') {
    // Confete cai mais devagar que as letras, deriva mais pros lados e gira no
    // eixo X também — é o rotationX que faz o papelzinho "piscar" virando.
    tl.to(rainPieces, {
      y: () => stageHeight * 1.2,
      x: () => `+=${$gsap.utils.random(-120, 120)}`,
      rotation: () => `+=${$gsap.utils.random(-540, 540)}`,
      rotationX: () => `+=${$gsap.utils.random(360, 1080)}`,
      duration: () => $gsap.utils.random(1.3, 2),
      ease: 'sine.in',
      stagger: { each: 0.006, from: 'random' }
    }, 0)
  }

  // Luz de segurança acende como lâmpada velha: pisca, cai, firma.
  tl.to(safelightEl.value, { opacity: 0.85, duration: 0.07, ease: 'none' }, 0.2)
    .to(safelightEl.value, { opacity: 0.25, duration: 0.09, ease: 'none' }, 0.27)
    .to(safelightEl.value, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.36)

  if (entrance === 'reel') {
    // Passagem: cópias com foto atravessam a tela inteira, uma atrás da
    // outra. Aparecem/somem fora da tela (opacidade só troca lá fora).
    tl.addLabel('pass', 0.3)
      .set(reelEls, { opacity: 1 }, 'pass')
      .to(reelEls, { x: offLeft, duration: PASS_DURATION, ease: 'power1.inOut', stagger: PASS_STAGGER }, 'pass')
      .set(reelEls, { opacity: 0 }, `pass+=${(REEL_COUNT - 1) * PASS_STAGGER + PASS_DURATION}`)
      // Formação logo atrás da última cópia que passa.
      .addLabel('form', `pass+=${(REEL_COUNT - 2) * PASS_STAGGER + PASS_DURATION * 0.5}`)
  } else {
    // Sem passagem: as reais entram enquanto a chuva ainda cai.
    tl.addLabel('form', RAIN_FORM_AT)
  }

  // Formação: as reais entram pela direita e param nas poses — fundo das
  // pilhas primeiro, topo por último, cópia central junto das camadas da frente.
  tl.set(stackFormEls, { opacity: (_i: number, target: Element) => poseFromDataset(target, 'poseOpacity') }, 'form')
    .to(stackFormEls, {
      x: (_i: number, target: Element) => poseFromDataset(target, 'poseX'),
      duration: FORM_DURATION,
      ease: 'expo.out',
      stagger: FORM_STAGGER
    }, 'form')
    .set(photoCardEl.value, { opacity: 1 }, `form+=${FORM_STAGGER * 4}`)
    .to(photoCardEl.value, { x: 0, rotation: 0, scale: 1, duration: FORM_DURATION, ease: 'expo.out' }, `form+=${FORM_STAGGER * 4}`)
    .to(captionEl.value, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, `form+=${FORM_STAGGER * 4 + 0.3}`)
    // Arrasto liberado só com tudo pousado (fim da timeline); no reverse volta a 'none'.
    .set(photoStageEl.value, { pointerEvents: 'auto' })
}

// Arraste de cópia na mesa: puxa o dedo/mouse, o cartão segue 1:1 com leve giro —
// solta com pouca força/distância e ele volta pro centro com folga elástica
// (back.out); solta com força, a troca vira uma travessia física na mesma
// timeline: a foto do topo da pilha de destino sai do canto e pousa reta no
// centro enquanto a foto que estava no centro migra pro fundo da pilha oposta
// (commitStackTransition) — velocidade real do gesto (mapRange+clamp) define
// duração/arco de AMBAS as viagens, não só da que sai. A legenda nunca participa
// disso — fica fixa, só as fotos se movem.
const THROW_DISTANCE = 60 // px de arrasto mínimos pra soltar já contar como arremesso
const THROW_VELOCITY = 0.35 // px/ms mínimos pra contar como arremesso rápido

// Flip 3D do cartão: um mini-timeline (levanta levemente → gira no eixo Y →
// assenta) em vez de só animar rotationY direto — o pequeno scale-up no meio
// do giro é o que faz o cartão ler como um objeto físico levantando da mesa
// pra virar, não uma textura sendo espelhada no lugar. Reduced motion pula
// direto pro estado final (duration 0), sem o levante. flipTween guardado
// separado de activeTween (drag/arremesso) — são independentes, matar um não
// deve cancelar o outro.
const isFlipped = ref(false)
let flipTween: { kill: () => void } | null = null

// Rótulo "veja o verso da foto": em seções com áudio, só depois que
// audioTime passa de 0 (áudio já começou a tocar pelo menos uma vez) — em
// seções sem áudio não existe "início" pra esperar, então nasce visível.
// Continua visível depois de virar a foto (não some mais) — só o TEXTO
// troca (flipHintLabel), pra sempre dar a ação certa: "veja o verso" antes
// de virar, "veja a foto" depois, o ícone servindo o tempo todo de volta.
const showFlipHint = computed(() => !(props.contributor.audio || props.contributor.video) || audioTime.value > 0)
const flipHintLabel = computed(() => isFlipped.value ? 'veja a foto' : 'veja o verso da foto')

function toggleFlip() {
  if (!photoCardEl.value || isDragging.value) return
  isFlipped.value = !isFlipped.value
  flipTween?.kill()

  const targetRotation = isFlipped.value ? 180 : 0
  if ($prefersReducedMotion?.()) {
    $gsap.set(photoCardEl.value, { rotationY: targetRotation })
    return
  }

  const tl = $gsap.timeline()
  tl.to(photoCardEl.value, { scale: 1.05, duration: 0.3, ease: 'power2.out' }, 0)
    .to(photoCardEl.value, { rotationY: targetRotation, duration: 0.65, ease: 'power2.inOut' }, 0)
    .to(photoCardEl.value, { scale: 1, duration: 0.3, ease: 'power2.in' }, 0.35)
  flipTween = tl
}

const isDragging = ref(false)
let startX = 0
let startY = 0
let startTime = 0
let dragDx = 0
let dragDy = 0
let activeTween: { progress: (value: number) => unknown, kill: () => void } | null = null

// gsap.quickTo — um tween reaproveitado por propriedade em vez de recriar tween
// a cada pointermove (gsap-performance oficial: followers de ponteiro em alta
// frequência devem usar quickTo). Instanciados uma vez em onMounted. Só o
// cartão central usa quickTo: as pilhas também levam `scale`/`rotation` num
// $gsap.set combinado a cada troca (setStackPose), e misturar isso com quickTo
// na MESMA propriedade corrompe o cache interno do quickTo (warning "not
// eligible for reset") — por isso o hover das pilhas usa gsap.to comum.
type QuickSetter = ((value: number) => void) & { tween: { pause: () => void } }
let cardXTo: QuickSetter, cardYTo: QuickSetter, cardRotTo: QuickSetter

// Tween de hover vivo por camada — guardado pra poder matar ao soltar. O
// último pointermove cria um tween que só grava o valor inicial no PRÓXIMO
// tick; o `set(opacity: 0)` da troca roda antes, então o hover "nascia" em 0
// e subia até 1, trazendo a foto puxada de volta ao bolo durante a viagem
// (duplicada). overwrite:'auto' não pega esse caso (tween ainda não começou).
const peekTweens = new Map<HTMLElement, { kill: () => void }>()

function setPeekHover(el: HTMLElement | null, scale: number, opacity: number) {
  if (!el) return
  peekTweens.get(el)?.kill()
  peekTweens.set(el, $gsap.to(el, { scale, opacity, duration: 0.3, ease: 'power2' }))
}

function killPeekHover() {
  peekTweens.forEach(tween => tween.kill())
  peekTweens.clear()
}

function onPointerDown(e: PointerEvent) {
  if (!photoCardEl.value || !photoStageEl.value || isFlipped.value) return
  isDragging.value = true
  startX = e.clientX
  startY = e.clientY
  startTime = performance.now()
  // progress(1) ANTES do kill — não só matar. `.kill()` sozinho interrompe a
  // travessia sem disparar o onComplete de commitStackTransition, que é quem
  // faz advanceCarousel (avança o índice/deque de verdade). Arrastar de novo
  // rápido (antes da troca anterior terminar, comportamento normal de quem
  // arrasta várias vezes seguidas) matava a troca no meio: current/deque
  // ficavam parados na foto de ANTES, e a próxima troca pegava essa mesma
  // foto de novo — lido como "sempre volta pra mesma foto" (bug reportado).
  // progress(1) força a timeline a saltar pro fim (dispara onComplete de
  // verdade) antes de matá-la, então toda troca commitada sempre termina de
  // avançar o carrossel, mesmo interrompida por um novo arrasto.
  activeTween?.progress(1)
  activeTween?.kill()
  try {
    // Sem ponteiro ativo (ex.: eventos sintéticos de teste), a captura falha —
    // não é fatal, só perdemos o reforço de continuar recebendo move/up fora
    // do elemento; o arraste em si não depende dela.
    photoStageEl.value.setPointerCapture(e.pointerId)
  } catch {
    // ignora
  }
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value || !photoCardEl.value) return
  dragDx = e.clientX - startX
  dragDy = e.clientY - startY
  cardXTo(dragDx)
  cardYTo(dragDy)
  cardRotTo($gsap.utils.clamp(-16, 16, dragDx * 0.07))

  // As pilhas reagem ao arrasto antes de qualquer coisa trocar — dão a pista
  // visual de qual pilha está prestes a ceder a foto do topo.
  const frontOpacity = STACK_LAYER_OPACITY[0] ?? 0.9
  const pull = $gsap.utils.clamp(0, 1, Math.abs(dragDx) / 150)
  const towardNext = dragDx < 0
  setPeekHover(nextStackEls[0], towardNext ? STACK_SCALE + pull * 0.12 : STACK_SCALE, towardNext ? frontOpacity + pull * (1 - frontOpacity) : frontOpacity)
  setPeekHover(prevStackEls[0], towardNext ? STACK_SCALE : STACK_SCALE + pull * 0.12, towardNext ? frontOpacity : frontOpacity + pull * (1 - frontOpacity))
}

// Avança o carrossel um passo no sentido da pilha de destino: a frente dela
// vira a atual e a antiga atual vira o TOPO da pilha oposta (current/prevDeque/
// nextDeque são computed de currentIndex, ver carouselWindow).
function advanceCarousel(destSide: 'prev' | 'next') {
  currentIndex.value = step(currentIndex.value, destSide, photoPool.value.length)

  // Toda foto nova entra de frente — sem isso, trocar de contribuidor com o
  // cartão virado deixaria o texto do PRÓXIMO já visível antes do usuário
  // clicar o ícone de novo.
  if (isFlipped.value) {
    isFlipped.value = false
    flipTween?.kill()
    $gsap.set(photoCardEl.value, { rotationY: 0 })
  }
}

// Fallback sério pro prefers-reduced-motion: sem arco, sem física, sem pouso
// imperfeito — troca de estado + crossfade simples no cartão central, pilhas
// reposicionadas direto (gsap.set, sem tween).
function reducedMotionCommit(destSide: 'prev' | 'next') {
  if (!photoCardEl.value) return
  const oppositeSide: 'prev' | 'next' = destSide === 'next' ? 'prev' : 'next'
  advanceCarousel(destSide)

  $gsap.set(photoCardEl.value, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 0 })
  nextTick(() => {
    if (!photoCardEl.value) return
    activeTween = $gsap.to(photoCardEl.value, { opacity: 1, duration: 0.25, ease: 'power1.out' })
  })

  const destSideEls = destSide === 'next' ? nextStackEls : prevStackEls
  const oppositeSideEls = destSide === 'next' ? prevStackEls : nextStackEls
  destSideEls.forEach((el, i) => setStackPose(el, destSide, i, STACK_LAYER_OPACITY[i] ?? 0.4))
  oppositeSideEls.forEach((el, i) => setStackPose(el, oppositeSide, i, STACK_LAYER_OPACITY[i] ?? 0.4))
}

// A travessia física de verdade: dois viajantes (mesma caixa das
// pilhas e do centro) percorrem, NA MESMA TIMELINE, trajetos opostos —
// keyframes com um ponto intermediário elevado (arco) em vez de x/y/rotation/
// scale instantâneos. Duração e altura do arco herdam a velocidade real do
// gesto (mapRange+clamp), igual ao arremesso já fazia pra x/y.
function commitStackTransition(destSide: 'prev' | 'next', duration: number, velocity: number) {
  if (!photoCardEl.value || !travelInEl.value || !travelOutEl.value || !travelInImgEl.value || !travelOutImgEl.value) return

  if ($prefersReducedMotion?.()) {
    reducedMotionCommit(destSide)
    return
  }

  const destDeque = destSide === 'next' ? nextDeque : prevDeque
  const destEls = destSide === 'next' ? nextStackEls : prevStackEls
  const oppositeSide: 'prev' | 'next' = destSide === 'next' ? 'prev' : 'next'
  const oppositeEls = destSide === 'next' ? prevStackEls : nextStackEls
  const destFront = destEls[0]
  if (!destFront) return

  const incomingPhoto = destDeque.value[0]
  const oldCurrent = current.value
  if (!incomingPhoto) return

  // Continuação do gesto: o viajante que sai do centro parte de onde o dedo
  // largou o cartão, não de um reset em (0,0).
  const startX = Number($gsap.getProperty(photoCardEl.value, 'x')) || 0
  const startY = Number($gsap.getProperty(photoCardEl.value, 'y')) || 0
  const startRotation = Number($gsap.getProperty(photoCardEl.value, 'rotation')) || 0

  const inStart = stackPose(destSide, 0)
  const inEnd = { x: 0, y: 0, rotation: $gsap.utils.random(-4, 4), scale: 1 }
  // A foto que sai do centro pousa no TOPO (camada 0) da pilha oposta — é ela
  // que volta se o usuário arrastar pro outro lado (antes mirava o fundo).
  const outEnd = stackPose(oppositeSide, 0)
  const dirSign = destSide === 'next' ? 1 : -1
  const arcHeight = $gsap.utils.clamp(30, 90, $gsap.utils.mapRange(THROW_VELOCITY, 1.4, 30, 90, velocity))

  travelInImgEl.value.src = incomingPhoto.photo
  travelInImgEl.value.alt = incomingPhoto.name
  travelOutImgEl.value.src = oldCurrent.photo
  travelOutImgEl.value.alt = oldCurrent.name

  // O cartão central e a camada de topo da pilha de destino somem por baixo —
  // quem assume a cena visualmente são os viajantes, nas mesmas poses exatas.
  $gsap.set(photoCardEl.value, { opacity: 0 })
  $gsap.set(destFront, { opacity: 0 })
  $gsap.set(travelInEl.value, { xPercent: -50, yPercent: -50, opacity: 1, ...inStart })
  $gsap.set(travelOutEl.value, { xPercent: -50, yPercent: -50, opacity: 1, x: startX, y: startY, rotation: startRotation, scale: 1 })

  const tl = $gsap.timeline({
    onComplete: () => {
      advanceCarousel(destSide)
      $gsap.set([travelInEl.value, travelOutEl.value], { opacity: 0 })
      $gsap.set(photoCardEl.value, { x: 0, y: 0, rotation: $gsap.utils.random(-4, 4), scale: 1, opacity: 0 })
      destEls.forEach((el, i) => setStackPose(el, destSide, i, STACK_LAYER_OPACITY[i] ?? 0.4))
      oppositeEls.forEach((el, i) => setStackPose(el, oppositeSide, i, STACK_LAYER_OPACITY[i] ?? 0.4))
      // O <img> do cartão central só troca de src depois que Vue reagir à
      // mudança de `current` — espera o próximo tick pra não piscar a foto
      // antiga por um frame com opacidade já em 1.
      nextTick(() => {
        $gsap.set(photoCardEl.value, { opacity: 1 })
      })
    }
  })

  // Arco em dois tempos (sobe até um ponto intermediário elevado, depois desce
  // pousando) em vez de `keyframes` — GSAP acusa "scale not eligible for
  // reset" ao misturar keyframes com scale nesses viajantes; dois .to()
  // posicionados na timeline dão o mesmo arco sem o aviso.
  const riseDuration = duration * 0.55
  const fallDuration = duration * 0.45

  tl.to(travelInEl.value, {
    x: (inStart.x + inEnd.x) / 2,
    y: (inStart.y + inEnd.y) / 2 - arcHeight,
    rotation: (inStart.rotation + inEnd.rotation) / 2,
    scale: Math.max(inStart.scale, inEnd.scale) * 1.08,
    duration: riseDuration,
    ease: 'power2.out'
  }, 0)
  tl.to(travelInEl.value, {
    x: inEnd.x,
    y: inEnd.y,
    rotation: inEnd.rotation,
    scale: inEnd.scale,
    duration: fallDuration,
    ease: 'power2.inOut'
  }, riseDuration)

  tl.to(travelOutEl.value, {
    x: (startX + outEnd.x) / 2 + dirSign * 40,
    y: (startY + outEnd.y) / 2 - arcHeight * 0.7,
    rotation: (startRotation + outEnd.rotation) / 2,
    scale: 0.62,
    duration: riseDuration,
    ease: 'power2.out'
  }, 0)
  tl.to(travelOutEl.value, {
    x: outEnd.x,
    y: outEnd.y,
    rotation: outEnd.rotation,
    scale: outEnd.scale,
    duration: fallDuration,
    ease: 'power2.inOut'
  }, riseDuration)

  // As pilhas acompanham a troca: a oposta desce uma camada (abre o topo pra
  // foto que chega; a mais funda some) e a de destino sobe uma (ocupa o lugar
  // da frente que saiu). No onComplete setStackPose devolve cada elemento à
  // própria camada já com a foto deslocada pelo currentIndex — mesma imagem na
  // mesma pose, então a troca de src não aparece. zIndex fica fora do tween
  // (não interpola) e overwrite mata o hover do arrasto nesses elementos.
  const shiftLayer = (el: HTMLElement | null, side: 'prev' | 'next', toLayer: number) => {
    if (!el) return
    const { zIndex: _zIndex, ...pose } = stackPose(side, toLayer)
    tl.to(el, { ...pose, opacity: STACK_LAYER_OPACITY[toLayer] ?? 0, duration, ease: 'power2.inOut', overwrite: 'auto' }, 0)
  }
  oppositeEls.forEach((el, i) => shiftLayer(el, oppositeSide, i + 1))
  destEls.forEach((el, i) => i > 0 && shiftLayer(el, destSide, i - 1))

  activeTween = tl
}

// Toque = soltou quase no mesmo lugar e rápido: abre a foto em tela cheia.
const TAP_DISTANCE = 8
const TAP_DURATION = 350

function onPointerUp(e?: PointerEvent) {
  if (!isDragging.value || !photoCardEl.value) return
  isDragging.value = false
  // Soltou: o cartão para de seguir o ponteiro. Num arremesso rápido os
  // quickTo ainda estavam no meio do caminho (~0.3s) e terminavam DEPOIS do
  // onComplete da troca, sobrescrevendo o x:0/rotation:0 — a nova foto
  // aparecia deslocada e torta. Pausar é seguro: o próximo pointermove chama
  // resetTo, que dá play de novo.
  ;[cardXTo, cardYTo, cardRotTo].forEach(follow => follow.tween.pause())

  const elapsed = Math.max(1, performance.now() - startTime)
  const distance = Math.hypot(dragDx, dragDy)
  const velocity = distance / elapsed
  const wantsNext = dragDx < 0
  // Sem carrossel (uma foto só) nunca há troca — o gesto só volta pro centro.
  const committed = hasCarousel.value && (distance > THROW_DISTANCE || velocity > THROW_VELOCITY)
  const isTap = e?.type === 'pointerup' && distance < TAP_DISTANCE && elapsed < TAP_DURATION
  killPeekHover()

  if (isTap) openLightbox()

  if (!committed) {
    // Folga: sem força/distância suficiente, a cópia desliza de volta pro
    // centro (papel na mesa não quica) — nada nas pilhas se move.
    const frontOpacity = STACK_LAYER_OPACITY[0] ?? 0.9
    setPeekHover(prevStackEls[0], STACK_SCALE, frontOpacity)
    setPeekHover(nextStackEls[0], STACK_SCALE, frontOpacity)
    activeTween = $gsap.to(photoCardEl.value, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: 'power3.out' })
    dragDx = 0
    dragDy = 0
    return
  }

  const throwDuration = $gsap.utils.clamp(0.28, 0.6, $gsap.utils.mapRange(THROW_VELOCITY, 1.4, 0.6, 0.28, velocity))
  commitStackTransition(wantsNext ? 'next' : 'prev', throwDuration, velocity)

  dragDx = 0
  dragDy = 0
}

onBeforeUnmount(() => {
  activeTween?.kill()
  flipTween?.kill()
  ctx?.revert()
  closeLightbox()
})
</script>

<style scoped>
/* Mensagem em vídeo no cartão: mesma caixa máxima das fotos (max-h/max-w do
   <img>), mas com a altura calculada pela proporção real (--video-ratio =
   altura/largura) — o cartão já nasce no tamanho certo antes do vídeo
   carregar, sem pular nem distorcer. object-fit cover com a proporção exata
   não corta nada; só garante que a capa preencha a caixa. */
/* Papel em branco enquanto a foto não chega: caixa 4:5 com a área da
   "emulsão" escura, mesmo tamanho máximo de uma foto em pé no cartão. */
.print-empty {
  position: relative;
  height: min(40dvh, calc(min(48vw, 28rem) * 1.25));
  aspect-ratio: 4 / 5;
  background: linear-gradient(155deg, #3a2a22 0%, #1f1612 60%, #120c0a 100%);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
}

@media (min-width: 640px) {
  .print-empty {
    height: min(64dvh, calc(min(62vw, 28rem) * 1.25));
  }
}

.print-video {
  display: block;
  position: relative;
  height: min(40dvh, calc(min(48vw, 28rem) * var(--video-ratio)));
  aspect-ratio: calc(1 / var(--video-ratio));
  object-fit: cover;
  background: #000;
}

@media (min-width: 640px) {
  .print-video {
    height: min(64dvh, calc(min(62vw, 28rem) * var(--video-ratio)));
  }
}

/* Vídeo em tela cheia: deixa espaço embaixo pra legenda. */
.lightbox-video {
  display: block;
  height: min(68dvh, calc((100vw - 4rem) * var(--video-ratio)));
  aspect-ratio: calc(1 / var(--video-ratio));
  background: #000;
}

@media (min-width: 640px) {
  .lightbox-video {
    height: min(74dvh, calc((100vw - 10rem) * var(--video-ratio)));
  }
}

/* Foto em tela cheia: fundo aparece em fade e a cópia cresce de leve até o
   tamanho final; fecha mais rápido do que abre. Movimento reduzido já é
   neutralizado pelo tailwind.css global. */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.lightbox-leave-active {
  transition-duration: 0.18s;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.lightbox-enter-active .lightbox-photo,
.lightbox-leave-active .lightbox-photo {
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

.lightbox-enter-from .lightbox-photo,
.lightbox-leave-to .lightbox-photo {
  transform: scale(0.94);
}

/* Crossfade simples (CSS, não GSAP — troca de texto por trecho não precisa da
   timeline de scroll/drag do resto do componente) entre um trecho da legenda
   e o próximo. prefers-reduced-motion já neutraliza via tailwind.css global. */
.caption-swap-enter-active,
.caption-swap-leave-active {
  transition: opacity 0.35s ease-out;
}

.caption-swap-enter-from,
.caption-swap-leave-to {
  opacity: 0;
}

/* Sombra mais forte só nas duas faces do cartão central — destaca "a cópia
   da frente" do bolo atrás, que usa a sombra padrão mais fraca do `.print`
   (tailwind.css). Fica nas FACES (não no photoCardEl) porque a sombra precisa
   girar junto com cada lado no flip 3D. */
.print--lifted {
  box-shadow:
    0 10px 18px -8px rgba(0, 0, 0, 0.55),
    0 32px 60px -20px rgba(0, 0, 0, 0.85);
}

/* Luz de segurança: halo vinho centrado na cópia central (mesmo anchor
   top-[38%] mobile / top-1/2 desktop do template). Só opacidade anima. */
.safelight {
  background: radial-gradient(70% 52% at 50% 38%, rgba(90, 10, 8, 0.28) 0%, rgba(50, 0, 0, 0.14) 45%, transparent 80%);
}

@media (min-width: 640px) {
  .safelight {
    background: radial-gradient(48% 70% at 50% 50%, rgba(90, 10, 8, 0.28) 0%, rgba(50, 0, 0, 0.14) 45%, transparent 80%);
  }
}

/* Flip 3D do cartão: photoCardEl (o pai) é quem recebe a
   animação de `rotationY` via GSAP (toggleFlip) — precisa de preserve-3d pra
   propagar o espaço 3D pros filhos, e o próprio wrapper da foto (o segundo
   nível, `aspect-[4/5]`) também, senão o back-face-visibility dos dois
   `.flip-face` (foto e verso) é calculado num plano achatado e os dois
   ficam sempre visíveis ao mesmo tempo em vez de se esconderem alternados. */
.flip-3d {
  transform-style: preserve-3d;
}

.flip-face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.flip-face--back {
  transform: rotateY(180deg);
}
</style>
