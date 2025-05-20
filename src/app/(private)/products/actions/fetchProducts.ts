"use server";

import { prisma } from "@/lib/prisma";

export type ProductsResponse = {
  id: number;
  name: string;
  description: string;
  price: number;
  priceCurrency: string;
  salesPageUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type FetchProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
};

export async function fetchProducts({
  page = 1,
  limit = 10,
  search = "",
  sortBy = "createdAt",
  sortOrder = "desc",
  isActive,
}: FetchProductsParams = {}) {
  try {
    // Calcular o número de itens a pular para paginação
    const skip = (page - 1) * limit;

    // Construir o filtro de busca
    const where: {
      deletedAt: null;
      isActive?: boolean;
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
      }>;
    } = {
      deletedAt: null,
    };

    // Adicionar filtro de status ativo se fornecido
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Adicionar filtro de busca se fornecido
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Buscar produtos com contagem total
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          priceCurrency: true,
          salesPageUrl: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Calcular informações de paginação
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw new Error("Não foi possível buscar os produtos. Tente novamente mais tarde.");
  }
}
