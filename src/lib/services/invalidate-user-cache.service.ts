"use server";

import { revalidatePath } from "next/cache";

/**
 * Revalida o cache de qualquer path informado
 */
export async function invalidateCache(path: string): Promise<void> {
  revalidatePath(path);
}

