import '@/styles/globals.css';
import { ThemeProvider } from '@/providers/theme-provider';
import { QueryProvider } from '@/providers/query-provider';
import { ToasterProvider } from '@/components/ui/toaster-provider';
import { SidebarProvider } from '@/providers/sidebar-provider';
import { SessionProvider } from '@/providers/session-provider';
import { Sidebar } from '@/components/dashboard/sidebar/sidebar';

// Configuração para indicar explicitamente que todas as páginas do dashboard são dinâmicas (SSR)
// Isso resolve os avisos de "Dynamic server usage" durante o build
export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryProvider>
        <SessionProvider>
          <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
              {/* Sidebar unificada com melhor performance */}
              <aside className="h-full">
                <Sidebar />
              </aside>

              {/* Main Content */}
              <main className="flex-1 overflow-y-auto bg-white p-8 dark:bg-gray-900">
                {children}
              </main>
            </div>

            {/* Notifications */}
            <ToasterProvider />
          </SidebarProvider>
        </SessionProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
