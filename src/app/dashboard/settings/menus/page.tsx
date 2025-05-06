import { MenuManagement } from "@/components/dashboard/settings/menus/MenuManagement";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Gerenciamento de Menus",
  description: "Gerencie os itens de menu do sistema",
};

export default async function MenusPage() {
  // Buscar todos os itens de menu com suas relações
  const menuItems = await prisma.menuItem.findMany({
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
          permission: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
    where: {
      parentId: null, // Apenas itens raiz
    },
    orderBy: {
      order: "asc",
    },
  });

  // Buscar todas as permissões para o dropdown de seleção
  const permissions = await prisma.permission.findMany({
    include: {
      resource: true,
      action: true,
    },
    orderBy: [
      {
        resource: {
          name: "asc",
        },
      },
      {
        action: {
          name: "asc",
        },
      },
    ],
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Gerenciamento de Menus</h3>
        <p className="text-sm text-muted-foreground">
          Configure os itens de menu que serão exibidos na navegação do sistema.
        </p>
      </div>
      
      <MenuManagement 
        menuItems={menuItems} 
        permissions={permissions} 
      />
    </div>
  );
}
