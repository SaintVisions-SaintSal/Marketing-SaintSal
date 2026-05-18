'use client'

import { useState, useRef, useEffect } from 'react'

const PLATFORMS = [
  { id: 'x', label: '🐦 X', hint: '280 chars max' },
  { id: 'linkedin', label: '💼 LinkedIn', hint: '~1,200 chars' },
  { id: 'instagram', label: '📸 Instagram', hint: 'Caption + hashtags' },
  { id: 'reddit', label: '🔴 Reddit', hint: 'Community post' },
  { id: 'tiktok', label: '🎵 TikTok', hint: 'Video script' },
]

const QUICK_FILLS = [
  'HACP patent filed 3 years before GPT-1',
  'We just hit 238 live API routes',
  'Responsible Intelligence for the 33% mainstream AI can\'t serve',
  'Series A: $15-25M @ $50-75M pre',
]

const PLATFORM_ICONS: Record<string, string> = {
  x: '🐦',
  linkedin: '💼',
  instagram: '📸',
  reddit: '🔴',
  tiktok: '🎵',
}

const PLATFORM_LABELS: Record<string, string> = {
  x: 'X (Twitter)',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  reddit: 'Reddit',
  tiktok: 'TikTok',
}

export default function Compose() {
  const [angle, setAngle] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['x'])
  const [loading, setLoading] = useState(false)
  const [drafts, setDrafts] = useState<Record<string, string> | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [sendingToInbox, setSendingToInbox] = useState<string | null>(null)
  const [sentToInbox, setSentToInbox] = useState<Record<string, boolean>>({})
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [angle])

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handleGenerate = async () => {
    if (!angle.trim() || selectedPlatforms.length === 0) return
    setLoading(true)
    setDrafts(null)
    try {
      const res = await fetch('/api/studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ angle: angle.trim(), platforms: selectedPlatforms }),
      })
      const data = await res.json()
      if (data.drafts) {
        setDrafts(data.drafts)
        setSentToInbox({})
      }
    } catch (err) {
      console.error('Generation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (platform: string, text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(platform)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSendToInbox = async (platform: string, text: string) => {
    setSendingToInbox(platform)
    try {
      await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          content: text,
          subject: `${PLATFORM_LABELS[platform]} draft — ${angle.slice(0, 60)}`,
          status: 'pending',
        }),
      })
      setSentToInbox((prev) => ({ ...prev, [platform]: true }))
    } catch (err) {
      console.error('Failed to send to inbox:', err)
    } finally {
      setSendingToInbox(null)
    }
  }

  const canGenerate = angle.trim().length > 0 && selectedPlatforms.length > 0

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Angle input */}
      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: '#8A8A85',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          Your Angle or Topic
        </label>
        <textarea
          ref={textareaRef}
          value={angle}
          onChange={(e) => setAngle(e.target.value)}
          placeholder="What's the insight, story, or announcement you want to share?"
          rows={3}
          style={{
            width: '100%',
            backgroundColor: '#1C1C1C',
            color: '#F5F5F0',
            border: '1px solid #2A2A2A',
            borderRadius: '8px',
            padding: '12px 14px',
            fontSize: '14px',
            resize: 'none',
            outline: 'none',
            lineHeight: '1.6',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s',
            overflow: 'hidden',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#D4AF37'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#2A2A2A'
          }}
        />

        {/* Quick-fill chips */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '10px',
          }}
        >
          {QUICK_FILLS.map((fill) => (
            <button
              key={fill}
              onClick={() => setAngle(fill)}
              style={{
                fontSize: '12px',
                color: '#D4AF37',
                backgroundColor: 'transparent',
                border: '1px solid #2A2A2A',
                borderRadius: '20px',
                padding: '4px 12px',
                cursor: 'pointer',
                transition: 'border-color 0.15s, background-color 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#D4AF37'
                e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2A2A2A'
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {fill.length > 40 ? fill.slice(0, 40) + '…' : fill}
            </button>
          ))}
        </div>
      </div>

      {/* Platform selector */}
      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: '#8A8A85',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          Generate for platforms:
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {PLATFORMS.map((p) => {
            const active = selectedPlatforms.includes(p.id)
            return (
              <button
                key={p.id}
                onClick={() => togglePlatform(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: active ? '1px solid #D4AF37' : '1px solid #2A2A2A',
                  backgroundColor: active ? '#D4AF37' : '#141414',
                  color: active ? '#0A0A0A' : '#8A8A85',
                  fontSize: '13px',
                  fontWeight: active ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = '#D4AF37'
                    e.currentTarget.style.color = '#D4AF37'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = '#2A2A2A'
                    e.currentTarget.style.color = '#8A8A85'
                  }
                }}
              >
                <span>{p.label}</span>
                <span style={{ fontSize: '11px', opacity: 0.7 }}>({p.hint})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate || loading}
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: canGenerate && !loading ? '#D4AF37' : '#2A2A2A',
          color: canGenerate && !loading ? '#0A0A0A' : '#8A8A85',
          border: 'none',
          borderRadius: '8px',
          fontSize: '15px',
          fontWeight: 600,
          cursor: canGenerate && !loading ? 'pointer' : 'not-allowed',
          marginBottom: '32px',
          transition: 'background-color 0.15s',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <span
            style={{
              display: 'inline-block',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          >
            SAL is drafting...
          </span>
        ) : (
          '✨ Generate Optimized Drafts'
        )}
        {loading && (
          <span
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
              animation: 'shimmer 1.5s infinite',
              backgroundSize: '200% 100%',
            }}
          />
        )}
      </button>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>

      {/* Results */}
      {drafts && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {selectedPlatforms
            .filter((p) => drafts[p])
            .map((platform) => {
              const text = drafts[platform]
              const isX = platform === 'x'
              const charCount = text.length
              const overLimit = isX && charCount > 280

              return (
                <div
                  key={platform}
                  style={{
                    backgroundColor: '#141414',
                    border: '1px solid #2A2A2A',
                    borderRadius: '10px',
                    overflow: 'hidden',
                  }}
                >
                  {/* Card header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderBottom: '1px solid #2A2A2A',
                      backgroundColor: '#1C1C1C',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>{PLATFORM_ICONS[platform]}</span>
                      <span
                        style={{ fontSize: '14px', fontWeight: 600, color: '#F5F5F0' }}
                      >
                        {PLATFORM_LABELS[platform]}
                      </span>
                      <span style={{ fontSize: '12px', color: '#8A8A85' }}>
                        {PLATFORMS.find((p) => p.id === platform)?.hint}
                      </span>
                    </div>
                    {isX && (
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: overLimit ? '#ef4444' : '#8A8A85',
                        }}
                      >
                        {charCount}/280
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: '#1C1C1C',
                      whiteSpace: 'pre-wrap',
                      fontSize: '14px',
                      lineHeight: '1.7',
                      color: '#F5F5F0',
                      borderBottom: '1px solid #2A2A2A',
                    }}
                  >
                    {text}
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      padding: '12px 16px',
                    }}
                  >
                    <button
                      onClick={() => handleCopy(platform, text)}
                      style={{
                        padding: '7px 16px',
                        backgroundColor: copied === platform ? '#22c55e' : '#2A2A2A',
                        color: copied === platform ? '#fff' : '#F5F5F0',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {copied === platform ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={() => handleSendToInbox(platform, text)}
                      disabled={sendingToInbox === platform || sentToInbox[platform]}
                      style={{
                        padding: '7px 16px',
                        backgroundColor: sentToInbox[platform]
                          ? '#22c55e'
                          : 'transparent',
                        color: sentToInbox[platform] ? '#fff' : '#D4AF37',
                        border: `1px solid ${sentToInbox[platform] ? '#22c55e' : '#D4AF37'}`,
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor:
                          sendingToInbox === platform || sentToInbox[platform]
                            ? 'default'
                            : 'pointer',
                        transition: 'all 0.15s',
                        opacity: sendingToInbox === platform ? 0.7 : 1,
                      }}
                    >
                      {sentToInbox[platform]
                        ? 'Sent to Inbox ✓'
                        : sendingToInbox === platform
                        ? 'Sending...'
                        : 'Send to Inbox →'}
                    </button>
                  </div>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}
