'use client'

import { useState } from 'react'
import { CHANNELS, type Warmth } from '@/lib/studio-data'

const PLATFORM_ICONS: Record<string, string> = {
  x: '🐦',
  linkedin: '💼',
  instagram: '📸',
  reddit: '🔴',
  tiktok: '🎵',
}

const PLATFORM_LABELS: Record<string, string> = {
  x: 'X',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  reddit: 'Reddit',
  tiktok: 'TikTok',
}

const WARMTH_COLORS: Record<Warmth, string> = {
  'high-fit': '#22c55e',
  warm: '#D4AF37',
  cold: '#8A8A85',
  sensitive: '#a855f7',
}

const WARMTH_LABELS: Record<Warmth, string> = {
  'high-fit': 'High Fit',
  warm: 'Warm',
  cold: 'Cold',
  sensitive: 'Sensitive',
}

const ALL_PLATFORMS = ['all', 'x', 'linkedin', 'reddit', 'tiktok']

export default function ChannelDiscovery() {
  const [activePlatform, setActivePlatform] = useState('all')

  const filtered =
    activePlatform === 'all'
      ? CHANNELS
      : CHANNELS.filter((c) => c.platform === activePlatform)

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Filter chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
        {ALL_PLATFORMS.map((platform) => {
          const active = activePlatform === platform
          return (
            <button
              key={platform}
              onClick={() => setActivePlatform(platform)}
              style={{
                padding: '7px 16px',
                borderRadius: '20px',
                border: active ? '1px solid #D4AF37' : '1px solid #2A2A2A',
                backgroundColor: active ? '#D4AF37' : 'transparent',
                color: active ? '#0A0A0A' : '#8A8A85',
                fontSize: '13px',
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
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
              {platform !== 'all' && (
                <span>{PLATFORM_ICONS[platform]}</span>
              )}
              {platform === 'all' ? 'All Channels' : PLATFORM_LABELS[platform]}
            </button>
          )
        })}
      </div>

      {/* Channel grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '14px',
        }}
      >
        {filtered.map((channel) => {
          const warmthColor = WARMTH_COLORS[channel.warmth]
          return (
            <div
              key={channel.id}
              style={{
                backgroundColor: '#141414',
                border: '1px solid #2A2A2A',
                borderRadius: '10px',
                overflow: 'hidden',
                borderLeft: `3px solid ${warmthColor}`,
              }}
            >
              <div style={{ padding: '14px 16px' }}>
                {/* Platform + warmth badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '15px' }}>
                      {PLATFORM_ICONS[channel.platform]}
                    </span>
                    <span style={{ fontSize: '12px', color: '#8A8A85' }}>
                      {PLATFORM_LABELS[channel.platform]}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: warmthColor,
                      backgroundColor: `${warmthColor}18`,
                      border: `1px solid ${warmthColor}40`,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {WARMTH_LABELS[channel.warmth]}
                  </span>
                </div>

                {/* Name + handle */}
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#F5F5F0', marginBottom: '2px' }}>
                  {channel.name}
                </div>
                <div style={{ fontSize: '12px', color: '#D4AF37', marginBottom: '8px' }}>
                  {channel.handle}
                </div>

                {/* Description */}
                <div style={{ fontSize: '13px', color: '#8A8A85', lineHeight: '1.5', marginBottom: '10px' }}>
                  {channel.description}
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {channel.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '11px',
                        color: '#8A8A85',
                        backgroundColor: '#2A2A2A',
                        borderRadius: '4px',
                        padding: '2px 8px',
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: '#8A8A85', padding: '40px 0', fontSize: '14px' }}>
          No channels for this platform yet.
        </div>
      )}
    </div>
  )
}
