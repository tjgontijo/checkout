import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from "@prisma/client";
type TransactionClient = Prisma.TransactionClient;
import { hash } from 'bcryptjs'
import { sendVerificationEmail } from '@/lib/emails'
import crypto from 'crypto'
import { cleanPhone, validateBrazilianPhone } from '@/lib/masks/phone'

// Função de validação de senha
const isPasswordValid = (password: string): boolean => {
  // Pelo menos 6 caracteres
  if (password.length < 6) return false

  // Pelo menos uma letra maiúscula
  if (!/[A-Z]/.test(password)) return false

  // Pelo menos uma letra minúscula
  if (!/[a-z]/.test(password)) return false

  // Pelo menos um número
  if (!/[0-9]/.test(password)) return false

  return true
}

export async function POST(request: Request) {
  try {
    const { 
      fullName, 
      email, 
      password, 
      phoneNumber, 
      allowEmailCommunication,
      allowWhatsappCommunication 
    } = await request.json()

    // Validações simplificadas
    if (!fullName?.trim()) {
      return NextResponse.json({ message: 'Nome completo é obrigatório' }, { status: 400 })
    }

    if (!email?.includes('@')) {
      return NextResponse.json({ message: 'Email inválido' }, { status: 400 })
    }

    // Nota: Validação de CPF removida pois o campo não existe no modelo User

    const cleanedPhone = cleanPhone(phoneNumber)
    if (!cleanedPhone || !validateBrazilianPhone(cleanedPhone)) {
      return NextResponse.json({ message: 'Número de telefone inválido' }, { status: 400 })
    }

    // Validação adicional de senha
    if (!isPasswordValid(password)) {
      return NextResponse.json(
        {
          message:
            'A senha deve ter pelo menos 6 caracteres, uma letra maiúscula, uma minúscula e um número',
        },
        { status: 400 }
      )
    }

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json({ message: 'Email já cadastrado' }, { status: 400 })
    }

    // Hash da senha
    const hashedPassword = await hash(password, 12)

    // Criar token de verificação
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas

    // Criar usuário, token de verificação e consentimento em uma transação
    const user = await prisma.$transaction(async (prismaClient: TransactionClient) => {
      // Buscar a role padrão 'USER'
      const defaultRole = await prismaClient.role.findUnique({
        where: { name: 'USER' },
      })

      if (!defaultRole) {
        throw new Error('Papel de usuário padrão não encontrado')
      }

      const newUser = await prismaClient.user.create({
        data: {
          id: crypto.randomBytes(16).toString('hex'),
          email: email.toLowerCase(),
          password: hashedPassword,
          roles: {
            connect: [{ id: defaultRole.id }]
          },          
          fullName: fullName.trim(),
          phoneNumber: cleanedPhone,          
        },
      })

      // Criar token de verificação
      await prismaClient.token.create({
        data: {
          token: verificationToken,
          expires: tokenExpiry,
          type: 'VERIFICATION',
          userId: newUser.id,
        },
      })

      // Salvar consentimento de comunicação
      await prismaClient.userConsent.create({
        data: {
          userId: newUser.id,
          consentGiven: 
            allowEmailCommunication === true || 
            allowWhatsappCommunication === true,
          consentIp: request.headers.get('x-forwarded-for') || 'unknown',
          method: 'web_form',
          serviceContext: 'senasp_events'
        }
      })

      return newUser
    })

    try {
      // Enviar email de verificação
      await sendVerificationEmail(
        email, 
        verificationToken
      )
    } catch (emailError) {
      // Log de erro no servidor sem expor detalhes sensíveis
      console.error('Erro no envio do email:', { 
        message: emailError instanceof Error ? emailError.message : 'Erro desconhecido',
        // Não inclua dados sensíveis aqui
      })

      // Mesmo com erro no email, retornamos sucesso pois o usuário foi criado
      // mas incluímos uma flag indicando o problema com o email
      return NextResponse.json(
        {
          user: { ...user, password: undefined },
          emailError:
            'Conta criada com sucesso, mas houve um problema ao enviar o email de verificação. Por favor, tente novamente mais tarde para receber um novo email de verificação.',
        },
        { status: 201 }
      )
    }

    // Retornar resposta de sucesso sem dados sensíveis
    return NextResponse.json({ 
      message: 'Usuário criado com sucesso. Verifique seu email para ativar a conta.' 
    }, { status: 201 })

  } catch (error) {
    // Log de erro no servidor sem expor detalhes sensíveis
    console.error('Erro no registro:', { 
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      // Não inclua dados sensíveis aqui
    })

    // Retornar erro genérico para o cliente
    return NextResponse.json(
      { message: 'Erro ao criar conta. Por favor, tente novamente.' },
      { status: 500 }
    )
  }
}
