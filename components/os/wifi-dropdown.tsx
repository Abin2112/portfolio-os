'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, Check, Signal } from 'lucide-react'
import { useOSStore } from '@/lib/os-store'

interface WifiDropdownProps {
  isOpen: boolean
  onClose: () => void
}

const availableNetworks = [
  { name: "Abin's WiFi", strength: 4, secured: true },
  { name: 'Guest Network', strength: 3, secured: false },
  { name: 'Neighbor_5G', strength: 2, secured: true },
  { name: 'CoffeeShop_Free', strength: 1, secured: false },
]

function SignalBars({ strength }: { strength: number }) {
  return (
    <div className="flex items-end gap-0.5 h-3">
      {[1, 2, 3, 4].map((level) => (
        <motion.div
          key={level}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: level * 0.05 }}
          className={`w-1 rounded-sm ${
            level <= strength ? 'bg-primary' : 'bg-muted-foreground/30'
          }`}
          style={{ height: `${level * 25}%` }}
        />
      ))}
    </div>
  )
}

export function WifiDropdown({ isOpen, onClose }: WifiDropdownProps) {
  const { wifiConnected, wifiNetworkName, setWifiConnected, setWifiNetworkName } = useOSStore()

  const handleConnect = (networkName: string) => {
    setWifiNetworkName(networkName)
    setWifiConnected(true)
  }

  const handleDisconnect = () => {
    setWifiConnected(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[9996]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute top-full right-0 mt-1 w-64 rounded-xl overflow-hidden shadow-2xl z-[9998]"
          >
            <div className="bg-[var(--popover)] backdrop-blur-xl border border-[var(--glass-border)] rounded-xl">
              {/* Header */}
              <div className="px-4 py-3 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Wi-Fi</span>
                  <button
                    onClick={() => setWifiConnected(!wifiConnected)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      wifiConnected ? 'bg-primary' : 'bg-secondary'
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                      style={{ left: wifiConnected ? '22px' : '2px' }}
                    />
                  </button>
                </div>
              </div>

              {/* Connected Network */}
              {wifiConnected && (
                <div className="px-4 py-3 border-b border-[var(--glass-border)] bg-primary/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wifi className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{wifiNetworkName}</p>
                        <p className="text-xs text-primary">Connected</p>
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="mt-2 w-full px-3 py-1.5 text-xs bg-secondary/50 text-muted-foreground rounded-lg hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              )}

              {/* Available Networks */}
              <div className="py-2 max-h-48 overflow-auto">
                <p className="px-4 py-1 text-xs text-muted-foreground">Available Networks</p>
                {availableNetworks
                  .filter((n) => !wifiConnected || n.name !== wifiNetworkName)
                  .map((network) => (
                    <button
                      key={network.name}
                      onClick={() => handleConnect(network.name)}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-foreground/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {wifiConnected && network.name === wifiNetworkName ? (
                          <Wifi className="w-4 h-4 text-primary" />
                        ) : (
                          <Signal className="w-4 h-4 text-muted-foreground" />
                        )}
                        <div className="text-left">
                          <p className="text-sm text-foreground">{network.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {network.secured ? 'Secured' : 'Open'}
                          </p>
                        </div>
                      </div>
                      <SignalBars strength={network.strength} />
                    </button>
                  ))}
              </div>

              {/* WiFi Settings */}
              <div className="px-4 py-3 border-t border-[var(--glass-border)]">
                <button className="text-xs text-primary hover:underline">
                  Wi-Fi Settings...
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
