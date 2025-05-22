'use server';

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

// Tipagem manual para payload de Permission com relações
type PermissionWithRelations = Prisma.PermissionGetPayload<{
  include: { resource: true; action: true };
}>;

// Mapeamento de permissões por recurso
interface PermissionsByResource {
  [resourceName: string]: PermissionWithRelations[];
}

/**
 * Server Action para buscar perfis e permissões
 * Retorna todos os perfis com suas permissões e todas as permissões agrupadas por recurso
 */
export async function getRolesAndPermissions() {
  try {
    // Busca todas as roles com suas permissões
    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' },
      include: {
        permissions: {
          include: {
            permission: {
              include: {
                resource: true,
                action: true,
              },
            },
          },
        },
      },
    });

    // Busca todas as permissões disponíveis, agrupadas por recurso
    const permissions: PermissionWithRelations[] = await prisma.permission.findMany({
      include: {
        resource: true,
        action: true,
      },
      orderBy: [{ resourceId: 'asc' }, { name: 'asc' }],
    });

    // Agrupa permissões por categoria (resource)
    const permissionsByResource: PermissionsByResource = permissions.reduce(
      (acc: PermissionsByResource, permission: PermissionWithRelations) => {
        const resourceName = permission.resource?.name || 'Sem categoria';

        if (!acc[resourceName]) {
          acc[resourceName] = [];
        }

        acc[resourceName].push(permission);
        return acc;
      },
      {} as PermissionsByResource
    );

    return {
      roles,
      permissionsByResource,
    };
  } catch (error) {
    console.error('Erro ao buscar perfis e permissões:', error);
    throw new Error('Não foi possível carregar os perfis e permissões');
  }
}
