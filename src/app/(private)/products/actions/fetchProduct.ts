'use server';

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export async function fetchProduct(id: string) {
  try {
    // Buscar o produto pelo ID, incluindo as configurações de redirecionamento
    const product = await prisma.product.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        thankYouRedirect: true,
      },
    });

    // Se o produto não existir, retornar 404
    if (!product) {
      notFound();
    }

    return product;
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    throw new Error('Não foi possível buscar o produto. Tente novamente mais tarde.');
  }
}
