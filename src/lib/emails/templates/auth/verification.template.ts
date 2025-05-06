export function getVerificationEmailTemplate(verificationUrl: string): string {
  const systemName = process.env.NEXT_PUBLIC_SYSTEM_FULL_NAME;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5; text-align: center;">${systemName}</h1>
      <h2 style="color: #374151;">Confirme aqui o seu cadastro.</h2>
      <p style="color: #4B5563; line-height: 1.5;">
        Obrigado por se cadastrar! Por favor, clique no botão abaixo para verificar seu email:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Verificar Email
        </a>
      </div>
      <p style="color: #6B7280; font-size: 14px;">
        Se você não criou uma conta em nosso sistema, pode ignorar este email.
      </p>     
    </div>
  `
}
