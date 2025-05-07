"use client"

import * as React from "react"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { fetchSidebarData } from "@/lib/actions/sidebar/fetch-sidebar"
import * as LucideIcons from "lucide-react"
import { LucideProps } from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

// Tipo para o item de menu
export type MenuItem = {
  id: string
  label: string
  href: string
  icon: string
  parentId?: string
  parent?: MenuItem
  children?: MenuItem[]
  permissionId?: string
  showInMenu?: boolean
  order?: number
  requiredPermissions?: string[]
  description?: string
}

// Função para converter nome de ícone em componente
export function getIconComponent(
  iconName: string
): ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> {
  const IconComponent = (
    LucideIcons as unknown as Record<
      string,
      ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
    >
  )[iconName]
  return IconComponent || LucideIcons.Menu
}

// Chaves para armazenar estados no localStorage
const SIDEBAR_STATE_KEY = "sidebar-storage"
const MENU_STORAGE_KEY = "menu-storage"
const USER_STORAGE_KEY = "user-storage"

// Tempo de expiração do cache em milissegundos (30 minutos)
const CACHE_EXPIRATION = 30 * 60 * 1000

// Tipos para o contexto da sidebar
// Tipo para informações do usuário no footer
export type UserInfo = {
  name: string
  email: string
  image?: string
  permissions?: string[]
}

type CachedUser = {
  info: UserInfo
  timestamp: number
}

type SidebarContext = {
  // Estado de abertura da sidebar
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  toggleSidebar: () => void
  
  // Estado dos itens de menu
  menuItems: MenuItem[]
  isLoading: boolean
  error: Error | null
  refreshSidebar: () => Promise<MenuItem[]>
  
  // Informações do usuário para o footer
  userInfo: UserInfo | null
  isUserLoading: boolean
  updateUserInfo: (info: UserInfo) => void
}

type CachedMenu = {
  items: MenuItem[]
  timestamp: number
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

// Função para ler o estado inicial da sidebar do localStorage
const getSavedSidebarState = (): boolean => {
  if (typeof window === "undefined") return true // Padrão para SSR
  
  try {
    const saved = localStorage.getItem(SIDEBAR_STATE_KEY)
    return saved !== "collapsed" // true = expandido (padrão), false = recolhido
  } catch {
    // Fallback em caso de erro (navegadores privados, etc)
    return true
  }
}

/**
 * Provider unificado para gerenciar o estado da sidebar e seus menus
 * Implementa cache no localStorage e integração com server actions
 */
export function SidebarProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Estado de abertura da sidebar
  const [open, setOpen] = React.useState(getSavedSidebarState)
  
  // Estado dos itens de menu
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)
  
  // Estado das informações do usuário
  const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null)
  const [isUserLoading, setIsUserLoading] = React.useState(true)
  
  // Função para alternar o estado da sidebar
  const toggleSidebar = React.useCallback(() => {
    setOpen(prevOpen => !prevOpen)
  }, [])
  
  // Efeito para salvar o estado da sidebar no localStorage quando mudar
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SIDEBAR_STATE_KEY, open ? "expanded" : "collapsed")
      } catch {
        // Ignora erros (modo privado, etc.)
      }
    }
  }, [open])
  
  // Adicionar atalho de teclado para abrir/fechar sidebar
  useKeyboardShortcuts([
    {
      key: 'b',
      modifier: 'meta', // para Mac (Command)
      action: toggleSidebar
    },
    {
      key: 'b',
      modifier: 'ctrl', // para Windows/Linux (Ctrl)
      action: toggleSidebar
    }
  ])
  
  // Função para buscar os dados da sidebar do servidor
  const fetchSidebar = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Usar a server action para buscar os dados
      const items = await fetchSidebarData()
      
      // Atualizar o estado
      setMenuItems(items)
      
      // Salvar no localStorage com timestamp
      const cacheData: CachedMenu = {
        items,
        timestamp: Date.now()
      }
      
      try {
        localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(cacheData))
      } catch (err) {
        // Ignorar erros de localStorage (modo privado, etc)
        console.warn('Não foi possível salvar menu no localStorage:', err)
      }
      
      return items
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido')
      setError(error)
      console.error('Erro ao carregar dados da sidebar:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }
  
  // Carregar menu do localStorage ou da server action na inicialização
  React.useEffect(() => {
    const loadSidebar = async () => {
      try {
        // Tentar carregar do localStorage primeiro
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem(MENU_STORAGE_KEY)
          
          if (cached) {
            try {
              const parsedCache = JSON.parse(cached) as CachedMenu
              const now = Date.now()
              
              // Verificar se o cache ainda é válido
              if (parsedCache.timestamp && now - parsedCache.timestamp < CACHE_EXPIRATION) {
                setMenuItems(parsedCache.items)
                setIsLoading(false)
                
                // Atualizar em segundo plano após usar o cache
                setTimeout(() => fetchSidebar(), 1000)
                return
              }
            } catch (parseErr) {
              console.warn('Erro ao processar cache do menu:', parseErr)
              // Continua para buscar do servidor
            }
          }
        }
        
        // Se não tiver cache válido, buscar do servidor
        await fetchSidebar()
      } catch (err) {
        // Se falhar ao ler do localStorage, buscar da API
        console.warn('Erro ao ler cache do menu:', err)
        await fetchSidebar()
      }
    }
    
    loadSidebar()
  }, [])
  
  const state = open ? "expanded" : "collapsed"
  
  // Função para atualizar as informações do usuário
  const updateUserInfo = React.useCallback((info: UserInfo) => {
    setUserInfo(info)
    
    // Salvar no localStorage com timestamp
    try {
      const cacheData: CachedUser = {
        info,
        timestamp: Date.now()
      }
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(cacheData))
    } catch (err) {
      console.warn('Não foi possível salvar informações do usuário no localStorage:', err)
    }
  }, [])
  
  // Carregar informações do usuário do localStorage na inicialização
  React.useEffect(() => {
    const loadUserInfo = () => {
      try {
        // Tentar carregar do localStorage
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem(USER_STORAGE_KEY)
          
          if (cached) {
            try {
              const parsedCache = JSON.parse(cached) as CachedUser
              const now = Date.now()
              
              // Verificar se o cache ainda é válido (24 horas)
              if (parsedCache.timestamp && now - parsedCache.timestamp < 24 * 60 * 60 * 1000) {
                setUserInfo(parsedCache.info)
              }
            } catch (parseErr) {
              console.warn('Erro ao processar cache do usuário:', parseErr)
            }
          }
        }
      } catch (err) {
        console.warn('Erro ao ler cache do usuário:', err)
      } finally {
        setIsUserLoading(false)
      }
    }
    
    loadUserInfo()
  }, [])
  
  // Valor do contexto unificado
  const contextValue = React.useMemo<SidebarContext>(
    () => ({
      // Estado da sidebar
      state,
      open,
      setOpen,
      toggleSidebar,
      
      // Estado do menu
      menuItems,
      isLoading,
      error,
      refreshSidebar: fetchSidebar,
      
      // Informações do usuário
      userInfo,
      isUserLoading,
      updateUserInfo
    }),
    [state, open, setOpen, toggleSidebar, menuItems, isLoading, error, userInfo, isUserLoading, updateUserInfo]
  )
  
  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  )
}

/**
 * Hook para acessar o contexto da sidebar
 */
export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar deve ser usado dentro de um SidebarProvider")
  }
  return context
}

/**
 * Hook para acessar apenas os itens de menu da sidebar
 * Mantido por compatibilidade com código existente
 */
export function useMenu() {
  const { menuItems, isLoading, error, refreshSidebar } = useSidebar()
  return {
    menuItems,
    isLoading,
    error,
    refreshMenu: refreshSidebar
  }
}
