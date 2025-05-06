"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin, logAudit } from "./utils";

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
  try {
    // Verificar permissões
    const user = await requireAdmin(); // user agora possui id, email, fullName, etc. Tipagem consistente com o schema.prisma
    
    // Extrair e validar dados
    const rawData: Record<string, string | boolean | null> = {};
    formData.forEach((value, key) => {
      if (key === "showInMenu") {
        rawData[key] = value === "true";
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
    revalidatePath("/dashboard/settings/menus");
    revalidateTag("menu");
    
    return {
      success: true,
      message: "Item de menu criado com sucesso",
      data: newMenuItem
    };
  } catch (error: unknown) {
    console.error("Erro ao criar item de menu:", error);
    
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
