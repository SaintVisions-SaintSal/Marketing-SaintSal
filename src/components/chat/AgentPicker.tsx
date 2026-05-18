'use client'

import type { Agent } from '@/lib/agents'

interface AgentPickerProps {
  agents: Agent[]
  activeAgentId: string
  onSelect: (id: string) => void
}

export default function AgentPicker({
  agents,
  activeAgentId,
  onSelect,
}: AgentPickerProps) {
  return (
    <div
      style={{
        width: '260px',
        minWidth: '260px',
        backgroundColor: '#141414',
        borderRight: '1px solid #2A2A2A',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #2A2A2A',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: '#8A8A85',
          textTransform: 'uppercase',
        }}
      >
        Agents
      </div>
      {agents.map((agent) => {
        const isActive = agent.id === activeAgentId
        return (
          <button
            key={agent.id}
            onClick={() => onSelect(agent.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '100%',
              padding: '10px 16px',
              backgroundColor: isActive ? '#1C1C1C' : 'transparent',
              borderLeft: isActive ? '3px solid #D4AF37' : '3px solid transparent',
              borderTop: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color 0.1s',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = '#1C1C1C'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                marginBottom: '2px',
              }}
            >
              <span style={{ fontSize: '18px', lineHeight: 1 }}>{agent.icon}</span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#F5F5F0' : '#D0D0CC',
                  flex: 1,
                }}
              >
                {agent.name}
              </span>
            </div>
            <div
              style={{
                paddingLeft: '26px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                width: '100%',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  color: '#D4AF37',
                  backgroundColor: 'rgba(212,175,55,0.12)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  display: 'inline-block',
                  width: 'fit-content',
                  fontWeight: 500,
                }}
              >
                {agent.engine}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: '#8A8A85',
                  lineHeight: 1.3,
                  marginTop: '2px',
                }}
              >
                {agent.role}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
