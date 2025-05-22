'use client';

import { Control } from 'react-hook-form';
import { ProductFormValues } from '../ProductForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

// Tipo para as props do componente
interface ProductConfigTabProps {
  control: Control<ProductFormValues>;
}

export function ProductConfigTab({ control }: ProductConfigTabProps) {
  return (
    <div className="space-y-8">
      {/* Seção Página de Obrigado / Upsell */}
      <ThankYouSection control={control} />

      {/* Seção Order Bump */}
      <OrderBumpSection control={control} />
    </div>
  );
}

// Componente para a seção de página de obrigado/upsell
function ThankYouSection({ control }: { control: Control<ProductFormValues> }) {
  return (
    <Card className="overflow-hidden border border-border/40 shadow-sm">
      <CardHeader className="border-b border-border/30 bg-muted/20 px-6 py-5">
        <CardTitle className="text-lg font-medium">Página de Obrigado / Upsell</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Configure redirecionamentos após o pagamento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <FormField
          control={control}
          name="enableCustomThankYou"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel className="text-base font-medium">
                  Habilitar página de obrigado personalizada
                </FormLabel>
                <FormDescription className="text-sm text-muted-foreground">
                  Redirecione o cliente para uma página específica após o pagamento
                </FormDescription>
              </div>
              <FormControl>
                <div className="h-6 w-11 rounded-full bg-muted p-1 shadow-inner transition-colors data-[state=checked]:bg-primary">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                  <div className="h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Campos condicionais que aparecem quando enableCustomThankYou está ativo */}
        <div className="space-y-4 border-l-2 border-muted pl-4">
          <FormField
            control={control}
            name="pixRedirectUrl"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">URL para Pix</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://exemplo.com/obrigado-pix"
                    className="h-10 transition-colors focus-visible:ring-1"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground">
                  URL para redirecionar após pagamento via Pix
                </FormDescription>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="cardRedirectUrl"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">URL para Cartão de Crédito</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://exemplo.com/obrigado-cartao"
                    className="h-10 transition-colors focus-visible:ring-1"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground">
                  URL para redirecionar após pagamento via Cartão de Crédito
                </FormDescription>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para a seção de order bumps
function OrderBumpSection({ control }: { control: Control<ProductFormValues> }) {
  return (
    <Card className="overflow-hidden border border-border/40 shadow-sm">
      <CardHeader className="border-b border-border/30 bg-muted/20 px-6 py-5">
        <CardTitle className="text-lg font-medium">Order Bumps</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Configure produtos adicionais para oferecer no checkout
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Campo de formulário usando control */}
        <FormField
          control={control}
          name="hasOffers"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormLabel className="text-sm font-medium">Habilitar Order Bumps</FormLabel>
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Lista de order bumps existentes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-md border p-4">
            <div>
              <h5 className="font-medium">Produto Adicional 1</h5>
              <p className="text-sm text-muted-foreground">R$ 97,00</p>
            </div>
            <Button type="button" size="icon" variant="ghost">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Botão para adicionar novo order bump */}
        <Button variant="outline" className="w-full" onClick={() => {}}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar novo order bump
        </Button>
      </CardContent>
    </Card>
  );
}
