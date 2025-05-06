"use server";

import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Revalida o cache de menus
 * Esta função deve ser chamada sempre que houver alterações nos menus
 * para garantir que as mudanças sejam refletidas em toda a aplicação
 */
export async function invalidateMenuCache() {
  revalidatePath("/dashboard/settings/menus");
  revalidateTag("menu");
  revalidateTag("navigation");
}
