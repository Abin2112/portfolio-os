'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Wifi, WifiOff, Volume2, VolumeX, Battery, Bell, ChevronDown, Settings, Power, Search, BatteryCharging } from 'lucide-react'
import { useNotificationStore } from '@/lib/notification-store'
import { useWindowStore } from '@/lib/window-store'
import { useOSStore } from '@/lib/os-store'
import { WifiDropdown } from './wifi-dropdown'

export function TopBar() {
  const [time, setTime] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [showAppMenu, setShowAppMenu] = useState(false)
  const [showWifiDropdown, setShowWifiDropdown] = useState(false)
  const [batteryLevel] = useState(87)
  const { notifications, togglePanel } = useNotificationStore()
  const { openWindow } = useWindowStore()
  const { wifiConnected, volume, isMuted, setLogin, setBoot } = useOSStore()

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
      setDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.length

  const handleLogout = () => {
    setShowAppMenu(false)
    setBoot(false)
    setLogin(false)
  }

  return (
    <motion.div
      initial={{ y: -40 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-[9998] h-8"
    >
      <div className="relative flex items-center justify-between h-full px-3">
        {/* Background */}
        <div className="absolute inset-0 bg-[var(--topbar-bg)] backdrop-blur-xl" />
        <div className="absolute inset-0 border-b border-[var(--glass-border)]" />

        {/* Left: App Menu */}
        <div className="relative flex items-center gap-3 z-10">
          <button
            onClick={() => setShowAppMenu(!showAppMenu)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-foreground/10 transition-colors"
          >
            <div className="w-4 h-4 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-[8px] font-bold text-primary-foreground">A</span>
            </div>
            <span className="text-xs font-medium text-foreground">Activities</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>

          {/* App Menu Dropdown */}
          {showAppMenu && (
            <>
              <div 
                className="fixed inset-0 z-[9997]" 
                onClick={() => setShowAppMenu(false)} 
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-1 w-56 rounded-lg overflow-hidden shadow-2xl z-[9999]"
              >
                <div className="bg-[var(--popover)] backdrop-blur-xl border border-[var(--glass-border)] rounded-lg p-1">
                  <button
                    onClick={() => {
                      openWindow('file-explorer')
                      setShowAppMenu(false)
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground rounded hover:bg-foreground/10 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                    Files
                  </button>
                  <button
                    onClick={() => {
                      openWindow('settings')
                      setShowAppMenu(false)
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground rounded hover:bg-foreground/10 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <div className="my-1 border-t border-[var(--glass-border)]" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground rounded hover:bg-foreground/10 transition-colors"
                  >
                    <Power className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Center: Date & Time */}
        <div className="absolute left-1/2 -translate-x-1/2 z-10">
          <span className="text-xs font-medium text-foreground/90">
            {date} {time}
          </span>
        </div>

        {/* Right: System Icons */}
        <div className="relative flex items-center gap-1 z-10">
          {/* WiFi */}
          <div className="relative">
            <button
              onClick={() => setShowWifiDropdown(!showWifiDropdown)}
              className="flex items-center justify-center w-7 h-7 rounded hover:bg-foreground/10 transition-colors"
              title={wifiConnected ? 'WiFi Connected' : 'WiFi Disconnected'}
            >
              {wifiConnected ? (
                <Wifi className="w-3.5 h-3.5 text-foreground/80" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
            <WifiDropdown 
              isOpen={showWifiDropdown} 
              onClose={() => setShowWifiDropdown(false)} 
            />
          </div>

          {/* Volume */}
          <button 
            className="flex items-center justify-center w-7 h-7 rounded hover:bg-foreground/10 transition-colors"
            title={isMuted ? 'Muted' : `Volume: ${volume}%`}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-foreground/80" />
            )}
          </button>

          {/* Battery */}
          <button 
            className="flex items-center gap-1 px-1.5 h-7 rounded hover:bg-foreground/10 transition-colors"
            title={`Battery: ${batteryLevel}%`}
          >
            {batteryLevel > 95 ? (
              <BatteryCharging className="w-4 h-4 text-green-500" />
            ) : (
              <Battery className="w-4 h-4 text-foreground/80" />
            )}
            <span className="text-[10px] text-foreground/80">{batteryLevel}%</span>
          </button>

          {/* Notifications */}
          <button
            onClick={togglePanel}
            className="relative flex items-center justify-center w-7 h-7 rounded hover:bg-foreground/10 transition-colors"
            title={`${unreadCount} notifications`}
          >
            <Bell className="w-3.5 h-3.5 text-foreground/80" />
            {unreadCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
