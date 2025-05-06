export interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export interface IEmailService {
  sendEmail(options: EmailOptions): Promise<boolean>
}
