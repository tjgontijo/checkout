'use client';

import { Control, useWatch, useFieldArray } from 'react-hook-form';
import { ProductFormValues } from '../../ProductForm';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { maskCurrency, unmaskCurrency } from '@/lib/masks/curerncy';

interface ProductPriceSectionProps {
  control: Control<ProductFormValues>;
}

export function ProductPriceSection({ control }: ProductPriceSectionProps) {
  const hasOffers = useWatch({
    control,
    name: 'hasOffers',
    defaultValue: false,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'offers',
  });

  return (
    <section>
      <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          <h2 className="mb-4 text-lg font-medium">Preços</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <p className="text-sm text-gray-600">
                Configure o preço do produto e ofertas especiais.
              </p>
            </div>

            <div className="space-y-6 md:col-span-2">
              <FormField
                control={control}
                name="price"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">Preço do produto</FormLabel>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500">R$</span>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="0,00"
                          className="h-10 pl-10"
                          value={field.value ? maskCurrency(String(field.value), 'BRL') : ''}
                          onChange={(e) => {
                            const unmasked = unmaskCurrency(e.target.value, 'BRL');
                            field.onChange(Number(unmasked) / 100);
                          }}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="hasOffers"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm font-medium">Ofertas especiais</FormLabel>
                      <p className="text-xs text-gray-500">
                        Ofereça preços promocionais por tempo limitado
                      </p>
                    </div>
                    <FormControl>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {hasOffers && (
                <div className="space-y-6">
                  <h3 className="text-sm font-medium">Configurar ofertas</h3>
                  
                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Oferta {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <FormField
                            control={control}
                            name={`offers.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">Nome da oferta</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Ex: Black Friday"
                                    className="h-10"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex items-end space-x-2">
                          <div>
                            <FormField
                              control={control}
                              name={`offers.${index}.price`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormLabel className="mb-2 block text-sm font-medium">
                                    Preço
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500">R$</span>
                                      </div>
                                      <Input
                                        placeholder="0,00"
                                        className="h-10 w-full pl-10"
                                        value={field.value ? maskCurrency(String(field.value), (fields[index].priceCurrency || 'BRL') as 'BRL' | 'USD') : ''}
                                        onChange={(e) => {
                                          const unmasked = unmaskCurrency(e.target.value, (fields[index].priceCurrency || 'BRL') as 'BRL' | 'USD');
                                          field.onChange(Number(unmasked) / 100);
                                        }}
                                      />
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={() =>
                      append({
                        name: '',
                        price: 0,
                        priceCurrency: 'BRL',
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar oferta
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
