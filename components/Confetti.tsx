'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EMOJIS = ['😂', '🤣', '💀', '🤡', '🎉', '😭', '🔥', '💜', '🫠', '🤦']

interface Particle {
  id: number
  emoji: string
  x: number
  tx: number
  ty: number
  size: number
  rotation: number
}

export function useConfetti() {
  const [particles, setParticles] = useState<Particle[]>([])

  const burst = useCallback(() => {
    const newParticles: Particle[] = Array.from({ length: 14 }, (_, i) => {
      const angle = -90 + (Math.random() - 0.5) * 140
      const speed = 2 + Math.random() * 3.5
      return {
        id: Date.now() + i,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        x: 35 + Math.random() * 30,
        tx: Math.cos((angle * Math.PI) / 180) * speed * 70,
        ty: Math.sin((angle * Math.PI) / 180) * speed * 70 - 180,
        size: 18 + Math.random() * 14,
        rotation: Math.random() * 720 - 360,
      }
    })
    setParticles(newParticles)
    setTimeout(() => setParticles([]), 1600)
  }, [])

  const ConfettiLayer = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: p.tx,
              y: p.ty,
              opacity: 0,
              rotate: p.rotation,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              bottom: '10%',
              fontSize: p.size,
            }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )

  return { burst, ConfettiLayer }
}
