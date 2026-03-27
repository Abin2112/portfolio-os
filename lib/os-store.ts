'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'dark' | 'light'
export type AccentColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'cyan'

interface OSStore {
  isBooted: boolean
  isLoggedIn: boolean
  theme: Theme
  accentColor: AccentColor
  bootProgress: number
  wifiConnected: boolean
  wifiNetworkName: string
  volume: number
  isMuted: boolean
  contextMenu: {
    isOpen: boolean
    x: number
    y: number
    targetId: string | null
  }
  setBoot: (isBooted: boolean) => void
  setLogin: (isLoggedIn: boolean) => void
  setTheme: (theme: Theme) => void
  setAccentColor: (color: AccentColor) => void
  setBootProgress: (progress: number) => void
  setWifiConnected: (connected: boolean) => void
  setWifiNetworkName: (name: string) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  openContextMenu: (x: number, y: number, targetId?: string) => void
  closeContextMenu: () => void
}

// Accent color CSS variable mappings
export const accentColorMap: Record<AccentColor, { primary: string; ring: string }> = {
  blue: { primary: 'oklch(0.7 0.15 220)', ring: 'oklch(0.6 0.15 220)' },
  purple: { primary: 'oklch(0.65 0.2 280)', ring: 'oklch(0.55 0.2 280)' },
  green: { primary: 'oklch(0.7 0.18 145)', ring: 'oklch(0.6 0.18 145)' },
  orange: { primary: 'oklch(0.75 0.18 50)', ring: 'oklch(0.65 0.18 50)' },
  pink: { primary: 'oklch(0.7 0.2 350)', ring: 'oklch(0.6 0.2 350)' },
  cyan: { primary: 'oklch(0.75 0.15 195)', ring: 'oklch(0.65 0.15 195)' },
}

// Theme CSS variable mappings
export const themeMap: Record<Theme, Record<string, string>> = {
  dark: {
    '--background': 'oklch(0.15 0.03 260)',
    '--foreground': 'oklch(0.95 0 0)',
    '--card': 'oklch(0.18 0.02 260 / 0.6)',
    '--card-foreground': 'oklch(0.95 0 0)',
    '--popover': 'oklch(0.16 0.025 260 / 0.9)',
    '--popover-foreground': 'oklch(0.95 0 0)',
    '--secondary': 'oklch(0.25 0.02 260 / 0.8)',
    '--secondary-foreground': 'oklch(0.9 0 0)',
    '--muted': 'oklch(0.25 0.015 260)',
    '--muted-foreground': 'oklch(0.7 0 0)',
    '--border': 'oklch(0.35 0.02 260 / 0.5)',
    '--input': 'oklch(0.25 0.02 260 / 0.8)',
    '--window-bg': 'oklch(0.12 0.025 260 / 0.85)',
    '--window-header': 'oklch(0.18 0.02 260 / 0.95)',
    '--taskbar': 'oklch(0.1 0.02 260 / 0.9)',
    '--topbar-bg': 'oklch(0.08 0.02 260 / 0.95)',
    '--glass': 'oklch(0.2 0.02 260 / 0.4)',
    '--glass-border': 'oklch(0.5 0.02 260 / 0.3)',
    '--glass-highlight': 'oklch(0.9 0 0 / 0.1)',
  },
  light: {
    '--background': 'oklch(0.97 0.01 260)',
    '--foreground': 'oklch(0.15 0.02 260)',
    '--card': 'oklch(1 0 0 / 0.8)',
    '--card-foreground': 'oklch(0.15 0.02 260)',
    '--popover': 'oklch(0.98 0.01 260 / 0.95)',
    '--popover-foreground': 'oklch(0.15 0.02 260)',
    '--secondary': 'oklch(0.92 0.01 260 / 0.8)',
    '--secondary-foreground': 'oklch(0.2 0.02 260)',
    '--muted': 'oklch(0.92 0.01 260)',
    '--muted-foreground': 'oklch(0.45 0.02 260)',
    '--border': 'oklch(0.85 0.01 260 / 0.6)',
    '--input': 'oklch(0.95 0.01 260 / 0.9)',
    '--window-bg': 'oklch(0.98 0.01 260 / 0.9)',
    '--window-header': 'oklch(0.95 0.01 260 / 0.98)',
    '--taskbar': 'oklch(0.92 0.01 260 / 0.95)',
    '--topbar-bg': 'oklch(0.88 0.01 260 / 0.98)',
    '--glass': 'oklch(1 0 0 / 0.6)',
    '--glass-border': 'oklch(0.7 0.01 260 / 0.3)',
    '--glass-highlight': 'oklch(1 0 0 / 0.3)',
  },
}

export const useOSStore = create<OSStore>()(
  persist(
    (set) => ({
      isBooted: false,
      isLoggedIn: false,
      theme: 'dark',
      accentColor: 'blue',
      bootProgress: 0,
      wifiConnected: true,
      wifiNetworkName: "Abin's WiFi",
      volume: 75,
      isMuted: false,
      contextMenu: {
        isOpen: false,
        x: 0,
        y: 0,
        targetId: null,
      },

      setBoot: (isBooted) => set(isBooted ? { isBooted } : { isBooted, bootProgress: 0 }),
      setLogin: (isLoggedIn) => set({ isLoggedIn }),
      
      setTheme: (theme) => {
        // Apply theme CSS variables to document
        if (typeof document !== 'undefined') {
          const root = document.documentElement
          const vars = themeMap[theme]
          Object.entries(vars).forEach(([key, value]) => {
            root.style.setProperty(key, value)
          })
          root.classList.toggle('dark', theme === 'dark')
          root.classList.toggle('light', theme === 'light')
        }
        set({ theme })
      },

      setAccentColor: (accentColor) => {
        // Apply accent color CSS variables to document
        if (typeof document !== 'undefined') {
          const root = document.documentElement
          const colors = accentColorMap[accentColor]
          root.style.setProperty('--primary', colors.primary)
          root.style.setProperty('--ring', colors.ring)
        }
        set({ accentColor })
      },

      setBootProgress: (bootProgress) => set({ bootProgress }),
      setWifiConnected: (wifiConnected) => set({ wifiConnected }),
      setWifiNetworkName: (wifiNetworkName) => set({ wifiNetworkName }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(100, volume)) }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      openContextMenu: (x, y, targetId = null) => {
        set({
          contextMenu: { isOpen: true, x, y, targetId },
        })
      },

      closeContextMenu: () => {
        set((state) => ({
          contextMenu: { ...state.contextMenu, isOpen: false },
        }))
      },
    }),
    {
      name: 'portfolio-os-storage',
      partialize: (state) => ({
        theme: state.theme,
        accentColor: state.accentColor,
        volume: state.volume,
        isMuted: state.isMuted,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
)

// Hook to apply stored theme/accent on mount
export function useApplyStoredSettings() {
  const { theme, accentColor, setTheme, setAccentColor } = useOSStore()
  
  if (typeof window !== 'undefined') {
    // Apply on first render
    setTimeout(() => {
      setTheme(theme)
      setAccentColor(accentColor)
    }, 0)
  }
}
