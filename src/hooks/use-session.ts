'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useSessionRedirect(redirectTo: string = '/dashboard', redirectIfNotAuthenticated?: string) {
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      // Opcional: log ou tratamento de não autenticado
      console.debug('Not authenticated')
    }
  })
  const router = useRouter()

  useEffect(() => {
    // Se o status de autenticação já foi verificado
    if (status !== 'loading') {
      if (session) {
        // Se estiver autenticado, redireciona para o dashboard (ou local especificado)
        router.replace(redirectTo)
      } else if (redirectIfNotAuthenticated) {
        // Se não estiver autenticado e houver um redirecionamento específico
        router.replace(redirectIfNotAuthenticated)
      }
    }
  }, [session, status, router, redirectTo, redirectIfNotAuthenticated])

  return { session, status }
}

export function useRequireAuth(redirectTo: string = '/auth/signin') {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // Opcional: log ou tratamento de não autenticado
      console.debug('Authentication required')
    }
  })
  const router = useRouter()

  useEffect(() => {
    // Se o status de autenticação já foi verificado
    if (status !== 'loading' && !session) {
      // Se não estiver autenticado, redireciona para login
      router.replace(redirectTo)
    }
  }, [session, status, router, redirectTo])

  return { session, status }
}
