"use client"

import React from "react"
import Link from "next/link"
import { 
  CalendarCheck, 
  PanelLeftClose  
} from "lucide-react"
import { useMemo } from "react"
import { useSidebar } from "@/providers/sidebar-provider"
import { getIconComponent } from "./menu"

import { MenuItem } from "./menu";
import { SidebarFooter } from "./footer";

interface SidebarProps {
  menuItems: MenuItem[];
}

export function Sidebar({ menuItems }: SidebarProps) {
  const { open, toggleSidebar } = useSidebar();
  // Garante que menuItems nunca será undefined
  const safeMenuItems = Array.isArray(menuItems) ? menuItems : [];

  // Conteúdo do header
  const headerContent = useMemo(() => (
    <div className="flex items-center justify-between p-4 border-b">
      {open ? (
        <div className="flex items-center space-x-2">
          <CalendarCheck className="h-6 w-6 text-primary opacity-70" />
          <span className="font-semibold">SGE</span>
        </div>
      ) : (
        <CalendarCheck className="h-6 w-6 text-primary mx-auto opacity-70" />
      )}
      {open && (
        <button 
          onClick={toggleSidebar} 
          className="hover:bg-gray-100 rounded-full p-1"
        >
          <PanelLeftClose className="text-gray-500 opacity-50 hover:opacity-100" />
        </button>
      )}
    </div>
  ), [open, toggleSidebar]);

  return (
    <div 
      className={`
        flex flex-col h-full 
        bg-zinc-50 dark:bg-gray-800 border-r rounded-lg shadow
        transition-all duration-300 ease-in-out
        ${open ? 'w-64' : 'w-16'}
      `}
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

function MenuItemComponent({ item, open }: MenuItemComponentProps) {
  const IconComponent = getIconComponent(item.icon);
  const hasChildren = item.children && item.children.length > 0;
  return (
    <div key={item.id}>
      <Link
        href={item.href}
        className={`
          flex items-center py-2 px-3 rounded-md
          text-sm font-medium text-gray-700 dark:text-gray-200
          hover:bg-gray-100 dark:hover:bg-gray-700 
          transition-colors duration-200
          ${open ? '' : 'justify-center'}
        `}
      >
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
                className="
                  flex items-center py-2 px-3 rounded-md
                  text-sm font-medium text-gray-600 dark:text-gray-300
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  transition-colors duration-200
                "
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
}