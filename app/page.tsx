'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shuffle,
  Camera,
  Share2,
  Globe,
  Zap,
  ChevronDown,
  MessageSquare,
  Sparkles,
  Copy,
  Linkedin,
  ExternalLink,
} from 'lucide-react'
import { toBlob } from 'html-to-image'
import TeamsMockup from '@/components/TeamsMockup'
import Toast from '@/components/Toast'
import { useConfetti } from '@/components/Confetti'
import { translations, type Lang } from '@/lib/i18n'
import { getRandomPack, getRandomMessage, getRandomMemeContent, type Category } from '@/lib/suggestions'

// ─── Dropdown Component ──────────────────────────────────────────────────────
function Dropdown({
  value,
  options,
  onChange,
  icon,
}: {
  value: string
  options: { value: string; label: string }[]
  onChange: (val: string) => void
  icon: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-display text-sm font-medium text-gray-200 transition-all hover:bg-white/10 hover:border-teams-accent/30"
      >
        {icon}
        <span>{selected?.label}</span>
        <ChevronDown
          size={14}
          className="transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="dropdown-menu"
          >
            {options.map((o) => (
              <button
                key={o.value}
                onClick={() => {
                  onChange(o.value)
                  setOpen(false)
                }}
                className="block w-full text-left px-4 py-2.5 text-sm font-display transition-colors"
                style={{
                  background:
                    value === o.value ? 'rgba(127,133,245,0.15)' : 'transparent',
                  color: value === o.value ? '#7f85f5' : '#ccc',
                  fontWeight: value === o.value ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (value !== o.value)
                    (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
                }}
                onMouseLeave={(e) => {
                  if (value !== o.value)
                    (e.target as HTMLElement).style.background = 'transparent'
                }}
              >
                {o.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Share Modal ─────────────────────────────────────────────────────────────
function ShareModal({
  open,
  onClose,
  shareText,
  url,
}: {
  open: boolean
  onClose: () => void
  shareText: string
  url: string
}) {
  const fullText = `${shareText}\n\n${url}`

  const shareTargets = [
    {
      name: 'LinkedIn',
      icon: <Linkedin size={18} />,
      color: '#0A66C2',
      onClick: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank'
        )
      },
    },
    {
      name: 'Teams',
      icon: <MessageSquare size={18} />,
      color: '#6264A7',
      onClick: () => {
        window.open(
          `https://teams.microsoft.com/share?text=${encodeURIComponent(fullText)}`,
          '_blank'
        )
      },
    },
    {
      name: 'Slack',
      icon: <MessageSquare size={18} />,
      color: '#4A154B',
      onClick: () => {
        window.open(
          `https://slack.com/intl/en/share?text=${encodeURIComponent(fullText)}`,
          '_blank'
        )
      },
    },
    {
      name: 'Copy link',
      icon: <Copy size={18} />,
      color: '#666',
      onClick: async () => {
        await navigator.clipboard?.writeText(fullText)
        onClose()
      },
    },
  ]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-80 rounded-2xl border border-white/10 bg-[#1e1e1e] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg font-bold mb-4">Partager</h3>
            <div className="grid grid-cols-2 gap-3">
              {shareTargets.map((target) => (
                <button
                  key={target.name}
                  onClick={target.onClick}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-gray-200 transition-all hover:bg-white/10 hover:border-white/20"
                >
                  <span style={{ color: target.color }}>{target.icon}</span>
                  {target.name}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Home() {
  const [lang, setLang] = useState<Lang>('fr')
  const [category, setCategory] = useState<Category>('passive')
  const [suggestions, setSuggestions] = useState<string[]>(['Oui', 'Non', 'Je ne sais pas'])
  const [counter, setCounter] = useState(0)
  const [toast, setToast] = useState({ visible: false, message: '' })
  const [senderName, setSenderName] = useState('')
  const [senderTime, setSenderTime] = useState('14:32')
  const [message, setMessage] = useState('')
  const [shakeKey, setShakeKey] = useState(0)
  const [shareOpen, setShareOpen] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('http://localhost:3001')
  const captureRef = useRef<HTMLDivElement>(null)
  const { burst, ConfettiLayer } = useConfetti()

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const t = translations[lang]
  const activeSenderName = senderName || t.defaultSenderName
  const senderInitials = activeSenderName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
  const activeMessage = message || t.defaultMessage
  const catOptions = Object.entries(t.categories).map(([k, v]) => ({
    value: k,
    label: v,
  }))
  const langOptions = Object.entries(translations).map(([k, v]) => ({
    value: k,
    label: `${v.flag} ${v.lang}`,
  }))

  const showToast = useCallback((msg: string) => {
    setToast({ visible: true, message: msg })
    setTimeout(() => setToast({ visible: false, message: '' }), 3500)
  }, [])

  const randomize = useCallback(() => {
    if (category === 'meme') {
      const meme = getRandomMemeContent(lang)
      setSuggestions(meme.suggestions)
      setSenderName(meme.sender)
      setMessage(meme.content)
    } else {
      const pack = getRandomPack(lang, category)
      setSuggestions(pack)
      const [name, msg] = getRandomMessage(lang, category)
      setSenderName(name)
      setMessage(msg)
    }
    setCounter((c) => c + 3)
    setShakeKey((k) => k + 1)
    burst()
  }, [lang, category, burst])

  const handleCapture = useCallback(async () => {
    if (!captureRef.current) return
    try {
      // Small timeout to ensure rendering is complete if anything just changed
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const blob = await toBlob(captureRef.current, {
        backgroundColor: '#1f1f1f',
        // Fix for "trim" and "CSSStyleSheet" errors:
        skipAutoScale: true,
        cacheBust: true,
        pixelRatio: 2,
        style: { transform: 'scale(1)' },
        fontEmbedCSS: '' // Disable font embedding if it causes cross-origin issues
      })

      if (blob && navigator.clipboard?.write) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ])
          showToast(t.toastCopied)
        } catch {
          // Fallback: open in new tab
          const url = URL.createObjectURL(blob)
          window.open(url)
          showToast(t.toastFallback)
        }
      } else if (blob) {
         const url = URL.createObjectURL(blob)
         window.open(url)
         showToast(t.toastFallback)
      }
    } catch (err) {
      console.error('Capture failed', err)
      showToast(t.toastFallback)
    }
  }, [showToast, t])

  const handleShare = useCallback(async () => {
    const text = `${t.shareText}\n\n💬 "${suggestions.join('" / "')}"`
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Teams Suggest',
          text,
          url: window.location.href,
        })
        return
      } catch {
        // User cancelled or not supported — fall through to modal
      }
    }
    setShareOpen(true)
  }, [suggestions, t])

  // Update suggestions and message when lang/category changes
  useEffect(() => {
    if (category === 'meme') {
      // Force consistent meme + suggestions
      const meme = getRandomMemeContent(lang)
      setSuggestions(meme.suggestions)
      setSenderName(meme.sender)
      setMessage(meme.content)
    } else {
      setSuggestions(getRandomPack(lang, category))
      const [name, msg] = getRandomMessage(lang, category)
      setSenderName(name)
      setMessage(msg)
    }
  }, [lang, category])

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(ellipse 1400px 600px at 50% 0%, #1e1b2e 0%, #0d0d0d 70%)',
      }}
    >
      {/* ── Hero ── */}
      <header className="relative text-center px-6 pt-16 pb-6">
        {/* Glow orb */}
        <div
          className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full pointer-events-none animate-pulse-glow"
          style={{
            background:
              'radial-gradient(circle, rgba(127,133,245,0.15) 0%, transparent 70%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-teams-accent/20 bg-teams-accent/10 px-5 py-1.5 mb-6 text-sm font-medium text-[#9d9fff]"
        >
          <Sparkles size={14} />
          <span>v2.0 — Now with multilingual absurdity</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[clamp(42px,8vw,76px)] font-black leading-none mb-3 tracking-[-3px]"
        >
          <span
            className="animate-gradient bg-clip-text"
            style={{
              background: 'linear-gradient(135deg, #7f85f5 0%, #b57fff 50%, #7f85f5 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animationName: 'gradientShift',
              animationDuration: '6s',
              animationTimingFunction: 'ease',
              animationIterationCount: 'infinite',
            }}
          >
            {t.title}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[clamp(18px,3vw,26px)] font-light text-gray-400 mb-2 tracking-[-0.3px]"
        >
          {t.tagline}{' '}
          <span className="font-semibold text-teams-accent">{t.tagline2}</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-sm text-gray-600 max-w-lg mx-auto"
        >
          {t.subtitle}
        </motion.p>
      </header>

      {/* ── Controls ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="flex flex-wrap justify-center gap-3 px-6 py-4 max-w-3xl mx-auto"
      >
        <Dropdown
          value={lang}
          options={langOptions}
          onChange={(v) => setLang(v as Lang)}
          icon={<Globe size={14} />}
        />
        <Dropdown
          value={category}
          options={catOptions}
          onChange={(v) => setCategory(v as Category)}
          icon={<Zap size={14} />}
        />
      </motion.div>

      {/* ── Mockup ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col items-center px-6 py-5 relative"
      >
        <ConfettiLayer />

        <motion.div
          key={shakeKey}
          animate={shakeKey > 0 ? { x: [0, -4, 3, -2, 1, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[760px] flex justify-center"
        >
          <TeamsMockup
            ref={captureRef}
            suggestions={suggestions}
            onSuggestionsChange={setSuggestions}
            placeholder={t.placeholder}
            senderName={activeSenderName}
            senderInitials={senderInitials}
            message={activeMessage}
            onMessageChange={setMessage}
            onSenderNameChange={setSenderName}
            senderTime={senderTime}
            onSenderTimeChange={setSenderTime}
          />
        </motion.div>

        <p className="text-xs text-white/25 mt-3 italic text-center">
          💡 {t.editHint}
        </p>
      </motion.div>

      {/* ── Action buttons ── */}
      <div className="flex flex-wrap justify-center gap-3 px-6 pt-3 pb-8">
        <button onClick={randomize} className="action-btn-primary font-display">
          <Shuffle size={16} />
          {t.randomize}
        </button>
        <button onClick={handleCapture} className="action-btn-secondary font-display">
          <Camera size={16} />
          {t.screenshot}
        </button>
        <button onClick={handleShare} className="action-btn-secondary font-display">
          <Share2 size={16} />
          {t.share}
        </button>
      </div>

      {/* ── Counter ── */}
      <AnimatePresence>
        {counter > 0 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm text-teams-accent font-medium px-6 pb-8"
          >
            🎯 {counter}
            {t.counter}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── How it works ── */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-3xl font-extrabold mb-8 tracking-[-1px]"
        >
          {t.howItWorks}
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              num: '01',
              icon: <Zap size={20} />,
              title: t.step1,
              desc: t.step1d,
            },
            {
              num: '02',
              icon: <MessageSquare size={20} />,
              title: t.step2,
              desc: t.step2d,
            },
            {
              num: '03',
              icon: <Camera size={20} />,
              title: t.step3,
              desc: t.step3d,
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="step-card"
            >
              <div className="flex items-center gap-2.5 mb-3 text-teams-accent">
                <span className="text-[11px] font-bold opacity-50">{step.num}</span>
                {step.icon}
              </div>
              <h3 className="text-[15px] font-bold mb-1.5">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Hall of Shame ── */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-3xl font-extrabold mb-2 tracking-[-1px]"
        >
          🏆 {t.gallery}
        </motion.h2>
        <p className="text-center text-sm text-gray-600 mb-8">{t.gallerySubtitle}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {t.galleryItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="gallery-card"
            >
              <p className="text-xs text-gray-500 mb-3 italic">{item.context}</p>
              <div className="flex gap-1 flex-wrap">
                {item.suggestions.map((s, j) => (
                  <span
                    key={j}
                    className="border border-teams-accent bg-teams-pill text-teams-accent px-2.5 py-0.5 rounded text-[11px] font-semibold font-teams"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Other Project ── */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-3xl font-extrabold mb-2 tracking-[-1px]"
        >
          {t.otherProject}
        </motion.h2>
        <p className="text-center text-sm text-gray-600 mb-8">
          {t.otherProjectSubtitle}
        </p>

        <motion.a
          href="https://mid-2000-pc.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="block rounded-2xl p-6 transition-all duration-200 group"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
          whileHover={{
            borderColor: 'rgba(127, 133, 245, 0.3)',
            y: -2,
          }}
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl flex-shrink-0">🖥️</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1 text-white group-hover:text-teams-accent transition-colors">
                {t.otherProjectName}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-3">
                {t.otherProjectDesc}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-teams-accent">
                {t.otherProjectCta}
                <ExternalLink size={14} />
              </span>
            </div>
          </div>
        </motion.a>
      </section>

      {/* ── Footer ── */}
      <footer className="text-center px-6 py-10 border-t border-white/[0.04]">
        <p className="text-sm text-gray-700">{t.madeWith}</p>
        <p className="text-xs text-gray-800 mt-2">
          Teams Suggest — Projet parodique indépendant, non affilié à Microsoft ni
          approuvé par eux. Obviously. 😏
        </p>
      </footer>

      {/* ── Modals & Overlays ── */}
      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast({ visible: false, message: '' })}
      />
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        shareText={`${t.shareText}\n\n💬 "${suggestions.join('" / "')}"`}
        url={currentUrl}
      />
    </main>
  )
}
