'use client'

import { useState, useEffect, useCallback } from 'react'

interface Contact {
  id: string
  name: string
  type: string
  status: string
  notes: string
  priority: string
  updated_at: string
}

const TYPE_ICONS: Record<string, string> = {
  investor: '💰',
  attorney: '⚖️',
  press: '📰',
  enterprise: '🏢',
  partner: '🤝',
  other: '👤',
}

const STATUS_COLORS: Record<string, string> = {
  cold: '#8A8A85',
  outreach: '#3b82f6',
  engaged: '#D4AF37',
  committed: '#22c55e',
  closed: '#4A4A45',
}

const PRIORITY_STYLES: Record<string, { color: string; label: string }> = {
  high: { color: '#D4AF37', label: 'HIGH' },
  medium: { color: '#8A8A85', label: 'MED' },
  low: { color: '#4A4A45', label: 'LOW' },
}

export default function VCVisibility() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'investor',
    status: 'cold',
    priority: 'medium',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const loadContacts = useCallback(async () => {
    const res = await fetch('/api/launch/visibility')
    if (!res.ok) return
    const data = await res.json()
    setContacts(data.contacts || [])
  }, [])

  useEffect(() => {
    loadContacts()
  }, [loadContacts])

  const handleAdd = async () => {
    if (!formData.name.trim()) return
    setSubmitting(true)
    const res = await fetch('/api/launch/visibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    if (res.ok) {
      await loadContacts()
      setFormData({ name: '', type: 'investor', status: 'cold', priority: 'medium', notes: '' })
      setShowForm(false)
    }
    setSubmitting(false)
  }

  const handleStatusChange = async (id: string, status: string) => {
    setContacts((prev) => prev.map((c) => c.id === id ? { ...c, status } : c))
    await fetch(`/api/launch/visibility/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  const handleDelete = async (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id))
    await fetch(`/api/launch/visibility/${id}`, { method: 'DELETE' })
  }

  // Summary counts
  const investors = contacts.filter((c) => c.type === 'investor')
  const attorneys = contacts.filter((c) => c.type === 'attorney')
  const press = contacts.filter((c) => c.type === 'press')
  const enterprise = contacts.filter((c) => c.type === 'enterprise')

  const inputStyle = {
    backgroundColor: '#1C1C1C',
    border: '1px solid #2A2A2A',
    borderRadius: '4px',
    color: '#F5F5F0',
    padding: '6px 10px',
    fontSize: '13px',
    width: '100%',
  }

  const selectStyle = { ...inputStyle }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Investors', count: investors.length, sub: `${investors.filter((c) => c.status === 'committed').length} committed`, subColor: '#22c55e' },
          { label: 'Attorneys', count: attorneys.length, sub: `${attorneys.filter((c) => c.status === 'engaged').length} engaged`, subColor: '#D4AF37' },
          { label: 'Press', count: press.length, sub: `${press.filter((c) => c.status === 'engaged').length} engaged`, subColor: '#D4AF37' },
          { label: 'Enterprise', count: enterprise.length, sub: 'pipeline', subColor: '#8A8A85' },
        ].map(({ label, count, sub, subColor }) => (
          <div key={label} style={{
            backgroundColor: '#141414',
            border: '1px solid #2A2A2A',
            borderRadius: '8px',
            padding: '16px',
          }}>
            <div style={{ color: '#8A8A85', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#F5F5F0', lineHeight: 1 }}>{count}</div>
            <div style={{ color: subColor, fontSize: '12px', marginTop: '4px' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Add Contact */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            backgroundColor: showForm ? '#1C1C1C' : '#D4AF37',
            color: showForm ? '#F5F5F0' : '#0A0A0A',
            border: '1px solid #2A2A2A',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: showForm ? '12px' : '0',
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add Contact'}
        </button>

        {showForm && (
          <div style={{
            backgroundColor: '#141414',
            border: '1px solid #2A2A2A',
            borderRadius: '8px',
            padding: '16px',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '12px',
            alignItems: 'end',
          }}>
            <div>
              <label style={{ color: '#8A8A85', fontSize: '11px', display: 'block', marginBottom: '4px' }}>Name</label>
              <input
                type="text"
                placeholder="Contact name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ color: '#8A8A85', fontSize: '11px', display: 'block', marginBottom: '4px' }}>Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={selectStyle}>
                <option value="investor">Investor</option>
                <option value="attorney">Attorney</option>
                <option value="press">Press</option>
                <option value="enterprise">Enterprise</option>
                <option value="partner">Partner</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label style={{ color: '#8A8A85', fontSize: '11px', display: 'block', marginBottom: '4px' }}>Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={selectStyle}>
                <option value="cold">Cold</option>
                <option value="outreach">Outreach</option>
                <option value="engaged">Engaged</option>
                <option value="committed">Committed</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label style={{ color: '#8A8A85', fontSize: '11px', display: 'block', marginBottom: '4px' }}>Priority</label>
              <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} style={selectStyle}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / 4' }}>
              <label style={{ color: '#8A8A85', fontSize: '11px', display: 'block', marginBottom: '4px' }}>Notes</label>
              <textarea
                placeholder="Notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <button
                onClick={handleAdd}
                disabled={submitting}
                style={{
                  backgroundColor: '#D4AF37',
                  color: '#0A0A0A',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                  width: '100%',
                }}
              >
                {submitting ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contact Table */}
      <div style={{
        backgroundColor: '#141414',
        border: '1px solid #2A2A2A',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2A2A2A' }}>
              {['Name', 'Type', 'Status', 'Priority', 'Notes', 'Actions'].map((col) => (
                <th key={col} style={{
                  padding: '10px 14px',
                  textAlign: 'left',
                  color: '#8A8A85',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#8A8A85', fontSize: '13px' }}>
                  No contacts yet. Add your first contact above.
                </td>
              </tr>
            ) : contacts.map((contact, i) => (
              <tr key={contact.id} style={{
                borderBottom: i < contacts.length - 1 ? '1px solid #1C1C1C' : 'none',
              }}>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ color: '#F5F5F0', fontSize: '14px', fontWeight: 600 }}>{contact.name}</span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span title={contact.type} style={{ fontSize: '18px' }}>
                    {TYPE_ICONS[contact.type] || '👤'}
                  </span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <select
                    value={contact.status}
                    onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                    style={{
                      backgroundColor: '#1C1C1C',
                      border: `1px solid ${STATUS_COLORS[contact.status] || '#2A2A2A'}`,
                      borderRadius: '4px',
                      color: STATUS_COLORS[contact.status] || '#F5F5F0',
                      padding: '4px 8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="cold">Cold</option>
                    <option value="outreach">Outreach</option>
                    <option value="engaged">Engaged</option>
                    <option value="committed">Committed</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  {contact.priority && PRIORITY_STYLES[contact.priority] ? (
                    <span style={{
                      color: PRIORITY_STYLES[contact.priority].color,
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                    }}>
                      {PRIORITY_STYLES[contact.priority].label}
                    </span>
                  ) : (
                    <span style={{ color: '#8A8A85', fontSize: '11px' }}>—</span>
                  )}
                </td>
                <td style={{ padding: '12px 14px', maxWidth: '200px' }}>
                  <span
                    title={contact.notes || ''}
                    style={{
                      color: '#8A8A85',
                      fontSize: '12px',
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {contact.notes || '—'}
                  </span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    title="Delete contact"
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid #ef4444',
                      borderRadius: '4px',
                      color: '#ef4444',
                      padding: '4px 8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
