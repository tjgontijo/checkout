'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi'

function VerifyPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [verificationAttempted, setVerificationAttempted] = useState(false)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Token não encontrado')
      setTimeout(() => {
        router.push('/auth/signin?error=token-missing')
      }, 3000)
      return
    }

    const verifyToken = async () => {
      // Evita múltiplas tentativas de verificação
      if (verificationAttempted) return

      try {
        setVerificationAttempted(true)
        const response = await fetch('/api/auth/validate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(data.message)
          setTimeout(() => {
            router.push(`/auth/signin?verified=true&email=${encodeURIComponent(data.email)}`)
          }, 3000)
        } else {
          setStatus('error')
          setMessage(data.message)
          setTimeout(() => {
            router.push('/auth/signin?error=verification-failed')
          }, 3000)
        }
      } catch {
        setStatus('error')
        setMessage('Erro ao verificar token')
        setTimeout(() => {
          router.push('/auth/signin?error=verification-error')
        }, 3000)
      }
    }

    verifyToken()
  }, [token, router, verificationAttempted])

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 transition-colors duration-200 dark:text-white">
          Verificação de Email
        </h2>
      </div>

      <div className="mt-8 px-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow dark:bg-gray-800 sm:rounded-lg sm:px-10">
          <div className="text-center">
            {status === 'loading' && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                <p className="text-gray-600 dark:text-gray-400">Verificando seu email...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <FiCheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Email verificado com sucesso!
                  </p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Você será redirecionado para a página de login em alguns segundos...
                  </p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <FiAlertCircle className="mx-auto h-12 w-12 text-red-500" />
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Erro na verificação
                  </p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {message}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <VerifyPageContent />
    </Suspense>
  )
}
