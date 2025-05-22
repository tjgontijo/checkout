'use client';

import React from 'react';
import Link from 'next/link';
import { PanelLeftClose, Sun } from 'lucide-react';
import { useMemo } from 'react';
import { useSidebar } from '@/providers/sidebar-provider';

import { MenuItem, getIconComponent } from '@/providers/sidebar-provider';
import { SidebarFooter } from './footer';

// Componente de Skeleton para a sidebar
function SidebarSkeleton({ open = true }: { open?: boolean }) {
  return (
    <div
      className={`flex h-full flex-col rounded-lg border-r bg-zinc-50 shadow transition-all duration-300 ease-in-out dark:bg-gray-800 ${open ? 'w-64' : 'w-16'} `}
    >
      {/* Header Skeleton */}
      <div className="flex items-center justify-between border-b p-4">
        {open ? (
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-4 w-16 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
          </div>
        ) : (
          <div className="mx-auto h-6 w-6 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></div>
        )}
        {open && (
          <div className="h-6 w-6 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></div>
        )}
      </div>

      {/* Menu Items Skeleton */}
      <div className={`flex-1 overflow-y-auto py-2 ${open ? 'px-3' : 'px-0'}`}>
        <div className="flex flex-col gap-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`flex items-center rounded-md px-3 py-2 ${open ? '' : 'justify-center'} `}
            >
              <div className="h-5 w-5 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
              {open && (
                <div className="ml-3 h-4 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="border-t p-4">
        {open ? (
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex-1">
              <div className="mb-1 h-4 w-20 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-3 w-16 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
            </div>
          </div>
        ) : (
          <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></div>
        )}
      </div>
    </div>
  );
}

export function Sidebar() {
  const { open, toggleSidebar, menuItems, isLoading } = useSidebar();

  // Garante que menuItems nunca será undefined
  const safeMenuItems = Array.isArray(menuItems) ? menuItems : [];

  // Conteúdo do header
  const headerContent = useMemo(
    () => (
      <div className="flex items-center justify-between border-b p-4">
        {open ? (
          <div className="flex items-center space-x-2">
            <Sun className="h-6 w-6 text-primary opacity-70" />
            <span className="font-semibold">My Checkout</span>
          </div>
        ) : (
          <Sun className="mx-auto h-6 w-6 text-primary opacity-70" />
        )}
        {open && (
          <button onClick={toggleSidebar} className="rounded-full p-1 hover:bg-gray-100">
            <PanelLeftClose className="text-gray-500 opacity-50 hover:opacity-100" />
          </button>
        )}
      </div>
    ),
    [open, toggleSidebar]
  );

  // Se estiver carregando, exibe o skeleton
  if (isLoading) {
    return <SidebarSkeleton open={open} />;
  }

  // Quando estiver pronto, exibe a sidebar completa
  return (
    <div
      className={`flex h-full flex-col rounded-lg border-r bg-zinc-50 shadow transition-all duration-300 ease-in-out dark:bg-gray-800 ${open ? 'w-64' : 'w-16'} `}
    >
      {headerContent}
      <div className={`flex-1 overflow-y-auto py-2 ${open ? 'px-3' : 'px-0'}`}>
        <nav className="flex flex-col gap-1">
          {safeMenuItems.map((item) => (
            <MenuItemComponent key={item.id} item={item} open={open} />
          ))}
        </nav>
      </div>
      <SidebarFooter open={open} />
    </div>
  );
}

interface MenuItemComponentProps {
  item: MenuItem;
  open: boolean;
}

// Componente memoizado para evitar renderizações desnecessárias
const MenuItemComponent = React.memo(function MenuItemComponent({
  item,
  open,
}: MenuItemComponentProps) {
  const IconComponent = getIconComponent(item.icon);
  const hasChildren = item.children && item.children.length > 0;

  // Memoização do cálculo de classes CSS para evitar recalcular em cada renderização
  const linkClassName = React.useMemo(() => {
    return `
      flex items-center py-2 px-3 rounded-md
      text-sm font-medium text-gray-700 dark:text-gray-200
      hover:bg-gray-100 dark:hover:bg-gray-700 
      transition-colors duration-200
      ${open ? '' : 'justify-center'}
    `;
  }, [open]);

  return (
    <div>
      {' '}
      {/* Removida a key redundante, pois já é fornecida pelo map no componente pai */}
      <Link href={item.href} className={linkClassName}>
        <IconComponent className="h-5 w-5 text-primary" />
        {open && <span className="ml-3 truncate">{item.label}</span>}
      </Link>
      {open && hasChildren && (
        <div className="ml-4 mt-1 space-y-1">
          {item.children?.map((child: MenuItem) => {
            const ChildIconComponent = getIconComponent(child.icon || 'CircleDot');
            return (
              <Link
                key={child.id}
                href={child.href}
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ChildIconComponent className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="ml-3 truncate">{child.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
});
