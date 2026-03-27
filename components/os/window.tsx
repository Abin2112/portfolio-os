'use client'

import { motion, useDragControls, type PanInfo } from 'framer-motion'
import { X, Minus, Square, Maximize2 } from 'lucide-react'
import { useWindowStore, type WindowId } from '@/lib/window-store'
import { useRef, useEffect, useState, useCallback } from 'react'

interface WindowProps {
  id: WindowId
  title: string
  children: React.ReactNode
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null

const MIN_WIDTH = 350
const MIN_HEIGHT = 250

export function Window({ id, title, children }: WindowProps) {
  const {
    windows,
    activeWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updatePosition,
    updateSize,
  } = useWindowStore()
  const window = windows[id]
  const dragControls = useDragControls()
  const constraintsRef = useRef<HTMLDivElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [resizeDir, setResizeDir] = useState<ResizeDirection>(null)
  const resizeRef = useRef({
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startPosX: 0,
    startPosY: 0,
  })

  useEffect(() => {
    const checkMobile = () => setIsMobile(globalThis.innerWidth < 768)
    checkMobile()
    globalThis.addEventListener('resize', checkMobile)
    return () => globalThis.removeEventListener('resize', checkMobile)
  }, [])

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!window.isMaximized) {
      updatePosition(id, {
        x: window.position.x + info.offset.x,
        y: window.position.y + info.offset.y,
      })
    }
  }

  const handleResizeStart = useCallback(
    (e: React.PointerEvent, direction: ResizeDirection) => {
      e.preventDefault()
      e.stopPropagation()
      setResizeDir(direction)
      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: window.size.width,
        startHeight: window.size.height,
        startPosX: window.position.x,
        startPosY: window.position.y,
      }
    },
    [window.size, window.position]
  )

  useEffect(() => {
    if (!resizeDir) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeRef.current.startX
      const deltaY = e.clientY - resizeRef.current.startY

      let newWidth = resizeRef.current.startWidth
      let newHeight = resizeRef.current.startHeight
      let newX = resizeRef.current.startPosX
      let newY = resizeRef.current.startPosY

      // Handle horizontal resize
      if (resizeDir.includes('e')) {
        newWidth = Math.max(MIN_WIDTH, resizeRef.current.startWidth + deltaX)
      }
      if (resizeDir.includes('w')) {
        const widthDelta = Math.min(deltaX, resizeRef.current.startWidth - MIN_WIDTH)
        newWidth = resizeRef.current.startWidth - widthDelta
        newX = resizeRef.current.startPosX + widthDelta
      }

      // Handle vertical resize
      if (resizeDir.includes('s')) {
        newHeight = Math.max(MIN_HEIGHT, resizeRef.current.startHeight + deltaY)
      }
      if (resizeDir.includes('n')) {
        const heightDelta = Math.min(deltaY, resizeRef.current.startHeight - MIN_HEIGHT)
        newHeight = resizeRef.current.startHeight - heightDelta
        newY = resizeRef.current.startPosY + heightDelta
      }

      updateSize(id, { width: newWidth, height: newHeight })
      if (resizeDir.includes('w') || resizeDir.includes('n')) {
        updatePosition(id, { x: newX, y: newY })
      }
    }

    const handleMouseUp = () => {
      setResizeDir(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [resizeDir, id, updateSize, updatePosition])

  if (!window.isOpen || window.isMinimized) return null

  const isActive = activeWindow === id
  const isMaximized = window.isMaximized

  const resizeHandleClass = 'absolute z-50'

  return (
    <>
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none" />
      <motion.div
        ref={windowRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: isActive ? 1 : 0.95,
          x: isMobile || isMaximized ? 0 : window.position.x,
          y: isMobile || isMaximized ? (isMaximized ? 32 : 0) : window.position.y,
          width: isMobile || isMaximized ? '100%' : window.size.width,
          height: isMobile || isMaximized ? (isMaximized ? 'calc(100% - 32px - 64px)' : '100%') : window.size.height,
        }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        drag={!isMobile && !isMaximized && !resizeDir}
        dragControls={dragControls}
        dragMomentum={false}
        dragConstraints={constraintsRef}
        onDragEnd={handleDragEnd}
        onPointerDown={() => focusWindow(id)}
        style={{
          zIndex: window.zIndex + 100,
        }}
        className={`fixed flex flex-col overflow-hidden ${
          isMaximized || isMobile ? '' : 'rounded-xl'
        } ${isActive ? 'shadow-2xl' : 'shadow-xl brightness-95'}`}
      >
        {/* Glass background */}
        <div className="absolute inset-0 bg-[var(--window-bg)] backdrop-blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--glass-highlight)] to-transparent pointer-events-none" />
        <div
          className={`absolute inset-0 border-2 pointer-events-none transition-colors ${
            isActive ? 'border-primary/40' : 'border-[var(--glass-border)]'
          } ${isMaximized || isMobile ? '' : 'rounded-xl'}`}
        />

        {/* Title bar */}
        <div
          onPointerDown={(e) => {
            if (!isMobile && !isMaximized && !resizeDir) dragControls.start(e)
          }}
          onDoubleClick={() => !isMobile && maximizeWindow(id)}
          className="relative flex items-center justify-between px-4 py-2.5 bg-[var(--window-header)] cursor-grab active:cursor-grabbing select-none"
        >
          {/* Window controls */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <button
                onClick={() => closeWindow(id)}
                className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-400 transition-colors flex items-center justify-center group"
              >
                <X className="w-2.5 h-2.5 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => minimizeWindow(id)}
                className="w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors flex items-center justify-center group"
              >
                <Minus className="w-2.5 h-2.5 text-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => maximizeWindow(id)}
                className="w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-400 transition-colors flex items-center justify-center group"
              >
                {isMaximized ? (
                  <Square className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <Maximize2 className="w-2.5 h-2.5 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            </div>
          </div>

          {/* Title */}
          <span className="absolute left-1/2 -translate-x-1/2 text-sm font-medium text-foreground/90">
            {title}
          </span>

          <div className="w-12" />
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-auto p-6">{children}</div>

        {/* Resize handles - only show when not maximized or mobile */}
        {!isMobile && !isMaximized && (
          <>
            {/* Edge handles */}
            <div
              onPointerDown={(e) => handleResizeStart(e, 'n')}
              className={`${resizeHandleClass} top-0 left-3 right-3 h-1 cursor-n-resize`}
            />
            <div
              onPointerDown={(e) => handleResizeStart(e, 's')}
              className={`${resizeHandleClass} bottom-0 left-3 right-3 h-1 cursor-s-resize`}
            />
            <div
              onPointerDown={(e) => handleResizeStart(e, 'w')}
              className={`${resizeHandleClass} left-0 top-3 bottom-3 w-1 cursor-w-resize`}
            />
            <div
              onPointerDown={(e) => handleResizeStart(e, 'e')}
              className={`${resizeHandleClass} right-0 top-3 bottom-3 w-1 cursor-e-resize`}
            />
            
            {/* Corner handles */}
            <div
              onPointerDown={(e) => handleResizeStart(e, 'nw')}
              className={`${resizeHandleClass} top-0 left-0 w-3 h-3 cursor-nw-resize`}
            />
            <div
              onPointerDown={(e) => handleResizeStart(e, 'ne')}
              className={`${resizeHandleClass} top-0 right-0 w-3 h-3 cursor-ne-resize`}
            />
            <div
              onPointerDown={(e) => handleResizeStart(e, 'sw')}
              className={`${resizeHandleClass} bottom-0 left-0 w-3 h-3 cursor-sw-resize`}
            />
            <div
              onPointerDown={(e) => handleResizeStart(e, 'se')}
              className={`${resizeHandleClass} bottom-0 right-0 w-4 h-4 cursor-se-resize group`}
            >
              <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-muted-foreground/30 group-hover:border-primary/60 transition-colors" />
            </div>
          </>
        )}
      </motion.div>
    </>
  )
}
