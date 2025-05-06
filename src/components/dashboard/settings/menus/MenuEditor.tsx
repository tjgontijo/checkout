"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MenuItemWithRelations, PermissionWithRelations } from "./MenuManagement";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Schema de validação para o formulário
const menuItemSchema = z.object({
  label: z.string().min(2, "O rótulo deve ter pelo menos 2 caracteres"),
  icon: z.string().optional().nullable(),
  href: z.string().optional().nullable(),
  order: z.coerce.number().int().min(0, "A ordem deve ser um número positivo"),
  parentId: z.string().optional().nullable(),
  showInMenu: z.boolean().default(true),
  permissionId: z.string().optional().nullable(),
});

// Tipo derivado do schema
type MenuItemFormValues = z.infer<typeof menuItemSchema>;

// Props do componente
interface MenuEditorProps {
  mode: "create" | "edit";
  item: MenuItemWithRelations;
  permissions: PermissionWithRelations[];
  menuItems: MenuItemWithRelations[];
  onClose: () => void;
}

export function MenuEditor({ mode, item, permissions, menuItems, onClose }: MenuEditorProps) {
  // Estado para controlar o loading durante o envio
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Inicializar o formulário com os valores do item
  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      label: item.label || "",
      icon: item.icon || null,
      href: item.href || null,
      order: item.order || 0,
      parentId: item.parentId || null,
      showInMenu: item.showInMenu !== false, // default para true
      permissionId: item.permission?.id || null,
    },
  });
  
  // Função para lidar com o envio do formulário
  const onSubmit = async (data: MenuItemFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Preparar os dados para enviar à Server Action
      const formData = new FormData();
      
      if (mode === "edit") {
        formData.append("id", item.id);
      }
      
      // Adicionar todos os campos do formulário
      Object.entries(data).forEach(([key, value]) => {
        // Tratar valores null/undefined
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      // Importar a Server Action dinamicamente
      let result;
      
      if (mode === "create") {
        const { createMenuItem } = await import("@/app/dashboard/settings/menus/actions");
        result = await createMenuItem(formData);
      } else {
        const { updateMenuItem } = await import("@/app/dashboard/settings/menus/actions");
        result = await updateMenuItem(formData);
      }
      
      // Exibir mensagem de sucesso/erro
      if (result.success) {
        toast.success(result.message);
        onClose(); // Fechar o editor após sucesso
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Erro ao salvar item de menu:", error);
      toast.error("Ocorreu um erro ao salvar o item de menu");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Lista de ícones disponíveis (pode ser expandida)
  const availableIcons = [
    "Home", "Settings", "User", "Users", "FileText", "Folder", 
    "FolderOpen", "Package", "ShoppingCart", "CreditCard", "Calendar", 
    "BarChart", "PieChart", "Mail", "MessageSquare", "Bell", "Menu",
    "List", "ListChecks", "CheckSquare", "CircleDot", "Grid", "Layout",
    "LayoutDashboard", "Shield", "ShieldCheck", "Lock", "Unlock", "Key"
  ];
  
  // Filtrar a lista de itens de menu para evitar ciclos (não pode selecionar o próprio item ou seus filhos como pai)
  const availableParents = menuItems.filter(menuItem => {
    // Se estamos no modo de edição, não podemos selecionar o próprio item
    if (mode === "edit" && menuItem.id === item.id) {
      return false;
    }
    
    // Função recursiva para verificar se um item é descendente de outro
    const isDescendant = (parent: MenuItemWithRelations, childId: string): boolean => {
      if (!parent.children || parent.children.length === 0) {
        return false;
      }
      
      return parent.children.some(child => 
        child.id === childId || isDescendant(child, childId)
      );
    };
    
    // No modo de edição, não podemos selecionar descendentes do item atual
    return !(mode === "edit" && isDescendant(menuItem, item.id));
  });
  
  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {mode === "create" ? "Novo Item de Menu" : "Editar Item de Menu"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create" 
              ? "Preencha os campos abaixo para criar um novo item de menu." 
              : "Edite as informações do item de menu selecionado."}
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Campo: Label */}
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rótulo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Dashboard" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nome que será exibido no menu
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Campo: Ícone */}
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ícone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um ícone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Nenhum ícone</SelectItem>
                        {availableIcons.map(icon => (
                          <SelectItem key={icon} value={icon}>
                            {icon}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Ícone que será exibido ao lado do rótulo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Campo: Href */}
              <FormField
                control={form.control}
                name="href"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: /dashboard" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>
                      Caminho para onde o item de menu irá direcionar
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Campo: Ordem */}
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordem</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    <FormDescription>
                      Posição do item no menu (menor = primeiro)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Campo: Item Pai */}
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Pai</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um item pai" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Nenhum (item raiz)</SelectItem>
                        {availableParents.map(parent => (
                          <SelectItem key={parent.id} value={parent.id}>
                            {parent.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Item pai na hierarquia do menu
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Campo: Exibir no Menu */}
              <FormField
                control={form.control}
                name="showInMenu"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Exibir no Menu</FormLabel>
                      <FormDescription>
                        Se desmarcado, o item não será exibido no menu, mas ainda poderá ser acessado diretamente pela URL
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              {/* Campo: Permissão */}
              <FormField
                control={form.control}
                name="permissionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permissão Requerida</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma permissão" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma (público)</SelectItem>
                        {permissions.map(permission => (
                          <SelectItem key={permission.id} value={permission.id}>
                            {permission.resource?.name || ""}.{permission.action?.name || ""} - {permission.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Se selecionada, o item só será exibido para usuários com esta permissão
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Botões de ação */}
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="button" variant="outline">Cancelar</Button>
                </SheetClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
