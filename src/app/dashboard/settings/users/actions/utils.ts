"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Verificar se o usuário possui uma permissão específica
 * @param permissionName Nome da permissão no formato 'recurso.ação'
 * @param errorMessage Mensagem de erro personalizada (opcional)
 * @returns Dados do usuário se ele tiver a permissão
 * @throws Error se o usuário não estiver autenticado ou não tiver permissão
 */
export async function requirePermission(permissionName: string, errorMessage?: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error("Você precisa estar autenticado para realizar esta ação");
  }
  
  // Verificar se o usuário tem a permissão necessária
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
  
  // Verificar se o usuário tem a permissão necessária
  const hasPermission = userWithRoles.roles.some((role: { permissions: Array<{ permission: { name: string } }> }) => 
    role.permissions.some((rp: { permission: { name: string } }) => 
      rp.permission.name === permissionName
    )
  );
  
  if (!hasPermission) {
    throw new Error(errorMessage || `Você não tem permissão para ${permissionName.replace('.', ' ')}`);
  }
  
  return session.user;
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
 * Revalida o cache de usuários
 */
export async function invalidateUserCache() {
  revalidatePath("/dashboard/settings/users");
}
