import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'
import { sendPasswordResetEmail } from '@/lib/emails'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Por segurança, não informamos se o usuário existe ou não
      return NextResponse.json({
        message:
          'Se um usuário com este email existir, você receberá um link para redefinir sua senha.',
      })
    }

    // Gerar token de redefinição
    const token = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000) // 1 hora

    // Salvar token no banco
    await prisma.token.create({
      data: {
        token,
        expires,
        type: 'password_reset',
        userId: user.id,
      },
    })

    // Enviar email usando a função existente
    await sendPasswordResetEmail(email, token)

    return NextResponse.json({
      message:
        'Se um usuário com este email existir, você receberá um link para redefinir sua senha.',
    })
  } catch (error) {
    console.error('Erro ao processar solicitação de redefinição de senha:', error)
    return NextResponse.json({ error: 'Erro ao processar solicitação' }, { status: 500 })
  }
}
