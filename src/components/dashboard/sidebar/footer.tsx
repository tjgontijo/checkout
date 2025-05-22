import React, { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useSidebar, UserInfo } from '@/providers/sidebar-provider';
import {
  LogOut,
  User as UserIcon,
  Settings,
  HelpCircle,
  MoreVertical,
  Palette,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SidebarFooterProps {
  open: boolean;
}

// Componente para alternar entre temas
function TemaSwitcher() {
  const { setTheme } = useTheme();

  return (
    <>
      <DropdownMenuItem onClick={() => setTheme('light')}>
        <Sun className="mr-2 h-4 w-4" />
        <span>Claro</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('dark')}>
        <Moon className="mr-2 h-4 w-4" />
        <span>Escuro</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('system')}>
        <Monitor className="mr-2 h-4 w-4" />
        <span>Sistema</span>
      </DropdownMenuItem>
    </>
  );
}

export function SidebarFooter({ open }: SidebarFooterProps) {
  // Usar useSession para obter dados da sessão
  const { data: session, status } = useSession();
  // Usar useSidebar para obter/atualizar informações do usuário
  const { userInfo, isUserLoading, updateUserInfo } = useSidebar();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Estado para controlar quando a sessão está totalmente carregada
  const [isSessionFullyLoaded, setIsSessionFullyLoaded] = useState(false);

  // Monitora a sessão para detectar quando está totalmente carregada e atualiza o cache
  useEffect(() => {
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
      const timer = setTimeout(() => {
        setIsSessionFullyLoaded(true);

        // Atualizar as informações do usuário no provider e localStorage
        if (session.user) {
          const userInfoData: UserInfo = {
            name: session.user.name || 'Usuário',
            email: session.user.email || 'Sem email',
            image: session.user.image || undefined,
            permissions: (session.user.permissions as string[]) || [],
          };
          updateUserInfo(userInfoData);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [session, status, updateUserInfo]);

  // Só mostra o conteúdo quando a sessão estiver totalmente carregada
  const isLoading = !isSessionFullyLoaded || isUserLoading;

  // Usar dados do cache ou da sessão
  const userData = React.useMemo(() => {
    // Priorizar dados do cache para carregamento rápido
    if (userInfo) {
      return userInfo;
    }

    // Fallback para dados da sessão
    if (session && 'user' in session && session.user) {
      return {
        name: session.user.name || 'Usuário',
        email: session.user.email || 'Sem email',
        image: session.user.image || undefined,
      };
    }

    return {
      name: 'Usuário',
      email: 'Sem email',
    };
  }, [session, userInfo]);

  const handleLogout = async () => {
    // Limpar chaves específicas do localStorage
    const keysToRemove = [
      'menu-storage', // Chave do menu da sidebar
      'sidebar-storage', // Chave do estado da sidebar (aberta/fechada)
      'user-storage', // Chave das informações do usuário
      'nextauth.message', // Limpa mensagem de sessão do NextAuth
    ];

    keysToRemove.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch (err) {
        console.warn(`Erro ao remover ${key} do localStorage:`, err);
      }
    });

    // Logout padrão
    await signOut({ redirect: false });
    window.location.href = '/';
  };

  // Renderiza o skeleton do footer quando a sessão está carregando
  if (isLoading) {
    return (
      <div className="border-t p-4">
        {open ? (
          <div className="flex items-center space-x-2 rounded-md p-2">
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 h-4 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-3 w-20 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
            </div>
            <div className="h-5 w-5 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></div>
          </div>
        ) : (
          <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></div>
        )}
      </div>
    );
  }

  // Renderiza o footer normal quando a sessão está carregada
  return (
    <div className="border-t p-4">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          {open ? (
            <div className="flex cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-slate-900">
              <Avatar>
                {session?.user?.image ? (
                  <AvatarImage src={session.user.image} alt={userData.name} />
                ) : null}
                <AvatarFallback>
                  <UserIcon />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{userData.name}</div>
                <div className="truncate text-xs text-gray-500">{userData.email}</div>
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
        <DropdownMenuContent className="w-56" align={open ? 'start' : 'center'}>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <Palette className="mr-2 h-4 w-4" />
                <span>Tema</span>
                <ChevronRight className="ml-auto h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-36">
              <TemaSwitcher />
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600"
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
