"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

import { requirePermission } from "@/lib/services/require-permission.service";
import { logAudit } from "@/lib/services/audit.service";
import { invalidateCache } from "@/lib/services/invalidate-user-cache.service";

// Schema de validação forte
const createRoleSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(50),
  description: z.string().min(2, "Descrição obrigatória").max(255),
});

export async function createRole(formData: FormData) {
  try {
    // Verificar permissões do usuário
    const user = await requirePermission("roles.create", "Você não tem permissão para criar perfis");
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const validated = createRoleSchema.parse({ name, description });

    // Cria a role no banco
    const role = await prisma.role.create({
      data: {
        name: validated.name,
        description: validated.description,
      },
    });

    // Registrar na auditoria
    await logAudit(
      user.id,
      "roles.create",
      `Perfil ${role.name} criado`,
      { role }
    );

    // Revalida a página para atualizar lista
    await invalidateCache("/settings/roles");

    return { success: true, role };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(", ") };
    }
    return { success: false, error: (error as Error).message };
  }
}
