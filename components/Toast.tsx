'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

interface ToastProps {
  message: string
  visible: boolean
  onClose: () => void
}

export default function Toast({ message, visible, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-8 left-1/2 z-50 flex items-center gap-3 rounded-xl border border-teams-accent/30 bg-[#2d2d2d] px-6 py-3 font-display text-sm font-medium text-white shadow-2xl"
          style={{ transform: 'translateX(-50%)' }}
        >
          <Check size={16} className="text-teams-accent" />
          {message}
          <button
            onClick={onClose}
            className="ml-1 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
