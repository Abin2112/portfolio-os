'use client'

import { motion, AnimatePresence, useDragControls, type PanInfo } from 'framer-motion'
import { X, Minus, Square, Maximize2 } from 'lucide-react'
import { useWindowStore, type WindowId } from '@/lib/window-store'
import { useOSStore } from '@/lib/os-store'
import { playClickSound, playMinimizeSound, playSnapSound } from '@/lib/sound-utils'
import { useRef, useEffect, useState, useCallback } from 'react'

interface WindowProps {
  id: WindowId
  title: string
  children: React.ReactNode
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null
type SnapZone = 'left' | 'right' | 'top' | null

const MIN_WIDTH = 350
const MIN_HEIGHT = 250
const SNAP_EDGE = 24 // px from edge to trigger snap preview
const TOP_BAR_H = 32
const TASKBAR_H = 64

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
  const { isMuted, volume } = useOSStore()
  const window = windows[id]
  const dragControls = useDragControls()
  const constraintsRef = useRef<HTMLDivElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [resizeDir, setResizeDir] = useState<ResizeDirection>(null)
  const [snapZone, setSnapZone] = useState<SnapZone>(null)
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

  const handleDrag = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (isMobile || window.isMaximized) return
      const vw = globalThis.innerWidth
      const vy = info.point.y

      let zone: SnapZone = null
      if (info.point.x < SNAP_EDGE) zone = 'left'
      else if (info.point.x > vw - SNAP_EDGE) zone = 'right'
      else if (vy < SNAP_EDGE) zone = 'top'

      setSnapZone(zone)
    },
    [isMobile, window?.isMaximized]
  )

  const applySnap = useCallback(
    (zone: NonNullable<SnapZone>) => {
      const vw = globalThis.innerWidth
      const vh = globalThis.innerHeight
      const availH = vh - TOP_BAR_H - TASKBAR_H
      playSnapSound(isMuted, volume)

      if (zone === 'top') {
        maximizeWindow(id)
      } else if (zone === 'left') {
        updatePosition(id, { x: 0, y: TOP_BAR_H })
        updateSize(id, { width: Math.floor(vw / 2), height: availH })
      } else if (zone === 'right') {
        updatePosition(id, { x: Math.floor(vw / 2), y: TOP_BAR_H })
        updateSize(id, { width: Math.ceil(vw / 2), height: availH })
      }
    },
    [id, isMuted, volume, maximizeWindow, updatePosition, updateSize]
  )

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!window.isMaximized) {
        if (snapZone) {
          applySnap(snapZone)
        } else {
          updatePosition(id, {
            x: window.position.x + info.offset.x,
            y: window.position.y + info.offset.y,
          })
        }
      }
      setSnapZone(null)
    },
    [window?.isMaximized, window?.position, snapZone, applySnap, updatePosition, id]
  )

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
    [window?.size, window?.position]
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

      if (resizeDir.includes('e')) {
        newWidth = Math.max(MIN_WIDTH, resizeRef.current.startWidth + deltaX)
      }
      if (resizeDir.includes('w')) {
        const widthDelta = Math.min(deltaX, resizeRef.current.startWidth - MIN_WIDTH)
        newWidth = resizeRef.current.startWidth - widthDelta
        newX = resizeRef.current.startPosX + widthDelta
      }
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

    const handleMouseUp = () => setResizeDir(null)

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

  // Snap preview geometry
  const vw = typeof globalThis !== 'undefined' ? globalThis.innerWidth : 1280
  const vh = typeof globalThis !== 'undefined' ? globalThis.innerHeight : 800
  const availH = vh - TOP_BAR_H - TASKBAR_H

  const snapPreviewStyle =
    snapZone === 'left'
      ? { left: 0, top: TOP_BAR_H, width: vw / 2, height: availH }
      : snapZone === 'right'
      ? { left: vw / 2, top: TOP_BAR_H, width: vw / 2, height: availH }
      : snapZone === 'top'
      ? { left: 0, top: TOP_BAR_H, width: vw, height: availH }
      : null

  return (
    <>
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none" />

      {/* Snap preview overlay */}
      <AnimatePresence>
        {snapZone && !isMobile && !isMaximized && snapPreviewStyle && (
          <motion.div
            key="snap-preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed pointer-events-none z-[9800]"
            style={snapPreviewStyle}
          >
            <div className="w-full h-full rounded-xl border-2 border-primary/70 bg-primary/10 backdrop-blur-sm" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={windowRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: isActive ? 1 : 0.95,
          x: isMobile || isMaximized ? 0 : window.position.x,
          y: isMobile || isMaximized ? (isMaximized ? TOP_BAR_H : 0) : window.position.y,
          width: isMobile || isMaximized ? '100%' : window.size.width,
          height:
            isMobile || isMaximized
              ? isMaximized
                ? `calc(100% - ${TOP_BAR_H}px - ${TASKBAR_H}px)`
                : '100%'
              : window.size.height,
        }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        drag={!isMobile && !isMaximized && !resizeDir}
        dragControls={dragControls}
        dragMomentum={false}
        dragConstraints={constraintsRef}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onPointerDown={() => focusWindow(id)}
        style={{ zIndex: window.zIndex + 100 }}
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
                onClick={() => {
                  playClickSound(isMuted, volume)
                  closeWindow(id)
                }}
                className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-400 transition-colors flex items-center justify-center group"
              >
                <X className="w-2.5 h-2.5 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => {
                  playMinimizeSound(isMuted, volume)
                  minimizeWindow(id)
                }}
                className="w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors flex items-center justify-center group"
              >
                <Minus className="w-2.5 h-2.5 text-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => {
                  playClickSound(isMuted, volume)
                  maximizeWindow(id)
                }}
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

        {/* Resize handles */}
        {!isMobile && !isMaximized && (
          <>
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
