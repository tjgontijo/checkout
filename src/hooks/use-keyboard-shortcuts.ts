import { useCallback, useEffect } from 'react'

type Shortcut = {
  key: string
  action: () => void
  description?: string
  modifier?: 'ctrl' | 'alt' | 'shift' | 'meta'
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
 
    shortcuts.forEach(shortcut => {
      const isCorrectModifier = 
        (shortcut.modifier === 'ctrl' && event.ctrlKey) ||
        (shortcut.modifier === 'meta' && event.metaKey) ||
        (shortcut.modifier === 'alt' && event.altKey) ||
        (shortcut.modifier === 'shift' && event.shiftKey)

      const isKeyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
    
      if (isKeyMatch && 
          (shortcut.modifier ? isCorrectModifier : true)) {
        event.preventDefault()
        shortcut.action()
      }
    })
  }, [shortcuts])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
