'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';



import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
// Função para criar um produto via API
async function createProduct(formData: FormData) {
  const response = await fetch('/api/products', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao criar produto');
  }

  return data;
}

// Esquema de validação com Zod
const productSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  price: z.string().refine(
    (value) => {
      const numValue = parseFloat(value.replace(',', '.'));
      return !isNaN(numValue) && numValue > 0;
    },
    {
      message: 'O preço deve ser um valor numérico positivo',
    }
  ),
  salesPageUrl: z.string().url('URL inválida. Inclua http:// ou https://'),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface CreateProductDialogProps {
  onSuccess?: () => void;
}

export function CreateProductDialog({ onSuccess }: CreateProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Função para controlar a abertura/fechamento do diálogo
  const handleOpenChange = (open: boolean) => {
    if (!isSubmitting) {
      setIsOpen(open);

      // Resetar o formulário quando o diálogo for fechado
      if (!open) {
        form.reset();
      }
    }
  };

  // Inicializar o formulário com React Hook Form + Zod
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      salesPageUrl: 'https://',
    },
  });

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      setIsSubmitting(true);

      // Preparar os dados do formulário
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('price', Math.floor(parseFloat(values.price.replace(',', '.')) * 100).toString());
      formData.append('priceCurrency', 'BRL');
      formData.append('salesPageUrl', values.salesPageUrl);
      formData.append('isActive', 'true');
      formData.append('storeId', '1'); // TODO: Obter o ID da loja do usuário logado

      await createProduct(formData);
      toast.success('Produto criado com sucesso!');
      handleOpenChange(false);
      form.reset();

      // Atualizar a página
      router.refresh();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao criar produto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" onClick={() => handleOpenChange(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para criar um novo produto.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva o produto" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (R$)</FormLabel>
                  <FormControl>
                    <Input placeholder="0,00" {...field} type="text" inputMode="decimal" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salesPageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Página de Vendas (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://exemplo.com/produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
