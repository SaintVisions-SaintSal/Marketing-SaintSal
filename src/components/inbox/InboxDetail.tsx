'use client'

import { useState } from 'react'
import type { InboxItem } from './InboxList'

export interface InboxReply {
  id: string
  inbox_id: string
  reply_content: string
  is_active: boolean
  is_edited: boolean
  post_status: string
  generated_by: string | null
  created_at: string
}

interface InboxDetailProps {
  item: InboxItem | null
  reply: InboxReply | null
  onApprove: () => void
  onSkip: () => void
  onRegenerate: () => void
  onSaveEdit: (text: string) => void
  onGenerateDraft: () => void
  isGenerating?: boolean
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

const SENTIMENT_COLORS: Record<string, string> = {
  positive: '#22c55e',
  negative: '#ef4444',
  neutral: '#8A8A85',
  mixed: '#f59e0b',
}

function parseDraft(content: string): { replyText: string; reasoning: string } {
  const separatorIndex = content.indexOf('\n---\n')
  if (separatorIndex === -1) {
    // Try inline ---
    const altIndex = content.lastIndexOf('---')
    if (altIndex > 0 && content.indexOf('SAL reasoning:', altIndex) !== -1) {
      const replyText = content.slice(0, altIndex).trim()
      const reasoning = content.slice(altIndex + 3).replace('SAL reasoning:', '').trim()
      return { replyText, reasoning }
    }
    // Check if SAL reasoning appears without separator
    const reasoningIdx = content.indexOf('\nSAL reasoning:')
    if (reasoningIdx !== -1) {
      return {
        replyText: content.slice(0, reasoningIdx).trim(),
        reasoning: content.slice(reasoningIdx).replace('SAL reasoning:', '').trim(),
      }
    }
    return { replyText: content.trim(), reasoning: '' }
  }
  const replyText = content.slice(0, separatorIndex).trim()
  const afterSep = content.slice(separatorIndex + 5).trim()
  const reasoning = afterSep.replace(/^SAL reasoning:\s*/i, '').trim()
  return { replyText, reasoning }
}

export default function InboxDetail({
  item,
  reply,
  onApprove,
  onSkip,
  onRegenerate,
  onSaveEdit,
  onGenerateDraft,
  isGenerating = false,
}: InboxDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')

  if (!item) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '12px',
          color: '#8A8A85',
        }}
      >
        <div style={{ fontSize: '32px' }}>📬</div>
        <div style={{ fontSize: '15px', fontWeight: '500' }}>Select a message to review</div>
        <div style={{ fontSize: '12px', color: '#4A4A45' }}>
          Choose an item from the queue on the left
        </div>
      </div>
    )
  }

  const platformKey = item.platform.toLowerCase()
  const icon = PLATFORM_ICONS[platformKey] || '📬'
  const { replyText, reasoning } = reply ? parseDraft(reply.reply_content) : { replyText: '', reasoning: '' }

  const isApproved = item.status === 'approved'
  const isSkipped = item.status === 'skipped'

  const handleEditStart = () => {
    setEditText(replyText)
    setIsEditing(true)
  }

  const handleEditSave = () => {
    onSaveEdit(editText)
    setIsEditing(false)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    setEditText('')
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: '#0A0A0A',
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {/* ORIGINAL MESSAGE */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '0.1em',
              color: '#8A8A85',
              marginBottom: '10px',
              textTransform: 'uppercase',
            }}
          >
            Original Message
          </div>

          {/* Message header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: '18px' }}>{icon}</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#F5F5F0' }}>
                {item.author_handle || item.author_name || 'Unknown'}
              </div>
              <div style={{ fontSize: '10px', color: '#8A8A85' }}>
                {item.platform.toUpperCase()} ·{' '}
                {new Date(item.received_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto', flexWrap: 'wrap' }}>
              {item.sentiment && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    border: `1px solid ${SENTIMENT_COLORS[item.sentiment.toLowerCase()] || '#8A8A85'}44`,
                    backgroundColor: `${SENTIMENT_COLORS[item.sentiment.toLowerCase()] || '#8A8A85'}11`,
                    color: SENTIMENT_COLORS[item.sentiment.toLowerCase()] || '#8A8A85',
                  }}
                >
                  {item.sentiment}
                </span>
              )}
              {item.item_type && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    border: '1px solid #2A2A2A',
                    color: '#8A8A85',
                  }}
                >
                  {item.item_type}
                </span>
              )}
            </div>
          </div>

          {/* Message body */}
          <div
            style={{
              backgroundColor: '#1C1C1C',
              borderLeft: '4px solid #D4AF37',
              padding: '14px 16px',
              borderRadius: '0 6px 6px 0',
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#F5F5F0',
              whiteSpace: 'pre-wrap',
            }}
          >
            {item.content}
          </div>
        </div>

        {/* SAL DRAFT / GENERATE */}
        {!reply ? (
          <div
            style={{
              backgroundColor: '#141414',
              border: '1px dashed #2A2A2A',
              borderRadius: '8px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '24px',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>✨</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#F5F5F0', marginBottom: '6px' }}>
              No SAL draft yet
            </div>
            <div style={{ fontSize: '12px', color: '#8A8A85', marginBottom: '16px' }}>
              Generate an AI-drafted reply tailored for {item.platform}
            </div>
            <button
              onClick={onGenerateDraft}
              disabled={isGenerating}
              style={{
                padding: '10px 20px',
                backgroundColor: isGenerating ? '#2A2A2A' : '#D4AF37',
                color: isGenerating ? '#8A8A85' : '#0A0A0A',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {isGenerating ? '✨ Generating...' : '✨ Generate SAL Draft'}
            </button>
          </div>
        ) : (
          <>
            {/* SAL DRAFT */}
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#D4AF37',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '800',
                      color: '#0A0A0A',
                      flexShrink: 0,
                    }}
                  >
                    S
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      letterSpacing: '0.1em',
                      color: '#D4AF37',
                      textTransform: 'uppercase',
                    }}
                  >
                    SAL Draft
                  </span>
                  {reply.is_edited && (
                    <span
                      style={{
                        fontSize: '9px',
                        padding: '1px 6px',
                        borderRadius: '8px',
                        border: '1px solid #f59e0b44',
                        color: '#f59e0b',
                        backgroundColor: '#f59e0b11',
                      }}
                    >
                      edited
                    </span>
                  )}
                </div>
                {!isEditing && (
                  <button
                    onClick={handleEditStart}
                    style={{
                      fontSize: '11px',
                      color: '#8A8A85',
                      background: 'none',
                      border: '1px solid #2A2A2A',
                      borderRadius: '4px',
                      padding: '3px 10px',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={6}
                    style={{
                      width: '100%',
                      backgroundColor: '#1C1C1C',
                      borderLeft: '4px solid #D4AF37',
                      border: '1px solid #2A2A2A',
                      borderLeftWidth: '4px',
                      borderLeftColor: '#D4AF37',
                      padding: '14px 16px',
                      borderRadius: '0 6px 6px 0',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: '#F5F5F0',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      onClick={handleEditSave}
                      style={{
                        padding: '6px 16px',
                        backgroundColor: '#D4AF37',
                        color: '#0A0A0A',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleEditCancel}
                      style={{
                        padding: '6px 16px',
                        backgroundColor: 'transparent',
                        color: '#8A8A85',
                        border: '1px solid #2A2A2A',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: '#1C1C1C',
                    borderLeft: '4px solid #D4AF37',
                    padding: '14px 16px',
                    borderRadius: '0 6px 6px 0',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#F5F5F0',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {replyText}
                </div>
              )}

              {!isEditing && (
                <button
                  onClick={onRegenerate}
                  disabled={isGenerating}
                  style={{
                    marginTop: '8px',
                    fontSize: '11px',
                    color: isGenerating ? '#4A4A45' : '#8A8A85',
                    background: 'none',
                    border: 'none',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {isGenerating ? '↻ Regenerating...' : '↻ Regenerate'}
                </button>
              )}
            </div>

            {/* SAL REASONING */}
            {reasoning && (
              <div
                style={{
                  backgroundColor: '#141414',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  border: '1px solid #1E1E1E',
                }}
              >
                <div
                  style={{
                    fontSize: '9px',
                    fontWeight: '700',
                    letterSpacing: '0.1em',
                    color: '#4A4A45',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  SAL Reasoning
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#8A8A85',
                    fontStyle: 'italic',
                    lineHeight: '1.5',
                  }}
                >
                  {reasoning}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ACTION BUTTONS — fixed at bottom */}
      {reply && (
        <div
          style={{
            flexShrink: 0,
            padding: '16px 24px',
            borderTop: '1px solid #2A2A2A',
            backgroundColor: '#0A0A0A',
          }}
        >
          {isApproved ? (
            <div
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#22c55e22',
                border: '1px solid #22c55e44',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '700',
                color: '#22c55e',
              }}
            >
              ✓ Approved — Queued for posting
            </div>
          ) : isSkipped ? (
            <div
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#1C1C1C',
                border: '1px solid #2A2A2A',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '600',
                color: '#8A8A85',
              }}
            >
              Skipped
            </div>
          ) : (
            <>
              <button
                onClick={onApprove}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#D4AF37',
                  color: '#0A0A0A',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  transition: 'opacity 0.15s',
                }}
              >
                ✓ Approve &amp; Queue
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleEditStart}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: 'transparent',
                    color: '#8A8A85',
                    border: '1px solid #2A2A2A',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Edit Draft
                </button>
                <button
                  onClick={onSkip}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: 'transparent',
                    color: '#ef4444',
                    border: '1px solid #ef444444',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Skip
                </button>
              </div>
            </>
          )}
          <div
            style={{
              marginTop: '10px',
              fontSize: '10px',
              color: '#4A4A45',
              textAlign: 'center',
            }}
          >
            🔒 Posts via authenticated Chrome · No bot accounts · Idempotent
          </div>
        </div>
      )}
    </div>
  )
}
