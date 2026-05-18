'use client'

import { OS_STACK } from '@/lib/stack'

const PRIORITY_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  core: { label: 'CORE', color: '#D4AF37', bg: '#D4AF3722' },
  evaluate: { label: 'EVALUATE', color: '#3b82f6', bg: '#3b82f622' },
  reference: { label: 'REFERENCE', color: '#8A8A85', bg: '#8A8A8522' },
}

export default function OpenSourceStack() {
  // Group by category
  const categories = Array.from(new Set(OS_STACK.map((t) => t.category)))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {categories.map((category) => {
        const tools = OS_STACK.filter((t) => t.category === category)
        return (
          <div key={category}>
            {/* Category header */}
            <p
              style={{
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#8A8A85',
                margin: '0 0 12px 0',
              }}
            >
              {category}
            </p>

            {/* Tool cards grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '12px',
              }}
            >
              {tools.map((tool) => {
                const priority = PRIORITY_STYLES[tool.priority] ?? PRIORITY_STYLES.reference
                return (
                  <div
                    key={tool.id}
                    style={{
                      backgroundColor: '#141414',
                      border: '1px solid #2A2A2A',
                      borderRadius: '10px',
                      padding: '16px',
                    }}
                  >
                    {/* Name + priority badge */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '8px',
                        marginBottom: '4px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#F5F5F0',
                        }}
                      >
                        {tool.name}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '10px',
                          backgroundColor: priority.bg,
                          color: priority.color,
                          letterSpacing: '0.05em',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}
                      >
                        {priority.label}
                      </span>
                    </div>

                    {/* Repo path */}
                    <p
                      style={{
                        margin: '0 0 8px 0',
                        fontSize: '11px',
                        color: '#8A8A85',
                        fontFamily: 'monospace',
                      }}
                    >
                      {tool.repo}
                    </p>

                    {/* Description */}
                    <p
                      style={{
                        margin: '0 0 10px 0',
                        fontSize: '13px',
                        color: '#8A8A85',
                        lineHeight: '1.5',
                      }}
                    >
                      {tool.description}
                    </p>

                    {/* License tag */}
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        backgroundColor: '#1C1C1C',
                        border: '1px solid #2A2A2A',
                        color: '#8A8A85',
                      }}
                    >
                      {tool.license}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
