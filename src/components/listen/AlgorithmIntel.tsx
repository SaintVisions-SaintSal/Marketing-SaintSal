'use client'

import { useState } from 'react'
import type { Platform } from '@/lib/platforms'

interface AlgorithmIntelProps {
  platforms: Platform[]
}

export default function AlgorithmIntel({ platforms }: AlgorithmIntelProps) {
  const [selectedId, setSelectedId] = useState(platforms[0]?.id ?? '')

  const platform = platforms.find((p) => p.id === selectedId) ?? platforms[0]

  const maxWeight = platform
    ? Math.max(...platform.signals.map((s) => Math.abs(s.weight)))
    : 1

  return (
    <div>
      {/* Platform selector chips */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '24px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
      >
        {platforms.map((p) => {
          const isSelected = p.id === selectedId
          return (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '20px',
                border: isSelected ? '1px solid #D4AF37' : '1px solid #2A2A2A',
                backgroundColor: isSelected ? '#D4AF37' : '#1C1C1C',
                color: isSelected ? '#0A0A0A' : '#F5F5F0',
                fontSize: '13px',
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                flexShrink: 0,
              }}
            >
              <span>{p.icon}</span>
              <span>{p.name}</span>
            </button>
          )
        })}
      </div>

      {/* 2-column grid */}
      {platform && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {/* LEFT: Signal Weights */}
          <div
            style={{
              backgroundColor: '#141414',
              border: '1px solid #2A2A2A',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <h3
              style={{
                fontSize: '13px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#8A8A85',
                margin: '0 0 16px 0',
              }}
            >
              Signal Weights
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {platform.signals.map((signal) => {
                const isPositive = signal.weight >= 0
                const barColor = isPositive ? '#D4AF37' : '#ef4444'
                const barWidth = (Math.abs(signal.weight) / maxWeight) * 100

                return (
                  <div key={signal.name}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ fontSize: '13px', color: '#F5F5F0' }}>
                        {signal.name}
                      </span>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: isPositive ? '#D4AF37' : '#ef4444',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {isPositive ? '+' : ''}{signal.weight}
                      </span>
                    </div>

                    {/* Bar */}
                    <div
                      style={{
                        height: '4px',
                        backgroundColor: '#2A2A2A',
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${barWidth}%`,
                          backgroundColor: barColor,
                          borderRadius: '2px',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>

                    {signal.note && (
                      <p
                        style={{
                          margin: '4px 0 0 0',
                          fontSize: '11px',
                          color: '#8A8A85',
                          fontStyle: 'italic',
                        }}
                      >
                        {signal.note}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT: SAL Playbook */}
          <div
            style={{
              backgroundColor: '#141414',
              border: '1px solid #2A2A2A',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <h3
              style={{
                fontSize: '13px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#8A8A85',
                margin: '0 0 4px 0',
              }}
            >
              SAL Playbook
            </h3>

            <p
              style={{
                fontSize: '11px',
                color: '#8A8A85',
                margin: '0 0 16px 0',
              }}
            >
              {platform.updated}
            </p>

            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {platform.playbook.map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    fontSize: '13px',
                    color: '#F5F5F0',
                    lineHeight: '1.5',
                  }}
                >
                  <span style={{ color: '#D4AF37', flexShrink: 0, marginTop: '1px' }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
