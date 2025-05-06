import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MenuItem } from '@/components/dashboard/sidebar/menu'
import { cache } from 'react'

const prisma = new PrismaClient()

/**
 * Server Component para buscar itens de menu do banco de dados baseado nas permissões do usuário.
 * Retorna o menu no formato esperado pelo componente de menu do frontend.
 */
export const getMenuItems = cache(async (): Promise<MenuItem[]> => {
  try {
    // Obter sessão do usuário com timeout para evitar bloqueios
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (error) {
      console.error("Erro ao obter sessão:", error);
      return [];
    }
    
    if (!session?.user) {
      // Sessão não autenticada - retornando menu vazio
      return [];
    }

    // Buscar todos os menu items de primeiro nível
    const menuItemsFromDb = await prisma.menuItem.findMany({
      where: {
        parentId: null, // Apenas itens de primeiro nível
        showInMenu: true,
        // Filtrar por permissões do usuário
        OR: [
          { permissionId: null }, // Itens sem permissão específica
          { 
            permission: {
              name: { in: session.user.permissions }
            }
          }
        ]
      },
      include: {
        children: {
          where: {
            showInMenu: true,
            // Filtrar submenu por permissões
            OR: [
              { permissionId: null },
              { 
                permission: {
                  name: { in: session.user.permissions }
                }
              }
            ]
          },
          include: {
            permission: true
          },
          orderBy: {
            order: 'asc'
          }
        },
        permission: true
      },
      orderBy: {
        order: 'asc'
      }
    })

    // DEBUG: Exibir resultado bruto da query do banco
    console.log('Menu items do banco:', menuItemsFromDb.map(i => ({id: i.id, label: i.label, perm: i.permission?.name, filhos: i.children?.length})))

    // Mapear para o formato esperado pelo frontend
    const mappedMenuItems: MenuItem[] = menuItemsFromDb.map(item => ({
      id: item.id,
      label: item.label,
      href: item.href,
      icon: item.icon ?? 'Menu', // Fallback para ícone
      showInMenu: item.showInMenu,
      order: item.order ?? 0,
      // Se tiver permissão, adiciona como requiredPermissions
      requiredPermissions: item.permission?.name ? [item.permission.name] : undefined,
      // Mapear filhos recursivamente
      children: item.children?.map(child => ({
        id: child.id,
        label: child.label,
        href: child.href,
        icon: child.icon ?? 'CircleDot',
        parentId: item.id,
        showInMenu: child.showInMenu,
        order: child.order ?? 0,
        requiredPermissions: child.permission?.name ? [child.permission.name] : undefined
      }))
    }))
    
    // DEBUG: Exibir menu final mapeado
    console.log('Menu final mapeado para o frontend:', mappedMenuItems.map(i => ({id: i.id, label: i.label, filhos: i.children?.length, perms: i.requiredPermissions})))
    return mappedMenuItems
  } catch (error) {
    console.error('Erro ao buscar itens de menu:', error)
    return []
  } finally {
    await prisma.$disconnect()
  }
})

/**
 * Busca todos os itens de menu com estrutura hierárquica para administração
 * @returns Lista completa de itens de menu com suas relações
 */
export async function getMenuTreeForAdmin() {
  try {
    // Buscar todos os itens de menu, incluindo os que não são exibidos no menu
    const menuItems = await prisma.menuItem.findMany({
      where: {
        parentId: null, // Apenas itens raiz
      },
      include: {
        permission: {
          include: {
            resource: true,
            action: true,
          },
        },
        parent: true,
        children: {
          include: {
            permission: {
              include: {
                resource: true,
                action: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    })

    return menuItems
  } catch (error) {
    console.error('Erro ao buscar árvore de menu para administração:', error)
    return []
  }
}

/**
 * Busca os itens de menu disponíveis para um usuário com base em suas roles
 * @param userRoleIds IDs das roles do usuário
 * @returns Lista de itens de menu filtrados pelas permissões do usuário
 */
export async function getMenuTreeForUser(userRoleIds: string[]) {
  try {
    if (!userRoleIds || userRoleIds.length === 0) {
      return []
    }

    // Buscar todas as permissões do usuário com base em suas roles
    const userPermissions = await prisma.rolePermission.findMany({
      where: {
        roleId: { in: userRoleIds },
      },
      select: {
        permission: {
          select: {
            id: true,
          },
        },
      },
    })

    // Extrair os IDs das permissões
    const permissionIds = userPermissions.map((rp) => rp.permission.id)

    // Buscar os itens de menu que o usuário tem permissão para ver
    const menuItems = await prisma.menuItem.findMany({
      where: {
        parentId: null, // Apenas itens raiz
        showInMenu: true, // Apenas itens visíveis no menu
        OR: [
          { permissionId: null }, // Itens sem permissão (públicos)
          { permissionId: { in: permissionIds } }, // Itens com permissões que o usuário possui
        ],
      },
      include: {
        permission: true,
        children: {
          where: {
            showInMenu: true,
            OR: [
              { permissionId: null },
              { permissionId: { in: permissionIds } },
            ],
          },
          include: {
            permission: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    })

    return menuItems
  } catch (error) {
    console.error('Erro ao buscar menu para usuário:', error)
    return []
  }
}

// Nota: A função de revalidação de cache foi movida para um arquivo de server actions
// para evitar problemas de importação em componentes do cliente

// Função helper para pegar o menu direto no lado do cliente, com melhor tipagem
export async function getMenu(): Promise<MenuItem[]> {
  return getMenuItems()
}
