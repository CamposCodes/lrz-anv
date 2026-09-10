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
          <h1 class="text-3xl md:text-4xl font-bold text-fg mb-3">Política de Privacidade</h1>
          <p class="text-sm text-fg-subtle font-medium">Última atualização: {{ lastUpdated }}</p>
        </div>

        <!-- Conteúdo -->
        <div class="prose-legal">

          <!-- 1. Quem Somos -->
          <section class="legal-section">
            <h2>1. Quem Somos</h2>
            <p>
              Esta Política de Privacidade descreve como a <strong>{{ company.legalName || company.name || 'Sua Empresa' }}</strong>,<template v-if="company.cnpj">
              inscrita no CNPJ sob o nº <strong>{{ company.cnpj }}</strong>,</template>
              com sede em
              <strong>{{ company.address?.street }}, {{ company.address?.neighborhood }},
              {{ company.address?.city }} – {{ company.address?.state }},
              CEP {{ company.address?.postalCode }}</strong> ("Controlador"), coleta, utiliza,
              armazena e protege os dados pessoais dos visitantes deste site.
            </p>
            <p>
              Para quaisquer questões relacionadas a esta política, entre em contato pelo e-mail
              <a :href="`mailto:${company.dpo?.email}`" class="text-link underline hover:text-link-hover">{{ company.dpo?.email }}</a>.
            </p>
          </section>

          <!-- 2. Quais Dados Coletamos -->
          <section class="legal-section">
            <h2>2. Quais Dados Coletamos e Como</h2>
            <p>Mesmo sem formulários de cadastro, este site pode coletar automaticamente as seguintes categorias de dados pessoais:</p>
            <ul>
              <li><strong>Dados de navegação:</strong> endereço IP, tipo de navegador, sistema operacional, páginas visitadas, tempo de permanência e localização aproximada (derivada do IP).</li>
              <li><strong>Identificadores de cookies:</strong> IDs de sessão, identificadores analíticos do Google Analytics (ex.: <code>_ga</code>, <code>_gid</code>) e do Microsoft Clarity (ex.: <code>_clck</code>, <code>_clsk</code>, <code>MUID</code>), e eventuais identificadores de marketing, todos sujeitos ao seu consentimento.</li>
              <li><strong>Dados fornecidos voluntariamente:</strong> ao clicar no botão de WhatsApp e iniciar uma conversa, seu nome e número de telefone são compartilhados diretamente com a plataforma WhatsApp (Meta Platforms Inc.) e recebidos pela nossa equipe para fins de atendimento.</li>
            </ul>
          </section>

          <!-- 3. Finalidade e Base Legal -->
          <section class="legal-section">
            <h2>3. Para Que Usamos Seus Dados</h2>
            <p>Cada tratamento de dados possui uma finalidade específica e uma base legal correspondente, conforme o art. 7º da LGPD:</p>

            <div class="overflow-x-auto mt-4">
              <table>
                <thead>
                  <tr>
                    <th>Tratamento</th>
                    <th>Finalidade</th>
                    <th>Base Legal (art. 7º LGPD)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Logs de servidor</td>
                    <td>Segurança, auditoria e prevenção de fraudes</td>
                    <td>Legítimo interesse (inciso IX)</td>
                  </tr>
                  <tr>
                    <td>Cookies essenciais</td>
                    <td>Funcionamento básico do site (sessão, preferências de consentimento)</td>
                    <td>Legítimo interesse (inciso IX)</td>
                  </tr>
                  <tr>
                    <td>Cookies analíticos</td>
                    <td>Mensuração de audiência e melhoria contínua do site</td>
                    <td>Consentimento (inciso I)</td>
                  </tr>
                  <tr>
                    <td>Cookies de marketing</td>
                    <td>Mensuração de campanhas e remarketing</td>
                    <td>Consentimento (inciso I)</td>
                  </tr>
                  <tr>
                    <td>Atendimento via WhatsApp</td>
                    <td>Atendimento comercial e suporte ao cliente</td>
                    <td>Execução de contrato / diligências pré-contratuais (inciso V)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- 4. Prazo de Retenção -->
          <section class="legal-section">
            <h2>4. Por Quanto Tempo Guardamos Seus Dados</h2>
            <ul>
              <li><strong>Logs de servidor:</strong> até 6 meses, conforme art. 15 do Marco Civil da Internet (Lei 12.965/2014).</li>
              <li><strong>Dados de analytics:</strong> Google Analytics 4 — até 14 meses (configuração padrão); Microsoft Clarity — até 13 meses.</li>
              <li><strong>Dados de contato via WhatsApp:</strong> enquanto necessário para o atendimento, acrescido do prazo legal aplicável.</li>
              <li><strong>Cookies:</strong> conforme a duração de cada cookie, detalhada na nossa <NuxtLink to="/cookies" class="text-link underline hover:text-link-hover">Política de Cookies</NuxtLink>.</li>
            </ul>
          </section>

          <!-- 5. Compartilhamento -->
          <section class="legal-section">
            <h2>5. Com Quem Compartilhamos Seus Dados</h2>
            <p>Seus dados podem ser acessados pelos seguintes terceiros, estritamente para as finalidades descritas:</p>

            <div class="overflow-x-auto mt-4">
              <table>
                <thead>
                  <tr>
                    <th>Terceiro</th>
                    <th>País</th>
                    <th>Finalidade</th>
                    <th>Política de Privacidade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="provider in providers" :key="provider.name">
                    <td>{{ provider.name }}</td>
                    <td>{{ provider.country }}</td>
                    <td>{{ provider.purpose }}</td>
                    <td><a :href="provider.policyUrl" target="_blank" rel="noopener noreferrer" class="text-link underline">Ver política</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- 6. Transferência Internacional -->
          <section class="legal-section">
            <h2>6. Transferência Internacional de Dados</h2>
            <p>
              Seus dados pessoais podem ser processados em servidores localizados fora do Brasil,
              principalmente nos Estados Unidos. Essas transferências ocorrem para países com legislação
              reconhecida como adequada ou mediante salvaguardas contratuais (Cláusulas Contratuais Padrão),
              conforme exigido pela LGPD.
            </p>
          </section>

          <!-- 7. Direitos do Titular -->
          <section class="legal-section">
            <h2>7. Seus Direitos Como Titular</h2>
            <p>Conforme o art. 18 da LGPD, você tem direito a:</p>
            <ol>
              <li><strong>Confirmação</strong> — saber se seus dados estão sendo tratados por nós.</li>
              <li><strong>Acesso</strong> — obter uma cópia dos dados pessoais que possuímos sobre você.</li>
              <li><strong>Correção</strong> — retificar dados incompletos, inexatos ou desatualizados.</li>
              <li><strong>Anonimização, bloqueio ou eliminação</strong> — para dados desnecessários, excessivos ou tratados em desconformidade com a LGPD.</li>
              <li><strong>Portabilidade</strong> — receber seus dados em formato estruturado para transferência a outro fornecedor de serviço.</li>
              <li><strong>Eliminação</strong> — excluir dados pessoais tratados com base no seu consentimento, mediante solicitação.</li>
              <li><strong>Informação sobre compartilhamento</strong> — saber com quais terceiros seus dados foram compartilhados.</li>
              <li><strong>Informação sobre a possibilidade de não consentir</strong> — ser informado sobre as consequências da recusa de consentimento.</li>
              <li><strong>Revogação do consentimento</strong> — retirar seu consentimento a qualquer momento, sem custo.</li>
              <li><strong>Oposição</strong> — opor-se a tratamentos realizados com base em legítimo interesse, caso considere que seus direitos estão sendo violados.</li>
              <li><strong>Revisão de decisões automatizadas</strong> — solicitar a revisão de decisões tomadas exclusivamente por sistemas automatizados que afetem seus interesses.</li>
            </ol>
          </section>

          <!-- 8. Como Exercer Seus Direitos -->
          <section class="legal-section">
            <h2>8. Como Exercer Seus Direitos</h2>
            <p>
              Para exercer qualquer um dos direitos listados acima, envie um e-mail para
              <a :href="`mailto:${company.dpo?.email}`" class="text-link underline hover:text-link-hover font-medium">{{ company.dpo?.email }}</a>
              com o assunto "Exercício de Direitos LGPD", informando:
            </p>
            <ul>
              <li>Seu nome completo;</li>
              <li>O direito que deseja exercer;</li>
              <li>Uma descrição da sua solicitação.</li>
            </ul>
            <p>Responderemos à sua solicitação em até <strong>15 dias corridos</strong>, conforme as boas práticas recomendadas pela ANPD.</p>
          </section>

          <!-- 9. Cookies (Resumo) -->
          <section class="legal-section">
            <h2>9. Cookies</h2>
            <p>
              Este site utiliza cookies para garantir seu funcionamento adequado e, com seu consentimento,
              para fins de análise de tráfego e mensuração de campanhas. Para informações completas sobre
              os cookies utilizados, suas categorias, duração e como gerenciar suas preferências, consulte
              nossa <NuxtLink to="/cookies" class="text-link underline hover:text-link-hover font-medium">Política de Cookies</NuxtLink>.
            </p>
          </section>

          <!-- 10. Segurança dos Dados -->
          <section class="legal-section">
            <h2>10. Segurança dos Dados</h2>
            <p>
              Adotamos medidas técnicas e administrativas adequadas para proteger seus dados pessoais
              contra acessos não autorizados, destruição, perda, alteração ou qualquer forma de
              tratamento inadequado. Entre as medidas adotadas, destacam-se:
            </p>
            <ul>
              <li>Transmissão criptografada via HTTPS/TLS;</li>
              <li>Política de Segurança de Conteúdo (CSP) restritiva;</li>
              <li>Cabeçalhos de segurança HTTP configurados (X-XSS-Protection, Referrer-Policy, Permissions-Policy);</li>
              <li>Hospedagem em plataforma com certificações de segurança.</li>
            </ul>
            <p>
              Em caso de incidente de segurança que possa causar risco ou dano relevante aos titulares,
              comunicaremos a Autoridade Nacional de Proteção de Dados (ANPD) e os titulares afetados,
              conforme o art. 48 da LGPD.
            </p>
          </section>

          <!-- 11. WhatsApp -->
          <section class="legal-section">
            <h2>11. Uso do WhatsApp</h2>
            <p>
              Ao clicar no botão de contato via WhatsApp neste site, você será direcionado à plataforma
              WhatsApp, operada pela Meta Platforms Inc., sujeita à sua própria
              <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" class="text-link underline">Política de Privacidade</a>.
            </p>
            <p>Declaramos que:</p>
            <ul>
              <li>O WhatsApp é utilizado <strong>exclusivamente para atendimento comercial e suporte</strong> iniciado pelo próprio visitante.</li>
              <li>Não enviaremos mensagens não solicitadas (spam) ao seu número.</li>
              <li>Seu número de telefone não será adicionado a grupos ou listas de transmissão sem sua autorização expressa.</li>
              <li>Seu número não será compartilhado com terceiros para fins de marketing sem consentimento explícito.</li>
              <li>Históricos de conversa são armazenados apenas pelo tempo necessário ao atendimento, podendo ser excluídos mediante sua solicitação.</li>
            </ul>
          </section>

          <!-- 12. Alterações -->
          <section class="legal-section">
            <h2>12. Alterações Nesta Política</h2>
            <p>
              Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças
              em nossas práticas ou em exigências legais. A data da última atualização será sempre
              indicada no topo deste documento. Recomendamos que você revisite esta página periodicamente.
            </p>
          </section>

          <!-- 13. Contato e DPO -->
          <section class="legal-section">
            <h2>13. Contato e Encarregado de Dados (DPO)</h2>
            <p>
              O Encarregado pelo Tratamento de Dados Pessoais (DPO) da {{ company.name || 'Sua Empresa' }}, conforme
              o art. 41 da LGPD e a Resolução CD/ANPD nº 2/2022 para agentes de tratamento de pequeno porte, é:
            </p>
            <div class="bg-surface rounded-2xl border border-border p-6 mt-4">
              <p class="font-bold text-fg mb-1">{{ company.dpo?.name }}</p>
              <p class="text-sm text-fg-subtle">
                E-mail: <a :href="`mailto:${company.dpo?.email}`" class="text-link underline hover:text-link-hover">{{ company.dpo?.email }}</a>
              </p>
              <p class="text-sm text-fg-subtle mt-1">
                {{ company.address?.street }}, {{ company.address?.neighborhood }},
                {{ company.address?.city }} – {{ company.address?.state }},
                CEP {{ company.address?.postalCode }}
              </p>
            </div>
          </section>

          <!-- 14. Vigência -->
          <section class="legal-section">
            <h2>14. Data de Vigência</h2>
            <p>
              Esta Política de Privacidade entra em vigor na data de sua publicação e permanece
              válida por tempo indeterminado, até que seja atualizada ou substituída.
            </p>
          </section>

          <!-- Referências Legais -->
          <section class="legal-section border-t border-border pt-8 mt-12">
            <h2 class="text-base">Referências Legais</h2>
            <ul class="text-sm text-fg-subtle">
              <li>Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais (LGPD)</li>
              <li>Lei nº 12.965/2014 — Marco Civil da Internet</li>
              <li>Resolução CD/ANPD nº 2/2022 — Regulamento para agentes de tratamento de pequeno porte</li>
            </ul>
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
  title: 'Política de Privacidade',
  description: 'Saiba como coletamos, armazenamos e protegemos seus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD).',
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
