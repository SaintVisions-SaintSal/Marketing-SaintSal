'use client'

import { useState } from 'react'

export interface InboxItem {
  id: string
  platform: string
  author_handle: string | null
  content: string
  status: string
  priority: string | null
  item_type: string | null
  received_at: string
  sentiment: string | null
  author_name: string | null
}

interface InboxListProps {
  items: InboxItem[]
  selectedId: string | null
  onSelect: (id: string) => void
}

const PLATFORM_ICONS: Record<string, string> = {
  x: '🐦',
  twitter: '🐦',
  linkedin: '💼',
  reddit: '🔴',
  instagram: '📸',
  ig: '📸',
  email: '📧',
  tiktok: '🎵',
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#D4AF37',
  approved: '#22c55e',
  skipped: '#8A8A85',
}

const PRIORITY_CONFIGS: Record<string, { label: string; color: string; pulse?: boolean }> = {
  critical: { label: 'CRITICAL', color: '#ef4444', pulse: true },
  high: { label: 'HIGH', color: '#f59e0b' },
  medium: { label: 'MEDIUM', color: '#8A8A85' },
  low: { label: 'LOW', color: '#4A4A45' },
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const STATUS_FILTERS = ['All', 'Pending', 'Approved', 'Skipped']
const PLATFORM_FILTERS = ['X', 'LinkedIn', 'Reddit', 'IG', 'Email', 'TikTok']

export default function InboxList({ items, selectedId, onSelect }: InboxListProps) {
  const [statusFilter, setStatusFilter] = useState('All')
  const [platformFilter, setPlatformFilter] = useState<string | null>(null)

  const filtered = items.filter((item) => {
    const matchStatus =
      statusFilter === 'All' || item.status.toLowerCase() === statusFilter.toLowerCase()
    const matchPlatform =
      !platformFilter ||
      item.platform.toLowerCase() === platformFilter.toLowerCase() ||
      (platformFilter === 'X' && item.platform.toLowerCase() === 'twitter') ||
      (platformFilter === 'IG' && item.platform.toLowerCase() === 'instagram')
    return matchStatus && matchPlatform
  })

  const pendingCount = items.filter((i) => i.status === 'pending').length
  const approvedCount = items.filter((i) => i.status === 'approved').length
  const skippedCount = items.filter((i) => i.status === 'skipped').length

  return (
    <div
      style={{
        width: '380px',
        minWidth: '380px',
        flexShrink: 0,
        height: '100%',
        backgroundColor: '#141414',
        borderRight: '1px solid #2A2A2A',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Filter Row */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #2A2A2A', flexShrink: 0 }}>
        {/* Status chips */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '600',
                border: statusFilter === s ? '1px solid #D4AF37' : '1px solid #2A2A2A',
                backgroundColor: statusFilter === s ? '#1C1C1C' : 'transparent',
                color: statusFilter === s ? '#D4AF37' : '#8A8A85',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {s}
            </button>
          ))}
        </div>
        {/* Platform chips */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {PLATFORM_FILTERS.map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(platformFilter === p ? null : p)}
              style={{
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '10px',
                fontWeight: '500',
                border: platformFilter === p ? '1px solid #9A7E1F' : '1px solid #2A2A2A',
                backgroundColor: platformFilter === p ? '#1C1C1C' : 'transparent',
                color: platformFilter === p ? '#D4AF37' : '#8A8A85',
                cursor: 'pointer',
              }}
            >
              {PLATFORM_ICONS[p.toLowerCase()] || ''} {p}
            </button>
          ))}
        </div>
        {/* Stats row */}
        <div
          style={{
            marginTop: '8px',
            fontSize: '10px',
            color: '#8A8A85',
            display: 'flex',
            gap: '12px',
          }}
        >
          <span style={{ color: '#D4AF37' }}>{pendingCount} pending</span>
          <span style={{ color: '#22c55e' }}>{approvedCount} approved today</span>
          <span>{skippedCount} skipped</span>
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div
            style={{
              padding: '32px 16px',
              textAlign: 'center',
              color: '#8A8A85',
              fontSize: '13px',
            }}
          >
            No items match filters
          </div>
        ) : (
          filtered.map((item) => {
            const isSelected = item.id === selectedId
            const priority = (item.priority || 'medium').toLowerCase()
            const priorityConfig = PRIORITY_CONFIGS[priority] || PRIORITY_CONFIGS.medium
            const platformKey = item.platform.toLowerCase()
            const icon = PLATFORM_ICONS[platformKey] || '📬'

            return (
              <div
                key={item.id}
                onClick={() => onSelect(item.id)}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #1E1E1E',
                  borderLeft: isSelected ? '3px solid #D4AF37' : '3px solid transparent',
                  backgroundColor: isSelected ? '#1C1C1C' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {/* Top row: icon + handle + time */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px' }}>{icon}</span>
                    <span
                      style={{ fontSize: '12px', fontWeight: '700', color: '#F5F5F0' }}
                    >
                      {item.author_handle || item.author_name || 'Unknown'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '10px', color: '#8A8A85' }}>
                      {timeAgo(item.received_at)}
                    </span>
                    {/* Status dot */}
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: STATUS_COLORS[item.status] || '#8A8A85',
                        flexShrink: 0,
                      }}
                    />
                  </div>
                </div>

                {/* Content preview */}
                <div
                  style={{
                    fontSize: '12px',
                    color: '#8A8A85',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '6px',
                  }}
                >
                  {item.content}
                </div>

                {/* Priority badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {priorityConfig.pulse ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '1px 6px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor: '#ef4444',
                          animation: 'pulse 1.5s infinite',
                        }}
                      />
                      <span
                        style={{ fontSize: '9px', fontWeight: '700', color: '#ef4444' }}
                      >
                        {priorityConfig.label}
                      </span>
                    </div>
                  ) : (
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: '600',
                        color: priorityConfig.color,
                        padding: '1px 6px',
                        borderRadius: '8px',
                        border: `1px solid ${priorityConfig.color}33`,
                        backgroundColor: `${priorityConfig.color}11`,
                      }}
                    >
                      {priorityConfig.label}
                    </span>
                  )}
                  {item.item_type && (
                    <span style={{ fontSize: '9px', color: '#4A4A45', textTransform: 'uppercase' }}>
                      {item.item_type}
                    </span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
