"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requirePermission } from "@/lib/services/require-permission.service";
import { invalidateCache } from "@/lib/services/invalidate-user-cache.service";
import { logAudit } from "@/lib/services/audit.service";

// Schema de validação para criação de itens de menu
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
 * Criar um novo item de menu
 */
export async function createMenuItem(formData: FormData) {
  console.log("Iniciando criação de item de menu. Dados recebidos:", formData);
  const rawData: Record<string, string | boolean | null> = {};
  try {
    // Verificar permissões
    const user = await requirePermission("menuItems.create");
    
    // Extrair e validar dados
    formData.forEach((value, key) => {
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
    });
    
    const validatedData = menuItemSchema.parse(rawData);
    
    // Criar o item de menu
    const newMenuItem = await prisma.menuItem.create({
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
      "menu.create",
      `Item de menu "${newMenuItem.label}" criado`,
      { item: newMenuItem }
    );
    
    // Revalidar cache
    await invalidateCache("/dashboard/settings/menus");
    
    return {
      success: true,
      message: "Item de menu criado com sucesso",
      data: newMenuItem
    };
  } catch (error: unknown) {
    console.error("Erro detalhado ao criar item de menu:", error instanceof Error ? error.message : String(error), "Dados de entrada:", rawData ? rawData : 'Não disponível');
    
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
      message: "Ocorreu um erro ao criar o item de menu",
    };
  }
}
