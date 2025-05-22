'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, ExternalLink, Link, Trash2 } from 'lucide-react';
import { FormLabel } from '@/components/ui/form';

// Tipo para as props do componente
interface ProductLinksTabProps {
  // control: Control<ProductFormValues>; // Removido control
  productLinks?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
}

export function ProductLinksTab({ productLinks = [] }: ProductLinksTabProps) {
  const [newRedirectUrl, setNewRedirectUrl] = useState('');

  // Função para copiar link para a área de transferência
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Aqui poderia mostrar uma notificação de sucesso
  };

  return (
    <div className="space-y-8">
      {/* Seção de Links Existentes */}
      <Card className="overflow-hidden border border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/30 bg-muted/20 px-6 py-5">
          <CardTitle className="text-lg font-medium">Links Existentes</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Links de vendas e checkouts gerados para o produto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="divide-y rounded-md border">
            {/* Link da página de vendas */}
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium">Página de Vendas</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copyToClipboard('https://lp.profdidatica.com.br/missao-literaria')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="break-all text-sm text-muted-foreground">
                https://lp.profdidatica.com.br/missao-literaria
              </p>
            </div>

            {/* Links de checkout para cada oferta */}
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium">Checkout - Oferta Padrão</h3>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      copyToClipboard('https://checkout.profdidatica.com.br/missao-literaria')
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      window.open('https://checkout.profdidatica.com.br/missao-literaria', '_blank')
                    }
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="break-all text-sm text-muted-foreground">
                https://checkout.profdidatica.com.br/missao-literaria
              </p>
            </div>

            {/* Links gerados dinamicamente */}
            {productLinks.map((link) => (
              <div key={link.id} className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium">{link.name}</h3>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(link.url)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="break-all text-sm text-muted-foreground">{link.url}</p>
                <p className="mt-1 text-xs text-muted-foreground">Tipo: {link.type}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seção para gerar novo link */}
      <Card className="overflow-hidden border border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/30 bg-muted/20 px-6 py-5">
          <CardTitle className="text-lg font-medium">Gerar Novo Link de Redirecionamento</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Crie links personalizados para redirecionamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium">URL de Destino</FormLabel>
            <div className="flex gap-2">
              <Input
                placeholder="https://exemplo.com/destino"
                className="h-10 transition-colors focus-visible:ring-1"
                value={newRedirectUrl}
                onChange={(e) => setNewRedirectUrl(e.target.value)}
              />
              <Button
                onClick={() => { /* Lógica para gerar o link com newRedirectUrl */ }}
                className="h-10 whitespace-nowrap bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
              >
                <Link className="mr-2 h-4 w-4" />
                Gerar Link
              </Button>
            </div>
          </div>

          {/* Exemplo de link gerado */}
          <div className="mt-6 rounded-md border bg-muted/20 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium">Link Gerado</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => copyToClipboard('https://pay.checkout.com/abc123')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">URL Original:</p>
                <p className="break-all text-sm">https://exemplo.com/destino</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Slug Gerado:</p>
                <p className="break-all text-sm font-medium">https://pay.checkout.com/abc123</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
