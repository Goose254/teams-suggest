'use client'

import { useRef, useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TeamsSendIcon,
  TeamsFormatIcon,
  TeamsEmojiIcon,
  TeamsClipIcon,
  TeamsPlusIcon,
  TeamsCopilotIcon,
} from './TeamsIcons'
import { MEME_PREFIX } from '@/lib/suggestions'

interface TeamsMockupProps {
  suggestions: string[]
  onSuggestionsChange: (suggestions: string[]) => void
  placeholder: string
  senderName: string
  senderInitials: string
  senderTime: string
  message: string
  onMessageChange: (message: string) => void
  onSenderNameChange: (name: string) => void
  onSenderTimeChange: (time: string) => void
}

const TeamsMockup = forwardRef<HTMLDivElement, TeamsMockupProps>(
  ({ suggestions, onSuggestionsChange, placeholder, senderName, senderInitials, senderTime, message, onMessageChange, onSenderNameChange, onSenderTimeChange }, ref) => {
    const pillRefs = useRef<(HTMLDivElement | null)[]>([])
    const messageRef = useRef<HTMLDivElement>(null)
    const nameRef = useRef<HTMLSpanElement>(null)
    const timeRef = useRef<HTMLSpanElement>(null)
    const [editingIdx, setEditingIdx] = useState(-1)

    const handlePillClick = (idx: number) => {
      setEditingIdx(idx)
      setTimeout(() => {
        const pill = pillRefs.current[idx]
        if (!pill) return
        pill.focus()
        // Place caret at end
        const range = document.createRange()
        range.selectNodeContents(pill)
        range.collapse(false)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
      }, 0)
    }

    const handleBlur = (idx: number) => {
      const text = pillRefs.current[idx]?.textContent?.trim() || '…'
      const next = [...suggestions]
      next[idx] = text
      onSuggestionsChange(next)
      setEditingIdx(-1)
    }

    const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        pillRefs.current[idx]?.blur()
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        const pill = pillRefs.current[idx]
        if (pill) pill.textContent = suggestions[idx]
        pill?.blur()
      }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault()
      const text = e.clipboardData.getData('text').replace(/\r?\n/g, ' ')
      document.execCommand('insertText', false, text)
    }

    const focusEditable = (el: HTMLElement | null) => {
      if (!el) return
      el.focus()
      const range = document.createRange()
      range.selectNodeContents(el)
      range.collapse(false)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    }

    // Meme messages are encoded as `meme:<emoji>|<caption>` and rendered as an
    // original emoji card (no copyrighted meme images involved).
    const memeParts = message.startsWith(MEME_PREFIX)
      ? message.slice(MEME_PREFIX.length).split('|')
      : null

    return (
      <div
        ref={ref}
        className="teams-mockup-capture"
        style={{
          background: '#1f1f1f',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 14,
          padding: '18px 18px 14px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
          width: '100%',
          maxWidth: 760,
        }}
      >
        {/* Received message bubble */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
            marginBottom: 14,
            padding: '0 2px',
          }}
        >
          {/* Avatar circle with initials */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6264A7, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
              letterSpacing: '0.5px',
              marginTop: '20px',
            }}
          >
            {senderInitials}
          </div>

          {/* Name, time, message */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
              <span
                ref={nameRef}
                contentEditable
                suppressContentEditableWarning
                spellCheck={false}
                onClick={() => focusEditable(nameRef.current)}
                onBlur={() => {
                  const text = nameRef.current?.textContent?.trim() || ''
                  onSenderNameChange(text)
                  if (!text && nameRef.current) {
                    nameRef.current.textContent = senderName
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    nameRef.current?.blur()
                  }
                }}
                onPaste={handlePaste}
                style={{
                  fontSize: 11,
                  color: '#adadad',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                  outline: 'none',
                  cursor: 'text',
                  borderRadius: 3,
                  padding: '0 2px',
                  transition: 'background 150ms ease',
                }}
                className="teams-editable-field"
              >
                {senderName}
              </span>
              <span
                ref={timeRef}
                contentEditable
                suppressContentEditableWarning
                spellCheck={false}
                onClick={() => focusEditable(timeRef.current)}
                onBlur={() => {
                  const text = timeRef.current?.textContent?.trim() || ''
                  onSenderTimeChange(text)
                  if (!text && timeRef.current) {
                    timeRef.current.textContent = senderTime
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    timeRef.current?.blur()
                  }
                }}
                onPaste={handlePaste}
                style={{
                  fontSize: 11,
                  color: '#888',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                  whiteSpace: 'nowrap',
                  outline: 'none',
                  cursor: 'text',
                  borderRadius: 3,
                  padding: '0 2px',
                  transition: 'background 150ms ease',
                }}
                className="teams-editable-field"
              >
                {senderTime}
              </span>
            </div>
            {memeParts ? (
              <div
                style={{
                  width: 'fit-content',
                  padding: '18px 28px 14px',
                  backgroundColor: '#292929',
                  borderRadius: 3,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 52, lineHeight: 1.2 }}>{memeParts[0]}</div>
                {memeParts[1] && (
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 13,
                      fontStyle: 'italic',
                      color: '#a9a9a9',
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                      letterSpacing: '0.2px',
                    }}
                  >
                    {memeParts[1]}
                  </div>
                )}
              </div>
            ) : (
              <div
                ref={messageRef}
                contentEditable
                suppressContentEditableWarning
                spellCheck={false}
                className="teams-editable-field"
                onClick={() => focusEditable(messageRef.current)}
                onBlur={() => {
                  const text = messageRef.current?.textContent?.trim() || ''
                  onMessageChange(text)
                  // If emptied, restore the message text visually
                  if (!text && messageRef.current) {
                    messageRef.current.textContent = message
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    messageRef.current?.blur()
                  }
                }}
                onPaste={handlePaste}
                style={{
                  width: 'fit-content',
                  fontSize: 14,
                  color: '#e0e0e0',
                  backgroundColor: '#292929',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                  outline: 'none',
                  cursor: 'text',
                  lineHeight: 1.45,
                  borderRadius: 3,
                  padding: '8px 12px',
                  transition: 'background 150ms ease',
                }}
              >
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Suggestions row */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: 4,
            marginRight: 6,
            flexWrap: 'wrap',
          }}
        >
          <AnimatePresence mode="wait">
            {suggestions.map((s, i) => (
              <motion.div
                key={`${s}-${i}`}
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                ref={(el) => { pillRefs.current[i] = el }}
                contentEditable
                suppressContentEditableWarning
                spellCheck={false}
                onClick={() => handlePillClick(i)}
                onBlur={() => handleBlur(i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
                className="teams-pill"
                style={{
                  border: '1px solid #7f85f5',
                  background: '#292929',
                  color: '#7f85f5',
                  padding: '2px 12px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                  cursor: 'text',
                  outline: 'none',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.1px',
                  transition: 'box-shadow 120ms ease, transform 120ms ease',
                  boxShadow:
                    editingIdx === i
                      ? '0 0 0 1px rgba(106,109,255,0.45) inset, 0 0 22px rgba(106,109,255,0.38)'
                      : 'none',
                  transform: editingIdx === i ? 'translateY(-1px)' : 'none',
                }}
              >
                {s}
              </motion.div>
            ))}
          </AnimatePresence>

          <div style={{ paddingLeft: 5, height: 20, display: 'flex', alignItems: 'center' }}>
            <TeamsCopilotIcon />
          </div>
        </div>

        {/* Composer bar (static) */}
        <div
          style={{
            background: '#262626',
            border: '1px solid #3a3a3a',
            borderRadius: 6,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            padding: '0 5px 0 14px',
            gap: 10,
          }}
        >
          <div
            style={{
              color: '#a9a9a9',
              fontSize: 14,
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
            }}
          >
            {placeholder}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 0, height: '100%' }}>
            {[TeamsFormatIcon, TeamsEmojiIcon, TeamsClipIcon, TeamsPlusIcon].map((Icon, i) => (
              <button
                key={i}
                type="button"
                style={{
                  width: 36,
                  height: '100%',
                  display: 'grid',
                  placeItems: 'center',
                  background: 'transparent',
                  border: 0,
                  padding: 0,
                  cursor: 'default',
                  opacity: 0.95,
                }}
              >
                <Icon />
              </button>
            ))}

            <div
              style={{
                width: 1,
                height: '60%',
                background: '#3b3b3b',
                margin: '0 2px',
                opacity: 0.9,
              }}
              aria-hidden
            />

            <button
              type="button"
              style={{
                width: 36,
                height: '100%',
                display: 'grid',
                placeItems: 'center',
                background: 'transparent',
                border: 0,
                padding: 0,
                cursor: 'default',
                opacity: 0.95,
              }}
            >
              <TeamsSendIcon />
            </button>
          </div>
        </div>
      </div>
    )
  }
)

TeamsMockup.displayName = 'TeamsMockup'
export default TeamsMockup
