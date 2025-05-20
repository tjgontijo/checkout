"use server";

import { prisma } from "@/lib/prisma";

export type DeleteProductResponse = {
  success: boolean;
  message: string;
};

export async function deleteProduct(formData: FormData): Promise<DeleteProductResponse> {
  try {
    const productId = formData.get("productId");

    if (!productId) {
      return {
        success: false,
        message: "ID do produto não fornecido",
      };
    }

    // Verificar se o produto existe
    const product = await prisma.product.findUnique({
      where: {
        id: Number(productId),
      },
    });

    if (!product) {
      return {
        success: false,
        message: "Produto não encontrado",
      };
    }

    // Verificar se o produto está sendo usado em algum checkout
    const checkoutsCount = await prisma.checkout.count({
      where: {
        productId: Number(productId),
      },
    });

    if (checkoutsCount > 0) {
      return {
        success: false,
        message: "Este produto não pode ser excluído pois está sendo usado em checkouts",
      };
    }

    // Verificar se o produto está sendo usado em algum pedido
    const ordersCount = await prisma.order.count({
      where: {
        productId: Number(productId),
      },
    });

    if (ordersCount > 0) {
      return {
        success: false,
        message: "Este produto não pode ser excluído pois está associado a pedidos",
      };
    }

    // Realizar exclusão lógica (soft delete)
    await prisma.product.update({
      where: {
        id: Number(productId),
      },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Produto excluído com sucesso",
    };
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    return {
      success: false,
      message: "Ocorreu um erro ao excluir o produto. Tente novamente mais tarde.",
    };
  }
}
