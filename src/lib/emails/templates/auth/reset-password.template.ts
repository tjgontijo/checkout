export function getResetPasswordEmailTemplate(resetPasswordUrl: string): string {
  const systemName = process.env.NEXT_PUBLIC_SYSTEM_FULL_NAME;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5; text-align: center;">${systemName}</h1>
      <h2 style="color: #374151;">Redefinição de Senha</h2>
      <p style="color: #4B5563; line-height: 1.5;">
        Você solicitou a redefinição de sua senha. Clique no botão abaixo para redefinir sua senha:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetPasswordUrl}" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Redefinir Senha
        </a>
      </div>
      <p style="color: #6B7280; font-size: 14px;">
        Se você não solicitou a redefinição de senha, pode ignorar este email.
      </p>
      <p style="color: #6B7280; font-size: 12px;">
        Se o botão não funcionar, copie e cole este link no seu navegador:<br>
        <a href="${resetPasswordUrl}" font-size: 12px; style="color: #4F46E5;">${resetPasswordUrl}</a>
      </p>
    </div>
  `
}
