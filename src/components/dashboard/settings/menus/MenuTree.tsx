"use client";

import { useState } from "react";
import { MenuItemWithRelations } from "./MenuManagement";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Edit, Trash, Plus, MoveUp, MoveDown, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MenuTreeProps {
  items: MenuItemWithRelations[];
  onEditItem: (item: MenuItemWithRelations) => void;
  onCreateItem: (parentId?: string) => void;
}

export function MenuTree({ items, onEditItem, onCreateItem }: MenuTreeProps) {
  // Estado para controlar quais nós estão expandidos
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  
  // Função para alternar a expansão de um nó
  const toggleNode = (itemId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  
  // Função para renderizar um item de menu e seus filhos recursivamente
  const renderMenuItem = (item: MenuItemWithRelations, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedNodes[item.id] || false;
    
    return (
      <div key={item.id} className="menu-tree-item">
        <div 
          className={cn(
            "flex items-center py-2 px-4 hover:bg-muted/50 border-b",
            depth > 0 && "pl-8"
          )}
        >
          {/* Ícone de expansão (apenas se tiver filhos) */}
          <div className="w-6 flex-shrink-0">
            {hasChildren && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => toggleNode(item.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          
          {/* Informações do item */}
          <div 
            className="flex-1 flex items-center cursor-pointer"
            onClick={() => onEditItem(item)}
          >
            <span className="font-medium">{item.label}</span>
            
            {/* Indicadores visuais */}
            <div className="ml-2 flex items-center space-x-1">
              {!item.showInMenu && (
                <span title="Não exibido no menu">
                  <EyeOff className="h-3 w-3 text-muted-foreground" />
                </span>
              )}
              {item.permission && (
                <span title={`Requer permissão: ${item.permission.name}`}>
                  <Lock className="h-3 w-3 text-muted-foreground" />
                </span>
              )}
            </div>
            
            {/* Rota (se houver) */}
            {item.href && (
              <span className="ml-2 text-xs text-muted-foreground">
                {item.href}
              </span>
            )}
          </div>
          
          {/* Ações */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onCreateItem(item.id)}
              aria-label="Adicionar subitem"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEditItem(item)}
              aria-label="Editar item"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => toast.info('Funcionalidade de exclusão será implementada em breve')}
              aria-label="Excluir item"
            >
              <Trash className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => toast.info('Funcionalidade de reordenação será implementada em breve')}
              aria-label="Mover para cima"
            >
              <MoveUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => toast.info('Funcionalidade de reordenação será implementada em breve')}
              aria-label="Mover para baixo"
            >
              <MoveDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Renderizar filhos se o nó estiver expandido */}
        {hasChildren && isExpanded && (
          <div className="menu-tree-children pl-6 border-l ml-4">
            {item.children!.map(child => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="menu-tree" role="tree">
      {items.length > 0 ? (
        items.map(item => renderMenuItem(item))
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          Nenhum item de menu encontrado. Clique em &quot;Novo Item&quot; para criar.
        </div>
      )}
    </div>
  );
}
