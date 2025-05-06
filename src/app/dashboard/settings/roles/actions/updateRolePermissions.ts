"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

type TransactionClient = Prisma.TransactionClient;

// Schema de validação para atualização de permissões
const updateRolePermissionsSchema = z.object({
  roleId: z.string().uuid(),
  permissionIds: z.array(z.string().uuid()),
});

/**
 * Server Action para atualizar as permissões de uma role
 */
export async function updateRolePermissions(formData: FormData) {
  try {
    // Extrair e validar dados
    const roleId = formData.get("roleId") as string;
    const permissionIdsJson = formData.get("permissionIds") as string;
    const permissionIds = JSON.parse(permissionIdsJson);
    
    const validatedData = updateRolePermissionsSchema.parse({ 
      roleId, 
      permissionIds 
    });
    
    // Verificar se a role existe
    const role = await prisma.role.findUnique({
      where: { id: validatedData.roleId },
      include: { permissions: true }
    });
    
    if (!role) {
      throw new Error("Perfil não encontrado");
    }
    
    // Buscar permissões existentes para comparação e auditoria
    const currentPermissions = await prisma.rolePermission.findMany({
      where: { roleId: validatedData.roleId },
      include: { permission: true }
    });
    
    const currentPermissionIds = currentPermissions.map((rp: { permissionId: string }) => rp.permissionId);
    
    // Permissões a adicionar (estão em permissionIds mas não em currentPermissionIds)
    const permissionsToAdd = validatedData.permissionIds.filter(
      (id: string) => !currentPermissionIds.includes(id)
    );
    
    // Permissões a remover (estão em currentPermissionIds mas não em permissionIds)
    const permissionsToRemove = currentPermissionIds.filter(
      (id: string) => !validatedData.permissionIds.includes(id)
    );
    
    // Buscar nomes das permissões para o log de auditoria
    const permissionsData = await prisma.permission.findMany({
      where: {
        id: {
          in: [...permissionsToAdd, ...permissionsToRemove]
        }
      }
    });
    
    const permissionNames = permissionsData.reduce((acc: Record<string, string>, p: { id: string, name: string }) => {
      acc[p.id] = p.name;
      return acc;
    }, {} as Record<string, string>);
    
    // Transação para garantir atomicidade
    await prisma.$transaction(async (tx: TransactionClient) => {
      // Remover permissões
      if (permissionsToRemove.length > 0) {
        await tx.rolePermission.deleteMany({
          where: {
            roleId: validatedData.roleId,
            permissionId: { in: permissionsToRemove }
          }
        });
      }
      
      // Adicionar novas permissões
      if (permissionsToAdd.length > 0) {
        await Promise.all(
          permissionsToAdd.map((permissionId: string) =>
            tx.rolePermission.create({
              data: {
                roleId: validatedData.roleId,
                permissionId,
                grantedBy: "system" // Idealmente, usar o ID do usuário logado
              }
            })
          )
        );
      }
      
      // Buscar um usuário válido para o audit log (primeira opção encontrada)
      // Em produção, você deve usar o ID do usuário logado que está fazendo a alteração
      const anyUser = await tx.user.findFirst();
      
      if (anyUser) {
        // Registrar no audit log apenas se encontrar um usuário válido
        await tx.auditLog.create({
          data: {
            action: "UPDATE_ROLE_PERMISSIONS",
            description: `Permissões do perfil ${role.name} atualizadas`,
            metadata: JSON.stringify({
              added: permissionsToAdd.map((id: string) => permissionNames[id] || id),
              removed: permissionsToRemove.map((id: string) => permissionNames[id] || id)
            }),
            userId: anyUser.id // Usando um ID válido de usuário
          }
        });
      }
      // Se não encontrar usuário, apenas pula o log de auditoria
    });
    
    // Revalidar a página para atualizar os dados
    revalidatePath("/dashboard/settings/roles");
    
    return { 
      success: true, 
      message: `Permissões do perfil ${role.name} atualizadas com sucesso` 
    };
  } catch (error) {
    console.error("Erro ao atualizar permissões:", error);
    
    if (error instanceof z.ZodError) {
      return { success: false, message: "Dados inválidos", errors: error.errors };
    }
    
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    
    return { success: false, message: "Erro ao atualizar permissões do perfil" };
  }
}
