import { create } from 'zustand'

export interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  type: 'info' | 'success' | 'warning'
}

interface NotificationStore {
  notifications: Notification[]
  isPanelOpen: boolean
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
  togglePanel: () => void
  closePanel: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  isPanelOpen: false,

  addNotification: (notification) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    set((state) => ({
      notifications: [
        { ...notification, id, timestamp: new Date() },
        ...state.notifications,
      ].slice(0, 10),
    }))
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  clearAll: () => {
    set({ notifications: [] })
  },

  togglePanel: () => {
    set((state) => ({ isPanelOpen: !state.isPanelOpen }))
  },

  closePanel: () => {
    set({ isPanelOpen: false })
  },
}))
