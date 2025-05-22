'use client';

import { Control } from 'react-hook-form';
import { ProductFormValues } from '../../ProductForm';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface ProductDetailsSectionProps {
  control: Control<ProductFormValues>;
}

export function ProductDetailsSection({ control }: ProductDetailsSectionProps) {
  // TODO: Adicionar estado e lógica para upload/remoção de imagem
  const hasImage = false; // Placeholder

  return (
    <section>
      <Card className="overflow-hidden border border-border/40 shadow-sm">
        <div className="p-6">
          <h2 className="mb-4 text-lg font-medium">Produto</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <p className="mb-2 text-sm text-gray-600">
                Você pode cadastrar o produto e já começar a vender.
              </p>
              <p className="text-sm text-gray-600">
                A imagem do produto será exibida na área de membros e no seu programa de afiliados.
              </p>
            </div>
            <div className="space-y-6 md:col-span-2">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">Nome do produto</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do produto"
                        className="h-10 transition-colors focus-visible:ring-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descrição do produto"
                        className="min-h-[120px] resize-y transition-colors focus-visible:ring-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="salesPageUrl"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">Página de vendas</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://exemplo.com/pagina-de-vendas"
                        className="h-10 transition-colors focus-visible:ring-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel className="text-sm font-medium">Imagem do produto</FormLabel>
                {hasImage ? (
                  <div className="relative">
                    <div className="group relative mb-2">
                      <Image
                        src="/placeholder-image.jpg" // Placeholder, substituir pela URL da imagem real
                        alt="Imagem do produto"
                        width={300}
                        height={250}
                        className="rounded-md border border-gray-200"
                      />
                      <button
                        className="absolute right-2 top-2 rounded-full bg-white/80 p-1 text-red-500 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
                        type="button"
                        aria-label="Remover imagem"
                        // onClick={handleRemoveImage} // Adicionar handler para remover imagem
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-8">
                    {/* TODO: Adicionar Input de arquivo para upload ou lógica de drag and drop */}
                    <div className="flex flex-col items-center text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <p className="mt-4 text-sm text-gray-500">
                        Arraste aqui ou{' '}
                        <span className="cursor-pointer text-blue-500">
                          selecione do computador
                        </span>
                      </p>
                    </div>
                  </div>
                )}
                <div className="mt-2 flex items-center">
                  <div className="flex w-full items-center border-l-4 border-amber-400 bg-amber-50 p-2 text-xs text-amber-700">
                    <span className="mr-1">⚠️</span> Tamanho recomendado: 300x250 pixels
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
