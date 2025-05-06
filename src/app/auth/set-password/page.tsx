import { Suspense } from 'react'
import { SetPasswordForm } from '@/components/auth/set-password-form'

export default function SetPasswordPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Definir Senha</h1>
          <p className="text-sm text-muted-foreground">Digite sua nova senha abaixo</p>
        </div>
        <Suspense fallback={<div>Carregando...</div>}>
          <SetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
