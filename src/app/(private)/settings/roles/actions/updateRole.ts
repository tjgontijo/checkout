"use server";

import { prisma } from "@/lib/prisma";

import { z } from "zod";
import { invalidateCache } from "@/lib/services/invalidate-user-cache.service";
import { requirePermission } from "@/lib/services/require-permission.service";
import { logAudit } from "@/lib/services/audit.service";

const updateRoleSchema = z.object({
  roleId: z.string().uuid(),
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(255),
});

export async function updateRole(formData: FormData) {
  try {
    const roleId = formData.get("roleId") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    
    const validated = updateRoleSchema.parse({ roleId, name, description });

    // Verifica se já existe uma role com o mesmo nome (exceto a própria)
    const existingRole = await prisma.role.findFirst({
      where: {
        name: validated.name,
        id: { not: validated.roleId }
      }
    });

    if (existingRole) {
      return { success: false, error: "Já existe um perfil com este nome" };
    }

    // Busca dados antigos para log
    const oldRole = await prisma.role.findUnique({
      where: { id: validated.roleId },
      select: { id: true, name: true, description: true }
    });

    // Atualiza a role
    const role = await prisma.role.update({
      where: { id: validated.roleId },
      data: {
        name: validated.name,
        description: validated.description,
      },
    });

    // Recupera usuário autenticado para log
    const user = await requirePermission("roles.update", "Você não tem permissão para atualizar perfis");
    await logAudit(
      user.id,
      "roles.update",
      `Perfil ${role.name} atualizado`,
      {
        before: oldRole,
        after: role
      }
    );

    await invalidateCache("/settings/roles");
    return { success: true, role };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(", ") };
    }
    return { success: false, error: (error as Error).message };
  }
}

