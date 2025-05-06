"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/services/require-permission.service";
import { invalidateCache } from "@/lib/services/invalidate-user-cache.service";
import { logAudit } from "@/lib/services/audit.service";

/**
 * Excluir um item de menu
 */
export async function deleteMenuItem(formData: FormData) {
  try {
    // Verificar permissões
    const user = await requirePermission("menuItems.delete");
    
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
        children: true,
      }
    });
    
    if (!existingItem) {
      throw new Error("Item de menu não encontrado");
    }
    
    // Verificar se o item tem filhos
    if (existingItem.children && existingItem.children.length > 0) {
      throw new Error("Não é possível excluir um item que possui subitens. Remova os subitens primeiro.");
    }
    
    // Excluir o item de menu
    await prisma.menuItem.delete({
      where: { id }
    });
    
    // Registrar no log de auditoria
    await logAudit(
      user.id,
      "menu.delete",
      `Item de menu "${existingItem.label}" excluído`,
      { item: existingItem }
    );
    
    // Revalidar cache
    await invalidateCache("/dashboard/settings/menus");
    
    return {
      success: true,
      message: "Item de menu excluído com sucesso"
    };
  } catch (error: unknown) {
    console.error("Erro ao excluir item de menu:", error);
    
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }
    
    return {
      success: false,
      message: "Ocorreu um erro ao excluir o item de menu",
    };
  }
}
