"use client";

import { useState, useEffect } from "react";
import { Permission, Resource, Action } from "@prisma/client";
import { MenuTree } from "./MenuTree";
import { MenuEditor } from "./MenuEditor";
import { CreateMenuDialog } from "./CreateMenuDialog";
import { EditMenuDialog } from "./EditMenuDialog";
import { Dialog } from "@/components/ui/dialog";
import { MenuToolbar } from "./MenuToolbar";
import { reorderMenuItems } from "@/app/dashboard/settings/menus/actions";
import { toast } from "sonner";

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
  
  // Estado para controlar o diálogo de criação
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Estado para controlar o diálogo de edição
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
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
  
  // Função para iniciar a criação de um novo item
  function handleCreateItem() {
    setIsCreateDialogOpen(true);
  }
  
  
  // Função para iniciar a edição de um item existente
  function handleEditItem(item: MenuItemWithRelations) {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };
  
  // Função para fechar o editor
  function handleCloseEditor() {
    setIsEditorOpen(false);
    setSelectedItem(null);
    
    // Recarregar a lista de itens (na implementação real, isso seria feito via revalidação)
    // fetchMenuItems();
  }
  
  // Função para lidar com a criação bem-sucedida de um menu
  function handleMenuCreated() {
    // Recarregar a lista de itens (na implementação real, isso seria feito via revalidação)
    // fetchMenuItems();
  }
  
  // Flatten menu tree para operações
  function flattenItems(items: MenuItemWithRelations[]): MenuItemWithRelations[] {
    return items.reduce<MenuItemWithRelations[]>((acc, cur) => [
      ...acc,
      cur,
      ...(cur.children ? flattenItems(cur.children) : []),
    ], []);
  }
  
  // Função para reordenar itens (subir)
  async function handleMoveUp(item: MenuItemWithRelations) {
    const all = flattenItems(menuItems);
    const siblings = all.filter(mi => mi.parentId === item.parentId).sort((a,b) => (a.order||0) - (b.order||0));
    const index = siblings.findIndex(mi => mi.id === item.id);
    if (index <= 0) return;
    const above = siblings[index-1];
    // trocar ordens
    const updated = [
      { id: item.id, order: (above.order||0) },
      { id: above.id, order: (item.order||0) }
    ];
    const fd = new FormData(); fd.append('items', JSON.stringify({ items: updated }));
    const res = await reorderMenuItems(fd);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
    // atualizar lista
    // aqui pode revalidação
  }
  
  // mover para baixo
  async function handleMoveDown(item: MenuItemWithRelations) {
    const all = flattenItems(menuItems);
    const siblings = all.filter(mi => mi.parentId === item.parentId).sort((a,b) => (a.order||0) - (b.order||0));
    const index = siblings.findIndex(mi => mi.id === item.id);
    if (index === -1 || index >= siblings.length-1) return;
    const below = siblings[index+1];
    const updated = [
      { id: item.id, order: (below.order||0) },
      { id: below.id, order: (item.order||0) }
    ];
    const fd = new FormData(); fd.append('items', JSON.stringify({ items: updated }));
    const res = await reorderMenuItems(fd);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  }
  
  return (
    <div className="flex flex-col space-y-4">
      <MenuToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreate={handleCreateItem}
      />
      
      {/* Árvore de menus */}
      <div className="border rounded-md">
        <MenuTree 
          items={filteredItems} 
          onEditItem={handleEditItem}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
        />
      </div>
      
      {/* Editor de item */}
      {isEditorOpen && selectedItem && (
        <MenuEditor
          mode="edit"
          item={selectedItem}
          permissions={permissions}
          menuItems={menuItems.filter(item => item.id !== selectedItem.id)}
          onClose={handleCloseEditor}
        />
      )}
      
      {/* Diálogo de criação rápida */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <CreateMenuDialog 
          onMenuCreated={handleMenuCreated} 
          setOpen={setIsCreateDialogOpen}
          menuItems={menuItems}
          permissions={permissions}
        />
      </Dialog>
      
      {/* Diálogo de edição */}
      {selectedItem && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <EditMenuDialog 
            item={selectedItem}
            onMenuUpdated={handleMenuCreated} 
            setOpen={setIsEditDialogOpen}
            menuItems={menuItems.filter(item => item.id !== selectedItem.id)}
            permissions={permissions}
          />
        </Dialog>
      )}
    </div>
  );
}
