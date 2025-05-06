"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin, logAudit } from "./utils";
import { z } from "zod";

// Schema para validação da reordenação
const reorderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    order: z.number(),
  })),
});

/**
 * Reordenar itens de menu
 */
export async function reorderMenuItems(formData: FormData) {
  try {
    // Verificar permissões
    const user = await requireAdmin();
    
    // Extrair dados
    const itemsJson = formData.get("items") as string;
    
    if (!itemsJson) {
      throw new Error("Dados de reordenação não fornecidos");
    }
    
    // Validar dados
    const items = reorderSchema.parse(JSON.parse(itemsJson));
    
    // Atualizar a ordem de cada item
    const updates = items.items.map(item => 
      prisma.menuItem.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    );
    
    // Executar todas as atualizações em uma transação
    await prisma.$transaction(updates);
    
    // Registrar no log de auditoria
    await logAudit(
      user.id,
      "menu.reorder",
      "Itens de menu reordenados",
      { items: items.items }
    );
    
    // Revalidar cache
    revalidatePath("/dashboard/settings/menus");
    revalidateTag("menu");
    
    return {
      success: true,
      message: "Itens de menu reordenados com sucesso"
    };
  } catch (error: unknown) {
    console.error("Erro ao reordenar itens de menu:", error);
    
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
      message: "Ocorreu um erro ao reordenar os itens de menu",
    };
  }
}
