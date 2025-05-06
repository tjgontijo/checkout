"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requirePermission } from "@/lib/services/require-permission.service";
import { logAudit } from "@/lib/services/audit.service";
import { invalidateCache } from "@/lib/services/invalidate-user-cache.service";

// Schema de validação para atualização de role
const updateUserRoleSchema = z.object({
  userId: z.string().uuid(),
  roleId: z.string().uuid(),
});

/**
 * Server Action para atualizar a role de um usuário
 */
export async function updateUserRole(formData: FormData) {
  try {
    // Verificar permissões do usuário que está fazendo a alteração
    const adminUser = await requirePermission("users.update", "Você não tem permissão para gerenciar usuários");
    
    // Extrair e validar dados
    const userId = formData.get("userId") as string;
    const roleId = formData.get("roleId") as string;
    
    const validatedData = updateUserRoleSchema.parse({ userId, roleId });
    
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
      include: { roles: true }
    });
    
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    
    // Verificar se a role existe
    const role = await prisma.role.findUnique({
      where: { id: validatedData.roleId }
    });
    
    if (!role) {
      throw new Error("Perfil não encontrado");
    }
    
    // Atualizar a relação entre usuário e role
    // Primeiro, remover todas as roles existentes
    await prisma.user.update({
      where: { id: validatedData.userId },
      data: {
        roles: {
          disconnect: user.roles.map((role: { id: string }) => ({ id: role.id }))
        }
      }
    });
    
    // Depois, adicionar a nova role
    await prisma.user.update({
      where: { id: validatedData.userId },
      data: {
        roles: {
          connect: { id: validatedData.roleId }
        }
      }
    });
    
    // Registrar no audit log
    await logAudit(
      adminUser.id,
      "UPDATE_USER_ROLE",
      `Perfil do usuário ${user.fullName} alterado para: ${role.name}`,
      {
        targetUserId: user.id,
        previousRoles: user.roles.map((r: { id: string; name: string }) => ({ id: r.id, name: r.name })),
        newRole: { id: role.id, name: role.name }
      }
    );
    
    await invalidateCache("/dashboard/settings/users");
    
    return { 
      success: true, 
      message: `Perfil do usuário ${user.fullName} atualizado com sucesso para ${role.name}` 
    };
  } catch (error) {
    console.error("Erro ao atualizar perfil do usuário:", error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        message: "Dados inválidos: " + error.errors.map(e => e.message).join(", ") 
      };
    }
    
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    
    return { success: false, message: "Erro ao atualizar perfil do usuário" };
  }
}
