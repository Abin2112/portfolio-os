'use client'

import { motion } from 'framer-motion'
import { useWindowStore, type WindowId } from '@/lib/window-store'
import { useOSStore } from '@/lib/os-store'
import { useNotificationStore } from '@/lib/notification-store'
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

interface DesktopIconProps {
  id: WindowId
  label: string
}

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

const iconColors: Record<WindowId, string> = {
  about: 'from-blue-500 to-cyan-500',
  projects: 'from-green-500 to-emerald-500',
  skills: 'from-purple-500 to-pink-500',
  experience: 'from-orange-500 to-amber-500',
  contact: 'from-red-500 to-rose-500',
  resume: 'from-gray-500 to-slate-600',
  'file-explorer': 'from-yellow-500 to-orange-500',
  settings: 'from-slate-500 to-zinc-600',
  terminal: 'from-emerald-600 to-green-700',
  certificates: 'from-amber-500 to-orange-600',
}

export function DesktopIcon({ id, label }: DesktopIconProps) {
  const { openWindow, selectedIcon, selectIcon } = useWindowStore()
  const { openContextMenu } = useOSStore()
  const { addNotification } = useNotificationStore()
  const Icon = iconMap[id]
  const isSelected = selectedIcon === id

  const handleDoubleClick = () => {
    openWindow(id)
    addNotification({
      title: 'App Opened',
      message: `Opened ${label}`,
      type: 'success',
    })
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    selectIcon(id)
    openContextMenu(e.clientX, e.clientY, id)
  }

  return (
    <motion.button
      onClick={() => selectIcon(id)}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors focus:outline-none group w-[88px] ${
        isSelected
          ? 'bg-primary/20 ring-1 ring-primary/50'
          : 'hover:bg-foreground/5'
      }`}
    >
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${iconColors[id]} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
      >
        <Icon className="w-7 h-7 text-white" />
      </motion.div>
      <span
        className={`text-xs font-medium text-center leading-tight px-1.5 py-0.5 rounded ${
          isSelected
            ? 'bg-primary text-primary-foreground'
            : 'text-foreground/90 drop-shadow-md'
        }`}
      >
        {label}
      </span>
    </motion.button>
  )
}
