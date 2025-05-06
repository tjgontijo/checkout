import React from "react";
import { getMenu } from "@/lib/services/menu.service";
import { Sidebar } from "./sidebar";

// Timeout para evitar que a requisição fique pendente indefinidamente
const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Timeout após ${timeoutMs}ms`));
      }, timeoutMs);
    })
  ]);
};

export default async function SidebarServer() {
  try {
    // Busca apenas os itens de menu, sem tentar acessar a sessão
    const menuItems = await withTimeout(getMenu(), 3000);

    // O menu já deve considerar as permissões do usuário, pois getMenu() já filtra
    // com base nas permissões da sessão do usuário atual
    
    // Simplifica: o componente Sidebar buscará as informações do usuário no cliente
    // usando useSession no SidebarFooter
    
    // Garante que menuItems sempre será um array
    return <Sidebar menuItems={Array.isArray(menuItems) ? menuItems : []} />;
  } catch (error) {
    console.error("Erro ao carregar menu:", error);
    // Retorna um menu vazio em caso de erro
    return <Sidebar menuItems={[]} />;
  }
}
