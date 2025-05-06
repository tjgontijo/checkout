

import React, { useState } from "react"
import { signOut, useSession } from "next-auth/react"
import { 
  LogOut, 
  User as UserIcon, 
  Settings, 
  HelpCircle,
  MoreVertical 
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

interface SidebarFooterProps {
  open: boolean;
}

export function SidebarFooter({ open }: SidebarFooterProps) {
  // Usar useSession para obter dados da sessão
  const { data: session, status } = useSession()
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  // Estado para controlar quando a sessão está totalmente carregada
  const [isSessionFullyLoaded, setIsSessionFullyLoaded] = useState(false)
  
  // Monitora a sessão para detectar quando está totalmente carregada
  React.useEffect(() => {
    // Consideramos a sessão totalmente carregada quando:
    // 1. O status é 'authenticated' (autenticado)
    // 2. Temos um objeto session válido
    // 3. O objeto session tem a propriedade 'user'
    // 4. O objeto user tem pelo menos uma propriedade (name, email, etc.)
    if (
      status === 'authenticated' && 
      session && 
      'user' in session && 
      session.user && 
      Object.keys(session.user).length > 0
    ) {
      // Pequeno delay para garantir estabilidade
      const timer = setTimeout(() => setIsSessionFullyLoaded(true), 50);
      return () => clearTimeout(timer);
    }
  }, [session, status]);
  
  // Só mostra o conteúdo quando a sessão estiver totalmente carregada
  const isLoading = !isSessionFullyLoaded;
  
  // Memoizar os dados do usuário para evitar recalcular a cada renderização
  // No dashboard, sempre teremos um usuário autenticado (middleware garante isso)
  const userData = React.useMemo(() => {
    if (session && 'user' in session && session.user) {
      return {
        name: session.user.name || 'Usuário',
        email: session.user.email || 'Sem email'
      };
    }
    return {
      name: 'Usuário',
      email: 'Sem email'
    };
  }, [session])

  const handleLogout = () => {
    // Limpar chaves específicas do localStorage
    const keysToRemove = [
      'menu-storage',  // Chave do menu
      'sidebar-storage', // Chave do sidebar
      // Adicione outras chaves que queira limpar no logout
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    // Logout padrão
    signOut({ callbackUrl: '/' })
  }
  
  // Renderiza o skeleton do footer quando a sessão está carregando
  if (isLoading) {
    return (
      <div className="p-4 border-t">
        {open ? (
          <div className="flex items-center space-x-2 p-2 rounded-md">
            <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
            <div className="flex-1 min-w-0">
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-1 animate-pulse"></div>
              <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            </div>
            <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
          </div>
        ) : (
          <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto animate-pulse"></div>
        )}
      </div>
    );
  }

  // Renderiza o footer normal quando a sessão está carregada
  return (
    <div className="p-4 border-t">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          {open ? (
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-slate-900 p-2 rounded-md">
              <Avatar>
                {session?.user?.image ? (
                  <AvatarImage src={session.user.image} alt={userData.name} />
                ) : null}
                <AvatarFallback>
                  <UserIcon />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{userData.name}</div>
                <div className="text-xs text-gray-500 truncate">
                  {userData.email}
                </div>
              </div>
              <MoreVertical className="text-gray-500 opacity-70 hover:opacity-100" />
            </div>
          ) : (
            <Avatar className="mx-auto cursor-pointer">
              {session?.user?.image ? (
                <AvatarImage src={session.user.image} alt={userData.name} />
              ) : null}
              <AvatarFallback>
                <UserIcon />
              </AvatarFallback>
            </Avatar>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align={open ? "start" : "center"}>
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Ajuda</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-600 focus:text-red-600 cursor-pointer" 
            onSelect={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
