'use server';

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

// Tipagem para permissão com relações
type PermissionWithRelations = {
  id: string;
  name: string;
  resourceId: string | null;
  actionId: string | null;
  description: string;
  resource: {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  action: {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

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
    const permissions = await prisma.permission.findMany({
      include: {
        resource: true,
        action: true,
      },
      orderBy: [{ resourceId: 'asc' }, { name: 'asc' }],
    });

    // Define o tipo para o resultado da consulta do Prisma
    type PrismaPermissionResult = {
      id: string;
      name: string;
      resourceId: string | null;
      actionId: string | null;
      description: string;
      resource: {
        id: string;
        name: string;
        description: string | null;
        category: string | null;
        createdAt: Date;
        updatedAt: Date;
      } | null;
      action: {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
      } | null;
    };

    // Agrupa permissões por categoria (resource) e garante que os tipos estejam corretos
    const permissionsByResource: PermissionsByResource = permissions.reduce(
      (acc: PermissionsByResource, permission: PrismaPermissionResult) => {
        const resourceName = permission.resource?.name || 'Sem categoria';

        if (!acc[resourceName]) {
          acc[resourceName] = [];
        }
        
        // Garante que action.description seja sempre uma string
        const formattedPermission: PermissionWithRelations = {
          ...permission,
          action: permission.action ? {
            ...permission.action,
            description: permission.action.description || '',
          } : null
        };

        acc[resourceName].push(formattedPermission);
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
