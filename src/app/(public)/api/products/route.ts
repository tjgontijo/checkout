import { prisma } from '@/lib/prisma'
import type { ProductWhereInput } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// ======================
// SCHEMAS + TIPOS
// ======================

// Criação de produto
const productSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  price: z.coerce.number().int().positive('O preço deve ser um valor inteiro positivo'),
  priceCurrency: z.string().length(3).default('BRL'),
  salesPageUrl: z.string().url('URL inválida'),
  isActive: z.boolean().default(true),
  storeId: z.string().min(1, 'ID da loja é obrigatório'),
  asset: z
    .object({
      bucket: z.string(),
      objectKey: z.string(),
      fileName: z.string(),
      fileSize: z.number().int().positive(),
      fileType: z.string(),
      expiryDays: z.number().int().positive().default(90),
    })
    .optional(),
})

type CreateProductDTO = z.infer<typeof productSchema>

// Consulta com paginação e filtros
const queryParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  isActive: z.enum(['true', 'false']).optional().transform((val) => val === 'true'),
  showDeleted: z.enum(['true', 'false']).optional().transform((val) => val === 'true'),
})

// ======================
// GET /api/products
// ======================
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const params = Object.fromEntries(url.searchParams)
    const { page, limit, search, sortBy, sortOrder, isActive, showDeleted } = queryParamsSchema.parse(params)

    const skip = (page - 1) * limit

    const where: ProductWhereInput = {}

    if (isActive !== undefined) where.isActive = isActive
    if (!showDeleted) where.deletedAt = null
    if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ]
      }

    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        productAsset: true,
        store: {
          select: { id: true, name: true },
        },
      },
      // Garante que as datas sejam retornadas como objetos Date
      // Isso é necessário para compatibilidade com o tipo esperado pelo componente
      // O Prisma já faz isso automaticamente, mas é bom garantir
    })

    const total = await prisma.product.count({ where })
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Erro ao buscar produtos' }, { status: 500 })
  }
}

// ======================
// POST /api/products
// ======================
export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const data: CreateProductDTO = productSchema.parse(json)

    const { asset, ...productData } = data

    const product = await prisma.product.create({
      data: {
        ...productData,
        productAsset: asset
          ? {
              create: { ...asset },
            }
          : undefined,
      },
      include: {
        productAsset: true,
        store: {
          select: { id: true, name: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: product }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Erro interno ao criar produto' }, { status: 500 })
  }
}
