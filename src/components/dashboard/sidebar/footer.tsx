

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
  // Usar useSession com a opção required para garantir que a sessão esteja disponível
  const { data: session, status } = useSession()
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  // Estado local para armazenar os dados do usuário
  const [userData, setUserData] = useState({
    name: 'Carregando...',
    email: 'Carregando...'
  })
  
  // Atualiza os dados do usuário quando a sessão estiver disponível
  React.useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUserData({
        name: session.user.name || 'Usuário',
        email: session.user.email || 'Sem email'
      })
    } else if (status === 'unauthenticated') {
      setUserData({
        name: 'Usuário',
        email: 'Sem email'
      })
    }
  }, [session, status])

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
  
  return (
    <div className="p-4 border-t">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          {open ? (
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
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
          <DropdownMenuItem>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Ajuda</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-600 focus:text-red-600" 
            onSelect={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
