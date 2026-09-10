<template>
  <div class="font-sans antialiased text-fg">
    <main class="py-16">
      <div class="container mx-auto px-4 max-w-4xl">
        <!-- Cabeçalho -->
        <div class="mb-12">
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm text-link hover:text-link-hover font-medium mb-6 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Voltar ao início
          </NuxtLink>
          <h1 class="text-3xl md:text-4xl font-bold text-fg mb-3">Política de Cookies</h1>
          <p class="text-sm text-fg-subtle font-medium">Última atualização: {{ lastUpdated }}</p>
        </div>

        <!-- Conteúdo -->
        <div class="prose-legal">

          <!-- 1. O Que São Cookies -->
          <section class="legal-section">
            <h2>1. O Que São Cookies</h2>
            <p>
              Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita um site.
              Eles permitem que o site reconheça seu dispositivo e lembre informações sobre sua visita,
              como suas preferências e configurações. Cookies são amplamente utilizados para fazer sites
              funcionarem de forma mais eficiente e fornecer informações aos proprietários do site.
            </p>
          </section>

          <!-- 2. Como Usamos Cookies -->
          <section class="legal-section">
            <h2>2. Como Usamos Cookies</h2>
            <p>
              Utilizamos cookies para garantir o funcionamento adequado deste site e, com seu consentimento
              prévio, para mensurar e analisar o tráfego (cookies analíticos) e a efetividade de campanhas
              de marketing (cookies de marketing). <strong>Cookies analíticos e de marketing só são ativados
              após o seu consentimento expresso</strong>, conforme exigido pela LGPD.
            </p>
          </section>

          <!-- 3. Categorias de Cookies -->
          <section class="legal-section">
            <h2>3. Categorias de Cookies</h2>

            <div class="overflow-x-auto mt-4">
              <table>
                <thead>
                  <tr>
                    <th>Categoria</th>
                    <th>Descrição</th>
                    <th>Consentimento</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Essenciais</strong></td>
                    <td>Necessários para o funcionamento básico do site (sessão, segurança, preferência de consentimento LGPD).</td>
                    <td>Não necessário (legítimo interesse)</td>
                  </tr>
                  <tr>
                    <td><strong>Analíticos</strong></td>
                    <td>Mensuração de audiência, páginas mais visitadas, tempo de navegação e comportamento do usuário.</td>
                    <td>Sim — necessário</td>
                  </tr>
                  <tr>
                    <td><strong>Marketing</strong></td>
                    <td>Rastreamento para campanhas publicitárias, remarketing e mensuração de conversões.</td>
                    <td>Sim — necessário</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- 4. Lista Detalhada -->
          <section class="legal-section">
            <h2>4. Lista de Cookies Utilizados</h2>

            <h3 class="text-sm font-bold text-fg-muted uppercase tracking-wider mt-6 mb-3">Cookies Essenciais</h3>
            <div class="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Provedor</th>
                    <th>Finalidade</th>
                    <th>Tipo</th>
                    <th>Duração</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>app:lgpd:consent</code></td>
                    <td>{{ orgName }} (1ª parte)</td>
                    <td>Armazena a preferência de consentimento do usuário sobre cookies</td>
                    <td>LocalStorage</td>
                    <td>Persistente</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 class="text-sm font-bold text-fg-muted uppercase tracking-wider mt-8 mb-3">Cookies Analíticos</h3>
            <div class="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Provedor</th>
                    <th>Finalidade</th>
                    <th>Tipo</th>
                    <th>Duração</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>_ga</code></td>
                    <td>Google LLC</td>
                    <td>Distinguir usuários únicos para mensuração de audiência</td>
                    <td>Persistente</td>
                    <td>2 anos</td>
                  </tr>
                  <tr>
                    <td><code>_gid</code></td>
                    <td>Google LLC</td>
                    <td>Identificar sessão de navegação do usuário</td>
                    <td>Persistente</td>
                    <td>24 horas</td>
                  </tr>
                  <tr>
                    <td><code>_gat</code></td>
                    <td>Google LLC</td>
                    <td>Limitar a taxa de requisições ao Google Analytics</td>
                    <td>Sessão</td>
                    <td>1 minuto</td>
                  </tr>
                  <tr>
                    <td><code>_clck</code></td>
                    <td>Microsoft Corporation</td>
                    <td>Identificador único de usuário do Microsoft Clarity</td>
                    <td>Persistente</td>
                    <td>1 ano</td>
                  </tr>
                  <tr>
                    <td><code>_clsk</code></td>
                    <td>Microsoft Corporation</td>
                    <td>Vincula visualizações de página em uma sessão Clarity</td>
                    <td>Persistente</td>
                    <td>1 dia</td>
                  </tr>
                  <tr>
                    <td><code>MUID</code></td>
                    <td>Microsoft Corporation</td>
                    <td>Identificador Microsoft cross-site usado por Clarity e Bing</td>
                    <td>Persistente</td>
                    <td>13 meses</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 class="text-sm font-bold text-fg-muted uppercase tracking-wider mt-8 mb-3">Cookies de Marketing</h3>
            <div class="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Provedor</th>
                    <th>Finalidade</th>
                    <th>Tipo</th>
                    <th>Duração</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>_fbp</code></td>
                    <td>Meta Platforms Inc.</td>
                    <td>Rastreamento de conversões e remarketing do Meta Pixel</td>
                    <td>Persistente</td>
                    <td>90 dias</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p class="text-sm text-fg-subtle mt-4 italic">
              Nota: os cookies analíticos e de marketing listados acima representam os que podem ser utilizados neste site.
              Eles só serão ativados após o seu consentimento expresso através do banner de cookies.
            </p>
          </section>

          <!-- 5. Cookies de Terceiros -->
          <section class="legal-section">
            <h2>5. Cookies de Terceiros</h2>
            <p>
              Terceiros (como os provedores de analytics e atendimento listados abaixo) podem gravar seus
              próprios cookies ao interagir com funcionalidades incorporadas neste site. A {{ orgName }} não
              controla esses cookies diretamente. Para mais informações sobre como cada terceiro trata seus
              dados, consulte suas respectivas políticas de privacidade:
            </p>
            <ul>
              <li v-for="provider in providers" :key="provider.name">
                <a :href="provider.policyUrl" target="_blank" rel="noopener noreferrer" class="text-link underline hover:text-link-hover">{{ provider.name }} — Política de Privacidade</a>
              </li>
            </ul>
          </section>

          <!-- 6. Como Gerenciar -->
          <section class="legal-section">
            <h2>6. Como Gerenciar Suas Preferências</h2>
            <p>
              Ao visitar nosso site pela primeira vez, um banner de consentimento será exibido com três opções:
              <strong>Aceitar todos</strong> (libera cookies analíticos), <strong>Apenas essenciais</strong>
              (mantém o site funcionando, sem analytics) e <strong>Personalizar</strong>
              (abre um painel onde você pode habilitar ou desabilitar cada categoria individualmente).
              Caso recuse os cookies analíticos, nenhum script do Google Analytics ou Microsoft Clarity será carregado
              e o site continuará funcionando normalmente.
            </p>
            <p>Você também pode gerenciar cookies diretamente pelo seu navegador:</p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" class="text-link underline hover:text-link-hover">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/pt-BR/kb/protecao-aprimorada-contra-rastreamento" target="_blank" rel="noopener noreferrer" class="text-link underline hover:text-link-hover">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/pt-br/guide/safari/sfri11471" target="_blank" rel="noopener noreferrer" class="text-link underline hover:text-link-hover">Safari</a></li>
              <li><a href="https://support.microsoft.com/pt-br/microsoft-edge/excluir-cookies-no-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" class="text-link underline hover:text-link-hover">Microsoft Edge</a></li>
            </ul>
          </section>

          <!-- 7. Como Revogar -->
          <section class="legal-section">
            <h2>7. Como Revogar Seu Consentimento</h2>
            <p>
              Você pode revogar seu consentimento a qualquer momento de uma das seguintes formas:
            </p>
            <ul>
              <li>Limpando os cookies do navegador e recarregando o site — o banner de consentimento será exibido novamente.</li>
              <li>Removendo o armazenamento local (<code>app:lgpd:consent</code>) pelas ferramentas de desenvolvedor do navegador.</li>
              <li>Entrando em contato conosco pelo e-mail <a :href="`mailto:${company.dpo?.email}`" class="text-link underline hover:text-link-hover">{{ company.dpo?.email }}</a>.</li>
            </ul>
            <p>
              A revogação terá efeito imediato para novos cookies. Os cookies já gravados serão
              excluídos automaticamente pelo navegador após sua expiração, ou podem ser removidos
              manualmente pelas configurações do navegador.
            </p>
          </section>

          <!-- 8. Contato -->
          <section class="legal-section">
            <h2>8. Contato</h2>
            <p>
              Para dúvidas sobre nossa Política de Cookies, entre em contato:
            </p>
            <div class="bg-surface rounded-2xl border border-border p-6 mt-4">
              <p class="font-bold text-fg mb-1">{{ orgName }}</p>
              <p class="text-sm text-fg-subtle">
                E-mail: <a :href="`mailto:${company.dpo?.email}`" class="text-link underline hover:text-link-hover">{{ company.dpo?.email }}</a>
              </p>
              <p class="text-sm text-fg-subtle mt-1">
                {{ company.address?.street }}, {{ company.address?.neighborhood }},
                {{ company.address?.city }} – {{ company.address?.state }},
                CEP {{ company.address?.postalCode }}
              </p>
            </div>
            <p class="mt-4 text-sm text-fg-subtle">
              Para informações completas sobre como tratamos seus dados pessoais, consulte nossa
              <NuxtLink to="/privacidade" class="text-link underline hover:text-link-hover font-medium">Política de Privacidade</NuxtLink>.
            </p>
          </section>

          <!-- 9. Vigência -->
          <section class="legal-section">
            <h2>9. Data de Vigência</h2>
            <p>
              Esta Política de Cookies entra em vigor na data de sua publicação e permanece
              válida por tempo indeterminado, até que seja atualizada ou substituída.
            </p>
          </section>

        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
interface AnalyticsProvider {
  name: string
  country: string
  purpose: string
  policyUrl: string
}

const appConfig = useAppConfig()
const company = computed(() => appConfig.company || {})
const orgName = computed(() => company.value?.name)

// Substitua pela data real da última revisão deste documento.
const lastUpdated = '1 de janeiro de 2026'

// Provedores terceiros lidos de useAppConfig().analytics.providers, com fallback
// genérico para o stack de analytics/contato deste projeto base.
const DEFAULT_PROVIDERS: AnalyticsProvider[] = [
  { name: 'Google LLC', country: 'EUA', purpose: 'Analytics (Google Analytics 4) e Search Console', policyUrl: 'https://policies.google.com/privacy' },
  { name: 'Microsoft Corporation', country: 'EUA', purpose: 'Mapas de calor e gravações de sessão (Microsoft Clarity)', policyUrl: 'https://privacy.microsoft.com/pt-br/privacystatement' },
  { name: 'WhatsApp LLC / Meta Platforms Inc.', country: 'EUA', purpose: 'Canal de atendimento comercial', policyUrl: 'https://www.whatsapp.com/legal/privacy-policy' }
]

const providers = computed<AnalyticsProvider[]>(() =>
  appConfig.analytics?.providers?.length ? appConfig.analytics.providers : DEFAULT_PROVIDERS
)

useSeoMeta({
  title: 'Política de Cookies',
  description: 'Saiba como utilizamos cookies neste site, suas finalidades, categorias e como você pode gerenciar suas preferências (LGPD).',
  robots: 'index, follow'
})

useHead({
  htmlAttrs: { lang: 'pt-BR' }
})
</script>

<style scoped>
.prose-legal h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-fg);
  margin-bottom: 0.75rem;
}

.legal-section {
  margin-bottom: 2.5rem;
}

.legal-section p {
  color: var(--color-fg-muted);
  font-size: 0.9375rem;
  line-height: 1.75;
  margin-bottom: 0.75rem;
}

.legal-section ul,
.legal-section ol {
  color: var(--color-fg-muted);
  font-size: 0.9375rem;
  line-height: 1.75;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}

.legal-section ul {
  list-style-type: disc;
}

.legal-section ol {
  list-style-type: decimal;
}

.legal-section li {
  margin-bottom: 0.375rem;
}

.legal-section table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.legal-section th {
  background-color: var(--color-surface);
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 700;
  color: var(--color-fg);
  border-bottom: 1px solid var(--color-border);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.legal-section td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-fg-muted);
  vertical-align: top;
}

.legal-section tr:last-child td {
  border-bottom: none;
}

.legal-section code {
  background-color: var(--color-surface-2);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.8125rem;
  color: var(--color-accent);
}
</style>
