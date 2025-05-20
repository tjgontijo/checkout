import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    // Buscar token no banco
    const resetToken = await prisma.token.findUnique({
      where: { 
        token: token,
        type: 'password_reset'
      },
      include: { user: true },
    })

    // Verificar se o token existe
    if (!resetToken) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 400 })
    }

    // Verificar se o token expirou
    if (resetToken.expires < new Date()) {
      return NextResponse.json({ error: 'Token expirado' }, { status: 400 })
    }

    // Atualizar senha do usuário
    await prisma.user.update({
      where: { id: resetToken.user.id },
      data: { 
        password: await hash(password, 10),
        emailVerified: new Date() 
      },
    })

    // Remover token de reset
    await prisma.token.delete({
      where: { id: resetToken.id },
    })

    return NextResponse.json({ message: 'Senha atualizada com sucesso' }, { status: 200 })
  } catch (error) {
    console.error('Erro ao redefinir senha:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
