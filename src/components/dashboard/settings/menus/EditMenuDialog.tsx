"use client";

import { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateMenuItem } from "@/app/dashboard/settings/menus/actions";
import { toast } from "sonner";
import { MenuItemWithRelations, PermissionWithRelations } from "./MenuManagement";
import { Resource } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface EditMenuDialogProps {
  item: MenuItemWithRelations;
  onMenuUpdated: () => void;
  setOpen: (open: boolean) => void;
  menuItems: MenuItemWithRelations[];
  permissions: PermissionWithRelations[];
}

export function EditMenuDialog({ item, onMenuUpdated, setOpen, menuItems, permissions }: EditMenuDialogProps) {
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState(item.label || "");
  const [icon, setIcon] = useState(item.icon || "");
  const [href, setHref] = useState(item.href || "");
  const [parentId, setParentId] = useState(item.parentId || "none");
  const [showInMenu, setShowInMenu] = useState(item.showInMenu);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  
  // Efeito para inicializar o recurso selecionado quando as permissões são carregadas
  useEffect(() => {
    if (item.permission?.id && permissions.length > 0) {
      // Encontrar a permissão do item
      const itemPermission = permissions.find(p => p.id === item.permission?.id);
      if (itemPermission?.resource?.id) {
        setSelectedResourceId(itemPermission.resource.id);
      }
    }
  }, [item.permission, permissions]);
  
  // Lista de recursos únicos
  const [resources, setResources] = useState<Resource[]>([]);
  // Mapa de recursos para permissões de visualização
  const [resourceViewPermissions, setResourceViewPermissions] = useState<Map<string, string>>(new Map());
  
  // Exemplos de ícones comuns
  const iconExamples = "home, settings, users, shopping-cart, file-text";
  
  // Extrair recursos únicos e mapear para permissões de visualização
  useEffect(() => {
    const uniqueResources: Resource[] = [];
    const resourceMap = new Map<string, Resource>();
    const viewPermissionsMap = new Map<string, string>();
    
    permissions.forEach(permission => {
      // Extrair recursos únicos
      if (permission.resource && !resourceMap.has(permission.resource.id)) {
        resourceMap.set(permission.resource.id, permission.resource);
        uniqueResources.push(permission.resource);
      }
      
      // Mapear recursos para permissões de visualização
      if (permission.resource && permission.action?.name === "view") {
        viewPermissionsMap.set(permission.resource.id, permission.id);
      }
    });
    
    setResources(uniqueResources);
    setResourceViewPermissions(viewPermissionsMap);
  }, [permissions]);

  // Filtrar itens de menu disponíveis para serem pais (evitar ciclos)
  const availableParents = menuItems.filter(menuItem => 
    // Não pode ser o próprio item
    menuItem.id !== item.id && 
    // Não pode ser um descendente do item atual
    !isDescendant(menuItem, item.id)
  );
  
  // Efeito para verificar se o parentId está na lista de disponíveis
  useEffect(() => {
    if (item.parentId) {
      // Verificar se o pai atual está na lista de disponíveis
      const parentExists = availableParents.some(p => p.id === item.parentId);
      // Se existir, use-o; caso contrário, defina como "none"
      setParentId(parentExists ? item.parentId : "none");
    }
  }, [item.parentId, availableParents]);

  // Função para verificar se um item é descendente de outro
  function isDescendant(menuItem: MenuItemWithRelations, targetId: string): boolean {
    if (!menuItem.children) return false;
    
    return menuItem.children.some(child => 
      child.id === targetId || isDescendant(child, targetId)
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("id", item.id);
    formData.append("label", label);
    formData.append("icon", icon);
    formData.append("href", href);
    formData.append("parentId", parentId);
    formData.append("showInMenu", showInMenu.toString());
    
    // Obter a permissão de visualização para o recurso selecionado, ou "none" se nenhum recurso for selecionado
    const viewPermissionId = selectedResourceId 
      ? resourceViewPermissions.get(selectedResourceId) || "none"
      : "none";
    formData.append("permissionId", viewPermissionId);
    
    try {
      const res = await updateMenuItem(formData);
      setLoading(false);
      
      if (res.success) {
        setOpen(false);
        onMenuUpdated();
        toast.success("Item de menu atualizado com sucesso");
      } else {
        toast.error(res.message || "Erro ao atualizar item de menu");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Erro ao atualizar item de menu");
      console.error("Erro ao atualizar item de menu:", error);
    }
  }

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Editar item de menu</DialogTitle>
        <DialogDescription>
          Atualize as informações do item de menu abaixo.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="menu-label" className="block text-sm font-medium">Nome</label>
          <Input
            id="menu-label"
            value={label}
            onChange={e => setLabel(e.target.value)}
            required
            minLength={2}
            maxLength={50}
            autoFocus
            placeholder="Nome do item de menu"
          />
        </div>
        <div>
          <label htmlFor="menu-icon" className="text-sm font-medium flex items-center">
            Ícone
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]">
                  <p>Use o nome do ícone do Lucide Icons.</p>
                  <p className="mt-1">Exemplos: {iconExamples}</p>
                  <p className="mt-1 text-xs">Veja todos em: <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-primary">lucide.dev/icons</a></p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <div className="flex gap-2">
            <Input
              id="menu-icon"
              value={icon}
              onChange={e => setIcon(e.target.value)}
              placeholder="Ex: home, settings, users"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-primary">
              Ver todos os ícones disponíveis
            </a>
          </p>
        </div>
        
        <div>
          <label htmlFor="menu-href" className="block text-sm font-medium">Link</label>
          <Input
            id="menu-href"
            value={href}
            onChange={e => setHref(e.target.value)}
            placeholder="Ex: /dashboard/settings"
            required
          />
        </div>
        
        <div>
          <label htmlFor="menu-parent" className="block text-sm font-medium">Item Pai</label>
          <Select
            value={parentId}
            onValueChange={setParentId}
          >
            <SelectTrigger id="menu-parent">
              <SelectValue placeholder="Selecione um item pai" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum (item raiz)</SelectItem>
              {availableParents.map(parent => (
                <SelectItem key={parent.id} value={parent.id}>
                  {parent.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>         
        </div>
        
        {/* Seleção de Recurso */}
        <div>
          <label htmlFor="menu-resource" className="block text-sm font-medium">Recurso</label>
          <Select
            value={selectedResourceId || "none"}
            onValueChange={(value) => setSelectedResourceId(value === "none" ? null : value)}
          >
            <SelectTrigger id="menu-resource">
              <SelectValue placeholder="Selecione um recurso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum (público)</SelectItem>
              {resources.map(resource => (
                <SelectItem key={resource.id} value={resource.id}>
                  {resource.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Selecione o recurso que o usuário precisa ter permissão para visualizar
          </p>
        </div>
        
        {/* Opção de mostrar no menu */}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="show-in-menu" 
            checked={showInMenu} 
            onCheckedChange={(checked) => setShowInMenu(checked as boolean)}
          />
          <label
            htmlFor="show-in-menu"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Mostrar no menu
          </label>
        </div>
        
        <DialogFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
