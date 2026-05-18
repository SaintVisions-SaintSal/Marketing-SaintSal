'use client'

import { useState } from 'react'
import { TEMPLATES } from '@/lib/studio-data'

const PLATFORM_ICONS: Record<string, string> = {
  x: '🐦',
  linkedin: '💼',
  instagram: '📸',
  reddit: '🔴',
  tiktok: '🎵',
  producthunt: '🚀',
}

const PLATFORM_LABELS: Record<string, string> = {
  x: 'X (Twitter)',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  reddit: 'Reddit',
  tiktok: 'TikTok',
  producthunt: 'Product Hunt',
}

export default function Templates() {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <p
        style={{
          fontSize: '14px',
          color: '#8A8A85',
          marginBottom: '24px',
          lineHeight: '1.6',
        }}
      >
        Battle-tested posts crafted around Cap's story — copy, refine, and post.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '16px',
        }}
      >
        {TEMPLATES.map((template) => (
          <div
            key={template.id}
            style={{
              backgroundColor: '#141414',
              border: '1px solid #2A2A2A',
              borderRadius: '10px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid #2A2A2A',
                backgroundColor: '#1C1C1C',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}
              >
                <span style={{ fontSize: '16px' }}>
                  {PLATFORM_ICONS[template.platform] || '📄'}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    color: '#D4AF37',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {PLATFORM_LABELS[template.platform] || template.platform}
                </span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#F5F5F0' }}>
                {template.name}
              </div>
              <div style={{ fontSize: '12px', color: '#8A8A85', marginTop: '2px' }}>
                {template.description}
              </div>
            </div>

            {/* Content */}
            <div
              style={{
                padding: '14px 16px',
                backgroundColor: '#1C1C1C',
                whiteSpace: 'pre-wrap',
                fontSize: '13px',
                lineHeight: '1.65',
                color: '#F5F5F0',
                flex: 1,
                borderBottom: '1px solid #2A2A2A',
              }}
            >
              {template.content}
            </div>

            {/* Actions */}
            <div style={{ padding: '10px 16px' }}>
              <button
                onClick={() => handleCopy(template.id, template.content)}
                style={{
                  padding: '7px 16px',
                  backgroundColor: copied === template.id ? '#22c55e' : '#2A2A2A',
                  color: copied === template.id ? '#fff' : '#F5F5F0',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {copied === template.id ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
