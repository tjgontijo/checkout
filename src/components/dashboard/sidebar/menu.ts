'use client';

import { useSession } from 'next-auth/react';
import { useCallback } from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

// Tipo para o item de menu
export type MenuItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
  parentId?: string;
  parent?: MenuItem;
  children?: MenuItem[];
  permissionId?: string;
  showInMenu?: boolean;
  order?: number;
  requiredPermissions?: string[];
  description?: string;
};

export function getIconComponent(
  iconName: string
): ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>> {
  const IconComponent = (
    LucideIcons as unknown as Record<
      string,
      ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
    >
  )[iconName];
  return IconComponent || LucideIcons.Menu;
}

// Hook para verificação de permissões
export function usePermissions() {
  const { data: session } = useSession();

  const hasPermission = useCallback(
    (requiredPermissions?: string[]) => {
      // Validações adicionais
      if (!session?.user) return false;
      if (!requiredPermissions || requiredPermissions.length === 0) return true;

      const userPermissions = session.user.permissions || [];

      return requiredPermissions.some((permission) => userPermissions.includes(permission));
    },
    [session]
  );

  return {
    hasPermission,
    userPermissions: session?.user?.permissions || [],
    isAuthenticated: !!session?.user,
  };
}

// Componentes do servidor são carregados diretamente pelo sidebar.tsx
// O Server Component do menu está em /lib/services/menu-service.ts
