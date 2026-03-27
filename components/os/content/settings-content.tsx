'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Monitor, Palette, Bell, Info, Moon, Sun, Volume2, VolumeX, Check } from 'lucide-react'
import { useOSStore, type AccentColor } from '@/lib/os-store'
import { useNotificationStore } from '@/lib/notification-store'

interface SettingSection {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const settingSections: SettingSection[] = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'display', label: 'Display', icon: Monitor },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'about', label: 'About', icon: Info },
]

const accentColors: { id: AccentColor; color: string; label: string }[] = [
  { id: 'blue', color: 'bg-blue-500', label: 'Blue' },
  { id: 'purple', color: 'bg-purple-500', label: 'Purple' },
  { id: 'green', color: 'bg-green-500', label: 'Green' },
  { id: 'orange', color: 'bg-orange-500', label: 'Orange' },
  { id: 'pink', color: 'bg-pink-500', label: 'Pink' },
  { id: 'cyan', color: 'bg-cyan-500', label: 'Cyan' },
]

export function SettingsContent() {
  const [activeSection, setActiveSection] = useState('appearance')
  const { theme, accentColor, setTheme, setAccentColor, volume, setVolume, isMuted, toggleMute } = useOSStore()
  const { addNotification } = useNotificationStore()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [resolution, setResolution] = useState('Loading...')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setResolution(`${window.innerWidth} x ${window.innerHeight}`)
      const handleResize = () => setResolution(`${window.innerWidth} x ${window.innerHeight}`)
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleThemeChange = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    addNotification({
      title: 'Theme Changed',
      message: `Switched to ${newTheme} mode`,
      type: 'info',
    })
  }

  const handleAccentChange = (color: AccentColor) => {
    setAccentColor(color)
    addNotification({
      title: 'Accent Color Changed',
      message: `Applied ${color} accent`,
      type: 'success',
    })
  }

  return (
    <div className="flex h-full -m-6">
      {/* Sidebar */}
      <div className="w-44 flex-shrink-0 border-r border-[var(--glass-border)] bg-secondary/20 p-2">
        {settingSections.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-primary/20 text-foreground'
                  : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {section.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {activeSection === 'appearance' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-lg font-semibold text-foreground">Appearance</h2>

            {/* Theme Toggle */}
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-primary" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">Theme</p>
                    <p className="text-sm text-muted-foreground">
                      {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleThemeChange}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    theme === 'dark' ? 'bg-primary' : 'bg-secondary border border-border'
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
                    style={{ left: theme === 'dark' ? '30px' : '4px' }}
                  />
                </button>
              </div>
            </div>

            {/* Accent Color */}
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
              <p className="font-medium text-foreground mb-3">Accent Color</p>
              <div className="flex gap-3 flex-wrap">
                {accentColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleAccentChange(color.id)}
                    className={`relative w-10 h-10 rounded-full ${color.color} transition-transform hover:scale-110 ${
                      accentColor === color.id ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground' : ''
                    }`}
                    title={color.label}
                  >
                    {accentColor === color.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Check className="w-5 h-5 text-white drop-shadow-md" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'display' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-lg font-semibold text-foreground">Display</h2>

            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
              <p className="font-medium text-foreground mb-2">Resolution</p>
              <p className="text-sm text-muted-foreground">{resolution}</p>
            </div>

            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
              <p className="font-medium text-foreground mb-3">Scale</p>
              <p className="text-sm text-muted-foreground">100% (Default)</p>
            </div>
          </motion.div>
        )}

        {activeSection === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-lg font-semibold text-foreground">Notifications & Sound</h2>

            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Notifications</p>
                    <p className="text-sm text-muted-foreground">Show desktop notifications</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    notificationsEnabled ? 'bg-primary' : 'bg-secondary border border-border'
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
                    style={{ left: notificationsEnabled ? '30px' : '4px' }}
                  />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-primary" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">Volume</p>
                    <p className="text-sm text-muted-foreground">{isMuted ? 'Muted' : `${volume}%`}</p>
                  </div>
                </div>
                <button
                  onClick={toggleMute}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    isMuted 
                      ? 'bg-destructive/20 text-destructive hover:bg-destructive/30' 
                      : 'bg-primary/20 text-primary hover:bg-primary/30'
                  }`}
                >
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                disabled={isMuted}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
              />
            </div>
          </motion.div>
        )}

        {activeSection === 'about' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-lg font-semibold text-foreground">About</h2>

            <div className="p-6 rounded-xl bg-secondary/30 border border-border/50 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-primary-foreground">AP</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">Portfolio OS</h3>
              <p className="text-sm text-muted-foreground mt-1">Version 2.0.0</p>
              <p className="text-sm text-muted-foreground mt-4">
                A Linux-inspired desktop experience built with React, Next.js, and Framer Motion.
              </p>
              <p className="text-sm text-primary mt-4">by Abin Pillai</p>
            </div>

            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
              <p className="font-medium text-foreground mb-2">System</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>OS: Portfolio Linux 2.0</p>
                <p>Kernel: Next.js 16</p>
                <p>Desktop: Framer Motion</p>
                <p>Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
