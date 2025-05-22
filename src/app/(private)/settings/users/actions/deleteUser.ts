'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { requirePermission } from '@/lib/services/require-permission.service';
import { logAudit } from '@/lib/services/audit.service';
import { invalidateCache } from '@/lib/services/invalidate-user-cache.service';

// Schema de validação para exclusão de usuário
const deleteUserSchema = z.object({
  userId: z.string().uuid(),
});

/**
 * Server Action para excluir um usuário
 */
export async function deleteUser(formData: FormData) {
  try {
    // Verificar permissões do usuário que está fazendo a exclusão
    const adminUser = await requirePermission(
      'users.delete',
      'Você não tem permissão para excluir usuários'
    );

    // Extrair e validar dados
    const userId = formData.get('userId') as string;

    const validatedData = deleteUserSchema.parse({ userId });

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
      include: { roles: true },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Não permitir que um usuário exclua a si mesmo
    if (user.id === adminUser.id) {
      throw new Error('Você não pode excluir seu próprio usuário');
    }

    // Remover relacionamentos primeiro (roles)
    await prisma.user.update({
      where: { id: validatedData.userId },
      data: {
        roles: {
          disconnect: user.roles.map((role: { id: string }) => ({ id: role.id })),
        },
      },
    });

    // Excluir o usuário
    await prisma.user.delete({
      where: { id: validatedData.userId },
    });

    // Registrar no audit log
    await logAudit(
      adminUser.id,
      'DELETE_USER',
      `Usuário ${user.fullName} (${user.email}) foi excluído`,
      {
        userId: user.id,
        userEmail: user.email,
      }
    );

    await invalidateCache('/settings/users');

    return {
      success: true,
      message: `Usuário ${user.fullName} excluído com sucesso`,
    };
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Dados inválidos: ' + error.errors.map((e) => e.message).join(', '),
      };
    }

    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    return { success: false, message: 'Erro ao excluir usuário' };
  }
}
