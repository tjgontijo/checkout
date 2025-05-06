'use client'

import dynamic from 'next/dynamic'

// Importar o Toaster dinamicamente para evitar problemas de hidratação
const DynamicToaster = dynamic(
  () => import('sonner').then((mod) => {
    const { Toaster } = mod
    return function ToasterWrapper(props: React.ComponentProps<typeof Toaster>) {
      return (
        <Toaster 
          position="bottom-right"
          closeButton
          richColors
          {...props} 
        />
      )
    }
  }),
  { ssr: false } // Desabilitar SSR para este componente
)

export function ToasterProvider() {
  return <DynamicToaster />;
}
