import React, { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export default function AlertBanner({ message, type = 'warn' }) {
  const [dismissed, setDismissed] = useState(false)
  if (!message || dismissed) return null

  const styles = {
    warn:  'border-cyber-yellow/40 bg-cyber-yellow/5 text-cyber-yellow',
    error: 'border-cyber-red/40    bg-cyber-red/5    text-cyber-red',
    info:  'border-cyber-cyan/40   bg-cyber-cyan/5   text-cyber-cyan',
  }[type]

  return (
    <div className={`flex items-start gap-2 px-4 py-2.5 border rounded text-[11px] font-mono ${styles}`}>
      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
      <span className="flex-1">{message}</span>
      <button onClick={() => setDismissed(true)} className="shrink-0 opacity-60 hover:opacity-100">
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}
