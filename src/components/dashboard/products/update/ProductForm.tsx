'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductDetailHeader } from './ProductDetailHeader';

// Importação dos componentes de abas
import { ProductGeneralTab } from './tabs/general/ProductGeneralTab';
import { ProductConfigTab } from './tabs/config/ProductConfigTab';
import { ProductLinksTab } from './tabs/links/ProductLinksTab';
import { ProductCheckoutTab } from './tabs/checkout/ProductCheckoutTab';

// Schema para validação dos dados do produto
const productSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  price: z.coerce.number().min(0.01, 'O preço deve ser maior que zero'),
  priceCurrency: z.string().min(3, 'A moeda deve ter pelo menos 3 caracteres'),
  salesPageUrl: z.string().url('URL da página de vendas inválida'),
  isActive: z.boolean(),
  hasOffers: z.boolean().default(false),
  offers: z
    .array(
      z.object({
        name: z.string().min(3, 'O nome da oferta deve ter pelo menos 3 caracteres'),
        price: z.coerce.number().min(0.01, 'O preço deve ser maior que zero'),
        priceCurrency: z.string().min(3, 'A moeda deve ter pelo menos 3 caracteres'),
      })
    )
    .optional(),
  enableCustomThankYou: z.boolean().default(false),
  cardRedirectUrl: z
    .string()
    .url('URL de redirecionamento para cartão inválida')
    .optional()
    .nullable(),
  pixRedirectUrl: z.string().url('URL de redirecionamento para PIX inválida').optional().nullable(),
  newCheckoutName: z.string().optional(), // Campo para o nome do novo checkout
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    priceCurrency: string;
    salesPageUrl: string;
    isActive: boolean;
    cardRedirectUrl?: string | null;
    pixRedirectUrl?: string | null;
  };
  productId: string;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('geral');

  // Inicializar o formulário com os valores do produto
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      priceCurrency: product.priceCurrency || 'BRL',
      salesPageUrl: product.salesPageUrl,
      isActive: product.isActive,
      hasOffers: false, // Inicialmente sem ofertas
      offers: [], // Array vazio de ofertas
      enableCustomThankYou: !!product.cardRedirectUrl || !!product.pixRedirectUrl,
      cardRedirectUrl: product.cardRedirectUrl || '',
      pixRedirectUrl: product.pixRedirectUrl || '',
      newCheckoutName: '', // Valor inicial para o nome do novo checkout
    },
  });

  // Função para lidar com o envio do formulário
  async function onSubmit(formValues: ProductFormValues) {
    setIsSubmitting(true);

    try {
      // Aqui implementaremos a lógica de salvar o produto
      console.log('Produto atualizado:', formValues);
      // Simulação de sucesso
      setTimeout(() => {
        setIsSubmitting(false);
        router.refresh();
      }, 1000);
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Header fixo com botão de salvar */}
          <ProductDetailHeader
            description="Configure os detalhes e redirecionamentos do produto."
            isActive={product.isActive}
            onSave={form.handleSubmit(onSubmit)}
            isSaving={isSubmitting}
          />

          {/* Container principal com largura máxima */}
          <div className="mx-auto px-4 py-6">
            {/* Sistema de abas */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="mb-4 flex h-12 w-full items-center justify-between gap-2 rounded-md bg-muted p-1 text-muted-foreground">
                <TabsTrigger
                  value="geral"
                  className="flex-1 rounded-md px-0 py-2 text-base font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Geral
                </TabsTrigger>
                <TabsTrigger
                  value="configuracoes"
                  className="flex-1 rounded-md px-0 py-2 text-base font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Configurações
                </TabsTrigger>
                <TabsTrigger
                  value="links"
                  className="flex-1 rounded-md px-0 py-2 text-base font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Links
                </TabsTrigger>
                <TabsTrigger
                  value="checkout"
                  className="flex-1 rounded-md px-0 py-2 text-base font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Checkout
                </TabsTrigger>
              </TabsList>

              {/* Conteúdo das abas */}
              <TabsContent value="geral">
                <ProductGeneralTab control={form.control} />
              </TabsContent>

              <TabsContent value="configuracoes">
                <ProductConfigTab control={form.control} />
              </TabsContent>

              <TabsContent value="links">
                <ProductLinksTab />
              </TabsContent>

              <TabsContent value="checkout">
                <ProductCheckoutTab control={form.control} />
              </TabsContent>
            </Tabs>
          </div>
        </form>
      </Form>
    </div>
  );
}
