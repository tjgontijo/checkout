'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Control } from 'react-hook-form';
import { ProductFormValues } from '../../ProductForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Edit, Plus, Trash2 } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Tipo para as props do componente
interface ProductCheckoutTabProps {
  control: Control<ProductFormValues>; // Adicionado control
  checkouts?: {
    id: string;
    name: string;
    offerName: string;
    previewUrl?: string;
  }[];
}

export function ProductCheckoutTab({ control, checkouts = [] }: ProductCheckoutTabProps) {
  const [showNewCheckoutForm, setShowNewCheckoutForm] = useState(false);
  return (
    <div className="space-y-8">
      {/* Seção de Checkouts Existentes */}
      <Card className="overflow-hidden border border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/30 bg-muted/20 px-6 py-5">
          <CardTitle className="text-lg font-medium">Checkouts Existentes</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Páginas de checkout configuradas para este produto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {checkouts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Nenhum checkout configurado</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Clique no botão abaixo para criar seu primeiro checkout
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {checkouts.map((checkout) => (
                <CheckoutCard key={checkout.id} checkout={checkout} />
              ))}
            </div>
          )}

          {!showNewCheckoutForm ? (
            <Button className="mt-4 w-full" onClick={() => setShowNewCheckoutForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Novo Checkout
            </Button>
          ) : (
            <div className="mt-6 space-y-4 rounded-md border p-4">
              <h4 className="font-medium">Novo Checkout</h4>
              <FormField
                control={control}
                name="newCheckoutName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Checkout</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Checkout Principal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowNewCheckoutForm(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    // Aqui viria a lógica para adicionar o checkout
                    // Por exemplo, pegar o valor de field.value e fazer uma chamada API
                    // Depois limpar o campo: control.setValue('newCheckoutName', '');
                    setShowNewCheckoutForm(false);
                  }}
                >
                  Adicionar Checkout
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seção de Modelos de Checkout */}
      <Card className="overflow-hidden border border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/30 bg-muted/20 px-6 py-5">
          <CardTitle className="text-lg font-medium">Modelos de Checkout</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Modelos pré-definidos para criação rápida
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <CheckoutTemplateCard
              name="Padrão"
              description="Layout padrão com campos essenciais"
              imageSrc="/images/checkout-template-1.jpg"
            />
            <CheckoutTemplateCard
              name="Minimalista"
              description="Layout simplificado e direto"
              imageSrc="/images/checkout-template-2.jpg"
            />
            <CheckoutTemplateCard
              name="Completo"
              description="Layout com todos os recursos"
              imageSrc="/images/checkout-template-3.jpg"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para exibir um card de checkout existente
function CheckoutCard({
  checkout,
}: {
  checkout: { id: string; name: string; offerName: string; previewUrl?: string };
}) {
  return (
    <div className="overflow-hidden rounded-lg border shadow-sm">
      {checkout.previewUrl && (
        <div className="relative aspect-video bg-muted">
          <Image
            src={checkout.previewUrl}
            alt={checkout.name}
            className="h-full w-full object-cover"
            width={300}
            height={200}
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-medium">{checkout.name}</h3>
        <p className="text-sm text-muted-foreground">Oferta: {checkout.offerName}</p>

        <div className="mt-4 flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Edit className="mr-2 h-3 w-3" />
            Editar
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Copy className="mr-2 h-3 w-3" />
            Duplicar
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Componente para exibir um card de modelo de checkout
function CheckoutTemplateCard({
  name,
  description,
  imageSrc,
}: {
  name: string;
  description: string;
  imageSrc: string;
}) {
  return (
    <div className="group cursor-pointer overflow-hidden rounded-lg border shadow-sm transition-colors hover:border-primary/50">
      <div className="relative aspect-video bg-muted">
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="secondary" size="sm">
            <Plus className="mr-2 h-3 w-3" />
            Usar este modelo
          </Button>
        </div>
        <Image src={imageSrc} alt={name} className="h-full w-full object-cover" width={300} height={200} />
      </div>
      <div className="p-4">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
