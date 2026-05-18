'use client'

import { useState } from 'react'
import ProductHunt from '@/components/launch/ProductHunt'
import VCVisibility from '@/components/launch/VCVisibility'
import AgentDeploy from '@/components/launch/AgentDeploy'

const TABS = [
  { key: 'ph', label: 'Product Hunt' },
  { key: 'vc', label: 'VC Visibility' },
  { key: 'agents', label: 'Agent Deploy' },
]

export default function LaunchPage() {
  const [activeTab, setActiveTab] = useState('ph')

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: '#F5F5F0', fontSize: '22px', fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
          Launch Command
        </h1>
        <p style={{ color: '#8A8A85', fontSize: '13px', margin: '4px 0 0' }}>
          Product Hunt sprint · VC pipeline · Agent deployment
        </p>
      </div>

      {/* Sub-tab nav */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #2A2A2A',
        marginBottom: '28px',
        gap: '0',
      }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '10px 20px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid #D4AF37' : '2px solid transparent',
                color: isActive ? '#D4AF37' : '#8A8A85',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                marginBottom: '-1px',
                letterSpacing: '0.02em',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = '#D4AF37'
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = '#8A8A85'
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'ph' && <ProductHunt />}
        {activeTab === 'vc' && <VCVisibility />}
        {activeTab === 'agents' && <AgentDeploy />}
      </div>
    </div>
  )
}
