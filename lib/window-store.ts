import { create } from 'zustand'

export type WindowId = 'about' | 'projects' | 'skills' | 'experience' | 'contact' | 'resume' | 'file-explorer' | 'settings' | 'terminal' | 'certificates'

interface WindowState {
  id: WindowId
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface WindowStore {
  windows: Record<WindowId, WindowState>
  activeWindow: WindowId | null
  maxZIndex: number
  selectedIcon: WindowId | null
  openWindow: (id: WindowId) => void
  closeWindow: (id: WindowId) => void
  minimizeWindow: (id: WindowId) => void
  maximizeWindow: (id: WindowId) => void
  focusWindow: (id: WindowId) => void
  updatePosition: (id: WindowId, position: { x: number; y: number }) => void
  updateSize: (id: WindowId, size: { width: number; height: number }) => void
  selectIcon: (id: WindowId | null) => void
}

const defaultSizes: Record<WindowId, { width: number; height: number }> = {
  about: { width: 550, height: 500 },
  projects: { width: 700, height: 520 },
  skills: { width: 580, height: 500 },
  experience: { width: 680, height: 520 },
  contact: { width: 520, height: 480 },
  resume: { width: 600, height: 500 },
  'file-explorer': { width: 800, height: 550 },
  settings: { width: 550, height: 450 },
  terminal: { width: 650, height: 400 },
  certificates: { width: 720, height: 540 },
}

const initialWindows: Record<WindowId, WindowState> = {
  about: { id: 'about', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, position: { x: 100, y: 50 }, size: defaultSizes.about },
  projects: { id: 'projects', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, position: { x: 150, y: 80 }, size: defaultSizes.projects },
  skills: { id: 'skills', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, position: { x: 200, y: 60 }, size: defaultSizes.skills },
  experience: { id: 'experience', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, position: { x: 120, y: 100 }, size: defaultSizes.experience },
  contact: { id: 'contact', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, position: { x: 180, y: 70 }, size: defaultSizes.contact },
  resume: { id: 'resume', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, position: { x: 140, y: 90 }, size: defaultSizes.resume },
  'file-explorer': { id: 'file-explorer', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, position: { x: 80, y: 40 }, size: defaultSizes['file-explorer'] },
  settings: { id: 'settings', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, position: { x: 250, y: 120 }, size: defaultSizes.settings },
  terminal: { id: 'terminal', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, position: { x: 160, y: 110 }, size: defaultSizes.terminal },
  certificates: { id: 'certificates', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, position: { x: 130, y: 65 }, size: defaultSizes.certificates },
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: initialWindows,
  activeWindow: null,
  maxZIndex: 0,
  selectedIcon: null,

  openWindow: (id) => {
    const { maxZIndex } = get()
    const newZIndex = maxZIndex + 1
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isOpen: true,
          isMinimized: false,
          zIndex: newZIndex,
        },
      },
      activeWindow: id,
      maxZIndex: newZIndex,
    }))
  },

  closeWindow: (id) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isOpen: false,
          isMinimized: false,
          isMaximized: false,
        },
      },
      activeWindow: state.activeWindow === id ? null : state.activeWindow,
    }))
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isMinimized: true,
        },
      },
      activeWindow: state.activeWindow === id ? null : state.activeWindow,
    }))
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isMaximized: !state.windows[id].isMaximized,
        },
      },
    }))
  },

  focusWindow: (id) => {
    const { maxZIndex, windows } = get()
    if (windows[id].isMinimized) {
      const newZIndex = maxZIndex + 1
      set((state) => ({
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            isMinimized: false,
            zIndex: newZIndex,
          },
        },
        activeWindow: id,
        maxZIndex: newZIndex,
      }))
    } else {
      const newZIndex = maxZIndex + 1
      set((state) => ({
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            zIndex: newZIndex,
          },
        },
        activeWindow: id,
        maxZIndex: newZIndex,
      }))
    }
  },

  updatePosition: (id, position) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          position,
        },
      },
    }))
  },

  updateSize: (id, size) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          size,
        },
      },
    }))
  },

  selectIcon: (id) => {
    set({ selectedIcon: id })
  },
}))
