import Link from "next/link"
import { 
  CalendarCheck, 
  Users, 
  BarChart2, 
  Zap, 
  Shield, 
  Globe 
} from "lucide-react"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'

const features = [
  {
    icon: CalendarCheck,
    title: "Gestão de Eventos",
    description: "Crie, gerencie e acompanhe eventos de forma simples e intuitiva."
  },
  {
    icon: Users,
    title: "Inscrições Online",
    description: "Processo de inscrição totalmente digitalizado e automatizado."
  },
  {
    icon: BarChart2,
    title: "Relatórios Detalhados",
    description: "Análises e relatórios em tempo real para tomada de decisão."
  },
  {
    icon: Zap,
    title: "Eficiência",
    description: "Automatize processos e reduza trabalho manual."
  },
  {
    icon: Shield,
    title: "Segurança",
    description: "Dados protegidos com criptografia e controles de acesso."
  },
  {
    icon: Globe,
    title: "Acessibilidade",
    description: "Plataforma responsiva, acessível de qualquer dispositivo."
  }
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="bg-background">
          {/* Hero Section */}
          <section className="relative w-full bg-primary/5">
            <div className="container mx-auto px-4 py-32 lg:py-48 text-center">
              <Badge variant="secondary" className="mb-4">
                Em Desenvolvimento
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
                Simplifique a Gestão dos Seus <span className="text-primary">Eventos</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                O Sistema de Gestão de Eventos oferece uma solução completa para organização, 
                inscrição e acompanhamento de eventos de forma eficiente e moderna.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 rounded-3xl">
                  <Link href="/auth/signin">
                    Começar Agora
                  </Link>
                </Button>              
              </div>
            </div>
          </section>

          {/* Recursos */}
          <section className="container mx-auto px-4 py-16 lg:py-24 bg-muted/10" id="recursos">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Recursos que Transformam sua Gestão de Eventos
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Descubra como o SGE pode revolucionar a forma como você organiza e gerencia eventos
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card 
                  key={feature.title} 
                  className="hover:shadow-lg transition-all duration-300 hover:border-primary/50"
                >
                  <CardHeader>
                    <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 text-primary">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Chamada para Ação */}
          <section className="relative w-full bg-primary/5 mb-16" id="contato">
            <div className="container mx-auto px-4 py-16 lg:py-24 text-center rounded-3xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Transforme Seus Eventos Hoje
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Não perca mais tempo com processos manuais. Experimente o SGE e leve a gestão 
                dos seus eventos para o próximo nível.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 rounded-3xl">
                  <Link href="/auth/signup">
                    Iniciar Gratuitamente
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
