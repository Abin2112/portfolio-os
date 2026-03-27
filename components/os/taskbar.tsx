'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useWindowStore, type WindowId } from '@/lib/window-store'
import {
  User,
  FolderKanban,
  Sparkles,
  Briefcase,
  Mail,
  FileText,
  FolderOpen,
  Settings,
  Terminal,
  Award,
} from 'lucide-react'

const iconMap: Record<WindowId, React.ComponentType<{ className?: string }>> = {
  about: User,
  projects: FolderKanban,
  skills: Sparkles,
  experience: Briefcase,
  contact: Mail,
  resume: FileText,
  'file-explorer': FolderOpen,
  settings: Settings,
  terminal: Terminal,
  certificates: Award,
}

const labelMap: Record<WindowId, string> = {
  about: 'About Me',
  projects: 'Projects',
  skills: 'Skills',
  experience: 'Experience',
  contact: 'Contact',
  resume: 'Resume',
  'file-explorer': 'Files',
  settings: 'Settings',
  terminal: 'Terminal',
  certificates: 'Certificates',
}

export function Taskbar() {
  const { windows, focusWindow, minimizeWindow, activeWindow, openWindow } = useWindowStore()

  const openWindows = Object.values(windows).filter((w) => w.isOpen)

  // Dock apps (always visible)
  const dockApps: WindowId[] = ['file-explorer', 'about', 'projects', 'skills', 'experience', 'contact', 'settings']

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 z-[9999]"
    >
      <div className="mx-auto max-w-3xl px-4 pb-2">
        <div className="relative flex items-center justify-center gap-1 px-3 py-2 rounded-2xl overflow-hidden">
          {/* Glass background */}
          <div className="absolute inset-0 bg-[var(--taskbar)] backdrop-blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-[var(--glass-highlight)]" />
          <div className="absolute inset-0 border border-[var(--glass-border)] rounded-2xl" />

          {/* Dock apps */}
          <div className="relative flex items-center gap-1">
            {dockApps.map((appId) => {
              const Icon = iconMap[appId]
              const window = windows[appId]
              const isOpen = window.isOpen
              const isActive = activeWindow === appId && !window.isMinimized

              return (
                <motion.button
                  key={appId}
                  whileHover={{ scale: 1.15, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (isOpen) {
                      if (window.isMinimized || !isActive) {
                        focusWindow(appId)
                      } else {
                        minimizeWindow(appId)
                      }
                    } else {
                      openWindow(appId)
                    }
                  }}
                  className={`relative flex items-center justify-center w-11 h-11 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-primary/20'
                      : 'hover:bg-foreground/10'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-foreground' : 'text-foreground/70'}`} />
                  
                  {/* Open indicator dot */}
                  {isOpen && (
                    <motion.div
                      layoutId={`indicator-${appId}`}
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full ${
                        isActive ? 'w-1.5 h-1.5 bg-primary' : 'w-1 h-1 bg-foreground/50'
                      }`}
                    />
                  )}
                </motion.button>
              )
            })}

            {/* Divider */}
            {openWindows.some((w) => !dockApps.includes(w.id)) && (
              <div className="w-px h-8 bg-[var(--glass-border)] mx-1" />
            )}

            {/* Non-dock open windows */}
            <AnimatePresence mode="popLayout">
              {openWindows
                .filter((w) => !dockApps.includes(w.id))
                .map((window) => {
                  const Icon = iconMap[window.id]
                  const isActive = activeWindow === window.id && !window.isMinimized

                  // Safety check - skip rendering if Icon is undefined
                  if (!Icon) return null

                  return (
                    <motion.button
                      key={window.id}
                      layout
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.15, y: -8 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (window.isMinimized || !isActive) {
                          focusWindow(window.id)
                        } else {
                          minimizeWindow(window.id)
                        }
                      }}
                      className={`relative flex items-center justify-center w-11 h-11 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-primary/20'
                          : 'hover:bg-foreground/10'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isActive ? 'text-foreground' : 'text-foreground/70'}`} />
                      <motion.div
                        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full ${
                          isActive ? 'w-1.5 h-1.5 bg-primary' : 'w-1 h-1 bg-foreground/50'
                        }`}
                      />
                    </motion.button>
                  )
                })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
