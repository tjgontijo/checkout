'use server';

import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';

/**
 * Serviço centralizado para registro de auditoria no sistema
 */
/**
 * Serviço centralizado para registro de auditoria no sistema
 */
export async function logAudit(
  userId: string,
  action: string,
  description: string,
  metadata?: Record<string, unknown>
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        description,
        metadata: metadata ? JSON.stringify(metadata) : null,
        ipAddress: null, // Poderia ser capturado aqui se necessário
        userAgent: null, // Poderia ser capturado aqui se necessário
      },
    });
  } catch (error) {
    // Log do erro, mas não propaga para não interromper operações principais
    logger.error(
      `Erro ao registrar auditoria: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      {
        userId,
        action,
        error,
      }
    );
  }
}
