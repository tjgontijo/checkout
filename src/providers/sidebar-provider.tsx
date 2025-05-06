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

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true)

  const toggleSidebar = React.useCallback(() => {
    console.log('Toggling sidebar') // Log de depuração
    setOpen(prevOpen => !prevOpen)
  }, [])

  // Adicionar atalho de teclado para abrir/fechar sidebar
  useKeyboardShortcuts([
    {
      key: 'b',
      modifier: 'meta', // para Mac (Command)
      action: () => {
        console.log('Cmd+B pressed') // Log de depuração
        toggleSidebar()
      }
    },
    {
      key: 'b',
      modifier: 'ctrl', // para Windows/Linux (Ctrl)
      action: () => {
        console.log('Ctrl+B pressed') // Log de depuração
        toggleSidebar()
      }
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
