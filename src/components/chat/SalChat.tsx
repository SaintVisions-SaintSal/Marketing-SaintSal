'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { AGENTS } from '@/lib/agents'
import AgentPicker from './AgentPicker'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const QUICK_PROMPTS: Record<string, string[]> = {
  'sal-supreme': [
    "What's the play for our Series A this week?",
    'Draft an X post about HACP that hits Phoenix algo',
    'What 3 VCs should I be targeting at $50-75M pre?',
    "Give me today's growth priorities",
    'How do I position HACP vs RAG/RLHF?',
  ],
  'sal-voice': [
    'Write a cold call script for enterprise AI buyers',
    'How do I open a VC intro call in 30 seconds?',
    'Give me the HACP differentiator talk track',
    'Draft a follow-up voicemail after no response',
    'What objections should I prep for on a Series A call?',
  ],
  'sal-research': [
    'Who are the top 10 "Responsible AI" VC funds right now?',
    'Summarize the competitive landscape for enterprise AI guardrails',
    'What is the addressable market for faith-aligned AI?',
    'Compare HACP to constitutional AI and RLHF',
    'Find recent press on enterprise AI compliance failures',
  ],
  'sal-social': [
    'Draft a LinkedIn post about HACP for this week',
    'Write an X thread on Responsible Intelligence — Phoenix-optimized',
    'Create a Reddit post for r/MachineLearning about our approach',
    'Give me an IG caption for a behind-the-scenes build moment',
    "What's the best time to post on LinkedIn this week?",
  ],
  'sal-computer': [
    'Design an OpenClaw workflow for posting to X and LinkedIn',
    'Write a Playwright script to scrape VC portfolio pages',
    'How do I set up idempotent posting with rate limits?',
    'Build a data extraction pipeline for LinkedIn profiles',
    'What are the failure modes for automated posting?',
  ],
  'sal-builder': [
    'Review my FastAPI route structure for auth patterns',
    'Write a Supabase RLS policy for multi-tenant data',
    'Design the schema for a social post queue',
    'How do I add streaming to my Claude API routes?',
    'What is the best way to handle webhooks in Next.js 16?',
  ],
  'sal-athena': [
    'What is the current status of patent #10,290,222?',
    'How do I strengthen the HACP patent claims?',
    'Review a standard Series A term sheet — what to watch for?',
    'What HIPAA considerations apply to our AI platform?',
    'How do we trademark "Responsible Intelligence"?',
  ],
  'sal-cookin': [
    'What PSA grading workflow should CookinCards use?',
    'Analyze the sports card market for Q2 2026',
    'Give me a cap rate analysis framework for CookinCapital deals',
    'What features should CookinCards launch first?',
    'How do I structure deal flow for alternative investments?',
  ],
  'sal-followup': [
    'Write a 3-touch investor followup sequence after a warm intro',
    'Draft a TechCrunch pitch follow-up email',
    'How do I re-engage a VC who went cold after a first call?',
    'Build a 30-day nurture cadence for Series A prospects',
    'Write a LinkedIn message to request a warm intro',
  ],
  'sal-listener': [
    'Analyze this mention and recommend a response priority',
    'What keywords should I track this week for SaintSal?',
    'Triage these 5 mentions by sentiment and influence',
    "Who's talking about Responsible AI right now?",
    'Flag any competitor mentions I should respond to',
  ],
  'sal-poster': [
    "What's the optimal post schedule for this week?",
    'Review the current OpenClaw queue',
    'When should I post on X for maximum reach today?',
    'Flag anything in the queue that needs edits before posting',
    'Show me the best LinkedIn posting windows for Tuesday',
  ],
}

interface SalChatProps {
  user: User
  initialAgentId?: string
}

export default function SalChat({ user, initialAgentId = 'sal-supreme' }: SalChatProps) {
  const [activeAgentId, setActiveAgentId] = useState(initialAgentId)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSession, setIsLoadingSession] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeAgent = AGENTS.find((a) => a.id === activeAgentId) || AGENTS[0]
  const quickPrompts = QUICK_PROMPTS[activeAgentId] || QUICK_PROMPTS['sal-supreme']

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  // Load session when agent changes
  const loadSession = useCallback(async (agentId: string) => {
    setIsLoadingSession(true)
    setMessages([])
    setSessionId(null)
    try {
      const res = await fetch(`/api/chat/sessions?agentId=${agentId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.sessionId) {
          setSessionId(data.sessionId)
          const loaded: Message[] = (data.messages || []).map(
            (m: { role: 'user' | 'assistant'; content: string; created_at: string }) => ({
              role: m.role,
              content: m.content,
              timestamp: new Date(m.created_at),
            })
          )
          setMessages(loaded)
        }
      }
    } catch {
      // silently fail — start fresh
    } finally {
      setIsLoadingSession(false)
    }
  }, [])

  useEffect(() => {
    loadSession(activeAgentId)
  }, [activeAgentId, loadSession])

  const handleAgentSelect = (id: string) => {
    if (id === activeAgentId) return
    setActiveAgentId(id)
  }

  const handleSend = async (text: string) => {
    const msg = text.trim()
    if (!msg || isLoading) return

    setInputValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    // Optimistic user message
    const userMsg: Message = {
      role: 'user',
      content: msg,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          agentId: activeAgentId,
          message: msg,
        }),
      })

      if (!res.ok) {
        throw new Error('Chat request failed')
      }

      const data = await res.json()

      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId)
      }

      const assistantMsg: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      const errorMsg: Message = {
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(inputValue)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    // Auto-grow
    const el = e.target
    el.style.height = 'auto'
    const maxH = 6 * 24 + 16 // ~6 rows
    el.style.height = Math.min(el.scrollHeight, maxH) + 'px'
  }

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh - 136px)',
        backgroundColor: '#0A0A0A',
        overflow: 'hidden',
      }}
    >
      {/* Left sidebar — agent picker */}
      <AgentPicker
        agents={AGENTS}
        activeAgentId={activeAgentId}
        onSelect={handleAgentSelect}
      />

      {/* Right — chat area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            backgroundColor: '#141414',
            borderBottom: '1px solid #2A2A2A',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '22px' }}>{activeAgent.icon}</span>
          <span
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#F5F5F0',
            }}
          >
            {activeAgent.name}
          </span>
          <span
            style={{
              fontSize: '11px',
              color: '#D4AF37',
              backgroundColor: 'rgba(212,175,55,0.12)',
              border: '1px solid rgba(212,175,55,0.25)',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: 500,
            }}
          >
            {activeAgent.engine}
          </span>
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <div
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
              }}
            />
            <span style={{ fontSize: '12px', color: '#8A8A85' }}>Online</span>
          </div>
        </div>

        {/* Messages area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {isLoadingSession ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#8A8A85',
                fontSize: '13px',
              }}
            >
              Loading conversation...
            </div>
          ) : messages.length === 0 ? (
            /* Empty state with quick prompts */
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                gap: '24px',
                padding: '40px 20px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                  {activeAgent.icon}
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#F5F5F0',
                    marginBottom: '6px',
                  }}
                >
                  {activeAgent.name}
                </div>
                <div style={{ fontSize: '13px', color: '#8A8A85' }}>
                  {activeAgent.role}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  width: '100%',
                  maxWidth: '560px',
                }}
              >
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: '#141414',
                      border: '1px solid #2A2A2A',
                      borderRadius: '10px',
                      color: '#D0D0CC',
                      fontSize: '13px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'border-color 0.15s, background-color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#D4AF37'
                      e.currentTarget.style.backgroundColor = '#1C1C1C'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#2A2A2A'
                      e.currentTarget.style.backgroundColor = '#141414'
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: '8px',
                  }}
                >
                  {msg.role === 'assistant' && (
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#D4AF37',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 800,
                        color: '#0A0A0A',
                        flexShrink: 0,
                        marginBottom: '18px',
                      }}
                    >
                      S
                    </div>
                  )}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: msg.role === 'user' ? '70%' : '80%',
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        backgroundColor: msg.role === 'user' ? '#D4AF37' : '#1C1C1C',
                        color: msg.role === 'user' ? '#0A0A0A' : '#F5F5F0',
                        fontSize: '14px',
                        lineHeight: 1.55,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {msg.content}
                    </div>
                    <span
                      style={{
                        fontSize: '10px',
                        color: '#8A8A85',
                        marginTop: '3px',
                        paddingLeft: '4px',
                        paddingRight: '4px',
                      }}
                    >
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#D4AF37',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 800,
                      color: '#0A0A0A',
                      flexShrink: 0,
                    }}
                  >
                    S
                  </div>
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '18px 18px 18px 4px',
                      backgroundColor: '#1C1C1C',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: '#D4AF37',
                          animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#141414',
            borderTop: '1px solid #2A2A2A',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '8px',
              backgroundColor: '#1C1C1C',
              border: '1px solid #2A2A2A',
              borderRadius: '12px',
              padding: '8px 8px 8px 14px',
              transition: 'border-color 0.15s',
            }}
            onFocusCapture={(e) => {
              const parent = e.currentTarget as HTMLDivElement
              parent.style.borderColor = '#D4AF37'
            }}
            onBlurCapture={(e) => {
              const parent = e.currentTarget as HTMLDivElement
              parent.style.borderColor = '#2A2A2A'
            }}
          >
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={
                isLoading
                  ? 'SAL is thinking...'
                  : `Message ${activeAgent.name}...`
              }
              rows={1}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#F5F5F0',
                fontSize: '14px',
                lineHeight: '24px',
                resize: 'none',
                fontFamily: 'inherit',
                overflowY: 'auto',
                maxHeight: '144px',
              }}
            />
            <button
              onClick={() => handleSend(inputValue)}
              disabled={isLoading || !inputValue.trim()}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor:
                  isLoading || !inputValue.trim() ? '#2A2A2A' : '#D4AF37',
                border: 'none',
                cursor:
                  isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background-color 0.15s',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isLoading || !inputValue.trim() ? '#8A8A85' : '#0A0A0A'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <div
            style={{
              textAlign: 'center',
              fontSize: '11px',
              color: '#8A8A85',
              marginTop: '6px',
            }}
          >
            Enter to send · Shift+Enter for newline
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.85); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
