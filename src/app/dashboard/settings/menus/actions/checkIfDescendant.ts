"use server";

import { prisma } from "@/lib/prisma";

/**
 * Verificar se um item é descendente de outro
 * Esta função é útil para evitar ciclos na hierarquia de menus
 * 
 * @param potentialParentId ID do item que seria o pai
 * @param itemId ID do item que seria o filho
 * @returns true se itemId é descendente de potentialParentId, false caso contrário
 */
export async function checkIfDescendant(potentialParentId: string, itemId: string): Promise<boolean> {
  // Se os IDs são iguais, não pode ser pai de si mesmo
  if (potentialParentId === itemId) {
    return true;
  }
  
  // Buscar os filhos diretos do potencial pai
  const children = await prisma.menuItem.findMany({
    where: { parentId: potentialParentId },
    select: { id: true }
  });
  
  // Se o item é filho direto, retorna true
  if (children.some(child => child.id === itemId)) {
    return true;
  }
  
  // Verificar recursivamente para cada filho
  for (const child of children) {
    const isDescendant = await checkIfDescendant(child.id, itemId);
    if (isDescendant) {
      return true;
    }
  }
  
  // Se chegou até aqui, não é descendente
  return false;
}
