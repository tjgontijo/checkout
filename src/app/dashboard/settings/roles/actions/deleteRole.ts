"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { invalidateCache } from "@/lib/services/invalidate-user-cache.service";
import { requirePermission } from "@/lib/services/require-permission.service";
import { logAudit } from "@/lib/services/audit.service";

const deleteRoleSchema = z.object({
  roleId: z.string().uuid(),
});

export async function deleteRole(formData: FormData) {
  try {
    // Verificar permissões do usuário
    const user = await requirePermission("roles.delete", "Você não tem permissão para excluir perfis");
    const roleId = formData.get("roleId") as string;
    deleteRoleSchema.parse({ roleId });

    // Remove as permissões associadas primeiro (dependendo do schema)
    await prisma.rolePermission.deleteMany({ where: { roleId } });
    // Remove a associação com usuários (tabela intermediária _RoleToUser)
    // Busca usuários com essa role
    const usersWithRole = await prisma.user.findMany({
      where: {
        roles: {
          some: { id: roleId }
        }
      },
      select: { id: true }
    });
    
    // Para cada usuário, atualiza individualmente para desconectar a role
    for (const user of usersWithRole) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          roles: {
            disconnect: [{ id: roleId }]
          }
        }
      });
    }
    // Buscar os dados da role antes de excluir (para auditoria)
    const role = await prisma.role.findUnique({ 
      where: { id: roleId },
      select: { id: true, name: true, description: true }
    });

    if (!role) {
      throw new Error("Perfil não encontrado");
    }

    // Deleta a role
    await prisma.role.delete({ where: { id: roleId } });
    
    // Registrar na auditoria
    await logAudit(
      user.id,
      "delete",
      `Perfil ${role.name} excluído`,
      { role }
    );
    
    await invalidateCache("/dashboard/settings/roles");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(", ") };
    }
    return { success: false, error: (error as Error).message };
  }
}
