'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, FileText, Info, RefreshCw, Settings } from 'lucide-react'
import { useOSStore } from '@/lib/os-store'
import { useWindowStore, type WindowId } from '@/lib/window-store'
import { useEffect } from 'react'

const menuItems = [
  { id: 'open', label: 'Open', icon: FolderOpen },
  { id: 'rename', label: 'Rename', icon: FileText, disabled: true },
  { id: 'properties', label: 'Properties', icon: Info },
  { id: 'divider', label: '', icon: null },
  { id: 'refresh', label: 'Refresh Desktop', icon: RefreshCw },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function ContextMenu() {
  const { contextMenu, closeContextMenu } = useOSStore()
  const { openWindow } = useWindowStore()

  // Close on escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeContextMenu()
    }

    if (contextMenu.isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [contextMenu.isOpen, closeContextMenu])

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case 'open':
        if (contextMenu.targetId) {
          openWindow(contextMenu.targetId as WindowId)
        }
        break
      case 'properties':
        if (contextMenu.targetId) {
          openWindow(contextMenu.targetId as WindowId)
        }
        break
      case 'settings':
        openWindow('settings')
        break
      case 'refresh':
        // Just close the menu, could add refresh logic
        break
    }
    closeContextMenu()
  }

  return (
    <AnimatePresence>
      {contextMenu.isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[9999]"
            onClick={closeContextMenu}
            onContextMenu={(e) => {
              e.preventDefault()
              closeContextMenu()
            }}
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
            className="fixed z-[10000] w-48 rounded-lg overflow-hidden shadow-2xl"
          >
            <div className="bg-[var(--popover)] backdrop-blur-xl border border-[var(--glass-border)] rounded-lg p-1">
              {menuItems.map((item, index) => {
                if (item.id === 'divider') {
                  return (
                    <div
                      key={index}
                      className="my-1 border-t border-[var(--glass-border)]"
                    />
                  )
                }

                const Icon = item.icon!
                return (
                  <button
                    key={item.id}
                    onClick={() => handleAction(item.id)}
                    disabled={item.disabled}
                    className={`flex items-center gap-2 w-full px-3 py-1.5 text-sm rounded transition-colors ${
                      item.disabled
                        ? 'text-muted-foreground/50 cursor-not-allowed'
                        : 'text-foreground hover:bg-foreground/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
