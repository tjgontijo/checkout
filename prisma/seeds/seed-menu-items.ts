import { PrismaClient } from '@prisma/client'
import logger from '@/lib/logger'

const prisma = new PrismaClient()

const menuItemsData = [
  {
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    href: '/dashboard',
    order: 1,
    showInMenu: true,
    permissionName: 'dashboard.view'
  },
  {
    label: 'Produtos',
    icon: 'Package',
    href: '/dashboard/products',
    order: 2,
    showInMenu: true,
    permissionName: 'products.view'
  },
  {
    label: 'Vendas',
    icon: 'ShoppingCart',
    href: '/dashboard/sales',
    order: 3,
    showInMenu: true,
    permissionName: 'orders.view'
  },
  {
    label: 'Clientes',
    icon: 'Users',
    href: '/dashboard/customers',
    order: 4,
    showInMenu: true,
    permissionName: 'users.view'
  },
  {
    label: 'Configurações',
    icon: 'Settings',
    href: '/dashboard/settings',
    order: 5,
    showInMenu: true,
    permissionName: 'accessControl.view'
  }
];


export async function seedMenuItems() {
  try {
    // Criar menu items principais com permissões
    const menuItemsToSeed = await Promise.all(menuItemsData.map(async (menuItem) => {
      const permission = await prisma.permission.findUnique({
        where: { name: menuItem.permissionName }
      })

      return {
        label: menuItem.label,
        icon: menuItem.icon,
        href: menuItem.href,
        order: menuItem.order,
        showInMenu: menuItem.showInMenu,
        permissionId: permission?.id
      }
    }))

    // Criar menu items principais
    await prisma.menuItem.createMany({ data: menuItemsToSeed })

    // Criar submenus de Vendas
    const salesMenu = await prisma.menuItem.findFirst({
      where: { href: '/dashboard/sales' }
    });
    if (salesMenu) {
      const ordersPermission = await prisma.permission.findUnique({ where: { name: 'orders.view' } });
      const abandonedCartsPermission = await prisma.permission.findUnique({ where: { name: 'carts.view' } });
      await prisma.menuItem.createMany({
        data: [
          {
            label: 'Pedidos',
            icon: 'ClipboardList',
            href: '/dashboard/sales/orders',
            parentId: salesMenu.id,
            order: 1,
            showInMenu: true,
            permissionId: ordersPermission?.id || null
          },
          {
            label: 'Carrinhos Abandonados',
            icon: 'ShoppingBag',
            href: '/dashboard/sales/abandoned-carts',
            parentId: salesMenu.id,
            order: 2,
            showInMenu: true,
            permissionId: abandonedCartsPermission?.id || null
          }
        ]
      });
    }

    // Criar submenus de Configurações
    const configMenu = await prisma.menuItem.findFirst({
      where: { href: '/dashboard/settings' }
    });
    if (configMenu) {
      const lojaPermission = await prisma.permission.findUnique({ where: { name: 'preferences.view' } });
      const emailsPermission = await prisma.permission.findUnique({ where: { name: 'emails.view' } });
      const pagamentosPermission = await prisma.permission.findUnique({ where: { name: 'checkouts.view' } });
      const relatoriosPermission = await prisma.permission.findUnique({ where: { name: 'auditLogs.view' } });
      const usuariosPermission = await prisma.permission.findUnique({ where: { name: 'users.view' } });
      const accessControlPermission = await prisma.permission.findUnique({ where: { name: 'accessControl.manage' } });
      const webhooksPermission = await prisma.permission.findUnique({ where: { name: 'webhooks.view' } });
      await prisma.menuItem.createMany({
        data: [
          {
            label: 'Dados da loja',
            icon: 'Store',
            href: '/dashboard/settings/store',
            parentId: configMenu.id,
            order: 1,
            showInMenu: true,
            permissionId: lojaPermission?.id || null            
          },
          {
            label: 'E-mails transacionais',
            icon: 'Mail',
            href: '/dashboard/settings/emails',
            parentId: configMenu.id,
            order: 2,
            showInMenu: true,
            permissionId: emailsPermission?.id || null            
          },
          {
            label: 'Formas de pagamento',
            icon: 'CreditCard',
            href: '/dashboard/settings/payments',
            parentId: configMenu.id,
            order: 3,
            showInMenu: true,
            permissionId: pagamentosPermission?.id || null            
          },
          {
            label: 'Relatórios',
            icon: 'BarChart2',
            href: '/dashboard/settings/reports',
            parentId: configMenu.id,
            order: 4,
            showInMenu: true,
            permissionId: relatoriosPermission?.id || null
          },
          {
            label: 'Usuários',
            icon: 'User',
            href: '/dashboard/settings/users',
            parentId: configMenu.id,
            order: 5,
            showInMenu: true,
            permissionId: usuariosPermission?.id || null
          },
          {
            label: 'Controle de Acesso',
            icon: 'ShieldCheck',
            href: '/dashboard/settings/roles',
            parentId: configMenu.id,
            order: 6,
            showInMenu: true,
            permissionId: accessControlPermission?.id || null            
          },
          {
            label: 'Menus',
            icon: 'Menu',
            href: '/dashboard/settings/menus',
            parentId: configMenu.id,
            order: 6,
            showInMenu: true,
            permissionId: accessControlPermission?.id || null            
          },
          {
            label: 'Webhooks',
            icon: 'Link',
            href: '/dashboard/settings/webhooks',
            parentId: configMenu.id,
            order: 7,
            showInMenu: true,
            permissionId: webhooksPermission?.id || null            
          }
        ]
      });
    }
    
  } catch (error) {
    logger.error('Error seeding menu items:', error)
    throw error
  }
}