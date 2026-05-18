'use client'

import { useState, useEffect, useCallback } from 'react'

interface PHRecord {
  id: string
  launch_date: string | null
  checklist: Record<string, boolean>
}

const WEEKS = [
  {
    key: 'week1',
    title: 'Week 1 — Foundation',
    subtitle: '6 weeks out',
    items: [
      'Set Product Hunt launch date (Tuesday)',
      'Create/optimize PH profile and maker account',
      'Define tagline (under 60 chars, benefit + differentiator)',
      'Screenshot gallery ready (5 images minimum)',
      'Demo video recorded (60-90 seconds)',
      'First comment drafted',
    ],
  },
  {
    key: 'week2',
    title: 'Week 2 — Hunter & Community',
    subtitle: '5 weeks out',
    items: [
      'Identify top PH hunter with relevant audience',
      'Warm intro to hunter secured',
      'Reached out to 50+ supporters for day-of upvotes',
      'Built email list segment for PH day announcement',
      'Engaged in PH community for 2+ weeks',
    ],
  },
  {
    key: 'week3',
    title: 'Week 3 — Assets & Copy',
    subtitle: '4 weeks out',
    items: [
      'Product description finalized (250 chars)',
      'All gallery images designed and formatted',
      'Pricing page ready and linked',
      'Social assets created for launch day sharing',
      'Maker comment pre-written and ready',
    ],
  },
  {
    key: 'week4',
    title: 'Week 4 — Validation & Beta',
    subtitle: '3 weeks out',
    items: [
      'Beta users providing testimonials',
      '3+ authentic reviews collected',
      'Live demo endpoint working',
      'Any press mentions secured or in progress',
      'SEO/landing page optimized',
    ],
  },
  {
    key: 'week5',
    title: 'Week 5 — Pre-Launch Warm-Up',
    subtitle: '2 weeks out',
    items: [
      '"Coming soon" teaser posted across all platforms',
      'Twitter/X thread about the build story drafted',
      'Email sequence scheduled for launch day',
      'All supporters reminded and committed',
      'Backup plan if hunter falls through',
    ],
  },
  {
    key: 'week6',
    title: 'Week 6 — Launch Week Prep',
    subtitle: '1 week out',
    items: [
      'Submitted to PH (goes live at 12:01 AM PST Tuesday)',
      'All social posts scheduled for launch day',
      'Slack/Discord/community posts ready',
      'Customer support ready for traffic spike',
      'Team briefed on launch day roles',
    ],
  },
  {
    key: 'launch',
    title: 'Launch Day',
    subtitle: 'Go time',
    items: [
      'Posted at exactly 12:01 AM PST Tuesday',
      'Maker comment posted immediately',
      'First personal outreach wave sent (top 20 supporters)',
      'Monitoring upvote count every 30 minutes',
      'Responding to every comment within 15 minutes',
      'Social posts going live on schedule',
    ],
  },
]

function getItemKey(weekKey: string, idx: number) {
  return `${weekKey}-item-${idx}`
}

function computeCountdown(launchDate: string | null): { days: number; hours: number; minutes: number } | null {
  if (!launchDate) return null
  const target = new Date(launchDate).getTime()
  const now = Date.now()
  const diff = target - now
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return { days, hours, minutes }
}

export default function ProductHunt() {
  const [record, setRecord] = useState<PHRecord | null>(null)
  const [dateInput, setDateInput] = useState('')
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number } | null>(null)
  const [openWeeks, setOpenWeeks] = useState<Record<string, boolean>>({ week1: true })
  const [saving, setSaving] = useState(false)

  const loadRecord = useCallback(async () => {
    const res = await fetch('/api/launch/ph')
    if (!res.ok) return
    const data = await res.json()
    setRecord(data.record)
    if (data.record?.launch_date) {
      setDateInput(data.record.launch_date.split('T')[0])
      setCountdown(computeCountdown(data.record.launch_date))
    }
  }, [])

  useEffect(() => {
    loadRecord()
  }, [loadRecord])

  useEffect(() => {
    const interval = setInterval(() => {
      if (record?.launch_date) {
        setCountdown(computeCountdown(record.launch_date))
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [record?.launch_date])

  const handleSetDate = async () => {
    if (!dateInput) return
    setSaving(true)
    const res = await fetch('/api/launch/ph', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ launch_date: dateInput }),
    })
    if (res.ok) {
      const data = await res.json()
      setRecord(data.record)
      setCountdown(computeCountdown(data.record.launch_date))
    }
    setSaving(false)
  }

  const handleCheck = async (weekKey: string, idx: number, checked: boolean) => {
    if (!record) return
    const key = getItemKey(weekKey, idx)
    const newChecklist = { ...record.checklist, [key]: checked }
    setRecord({ ...record, checklist: newChecklist })
    await fetch('/api/launch/ph', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checklist: newChecklist }),
    })
  }

  const totalItems = WEEKS.reduce((acc, w) => acc + w.items.length, 0)
  const completedItems = WEEKS.reduce((acc, w) => {
    return acc + w.items.filter((_, idx) => record?.checklist?.[getItemKey(w.key, idx)]).length
  }, 0)
  const progressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  const toggleWeek = (key: string) => {
    setOpenWeeks((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Top 3 cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        {/* Launch Date card */}
        <div style={{
          backgroundColor: '#141414',
          border: '1px solid #D4AF37',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{ color: '#8A8A85', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Launch Date</div>
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            style={{
              backgroundColor: '#1C1C1C',
              border: '1px solid #2A2A2A',
              borderRadius: '4px',
              color: '#F5F5F0',
              padding: '6px 10px',
              fontSize: '14px',
              width: '100%',
              textAlign: 'center',
            }}
          />
          <button
            onClick={handleSetDate}
            disabled={saving}
            style={{
              backgroundColor: '#D4AF37',
              color: '#0A0A0A',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 16px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              width: '100%',
            }}
          >
            {saving ? 'Saving...' : 'Set Date'}
          </button>
        </div>

        {/* Countdown card */}
        <div style={{
          backgroundColor: '#141414',
          border: '1px solid #2A2A2A',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div style={{ color: '#8A8A85', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Countdown</div>
          {countdown ? (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
              {[
                { val: countdown.days, label: 'days' },
                { val: countdown.hours, label: 'hrs' },
                { val: countdown.minutes, label: 'min' },
              ].map(({ val, label }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: '#D4AF37', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: '11px', color: '#8A8A85', marginTop: '4px' }}>{label}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#8A8A85', fontSize: '13px', textAlign: 'center' }}>Set your launch date →</div>
          )}
        </div>

        {/* Progress card */}
        <div style={{
          backgroundColor: '#141414',
          border: '1px solid #2A2A2A',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <div style={{ color: '#8A8A85', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Progress</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#F5F5F0' }}>
            {completedItems}/{totalItems}
            <span style={{ fontSize: '13px', color: '#8A8A85', fontWeight: 400, marginLeft: '6px' }}>items</span>
          </div>
          <div style={{ backgroundColor: '#2A2A2A', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
            <div style={{
              backgroundColor: '#D4AF37',
              height: '100%',
              width: `${progressPct}%`,
              transition: 'width 0.3s ease',
            }} />
          </div>
          <div style={{ color: '#8A8A85', fontSize: '12px' }}>{progressPct}% ready</div>
        </div>
      </div>

      {/* Checklist accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {WEEKS.map((week) => {
          const weekCompleted = week.items.filter((_, idx) => record?.checklist?.[getItemKey(week.key, idx)]).length
          const weekTotal = week.items.length
          const allDone = weekCompleted === weekTotal
          const someDone = weekCompleted > 0 && !allDone
          const headerColor = allDone ? '#22c55e' : someDone ? '#D4AF37' : '#8A8A85'
          const isOpen = openWeeks[week.key]

          return (
            <div key={week.key} style={{
              backgroundColor: '#141414',
              border: '1px solid #2A2A2A',
              borderRadius: '8px',
              overflow: 'hidden',
            }}>
              <button
                onClick={() => toggleWeek(week.key)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ color: '#F5F5F0', fontSize: '14px', fontWeight: 600 }}>{week.title}</span>
                  <span style={{ color: '#8A8A85', fontSize: '12px' }}>{week.subtitle}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: headerColor, fontSize: '13px', fontWeight: 600 }}>
                    {weekCompleted}/{weekTotal}
                  </span>
                  <span style={{ color: '#8A8A85', fontSize: '16px' }}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {isOpen && (
                <div style={{ padding: '0 16px 16px', borderTop: '1px solid #2A2A2A' }}>
                  {week.items.map((item, idx) => {
                    const key = getItemKey(week.key, idx)
                    const checked = record?.checklist?.[key] ?? false
                    return (
                      <label
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 0',
                          borderBottom: idx < week.items.length - 1 ? '1px solid #1C1C1C' : 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => handleCheck(week.key, idx, e.target.checked)}
                          style={{ accentColor: '#D4AF37', width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <span style={{
                          color: checked ? '#8A8A85' : '#F5F5F0',
                          fontSize: '13px',
                          textDecoration: checked ? 'line-through' : 'none',
                          transition: 'color 0.15s',
                        }}>
                          {item}
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
