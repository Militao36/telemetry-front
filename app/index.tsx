import { ArrowRight, Database, Radio, Zap, Code2, BarChart3, Shield, Check } from "lucide-react"
import Link from "next/link"

export default function SitePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Radio className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">UnTelemetry</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition">
              Recursos
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition">
              Como funciona
            </a>
            <a href="#benefits" className="text-muted-foreground hover:text-foreground transition">
              Benefícios
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition">
              Preços
            </a>
            <Link href="/login">
              <button className="cursor-pointer bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition font-semibold">
                Começar agora
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="inline-block mb-6 px-4 py-2 bg-muted rounded-full">
            <p className="text-sm font-semibold text-accent text-gray-800">✨ Tecnologia OpenTelemetry integrada, onde está o OpenTelemetry nós estamos!</p>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance leading-tight">
            Veja tudo o que acontece <span className="text-primary">no seu sistema</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            Monitore queries, logs e requisições HTTP em um único lugar. Suporte para qualquer linguagem, qualquer banco
            de dados. Transparência total do seu fluxo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/login">
              <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:opacity-90 transition font-semibold text-lg inline-flex items-center justify-center gap-2 group">
                Começar gratuitamente
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <p className="text-4xl font-bold mb-2">100%</p>
              <p className="text-muted-foreground">Visibilidade do fluxo</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">Qualquer</p>
              <p className="text-muted-foreground">Linguagem suportada</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">Real-time</p>
              <p className="text-muted-foreground">Monitoramento contínuo</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">&lt;100ms</p>
              <p className="text-muted-foreground">Latência de dados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Recursos poderosos</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tudo que você precisa para entender completamente o comportamento do seu sistema em produção
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-muted/30 transition group">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Monitoramento de Queries</h3>
            <p className="text-muted-foreground">
              Capture cada query executada. SQL, NoSQL, qualquer banco. Veja performance e padrões em tempo real.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-muted/30 transition group">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
              <Radio className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Rastreamento HTTP</h3>
            <p className="text-muted-foreground">
              Trace cada requisição. Endpoints, métodos, status, tempos de resposta. Complete observabilidade.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-muted/30 transition group">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Agregação de Logs</h3>
            <p className="text-muted-foreground">
              Centralize logs de múltiplas fontes. Erro, warning, info. Busque e analise em segundos.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-muted/30 transition group">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Compatível com Tudo</h3>
            <p className="text-muted-foreground">
              Node.js, Python, Java, Go, Ruby, .NET. <strong>Se usa OpenTelemetry</strong>, nós suportamos.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-muted/30 transition group">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Dashboard Intuitivo</h3>
            <p className="text-muted-foreground">
              Visualizações claras. Gráficos em tempo real. Filtros poderosos.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-muted/30 transition group">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Segurança Primeiro</h3>
            <p className="text-muted-foreground">
              Dados criptografados. Acesso controlado. Em conformidade com padrões de segurança.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Como funciona</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Integração simples em 3 passos</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-4">
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary text-primary-foreground font-bold text-lg">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Instale o SDK</h3>
                  <p className="text-muted-foreground">
                    Adicione nosso SDK em sua aplicação em poucos minutos. Configuração mínima necessária.
                  </p>
                </div>
              </div>
              <div className="hidden md:block absolute top-20 right-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent transform translate-x-1/2"></div>
            </div>

            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary text-primary-foreground font-bold text-lg">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Comece a Rastrear</h3>
                  <p className="text-muted-foreground">
                    Sua aplicação envia dados automaticamente via OpenTelemetry. Sem código extra.
                  </p>
                </div>
              </div>
              <div className="hidden md:block absolute top-20 right-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent transform translate-x-1/2"></div>
            </div>

            <div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary text-primary-foreground font-bold text-lg">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Analise e Otimize</h3>
                  <p className="text-muted-foreground">
                    Use nosso dashboard para entender e otimizar cada parte do seu sistema.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Por que escolher a Telemetry?</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <span className="text-lg">Visibilidade 100% do fluxo da aplicação</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <span className="text-lg">Suporte para qualquer tecnologia e bancos* (SQL)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <span className="text-lg">Reduz tempo de debug e troubleshooting</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <span className="text-lg">Identifique gargalos de performance</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <span className="text-lg">Detecção automática de erros</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <span className="text-lg">Interface simples e poderosa</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-border">
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-4 border border-border hover:border-primary/50 transition">
                <p className="text-sm font-mono text-primary mb-2">$ npm install @telemetry/sdk</p>
                <p className="text-xs text-muted-foreground">Instalação super rápida</p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border hover:border-primary/50 transition">
                <p className="font-bold mb-2">Queries capturadas hoje</p>
                <p className="text-2xl font-mono text-primary">4.2M</p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border hover:border-primary/50 transition">
                <p className="font-bold mb-2">Tempo médio de trace</p>
                <p className="text-2xl text-gray-700 font-mono text-accent">23ms</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Planos Simples e Transparentes</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comece pequeno e escale conforme sua necessidade. Sem surpresas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Starter Plan */}
            <div className="border-2 border-primary rounded-2xl p-8 bg-background relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-bold rounded-bl-lg">
                MAIS POPULAR
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Plano Base</h3>
                <p className="text-muted-foreground">Perfeito para começar</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold">R$ 79,90</span>
                <span className="text-muted-foreground ml-2">/mês</span>
                <p className="text-sm text-muted-foreground mt-2">
                  Até <span className="font-semibold text-foreground">50.000 métricas</span> e{" "}
                  <span className="font-semibold text-foreground">50.000 logs</span>
                </p>
              </div>

              <Link href="/login">
                <button className="cursor-pointer w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold mb-8 hover:opacity-90 transition">
                  Começar Agora
                </button>
              </Link>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>50.000 métricas/mês</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>50.000 logs/mês</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Dashboard em tempo real</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Suporte por email</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>1 usuário</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>15 dias de retenção de dados</span>
                </li>
              </ul>
            </div>

            {/* Growth Plan */}
            <div className="border-2 border-primary rounded-2xl p-8 bg-background relative overflow-hidden">
              {/* Destaque visual */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Plano Crescimento</h3>
                <p className="text-muted-foreground">Para aplicações em expansão</p>
              </div>

              <div className="mb-8">
                <div className="space-y-2 mb-4">
                  <div>
                    <span className="text-5xl font-bold">R$ 99,90</span>
                    <span className="text-muted-foreground ml-2">/mês</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Escale sem limites. Adicione mais conforme cresce.</p>
              </div>

              <Link href="/login">
                <button className="cursor-pointer w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold mb-8 hover:opacity-90 transition">
                  Começar Agora
                </button>
              </Link>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>250.000 métricas/mês</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>250.000 logs/mês</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Dashboard em tempo real</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Suporte por email/WhatsApp</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Vários usuários</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Vários projetos</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>30 dias de retenção de dados</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Pronto para transparência total?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a desenvolvedores que confiam na Telemetry para entender seus sistemas em produção.
          </p>
          <Link href="/login">
            <button className="cursor-pointer bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:opacity-90 transition font-semibold text-lg inline-flex items-center justify-center gap-2 group">
              Comece sua jornada agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
          </Link>
          <p className="text-muted-foreground mt-6">14 dias grátis. Sem cartão de crédito.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                  <Radio className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold">Telemetry</span>
              </div>
              <p className="text-sm text-muted-foreground">Visibilidade completa para seus sistemas.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Recursos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Preços
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Documentação
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Termos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2025 Telemetry. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition">
                Twitter
              </a>
              <a href="#" className="hover:text-foreground transition">
                GitHub
              </a>
              <a href="#" className="hover:text-foreground transition">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
