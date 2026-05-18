'use client'

import { useState, useEffect } from 'react'

interface KnowledgeEntry {
  id: string
  title: string
  detail: string
  source: string
  platforms: string[]
  status: 'working' | 'not_working' | 'emerging'
  updated_at: string
}

type FilterStatus = 'all' | 'working' | 'not_working' | 'emerging'

const STATUS_COLOR: Record<string, string> = {
  working: '#22c55e',
  not_working: '#ef4444',
  emerging: '#a855f7',
}

const STATUS_LABEL: Record<string, string> = {
  working: 'Working',
  not_working: 'Not Working',
  emerging: 'Emerging',
}

const FILTERS: { label: string; value: FilterStatus; color: string }[] = [
  { label: 'All', value: 'all', color: '#F5F5F0' },
  { label: 'Working', value: 'working', color: '#22c55e' },
  { label: 'Not Working', value: 'not_working', color: '#ef4444' },
  { label: 'Emerging', value: 'emerging', color: '#a855f7' },
]

export default function KnowledgeBase() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([])
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/knowledge')
        if (!res.ok) {
          if (res.status === 401) {
            setError('Unauthorized')
          } else {
            setError('Failed to load knowledge base')
          }
          return
        }
        const data = await res.json()
        setEntries(data.entries ?? [])
      } catch {
        setError('Failed to load knowledge base')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered =
    filter === 'all' ? entries : entries.filter((e) => e.status === filter)

  return (
    <div>
      {/* Filter chips */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        {FILTERS.map((f) => {
          const isActive = filter === f.value
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: isActive ? `1px solid ${f.color}` : '1px solid #2A2A2A',
                backgroundColor: isActive ? `${f.color}22` : '#1C1C1C',
                color: isActive ? f.color : '#8A8A85',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ color: '#8A8A85', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
          Loading knowledge base...
        </div>
      )}

      {/* Error state */}
      {error && (
        <div style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ color: '#8A8A85', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
          No entries found.
        </div>
      )}

      {/* Entry cards */}
      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((entry) => {
            const borderColor = STATUS_COLOR[entry.status] ?? '#2A2A2A'
            return (
              <div
                key={entry.id}
                style={{
                  backgroundColor: '#141414',
                  border: '1px solid #2A2A2A',
                  borderLeft: `3px solid ${borderColor}`,
                  borderRadius: '8px',
                  padding: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '12px',
                    marginBottom: '6px',
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#F5F5F0',
                      lineHeight: '1.4',
                    }}
                  >
                    {entry.title}
                  </h4>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#8A8A85',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {new Date(entry.updated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <p
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '13px',
                    color: '#8A8A85',
                    lineHeight: '1.5',
                  }}
                >
                  {entry.detail}
                </p>

                {entry.source && (
                  <p
                    style={{
                      margin: '0 0 10px 0',
                      fontSize: '11px',
                      color: '#8A8A85',
                      fontStyle: 'italic',
                    }}
                  >
                    Source: {entry.source}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Status badge */}
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      backgroundColor: `${borderColor}22`,
                      color: borderColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {STATUS_LABEL[entry.status] ?? entry.status}
                  </span>

                  {/* Platform tags */}
                  {(entry.platforms ?? []).map((platform) => (
                    <span
                      key={platform}
                      style={{
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        backgroundColor: '#1C1C1C',
                        border: '1px solid #2A2A2A',
                        color: '#8A8A85',
                      }}
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
