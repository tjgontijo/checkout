"use client"

import * as React from "react"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

// Chave para armazenar o estado da sidebar no localStorage
const SIDEBAR_STATE_KEY = "sidebar-storage";

// Função para ler o estado inicial da sidebar do localStorage
const getSavedSidebarState = (): boolean => {
  if (typeof window === "undefined") return true; // Padrão para SSR
  
  try {
    const saved = localStorage.getItem(SIDEBAR_STATE_KEY);
    return saved !== "collapsed"; // true = expandido (padrão), false = recolhido
  } catch {
    // Fallback em caso de erro (navegadores privados, etc)
    return true;
  }
};

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  // Inicializa com o valor salvo no localStorage ou true (aberto) como padrão
  const [open, setOpen] = React.useState(getSavedSidebarState)

  const toggleSidebar = React.useCallback(() => {
    // Removido log de depuração para melhorar performance
    setOpen(prevOpen => !prevOpen)
  }, [])
  
  // Efeito para salvar o estado da sidebar no localStorage quando mudar
  React.useEffect(() => {
    // Protege contra execução no lado do servidor
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SIDEBAR_STATE_KEY, open ? "expanded" : "collapsed");
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
      action: toggleSidebar // Referência direta à função, sem logs desnecessários
    },
    {
      key: 'b',
      modifier: 'ctrl', // para Windows/Linux (Ctrl)
      action: toggleSidebar // Referência direta à função, sem logs desnecessários
    }
  ])

  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<SidebarContext>(
    () => ({
      state,
      open,
      setOpen,
      toggleSidebar
    }),
    [state, open, setOpen, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}
