export function getSetInitialPasswordEmailTemplate(
  setPasswordUrl: string,
  userName: string
): string {
  const systemName = process.env.NEXT_PUBLIC_SYSTEM_FULL_NAME;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5; text-align: center;">${systemName}</h1>
      <h2 style="color: #374151;">Bem-vindo(a) ${userName}!</h2>
      <p style="color: #4B5563; line-height: 1.5;">
        Uma conta foi criada para você na plataforma ${systemName}. Para começar a usar sua conta,
        você precisa definir uma senha. Clique no botão abaixo para criar sua senha:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${setPasswordUrl}" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Criar Senha
        </a>
      </div>
      <p style="color: #6B7280; font-size: 14px;">
        Este link é válido por 24 horas. Se você não conseguir definir sua senha neste período,
        entre em contato com o administrador para solicitar um novo link.
      </p>
      <p style="color: #6B7280; font-size: 14px;">
        Se o botão não funcionar, copie e cole este link no seu navegador:<br>
        <a href="${setPasswordUrl}" style="color: #4F46E5;">${setPasswordUrl}</a>
      </p>
    </div>
  `
}
