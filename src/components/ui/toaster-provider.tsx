'use client'

import { Toaster } from 'sonner'

// Utilizando o componente Toaster diretamente com a opção client-only
export function ToasterProvider() {
  return (
    <Toaster
      position="bottom-right"
      closeButton
      richColors
      theme="light"
    />
  )
}
