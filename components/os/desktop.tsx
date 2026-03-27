'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { DesktopIcon } from './desktop-icon'
import { Window } from './window'
import { Taskbar } from './taskbar'
import { TopBar } from './top-bar'
import { NotificationPanel } from './notification-panel'
import { ChatbotPanel } from './chatbot-panel'
import { ContextMenu } from './context-menu'
import { BootScreen, LoginScreen } from './boot-screen'
import { useWindowStore, type WindowId } from '@/lib/window-store'
import { useOSStore, themeMap, accentColorMap } from '@/lib/os-store'
import { AboutContent } from './content/about-content'
import { ProjectsContent } from './content/projects-content'
import { SkillsContent } from './content/skills-content'
import { ExperienceContent } from './content/experience-content'
import { ContactContent } from './content/contact-content'
import { ResumeContent } from './content/resume-content'
import { FileExplorerContent } from './content/file-explorer-content'
import { SettingsContent } from './content/settings-content'
import { CertificatesContent } from './content/certificates-content'

const desktopIcons: { id: WindowId; label: string }[] = [
  { id: 'file-explorer', label: 'Files' },
  { id: 'about', label: 'About Me' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
  { id: 'settings', label: 'Settings' },
]

const windowTitles: Record<WindowId, string> = {
  about: 'About Me',
  projects: 'Projects',
  skills: 'Skills',
  experience: 'Experience',
  resume: 'Resume',
  contact: 'Contact',
  'file-explorer': 'Files',
  settings: 'Settings',
  terminal: 'Terminal',
  certificates: 'Certificates',
}

const windowContent: Record<WindowId, React.ReactNode> = {
  about: <AboutContent />,
  projects: <ProjectsContent />,
  skills: <SkillsContent />,
  experience: <ExperienceContent />,
  resume: <ResumeContent />,
  contact: <ContactContent />,
  'file-explorer': <FileExplorerContent />,
  settings: <SettingsContent />,
  terminal: <TerminalContent />,
  certificates: <CertificatesContent />,
}

function TerminalContent() {
  return (
    <div className="font-mono text-sm text-green-400 space-y-1">
      <p>abin@portfolio:~$ whoami</p>
      <p className="text-foreground">Abin Pillai - Data Science & Backend Developer</p>
      <p className="mt-2">abin@portfolio:~$ cat skills.txt</p>
      <p className="text-foreground">Python, JavaScript, TypeScript, Rust, SQL</p>
      <p className="text-foreground">Pandas, NumPy, Scikit-learn, TensorFlow</p>
      <p className="text-foreground">Node.js, FastAPI, Express, PostgreSQL</p>
      <p className="mt-2">abin@portfolio:~$ <span className="animate-pulse">_</span></p>
    </div>
  )
}

export function Desktop() {
  const { windows, selectIcon } = useWindowStore()
  const { isBooted, isLoggedIn, theme, accentColor, closeContextMenu } = useOSStore()

  // Apply theme and accent color on mount and when they change
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      
      // Apply theme
      const themeVars = themeMap[theme]
      Object.entries(themeVars).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })
      root.classList.toggle('dark', theme === 'dark')
      root.classList.toggle('light', theme === 'light')

      // Apply accent color
      const colors = accentColorMap[accentColor]
      root.style.setProperty('--primary', colors.primary)
      root.style.setProperty('--ring', colors.ring)
    }
  }, [theme, accentColor])

  const handleDesktopClick = () => {
    selectIcon(null)
    closeContextMenu()
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    // Could add desktop context menu here
  }

  return (
    <>
      {/* Boot Screen */}
      <BootScreen />

      {/* Login Screen */}
      {isBooted && !isLoggedIn && <LoginScreen />}

      {/* Main Desktop */}
      {isBooted && isLoggedIn && (
        <div
          className="relative min-h-screen overflow-hidden"
          onClick={handleDesktopClick}
          onContextMenu={handleContextMenu}
        >
          {/* Background gradient - adapts to theme */}
          <div 
            className="fixed inset-0 transition-colors duration-500"
            style={{
              background: theme === 'dark' 
                ? 'linear-gradient(135deg, oklch(0.12 0.04 260), oklch(0.15 0.03 250), oklch(0.1 0.05 280))'
                : 'linear-gradient(135deg, oklch(0.95 0.02 260), oklch(0.97 0.01 250), oklch(0.93 0.02 280))'
            }}
          />

          {/* Subtle pattern overlay */}
          <div
            className="fixed inset-0 transition-opacity duration-500"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${theme === 'dark' ? 'white' : 'black'} 1px, transparent 0)`,
              backgroundSize: '40px 40px',
              opacity: theme === 'dark' ? 0.02 : 0.015,
            }}
          />

          {/* Glow effects */}
          <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[128px] pointer-events-none transition-colors duration-500" />
          <div className="fixed bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none transition-colors duration-500" />

          {/* Top Bar */}
          <TopBar />

          {/* Desktop icons grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative z-10 p-4 pt-12 sm:p-8 sm:pt-14 pb-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1 max-w-5xl">
              {desktopIcons.map((icon, index) => (
                <motion.div
                  key={icon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.4 }}
                >
                  <DesktopIcon id={icon.id} label={icon.label} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Windows */}
          <AnimatePresence>
            {Object.entries(windows).map(
              ([id, window]) =>
                window.isOpen &&
                !window.isMinimized && (
                  <Window key={id} id={id as WindowId} title={windowTitles[id as WindowId]}>
                    {windowContent[id as WindowId]}
                  </Window>
                )
            )}
          </AnimatePresence>

          {/* Taskbar */}
          <Taskbar />

          {/* Notification Panel */}
          <NotificationPanel />

          {/* Chatbot Panel */}
          <ChatbotPanel />

          {/* Context Menu */}
          <ContextMenu />
        </div>
      )}
    </>
  )
}
