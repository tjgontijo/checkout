'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FiMail, FiLock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { useSessionRedirect } from '@/hooks/use-session'

function SignInPageContent() {
  const { } = useSessionRedirect()
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams?.get('registered')
  const email = searchParams?.get('email')

  const [formData, setFormData] = useState({
    email: email || '',
    password: '',
  })
  const [errorState, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(registered === 'true')

  useEffect(() => {
    if (registered === 'true') {
      setSuccess(true)
      // Limpar o parâmetro da URL para evitar mostrar a mensagem novamente
      router.replace('/signin')
    }
  }, [registered, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess(false)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        // Traduzir mensagens de erro específicas
        const errorMessages: { [key: string]: string } = {
          'CredentialsSignin': 'Email ou senha incorretos. Verifique suas credenciais.',
          'default': 'Ocorreu um erro ao fazer login. Tente novamente.'
        }
        
        setError(errorMessages[result.error] || errorMessages['default'])
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Ocorreu um erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <>      
      <div className="mt-8 px-3 sm:mx-auto sm:w-full sm:max-w-md">        
        <div className="transform bg-white px-4 py-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800 sm:rounded-lg sm:px-10">
          {success && (
            <div className="animate-fadeIn mb-4 rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiCheckCircle className="h-5 w-5 text-green-400 dark:text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Sua conta foi criada com sucesso! 
                    Por favor, verifique seu email para confirmar o cadastro.
                  </p>
                </div>
              </div>
            </div>
          )}

          {errorState && (
            <div className="animate-fadeIn mb-4 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-red-400 dark:text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-200">{errorState}</p>
                </div>
              </div>
            </div>
          )}
        <div className="sm:mx-auto sm:w-full sm:max-w-md pb-8">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 transition-colors duration-200 dark:text-white">
            Acessar Conta
          </h2>
        </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border-2 border-gray-300 bg-white py-3 pl-10 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:hover:border-gray-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm"
                  placeholder="seuemail@exemplo.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Senha
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md border-2 border-gray-300 bg-white py-3 pl-10 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:hover:border-gray-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-700"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                >
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/reset-password-request"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  'Entrar'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  Ou continue com
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={true}
                className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-gray-200 px-4 py-3 text-sm font-medium text-gray-400 cursor-not-allowed opacity-50 dark:bg-gray-700 dark:text-gray-500"
              >
                <FcGoogle className="h-5 w-5 mr-2" />
                Entrar com Google (Em breve)
              </button>
            </div>
              <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Não tem uma conta?{' '}
            <Link
              href="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
          </div>
        </div>

      
      </div>
    </>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SignInPageContent />
    </Suspense>
  )
}
