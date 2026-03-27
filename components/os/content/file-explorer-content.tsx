'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  Folder,
  FolderOpen,
  FileText,
  Home,
  Download,
  ChevronRight,
  Grid,
  List,
  User,
  Code,
  Briefcase,
  Mail,
  Star,
} from 'lucide-react'
import { useWindowStore, type WindowId } from '@/lib/window-store'
import { useNotificationStore } from '@/lib/notification-store'

interface FileItem {
  id: WindowId | string
  name: string
  type: 'folder' | 'file'
  icon: React.ComponentType<{ className?: string }>
  color: string
  isApp?: boolean
}

const sidebarItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'projects', label: 'Projects', icon: Code },
  { id: 'downloads', label: 'Downloads', icon: Download },
]

const homeFiles: FileItem[] = [
  { id: 'about', name: 'About Me.app', type: 'file', icon: User, color: 'from-blue-500 to-cyan-500', isApp: true },
  { id: 'projects', name: 'Projects.app', type: 'file', icon: Code, color: 'from-green-500 to-emerald-500', isApp: true },
  { id: 'skills', name: 'Skills.app', type: 'file', icon: Star, color: 'from-purple-500 to-pink-500', isApp: true },
  { id: 'experience', name: 'Experience.app', type: 'file', icon: Briefcase, color: 'from-orange-500 to-amber-500', isApp: true },
  { id: 'contact', name: 'Contact.app', type: 'file', icon: Mail, color: 'from-red-500 to-rose-500', isApp: true },
  { id: 'resume', name: 'Resume.pdf', type: 'file', icon: FileText, color: 'from-gray-500 to-slate-600', isApp: true },
]

const folderContents: Record<string, FileItem[]> = {
  home: homeFiles,
  documents: [
    { id: 'resume', name: 'Resume.pdf', type: 'file', icon: FileText, color: 'from-red-500 to-rose-500', isApp: true },
    { id: 'cv-folder', name: 'CV', type: 'folder', icon: Folder, color: 'from-yellow-500 to-orange-500' },
  ],
  projects: [
    { id: 'projects', name: 'View All Projects', type: 'file', icon: Code, color: 'from-green-500 to-emerald-500', isApp: true },
    { id: 'ml-folder', name: 'Machine Learning', type: 'folder', icon: Folder, color: 'from-blue-500 to-indigo-500' },
    { id: 'backend-folder', name: 'Backend', type: 'folder', icon: Folder, color: 'from-purple-500 to-violet-500' },
  ],
  downloads: [
    { id: 'resume', name: 'Abin_Pillai_Resume.pdf', type: 'file', icon: FileText, color: 'from-gray-500 to-slate-600', isApp: true },
  ],
}

export function FileExplorerContent() {
  const [currentPath, setCurrentPath] = useState('home')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const { openWindow } = useWindowStore()
  const { addNotification } = useNotificationStore()

  const files = folderContents[currentPath] || homeFiles

  const handleFileDoubleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      setCurrentPath(file.id)
    } else if (file.isApp) {
      openWindow(file.id as WindowId)
      addNotification({
        title: 'File Opened',
        message: `Opened ${file.name}`,
        type: 'success',
      })
    }
  }

  return (
    <div className="flex h-full -m-6">
      {/* Sidebar */}
      <div className="w-44 flex-shrink-0 border-r border-[var(--glass-border)] bg-secondary/20 p-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPath === item.id
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPath(item.id)
                setSelectedFile(null)
              }}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-primary/20 text-foreground'
                  : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <button
              onClick={() => setCurrentPath('home')}
              className="hover:text-foreground transition-colors"
            >
              Home
            </button>
            {currentPath !== 'home' && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground capitalize">{currentPath}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list' ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Files Grid/List */}
        <div className="flex-1 overflow-auto p-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-4 gap-4">
              {files.map((file, index) => {
                const Icon = file.type === 'folder' && selectedFile === file.id ? FolderOpen : file.icon
                return (
                  <motion.button
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedFile(file.id)}
                    onDoubleClick={() => handleFileDoubleClick(file)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${
                      selectedFile === file.id
                        ? 'bg-primary/20 ring-1 ring-primary/50'
                        : 'hover:bg-foreground/5'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${file.color} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-center text-foreground/90 line-clamp-2">
                      {file.name}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          ) : (
            <div className="space-y-1">
              {files.map((file, index) => {
                const Icon = file.icon
                return (
                  <motion.button
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedFile(file.id)}
                    onDoubleClick={() => handleFileDoubleClick(file)}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors ${
                      selectedFile === file.id
                        ? 'bg-primary/20 ring-1 ring-primary/50'
                        : 'hover:bg-foreground/5'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${file.color} flex items-center justify-center`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-foreground/90">{file.name}</span>
                  </motion.button>
                )
              })}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="px-4 py-2 border-t border-[var(--glass-border)] text-xs text-muted-foreground">
          {files.length} items
        </div>
      </div>
    </div>
  )
}
