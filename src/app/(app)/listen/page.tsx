'use client'

import { useState } from 'react'
import { PLATFORMS } from '@/lib/platforms'
import AlgorithmIntel from '@/components/listen/AlgorithmIntel'
import KnowledgeBase from '@/components/listen/KnowledgeBase'
import OpenSourceStack from '@/components/listen/OpenSourceStack'

type Tab = 'algorithm' | 'knowledge' | 'stack'

const TABS: { id: Tab; label: string }[] = [
  { id: 'algorithm', label: 'Algorithm Intel' },
  { id: 'knowledge', label: 'Knowledge Base' },
  { id: 'stack', label: 'Open-Source Stack' },
]

export default function ListenPage() {
  const [activeTab, setActiveTab] = useState<Tab>('algorithm')

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ marginBottom: '24px' }}>
        <h1
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#F5F5F0',
            margin: '0 0 4px 0',
          }}
        >
          Listen
        </h1>
        <p style={{ fontSize: '13px', color: '#8A8A85', margin: 0 }}>
          Platform intelligence, growth knowledge, and open-source tooling.
        </p>
      </div>

      {/* Tab nav */}
      <div
        style={{
          display: 'flex',
          gap: '2px',
          backgroundColor: '#141414',
          border: '1px solid #2A2A2A',
          borderRadius: '10px',
          padding: '4px',
          marginBottom: '28px',
          width: 'fit-content',
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '7px',
                border: 'none',
                backgroundColor: isActive ? '#D4AF37' : 'transparent',
                color: isActive ? '#0A0A0A' : '#8A8A85',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'algorithm' && <AlgorithmIntel platforms={PLATFORMS} />}
      {activeTab === 'knowledge' && <KnowledgeBase />}
      {activeTab === 'stack' && <OpenSourceStack />}
    </div>
  )
}
