"use server"

import { getMenu } from '@/lib/services/menu.service'
import { MenuItem } from '@/providers/sidebar-provider'

/**
 * Server Action para buscar todos os dados da sidebar
 * Inclui tratamento de erros e timeout para evitar problemas em produção
 */
export async function fetchSidebarData(): Promise<MenuItem[]> {
  try {
    // Implementação de timeout para evitar que a requisição fique pendente
    const menuItems = await Promise.race([
      getMenu(),
      new Promise<MenuItem[]>((_, reject) => {
        setTimeout(() => {
          reject(new Error("Timeout ao buscar dados da sidebar (5s)"));
        }, 5000); // 5 segundos de timeout
      })
    ]);

    // Garantir que o resultado é um array
    return Array.isArray(menuItems) ? menuItems : [];
  } catch (error) {
    // Log do erro e retorno de array vazio para evitar quebrar a UI
    console.error("Erro ao buscar dados da sidebar:", error);
    return [];
  }
}