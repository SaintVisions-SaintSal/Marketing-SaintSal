'use client'

import { useState, useEffect, useCallback } from 'react'

interface Agent {
  id: string
  agent_name: string
  engine: string
  role: string
  is_active: boolean
  icon?: string
}

const AGENT_ICONS: Record<string, string> = {
  'SAL Listener': '👂',
  'SAL Social': '💬',
  'SAL Followup': '📬',
  'SAL Poster': '📣',
  'SAL Scout': '🔍',
  'SAL Analyst': '📊',
  'SAL Outreach': '✉️',
  'SAL Curator': '📚',
  'SAL Monitor': '🖥️',
  'SAL Writer': '✍️',
  'SAL Builder': '🔧',
}

function getIcon(name: string): string {
  return AGENT_ICONS[name] || '🤖'
}

export default function AgentDeploy() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  const loadAgents = useCallback(async () => {
    const res = await fetch('/api/launch/agents')
    if (!res.ok) return
    const data = await res.json()
    setAgents(data.agents || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadAgents()
  }, [loadAgents])

  const handleToggle = async (agentId: string, currentActive: boolean) => {
    const newActive = !currentActive
    // Optimistic update
    setAgents((prev) => prev.map((a) => a.id === agentId ? { ...a, is_active: newActive } : a))

    const res = await fetch('/api/launch/agents', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId, isActive: newActive }),
    })

    if (!res.ok) {
      // Revert on error
      setAgents((prev) => prev.map((a) => a.id === agentId ? { ...a, is_active: currentActive } : a))
    }
  }

  if (loading) {
    return (
      <div style={{ color: '#8A8A85', fontSize: '14px', textAlign: 'center', padding: '40px' }}>
        Loading agents...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Agent grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {agents.map((agent) => (
          <div
            key={agent.id}
            style={{
              backgroundColor: '#141414',
              border: `1px solid ${agent.is_active ? '#22c55e33' : '#2A2A2A'}`,
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              transition: 'border-color 0.2s',
            }}
          >
            {/* Icon + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '2rem', lineHeight: 1 }}>{getIcon(agent.agent_name)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#F5F5F0', fontSize: '14px', fontWeight: 700 }}>{agent.agent_name}</div>
              </div>
            </div>

            {/* Engine badge */}
            {agent.engine && (
              <div style={{ display: 'flex' }}>
                <span style={{
                  border: '1px solid #D4AF37',
                  color: '#D4AF37',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  {agent.engine}
                </span>
              </div>
            )}

            {/* Role */}
            <div style={{
              color: '#8A8A85',
              fontSize: '12px',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {agent.role}
            </div>

            {/* Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '4px' }}>
              <span style={{
                color: agent.is_active ? '#22c55e' : '#8A8A85',
                fontSize: '12px',
                fontWeight: 600,
              }}>
                {agent.is_active ? 'Deployed' : 'Stopped'}
              </span>
              <button
                onClick={() => handleToggle(agent.id, agent.is_active)}
                title={agent.is_active ? 'Stop agent' : 'Deploy agent'}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  backgroundColor: agent.is_active ? '#22c55e' : '#2A2A2A',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background-color 0.2s',
                  flexShrink: 0,
                }}
              >
                <span style={{
                  position: 'absolute',
                  top: '3px',
                  left: agent.is_active ? '23px' : '3px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#F5F5F0',
                  transition: 'left 0.2s',
                  display: 'block',
                }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info callout */}
      <div style={{
        backgroundColor: '#141414',
        borderLeft: '3px solid #D4AF37',
        borderRadius: '4px',
        padding: '16px 20px',
      }}>
        <div style={{ color: '#D4AF37', fontSize: '13px', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.05em' }}>
          Auto-Followup Engine · Routing
        </div>
        <div style={{ color: '#8A8A85', fontSize: '13px', lineHeight: 1.6 }}>
          When a new inbox item arrives with relevance ≥ 4, SAL Listener classifies it, SAL Social drafts a reply, and SAL Followup queues personalized follow-up sequences. SAL Poster dispatches via OpenClaw when approved.
        </div>
      </div>
    </div>
  )
}
