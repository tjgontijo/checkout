import Link from 'next/link';
import { CalendarCheck, Users, BarChart2, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';

const features = [
  {
    icon: CalendarCheck,
    title: 'Gestão de Eventos',
    description: 'Crie, gerencie e acompanhe eventos de forma simples e intuitiva.',
  },
  {
    icon: Users,
    title: 'Inscrições Online',
    description: 'Processo de inscrição totalmente digitalizado e automatizado.',
  },
  {
    icon: BarChart2,
    title: 'Relatórios Detalhados',
    description: 'Análises e relatórios em tempo real para tomada de decisão.',
  },
  {
    icon: Zap,
    title: 'Eficiência',
    description: 'Automatize processos e reduza trabalho manual.',
  },
  {
    icon: Shield,
    title: 'Segurança',
    description: 'Dados protegidos com criptografia e controles de acesso.',
  },
  {
    icon: Globe,
    title: 'Acessibilidade',
    description: 'Plataforma responsiva, acessível de qualquer dispositivo.',
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="bg-background">
          {/* Hero Section */}
          <section className="relative w-full bg-primary/5">
            <div className="container mx-auto px-4 py-32 text-center lg:py-48">
              <Badge variant="secondary" className="mb-4">
                Em Desenvolvimento
              </Badge>
              <h1 className="mb-6 text-5xl font-bold text-foreground md:text-7xl">
                Simplifique a Gestão dos Seus <span className="text-primary">Eventos</span>
              </h1>
              <p className="mx-auto mb-8 max-w-3xl text-xl text-muted-foreground">
                O Sistema de Gestão de Eventos oferece uma solução completa para organização,
                inscrição e acompanhamento de eventos de forma eficiente e moderna.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild size="lg" className="rounded-3xl bg-primary hover:bg-primary/90">
                  <Link href="/signin">Começar Agora</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Recursos */}
          <section className="container mx-auto bg-muted/10 px-4 py-16 lg:py-24" id="recursos">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Recursos que Transformam sua Gestão de Eventos
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
                Descubra como o SGE pode revolucionar a forma como você organiza e gerencia eventos
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
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
          <section className="relative mb-16 w-full bg-primary/5" id="contato">
            <div className="container mx-auto rounded-3xl px-4 py-16 text-center lg:py-24">
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Transforme Seus Eventos Hoje
              </h2>
              <p className="mx-auto mb-8 max-w-3xl text-xl text-muted-foreground">
                Não perca mais tempo com processos manuais. Experimente o SGE e leve a gestão dos
                seus eventos para o próximo nível.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild size="lg" className="rounded-3xl bg-primary hover:bg-primary/90">
                  <Link href="/signup">Iniciar Gratuitamente</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
