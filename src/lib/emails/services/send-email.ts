import { EmailOptions } from './email-service.interface'
import { NodemailerService } from './nodemailer.service'

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const emailService = new NodemailerService()
  return emailService.sendEmail(options)
}
