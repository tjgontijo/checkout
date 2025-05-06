"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requirePermission } from "@/lib/services/require-permission.service";
import { invalidateCache } from "@/lib/services/invalidate-user-cache.service";
import { logAudit } from "@/lib/services/audit.service";

// Schema de validação para atualização de itens de menu
const menuItemSchema = z.object({
  label: z.string().min(2, "O rótulo deve ter pelo menos 2 caracteres"),
  icon: z.string().optional().nullable(),
  href: z.string().optional().nullable(),
  order: z.coerce.number().int().min(0, "A ordem deve ser um número positivo"),
  parentId: z.string().optional().nullable(),
  showInMenu: z.coerce.boolean().default(true),
  permissionId: z.string().optional().nullable(),
});

/**
 * Atualizar um item de menu existente
 */
export async function updateMenuItem(formData: FormData) {
  try {
    // Verificar permissões
    const user = await requirePermission("menu.manage");
    
    // Extrair ID do item
    const id = formData.get("id") as string;
    
    if (!id) {
      throw new Error("ID do item de menu não fornecido");
    }
    
    // Verificar se o item existe
    const existingItem = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        permission: true,
        parent: true,
      }
    });
    
    if (!existingItem) {
      throw new Error("Item de menu não encontrado");
    }
    
    // Extrair e validar dados
    const rawData: Record<string, string | boolean | null> = {};
    formData.forEach((value, key) => {
      if (key !== "id") {
        if (key === "showInMenu") {
          rawData[key] = value === "true";
        } else if (key === "parentId" || key === "permissionId") {
          // Tratar valores especiais
          rawData[key] = value === "none" ? null : (typeof value === 'string' ? value : null);
        } else if (typeof value === 'string') {
          rawData[key] = value;
        } else {
          // Se for um File ou outro tipo, converte para null
          rawData[key] = null;
        }
      }
    });
    
    const validatedData = menuItemSchema.parse(rawData);
    
    // Atualizar o item de menu
    const updatedMenuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        label: validatedData.label,
        icon: validatedData.icon ?? "",
        href: validatedData.href ?? "",
        order: validatedData.order,
        parentId: validatedData.parentId || null,
        showInMenu: validatedData.showInMenu,
        permissionId: validatedData.permissionId || null,
      },
      include: {
        permission: true,
        parent: true,
      }
    });
    
    // Registrar no log de auditoria
    await logAudit(
      user.id,
      "menu.update",
      `Item de menu "${existingItem.label}" atualizado`,
      { 
        before: existingItem,
        after: updatedMenuItem
      }
    );
    
    // Revalidar cache
    await invalidateCache("/dashboard/settings/menus");
    
    return {
      success: true,
      message: "Item de menu atualizado com sucesso",
      data: updatedMenuItem
    };
  } catch (error: unknown) {
    console.error("Erro ao atualizar item de menu:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Dados inválidos: " + error.errors.map(e => e.message).join(", "),
      };
    }
    
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }
    
    return {
      success: false,
      message: "Ocorreu um erro ao atualizar o item de menu",
    };
  }
}
