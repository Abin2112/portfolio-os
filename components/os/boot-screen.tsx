'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useOSStore } from '@/lib/os-store'

const bootMessages = [
  'Initializing system...',
  'Loading kernel modules...',
  'Mounting filesystems...',
  'Starting display manager...',
  'Loading desktop environment...',
  'Preparing portfolio...',
  'Welcome!',
]

export function BootScreen() {
  const { isBooted, bootProgress, setBoot, setBootProgress } = useOSStore()
  const [currentMessage, setCurrentMessage] = useState(0)

  useEffect(() => {
    if (isBooted) return

    const progressInterval = setInterval(() => {
      setBootProgress(Math.min(bootProgress + Math.random() * 15, 100))
    }, 200)

    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => Math.min(prev + 1, bootMessages.length - 1))
    }, 400)

    if (bootProgress >= 100) {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
      setTimeout(() => setBoot(true), 500)
    }

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
    }
  }, [isBooted, bootProgress, setBoot, setBootProgress])

  return (
    <AnimatePresence>
      {!isBooted && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[20000] bg-[#0d0d12] flex flex-col items-center justify-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="mb-12"
          >
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center shadow-2xl shadow-primary/30">
              <motion.span
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl font-bold text-primary-foreground"
              >
                AP
              </motion.span>
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="w-64 mb-6">
            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${bootProgress}%` }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
          </div>

          {/* Boot message */}
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-white/60 font-mono"
          >
            {bootMessages[currentMessage]}
          </motion.p>

          {/* Decorative elements */}
          <div className="absolute bottom-8 text-center">
            <p className="text-xs text-white/30">Portfolio OS v1.0</p>
            <p className="text-[10px] text-white/20 mt-1">Built with Next.js & Framer Motion</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function LoginScreen() {
  const { isLoggedIn, setLogin } = useOSStore()
  const [isHovered, setIsHovered] = useState(false)

  if (isLoggedIn) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[19000] flex flex-col items-center justify-center"
    >
      {/* Blurred background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.12_0.04_260)] via-[oklch(0.15_0.03_250)] to-[oklch(0.1_0.05_280)]" />
      <div className="absolute inset-0 backdrop-blur-sm" />

      {/* Login content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 text-center"
      >
        {/* Avatar */}
        <motion.button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setLogin(true)}
          className="relative mb-6 mx-auto"
        >
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            className="w-28 h-28 rounded-full bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center shadow-2xl shadow-primary/30 cursor-pointer"
          >
            <span className="text-4xl font-bold text-primary-foreground">AP</span>
          </motion.div>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 rounded-full ring-4 ring-primary/50"
            />
          )}
        </motion.button>

        <h1 className="text-2xl font-bold text-foreground mb-1">Abin Pillai</h1>
        <p className="text-sm text-muted-foreground mb-8">Click to enter</p>

        {/* Time */}
        <TimeDisplay />
      </motion.div>
    </motion.div>
  )
}

function TimeDisplay() {
  const [time, setTime] = useState<string>('')
  const [date, setDate] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }))
      setDate(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="absolute bottom-16 left-1/2 -translate-x-1/2"
    >
      <p className="text-5xl font-light text-foreground tabular-nums">{time}</p>
      <p className="text-sm text-muted-foreground mt-2">{date}</p>
    </motion.div>
  )
}
