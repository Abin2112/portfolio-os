'use client'

import { motion } from 'framer-motion'
import { useState, useCallback, memo } from 'react'
import {
  Folder,
  FolderOpen,
  FileText,
  Home,
  ChevronRight,
  ChevronLeft,
  Grid,
  List,
  User,
  Code,
  Briefcase,
  Mail,
  Star,
  Award,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import { useWindowStore, type WindowId } from '@/lib/window-store'
import { useNotificationStore } from '@/lib/notification-store'

interface FileItem {
  id: string
  name: string
  type: 'folder' | 'file' | 'txt'
  icon: React.ComponentType<{ className?: string }>
  color: string
  opensWindow?: WindowId
  description?: string
}

interface FolderNode {
  id: string
  label: string
  parent: string | null
  items: FileItem[]
}

// File system tree: /home/abin/
const fileSystem: Record<string, FolderNode> = {
  home: {
    id: 'home',
    label: 'abin',
    parent: null,
    items: [
      {
        id: 'projects-dir',
        name: 'projects',
        type: 'folder',
        icon: Folder,
        color: 'from-yellow-500 to-orange-500',
        description: '4 items',
      },
      {
        id: 'certificates-dir',
        name: 'certificates',
        type: 'folder',
        icon: Folder,
        color: 'from-purple-500 to-violet-500',
        description: '3 items',
      },
      {
        id: 'resume-dir',
        name: 'resume',
        type: 'folder',
        icon: Folder,
        color: 'from-blue-500 to-cyan-500',
        description: '1 item',
      },
      {
        id: 'about-txt',
        name: 'about.txt',
        type: 'txt',
        icon: FileText,
        color: 'from-gray-500 to-slate-600',
        opensWindow: 'about',
        description: '2 KB',
      },
      {
        id: 'skills-txt',
        name: 'skills.txt',
        type: 'txt',
        icon: FileText,
        color: 'from-green-500 to-emerald-500',
        opensWindow: 'skills',
        description: '1 KB',
      },
      {
        id: 'contact-txt',
        name: 'contact.txt',
        type: 'txt',
        icon: FileText,
        color: 'from-red-500 to-rose-500',
        opensWindow: 'contact',
        description: '1 KB',
      },
    ],
  },
  'projects-dir': {
    id: 'projects-dir',
    label: 'projects',
    parent: 'home',
    items: [
      {
        id: 'proj-ml',
        name: 'ML Price Predictor',
        type: 'file',
        icon: Code,
        color: 'from-blue-500 to-cyan-500',
        opensWindow: 'projects',
        description: 'Python · ML',
      },
      {
        id: 'proj-api',
        name: 'REST API Framework',
        type: 'file',
        icon: Code,
        color: 'from-green-500 to-emerald-500',
        opensWindow: 'projects',
        description: 'Node.js · Backend',
      },
      {
        id: 'proj-pipeline',
        name: 'Data Pipeline Tool',
        type: 'file',
        icon: Code,
        color: 'from-orange-500 to-amber-500',
        opensWindow: 'projects',
        description: 'Python · ETL',
      },
      {
        id: 'proj-cli',
        name: 'CLI Task Manager',
        type: 'file',
        icon: Code,
        color: 'from-pink-500 to-rose-500',
        opensWindow: 'projects',
        description: 'Rust · CLI',
      },
    ],
  },
  'certificates-dir': {
    id: 'certificates-dir',
    label: 'certificates',
    parent: 'home',
    items: [
      {
        id: 'cert-aws',
        name: 'AWS Certification',
        type: 'file',
        icon: Award,
        color: 'from-yellow-500 to-orange-500',
        opensWindow: 'certificates',
        description: '128 KB',
      },
      {
        id: 'cert-ml',
        name: 'ML Specialization',
        type: 'file',
        icon: Award,
        color: 'from-purple-500 to-pink-500',
        opensWindow: 'certificates',
        description: '256 KB',
      },
      {
        id: 'cert-hack',
        name: 'Hackathon 2023',
        type: 'file',
        icon: Award,
        color: 'from-green-500 to-teal-500',
        opensWindow: 'certificates',
        description: '512 KB',
      },
    ],
  },
  'resume-dir': {
    id: 'resume-dir',
    label: 'resume',
    parent: 'home',
    items: [
      {
        id: 'resume-pdf',
        name: 'Abin_Pillai_Resume.pdf',
        type: 'file',
        icon: FileText,
        color: 'from-red-500 to-rose-500',
        opensWindow: 'resume',
        description: '142 KB',
      },
    ],
  },
}

const sidebarItems: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'projects-dir', label: 'Projects', icon: Code },
  { id: 'certificates-dir', label: 'Certificates', icon: Award },
  { id: 'resume-dir', label: 'Resume', icon: FileText },
  { id: 'about', label: 'About Me', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'skills', label: 'Skills', icon: Star },
]

function getBreadcrumbs(folderId: string): { id: string; label: string }[] {
  const crumbs: { id: string; label: string }[] = []
  let current: string | null = folderId
  while (current) {
    const node: FolderNode | undefined = fileSystem[current]
    if (node) {
      crumbs.unshift({ id: node.id, label: node.label })
      current = node.parent
    } else {
      break
    }
  }
  // Prepend /home
  crumbs.unshift({ id: 'root', label: 'Home' })
  return crumbs
}

export const FileExplorerContent = memo(function FileExplorerContent() {
  const [currentFolder, setCurrentFolder] = useState<string>('home')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [navHistory, setNavHistory] = useState<string[]>(['home'])
  const [navIndex, setNavIndex] = useState(0)
  const { openWindow } = useWindowStore()
  const { addNotification } = useNotificationStore()

  const navigate = useCallback(
    (folderId: string) => {
      setSelectedFile(null)
      setCurrentFolder(folderId)
      setNavHistory((prev) => {
        const truncated = prev.slice(0, navIndex + 1)
        return [...truncated, folderId]
      })
      setNavIndex((prev) => prev + 1)
    },
    [navIndex]
  )

  const goBack = useCallback(() => {
    if (navIndex > 0) {
      const newIdx = navIndex - 1
      setNavIndex(newIdx)
      setCurrentFolder(navHistory[newIdx])
      setSelectedFile(null)
    }
  }, [navIndex, navHistory])

  const goForward = useCallback(() => {
    if (navIndex < navHistory.length - 1) {
      const newIdx = navIndex + 1
      setNavIndex(newIdx)
      setCurrentFolder(navHistory[newIdx])
      setSelectedFile(null)
    }
  }, [navIndex, navHistory])

  const handleSidebarClick = useCallback(
    (itemId: string) => {
      // Check if it's a file system folder
      if (fileSystem[itemId]) {
        navigate(itemId)
      } else {
        // It's an app window shortcut
        openWindow(itemId as WindowId)
        addNotification({ title: 'App Launched', message: `Opened ${itemId}`, type: 'success' })
      }
    },
    [navigate, openWindow, addNotification]
  )

  const handleItemDoubleClick = useCallback(
    (item: FileItem) => {
      if (item.type === 'folder' && fileSystem[item.id]) {
        navigate(item.id)
      } else if (item.opensWindow) {
        openWindow(item.opensWindow)
        addNotification({ title: 'Opened', message: item.name, type: 'success' })
      }
    },
    [navigate, openWindow, addNotification]
  )

  const folder = fileSystem[currentFolder]
  const items = folder?.items ?? []
  const breadcrumbs = getBreadcrumbs(currentFolder)
  const canGoBack = navIndex > 0
  const canGoForward = navIndex < navHistory.length - 1

  return (
    <div className="flex h-full -m-6">
      {/* Sidebar */}
      <div className="w-44 flex-shrink-0 border-r border-[var(--glass-border)] bg-secondary/20 p-2 overflow-y-auto">
        <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Favourites
        </p>
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = currentFolder === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleSidebarClick(item.id)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-primary/20 text-foreground'
                  : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--glass-border)]">
          {/* Back / Forward */}
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className="p-1.5 rounded transition-colors disabled:opacity-30 hover:bg-foreground/10 text-muted-foreground hover:text-foreground"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goForward}
            disabled={!canGoForward}
            className="p-1.5 rounded transition-colors disabled:opacity-30 hover:bg-foreground/10 text-muted-foreground hover:text-foreground"
            title="Go Forward"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-0.5 flex-1 min-w-0 text-sm overflow-x-auto">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.id} className="flex items-center gap-0.5 flex-shrink-0">
                {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-foreground font-medium">{crumb.label}</span>
                ) : (
                  <button
                    onClick={() => crumb.id !== 'root' && navigate(crumb.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {crumb.label}
                  </button>
                )}
              </span>
            ))}
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-foreground/10 text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-foreground/10 text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Files */}
        <div className="flex-1 overflow-auto p-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {items.map((item, index) => {
                const Icon =
                  item.type === 'folder' && selectedFile === item.id ? FolderOpen : item.icon
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => setSelectedFile(item.id)}
                    onDoubleClick={() => handleItemDoubleClick(item)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                      selectedFile === item.id
                        ? 'bg-primary/20 ring-1 ring-primary/50'
                        : 'hover:bg-foreground/5'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs text-center text-foreground/90 line-clamp-2 w-full">
                      {item.name}
                    </span>
                    {item.description && (
                      <span className="text-[10px] text-muted-foreground">{item.description}</span>
                    )}
                  </motion.button>
                )
              })}
            </div>
          ) : (
            <div className="space-y-0.5">
              {items.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => setSelectedFile(item.id)}
                    onDoubleClick={() => handleItemDoubleClick(item)}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors ${
                      selectedFile === item.id
                        ? 'bg-primary/20 ring-1 ring-primary/50'
                        : 'hover:bg-foreground/5'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm text-foreground/90 truncate">{item.name}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground capitalize flex-shrink-0">
                      {item.type === 'folder' ? 'Folder' : item.type.toUpperCase()}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="px-4 py-1.5 border-t border-[var(--glass-border)] flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {selectedFile
              ? `"${items.find((i) => i.id === selectedFile)?.name}" selected`
              : `${items.length} item${items.length !== 1 ? 's' : ''}`}
          </span>
          <span className="text-muted-foreground/60">/home/{breadcrumbs.slice(1).map(b => b.label).join('/')}</span>
        </div>
      </div>
    </div>
  )
})
