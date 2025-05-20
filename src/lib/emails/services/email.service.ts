import { NodemailerService } from './nodemailer.service'
import { getVerificationEmailTemplate } from '../templates/verification.template'
import { getResetPasswordEmailTemplate } from '../templates/reset-password.template'
import { getSetInitialPasswordEmailTemplate } from '../templates/set-initial-password.template'
import logger from '@/lib/logger'

const emailService = new NodemailerService()

interface SendEmailOptions {
  to: string
  token: string
  type: 'verification' | 'reset-password' | 'set-password'
  name?: string
}

export async function sendEmail({ to, token, type, name }: SendEmailOptions) {
  const baseUrl = process.env.NEXTAUTH_URL?.replace(/\/+$/, '') // Remove trailing slashes

  try {
    if (type === 'verification') {
      
      const verificationUrl = `${baseUrl}/verify?token=${token}`
      await emailService.sendEmail({
        to,
        subject: 'Confirme seu cadastro',
        html: getVerificationEmailTemplate(verificationUrl),
      })
    } else if (type === 'reset-password') {
      const resetPasswordUrl = `${baseUrl}/reset-password?token=${token}`
      await emailService.sendEmail({
        to,
        subject: 'Redefinição de Senha',
        html: getResetPasswordEmailTemplate(resetPasswordUrl),
      })
    } else if (type === 'set-password') {
      const setPasswordUrl = `${baseUrl}/set-password?token=${token}`
      await emailService.sendEmail({
        to,
        subject: 'Bem-vindo - Crie sua senha',
        html: getSetInitialPasswordEmailTemplate(setPasswordUrl, name || ''),
      })
    } else {
      throw new Error('Invalid email type')
    }

    return true
  } catch (error) {
    logger.error('Erro ao enviar email', { 
      type, 
      to, 
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      context: 'email_service'
    })
    throw error
  }
}
