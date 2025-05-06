import "@/styles/globals.css"
import { Suspense } from 'react'
import { ThemeProvider } from '@/providers/theme-provider'
import { QueryProvider } from "@/providers/query-provider"
import { ToasterProvider } from "@/components/ui/toaster-provider"
import SidebarServer from '@/components/dashboard/sidebar/sidebar-server'
import { SidebarProvider } from '@/providers/sidebar-provider'
import { SessionProvider } from '@/providers/session-provider'

// Configuração para indicar explicitamente que todas as páginas do dashboard são dinâmicas (SSR)
// Isso resolve os avisos de "Dynamic server usage" durante o build
export const dynamic = "force-dynamic";

// Componente de fallback para o sidebar enquanto carrega
function SidebarFallback() {
  return (
    <div className="h-full w-16 bg-zinc-50 dark:bg-gray-800 border-r rounded-lg shadow animate-pulse">
      {/* Skeleton do header */}
      <div className="p-4 border-b flex justify-center">
        <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <SessionProvider>
          <SidebarProvider>
            <div className="flex w-full h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
              {/* Sidebar com Suspense para lidar com carregamento */}
              <aside className="h-full">
                <Suspense fallback={<SidebarFallback />}>
                  <SidebarServer />
                </Suspense>
              </aside>
              
              {/* Main Content */}
              <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 p-8">
                {children}
              </main>
            </div>
            
            {/* Notifications */}
            <ToasterProvider />
          </SidebarProvider>
        </SessionProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
