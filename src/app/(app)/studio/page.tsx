'use client'

import { useState } from 'react'
import Compose from '@/components/studio/Compose'
import Templates from '@/components/studio/Templates'
import ChannelDiscovery from '@/components/studio/ChannelDiscovery'

const TABS = [
  { id: 'compose', label: 'Compose' },
  { id: 'templates', label: 'Templates' },
  { id: 'channels', label: 'Channels' },
]

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState('compose')

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '24px' }}>
        <h1
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#F5F5F0',
            marginBottom: '4px',
          }}
        >
          Studio
        </h1>
        <p style={{ fontSize: '14px', color: '#8A8A85' }}>
          AI-powered content for every platform — optimized for the algorithms that matter.
        </p>
      </div>

      {/* Tab nav */}
      <nav
        style={{
          display: 'flex',
          borderBottom: '1px solid #2A2A2A',
          marginBottom: '28px',
          gap: '0',
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#D4AF37' : '#8A8A85',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid #D4AF37' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'color 0.15s',
                marginBottom: '-1px',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#D4AF37'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#8A8A85'
                }
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </nav>

      {/* Tab content */}
      {activeTab === 'compose' && <Compose />}
      {activeTab === 'templates' && <Templates />}
      {activeTab === 'channels' && <ChannelDiscovery />}
    </div>
  )
}
