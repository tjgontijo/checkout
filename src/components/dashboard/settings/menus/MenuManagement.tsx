"use client";

import { useState, useEffect } from "react";
import { Permission, Resource, Action } from "@prisma/client";
import { MenuTree } from "./MenuTree";
import { MenuEditor } from "./MenuEditor";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Tipagem forte para os itens de menu
export interface MenuItemWithRelations {
  id: string;
  label: string;
  icon?: string | null;
  href?: string | null;
  order: number | null;
  parentId?: string | null;
  showInMenu: boolean;
  permission?: {
    id: string;
    name: string;
    description: string;
    resource?: Resource | null;
    action?: Action | null;
  } | null;
  parent?: MenuItemWithRelations | null;
  children?: MenuItemWithRelations[];
}

// Tipagem para as permissões
export interface PermissionWithRelations extends Permission {
  resource: Resource | null;
  action: Action | null;
}

// Props do componente
interface MenuManagementProps {
  menuItems: MenuItemWithRelations[];
  permissions: PermissionWithRelations[];
}

export function MenuManagement({ menuItems, permissions }: MenuManagementProps) {
  // Estado para o item selecionado (para edição)
  const [selectedItem, setSelectedItem] = useState<MenuItemWithRelations | null>(null);
  
  // Estado para controlar o modal/drawer de edição
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  // Estado para o modo de edição (criar ou editar)
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
  
  // Estado para o filtro de busca
  const [searchQuery, setSearchQuery] = useState("");
  
  // Estado para os itens de menu filtrados
  const [filteredItems, setFilteredItems] = useState<MenuItemWithRelations[]>(menuItems);
  
  // Atualizar os itens filtrados quando o searchQuery mudar
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(menuItems);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    
    // Função recursiva para filtrar itens e seus filhos
    const filterItems = (items: MenuItemWithRelations[]): MenuItemWithRelations[] => {
      return items.filter(item => {
        const matchesQuery = item.label.toLowerCase().includes(query) ||
                            item.href?.toLowerCase().includes(query) ||
                            item.permission?.name.toLowerCase().includes(query);
        
        // Se o item corresponde à consulta, incluí-lo
        if (matchesQuery) return true;
        
        // Se o item tem filhos, verificar se algum deles corresponde à consulta
        if (item.children && item.children.length > 0) {
          const filteredChildren = filterItems(item.children);
          
          // Se algum filho corresponde, incluir o item pai com apenas os filhos filtrados
          if (filteredChildren.length > 0) {
            item.children = filteredChildren;
            return true;
          }
        }
        
        return false;
      });
    };
    
    setFilteredItems(filterItems([...menuItems]));
  }, [searchQuery, menuItems]);
  
  // Função para abrir o editor para criar um novo item
  const handleCreateItem = (parentId?: string) => {
    setEditorMode("create");
    setSelectedItem({
      id: "",
      label: "",
      order: getNextOrder(parentId),
      showInMenu: true,
      parentId: parentId || null
    } as MenuItemWithRelations);
    setIsEditorOpen(true);
  };
  
  // Função para abrir o editor para editar um item existente
  const handleEditItem = (item: MenuItemWithRelations) => {
    setEditorMode("edit");
    setSelectedItem(item);
    setIsEditorOpen(true);
  };
  
  // Função para fechar o editor
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedItem(null);
  };
  
  // Função para obter a próxima ordem para um novo item
  const getNextOrder = (parentId?: string | null): number => {
    if (!parentId) {
      // Para itens raiz, encontrar o maior order e adicionar 10
      const maxOrder = Math.max(0, ...menuItems
        .filter(item => !item.parentId)
        .map(item => item.order ?? 0));
      return maxOrder + 10;
    } else {
      // Para subitens, encontrar o item pai e o maior order entre seus filhos
      const parent = menuItems.find(item => item.id === parentId);
      if (parent && parent.children && parent.children.length > 0) {
        const maxChildOrder = Math.max(0, ...parent.children.map(child => child.order ?? 0));
        return maxChildOrder + 10;
      }
      return 10; // Primeiro filho
    }
  };
  
  return (
    <div className="flex flex-col space-y-4">
      {/* Barra de ações */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar itens de menu..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button onClick={() => handleCreateItem()} className="ml-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Item
        </Button>
      </div>
      
      {/* Árvore de menus */}
      <div className="border rounded-md">
        <MenuTree 
          items={filteredItems} 
          onEditItem={handleEditItem}
          onCreateItem={handleCreateItem}
        />
      </div>
      
      {/* Editor de item */}
      {isEditorOpen && selectedItem && (
        <MenuEditor
          mode={editorMode}
          item={selectedItem}
          permissions={permissions}
          menuItems={menuItems}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
}
