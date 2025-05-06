import nodemailer from 'nodemailer'
import { IEmailService, EmailOptions } from './email-service.interface'

interface NodemailerError extends Error {
  response?: string
}

export class NodemailerService implements IEmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      secure: process.env.EMAIL_SERVER_PORT === '465',
    })
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: options.from || process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }

      const info = await this.transporter.sendMail(mailOptions)
      console.log('Email enviado:', info.messageId)
      return true
    } catch (error) {
      const nodeMailerError = error as NodemailerError
      console.error('Erro ao enviar email:', {
        error: nodeMailerError.message,
        timestamp: new Date().toISOString(),
        details: nodeMailerError.response || 'Sem detalhes adicionais',
      })
      throw nodeMailerError
    }
  }
}
