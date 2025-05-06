"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

/**
 * Verificar se o usuário é administrador
 * Retorna os dados do usuário se ele tiver permissão
 * Lança um erro se o usuário não estiver autenticado ou não tiver permissão
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Você precisa estar autenticado para realizar esta ação");
  }

  // Buscar o usuário completo do banco, incluindo roles e permissões
  const userWithRoles = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      roles: {
        include: {
          permissions: {
            include: {
              permission: true
            }
          }
        }
      }
    }
  });

  if (!userWithRoles) {
    throw new Error("Usuário não encontrado");
  }

  // Verificar se o usuário tem permissão de administrador
  const isAdmin = userWithRoles.roles.some((role) =>
    role.permissions.some((rp) =>
      rp.permission.name === "admin" ||
      rp.permission.name === "menu.manage"
    )
  );

  if (!isAdmin) {
    throw new Error("Você não tem permissão para gerenciar menus");
  }

  // Retornar o usuário completo, garantindo que o id estará disponível
  return userWithRoles;
}

/**
 * Registrar ação no log de auditoria
 */
export async function logAudit(userId: string, action: string, description: string, metadata?: Record<string, unknown>) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      description,
      metadata: metadata ? JSON.stringify(metadata) : null,
    }
  });
}

/**
 * Revalida o cache de menus
 * Esta função deve ser chamada sempre que houver alterações nos menus
 * para garantir que as mudanças sejam refletidas em toda a aplicação
 */
export async function invalidateMenuCache() {
  revalidatePath("/dashboard/settings/menus");
  revalidateTag("menu");
  revalidateTag("navigation");
}

/**
 * Schema de validação para criação/atualização de itens de menu
 */
export const menuItemSchema = z.object({
  label: z.string().min(2, "O rótulo deve ter pelo menos 2 caracteres"),
  icon: z.string().optional().nullable(),
  href: z.string().optional().nullable(),
  order: z.coerce.number().int().min(0, "A ordem deve ser um número positivo"),
  parentId: z.string().optional().nullable(),
  showInMenu: z.coerce.boolean().default(true),
  permissionId: z.string().optional().nullable(),
});
