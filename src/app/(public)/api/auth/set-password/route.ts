import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    // Buscar token válido
    const validToken = await prisma.token.findFirst({
      where: {
        token,
        expires: {
          gt: new Date(),
        },
        type: 'SET_PASSWORD',
      },
      include: {
        user: true,
      },
    });

    if (!validToken) {
      return NextResponse.json({ error: 'Token inválido ou expirado.' }, { status: 400 });
    }

    // Hash da nova senha
    const hashedPassword = await hash(password, 10);

    // Atualizar senha do usuário
    await prisma.user.update({
      where: {
        id: validToken.userId,
      },
      data: {
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });

    // Remover token usado
    await prisma.token.delete({
      where: {
        id: validToken.id,
      },
    });

    return NextResponse.json({ message: 'Senha definida com sucesso!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao definir senha.' }, { status: 500 });
  }
}
