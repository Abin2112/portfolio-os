'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, Trash2 } from 'lucide-react'
import { useNotificationStore, type Notification } from '@/lib/notification-store'
import { useEffect } from 'react'

const notificationMessages = [
  { title: 'System', message: 'Welcome to Abin\'s Portfolio OS', type: 'info' as const },
  { title: 'Projects', message: 'New project viewed: ML Price Predictor', type: 'success' as const },
  { title: 'Skills', message: 'Check out the latest tech stack', type: 'info' as const },
  { title: 'Experience', message: 'View internship experiences', type: 'info' as const },
  { title: 'Contact', message: 'Ready to connect? Open Contact', type: 'success' as const },
]

export function NotificationPanel() {
  const { notifications, isPanelOpen, closePanel, clearAll, addNotification, removeNotification } = useNotificationStore()

  // Auto-generate notifications every 30-40 seconds
  useEffect(() => {
    const generateNotification = () => {
      const randomMessage = notificationMessages[Math.floor(Math.random() * notificationMessages.length)]
      addNotification(randomMessage)
    }

    // Initial notification after 5 seconds
    const initialTimeout = setTimeout(generateNotification, 5000)

    // Then every 30-40 seconds
    const interval = setInterval(() => {
      generateNotification()
    }, 30000 + Math.random() * 10000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [addNotification])

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePanel}
            className="fixed inset-0 z-[9990]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 350, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 350, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-10 right-2 bottom-14 w-80 z-[9991] rounded-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-[var(--window-bg)] backdrop-blur-xl" />
            <div className="absolute inset-0 border border-[var(--glass-border)] rounded-xl" />

            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Notifications</span>
                </div>
                <div className="flex items-center gap-1">
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="p-1.5 rounded hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={closePanel}
                    className="p-1.5 rounded hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto p-2">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <Bell className="w-10 h-10 text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground">No notifications</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onDismiss={() => removeNotification(notification.id)}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function NotificationItem({
  notification,
  onDismiss,
}: {
  notification: Notification
  onDismiss: () => void
}) {
  const typeColors = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      className="group relative p-3 mb-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
    >
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-foreground/10 transition-all"
      >
        <X className="w-3 h-3 text-muted-foreground" />
      </button>

      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-1.5 ${typeColors[notification.type]}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{notification.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
          <p className="text-[10px] text-muted-foreground/70 mt-1">{formatTime(notification.timestamp)}</p>
        </div>
      </div>
    </motion.div>
  )
}

// Toast notification component for immediate display
export function NotificationToast() {
  const { notifications } = useNotificationStore()
  const latestNotification = notifications[0]

  return (
    <AnimatePresence>
      {latestNotification && (
        <motion.div
          key={latestNotification.id}
          initial={{ x: 350, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 350, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-12 right-4 w-72 z-[9989] pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="p-3 rounded-lg bg-[var(--popover)] backdrop-blur-xl border border-[var(--glass-border)] shadow-xl"
          >
            <div className="flex items-start gap-3">
              <Bell className="w-4 h-4 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{latestNotification.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{latestNotification.message}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
