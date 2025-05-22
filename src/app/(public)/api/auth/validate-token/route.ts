import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';
import type { Prisma } from '@prisma/client';
type TransactionClient = Prisma.TransactionClient;

export async function POST(request: Request) {
  try {
    const { token, type = 'VERIFICATION' } = await request.json();

    if (!token) {
      return NextResponse.json({ message: 'Token é obrigatório' }, { status: 400 });
    }

    // Usar transação para garantir atomicidade
    const result = await prisma.$transaction(async (prismaClient: TransactionClient) => {
      // Buscar o token de acordo com o tipo
      const validToken = await prismaClient.token.findFirst({
        where: {
          token: token,
          type: type,
          expires: {
            gt: new Date(),
          },
        },
      });

      if (!validToken) {
        throw new Error('TOKEN_INVALID');
      }

      // Buscar e atualizar o usuário
      const user = await prismaClient.user.findUnique({
        where: { id: validToken.userId },
      });

      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      // Se for token de verificação, atualizar o usuário como verificado
      if (type === 'VERIFICATION') {
        await prismaClient.user.update({
          where: { id: user.id },
          data: {
            emailVerified: new Date(),
            // Campo status removido pois não existe no modelo User
          },
        });
      }

      return { user, token: validToken };
    });

    logger.info(`Token ${type} validado com sucesso para usuário ${result.user.id}`);
    return NextResponse.json({ message: 'Token válido' }, { status: 200 });
  } catch (error) {
    logger.error('Erro na validação de token', error);
    return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 400 });
  }
}
