"use client";

import { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createMenuItem } from "@/app/dashboard/settings/menus/actions";
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

interface CreateMenuDialogProps {
  onMenuCreated: () => void;
  setOpen: (open: boolean) => void;
  menuItems: MenuItemWithRelations[];
  permissions: PermissionWithRelations[];
}

export function CreateMenuDialog({ onMenuCreated, setOpen, menuItems, permissions }: CreateMenuDialogProps) {
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState("");
  const [href, setHref] = useState("");
  const [parentId, setParentId] = useState("none"); // "none" para item raiz
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("label", label);
    formData.append("icon", icon);
    formData.append("href", href);
    formData.append("order", "0"); // Ordem padrão inicial
    formData.append("parentId", parentId); // Valor selecionado pelo usuário
    formData.append("showInMenu", "true"); // Visível por padrão
    // Obter a permissão de visualização para o recurso selecionado, ou "none" se nenhum recurso for selecionado
    const viewPermissionId = selectedResourceId 
      ? resourceViewPermissions.get(selectedResourceId) || "none"
      : "none";
    formData.append("permissionId", viewPermissionId);
    
    try {
      const res = await createMenuItem(formData);
      setLoading(false);
      
      if (res.success) {
        setLabel("");
        setIcon("");
        setHref("");
        setOpen(false);
        onMenuCreated();
        toast.success("Item de menu criado com sucesso");
      } else {
        toast.error(res.message || "Erro ao criar item de menu");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Erro ao criar item de menu");
      console.error("Erro ao criar item de menu:", error);
    }
  }

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Criar novo item de menu</DialogTitle>
        <DialogDescription>
          Crie um novo item de menu preenchendo os campos abaixo.
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
              {menuItems.map(item => (
                <SelectItem key={item.id} value={item.id}>
                  {item.label}
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
        <DialogFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar item"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
