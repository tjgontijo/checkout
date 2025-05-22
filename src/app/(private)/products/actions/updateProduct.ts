'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Schema para validação dos dados do produto
const productSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  price: z.coerce.number().min(0.01, 'O preço deve ser maior que zero'),
  priceCurrency: z.string().min(3, 'A moeda deve ter pelo menos 3 caracteres'),
  salesPageUrl: z.string().url('URL da página de vendas inválida'),
  isActive: z.boolean(),
  cardRedirectUrl: z
    .string()
    .url('URL de redirecionamento para cartão inválida')
    .optional()
    .nullable(),
  pixRedirectUrl: z.string().url('URL de redirecionamento para PIX inválida').optional().nullable(),
});

export type UpdateProductFormData = z.infer<typeof productSchema>;

export async function updateProduct(id: string, formData: UpdateProductFormData) {
  try {
    // Validar os dados do formulário
    const validatedData = productSchema.parse(formData);

    // Extrair os dados de redirecionamento
    const { cardRedirectUrl, pixRedirectUrl, ...productData } = validatedData;

    // Verificar se o produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { thankYouRedirect: true },
    });

    if (!existingProduct) {
      throw new Error('Produto não encontrado');
    }

    // Atualizar o produto em uma transação
    await prisma.$transaction(async (tx) => {
      // Atualizar os dados básicos do produto
      await tx.product.update({
        where: { id },
        data: productData,
      });

      // Atualizar ou criar as configurações de redirecionamento
      if (existingProduct.thankYouRedirect) {
        await tx.productThankYouRedirect.update({
          where: { id: existingProduct.thankYouRedirect.id },
          data: {
            cardRedirectUrl,
            pixRedirectUrl,
          },
        });
      } else {
        await tx.productThankYouRedirect.create({
          data: {
            productId: id,
            cardRedirectUrl,
            pixRedirectUrl,
          },
        });
      }
    });

    // Revalidar a página de produtos para atualizar os dados em cache
    revalidatePath('/products');
    revalidatePath(`/products/${id}`);

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }

    return {
      success: false,
      errors: [
        {
          path: 'root',
          message: 'Não foi possível atualizar o produto. Tente novamente mais tarde.',
        },
      ],
    };
  }
}
