"use server";

import { prisma } from "@/lib/prisma";

export type CreateProductResponse = {
  success: boolean;
  message: string;
  productId?: number;
};

export type CreateProductData = {
  name: string;
  description: string;
  price: number;
  salesPageUrl: string;
};

export async function createProduct(formData: FormData): Promise<CreateProductResponse> {
  try {
    // Extrair dados do formulário
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const salesPageUrl = formData.get("salesPageUrl") as string;

    // Validar dados obrigatórios
    if (!name || !description || !priceStr || !salesPageUrl) {
      return {
        success: false,
        message: "Todos os campos são obrigatórios",
      };
    }

    // Converter e validar o preço
    const price = parseFloat(priceStr.replace(",", "."));
    if (isNaN(price) || price <= 0) {
      return {
        success: false,
        message: "O preço deve ser um valor numérico positivo",
      };
    }

    // Validar URL da página de vendas
    let isValidUrl = false;
    try {
      new URL(salesPageUrl);
      isValidUrl = true;
    } catch {
      // Captura erro sem usar variável
    }
    
    if (!isValidUrl) {
      return {
        success: false,
        message: "A URL da página de vendas é inválida",
      };
    }

    // Criar o produto no banco de dados
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        salesPageUrl,
        priceCurrency: "BRL", // Valor padrão para moeda
        isActive: true,
      },
    });

    return {
      success: true,
      message: "Produto criado com sucesso",
      productId: product.id,
    };
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return {
      success: false,
      message: "Ocorreu um erro ao criar o produto. Tente novamente mais tarde.",
    };
  }
}
