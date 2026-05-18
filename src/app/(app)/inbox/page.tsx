'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import InboxList, { type InboxItem } from '@/components/inbox/InboxList'
import InboxDetail, { type InboxReply } from '@/components/inbox/InboxDetail'

export default function InboxPage() {
  const [items, setItems] = useState<InboxItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<InboxItem | null>(null)
  const [selectedReply, setSelectedReply] = useState<InboxReply | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  // Fetch all inbox items
  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/inbox')
      if (!res.ok) return
      const data = await res.json()
      setItems(data.items || [])
    } catch (err) {
      console.error('Failed to fetch inbox items', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch selected item detail
  const fetchDetail = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/inbox/${id}`)
      if (!res.ok) return
      const data = await res.json()
      setSelectedItem(data.item)
      setSelectedReply(data.reply)
    } catch (err) {
      console.error('Failed to fetch inbox detail', err)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  // Set up Supabase realtime subscription
  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const channel = supabase
      .channel('growth_inbox_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'growth_inbox' },
        () => {
          fetchItems()
          // Refresh detail if the changed item is selected
          if (selectedId) fetchDetail(selectedId)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchItems, fetchDetail, selectedId])

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId(id)
      fetchDetail(id)
    },
    [fetchDetail]
  )

  const handleApprove = useCallback(async () => {
    if (!selectedId) return
    await fetch(`/api/inbox/${selectedId}/approve`, { method: 'POST' })
    await fetchItems()
    await fetchDetail(selectedId)
  }, [selectedId, fetchItems, fetchDetail])

  const handleSkip = useCallback(async () => {
    if (!selectedId) return
    await fetch(`/api/inbox/${selectedId}/skip`, { method: 'POST' })
    await fetchItems()
    await fetchDetail(selectedId)
  }, [selectedId, fetchItems, fetchDetail])

  const handleGenerateDraft = useCallback(async () => {
    if (!selectedId) return
    setIsGenerating(true)
    try {
      await fetch(`/api/inbox/${selectedId}/draft`, { method: 'POST' })
      await fetchDetail(selectedId)
    } catch (err) {
      console.error('Failed to generate draft', err)
    } finally {
      setIsGenerating(false)
    }
  }, [selectedId, fetchDetail])

  const handleRegenerate = useCallback(async () => {
    if (!selectedId) return
    setIsGenerating(true)
    try {
      await fetch(`/api/inbox/${selectedId}/draft`, { method: 'POST' })
      await fetchDetail(selectedId)
    } catch (err) {
      console.error('Failed to regenerate draft', err)
    } finally {
      setIsGenerating(false)
    }
  }, [selectedId, fetchDetail])

  const handleSaveEdit = useCallback(
    async (text: string) => {
      if (!selectedId || !selectedReply) return
      await fetch(`/api/inbox/${selectedId}/draft/${selectedReply.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply_content: text }),
      })
      await fetchDetail(selectedId)
    },
    [selectedId, selectedReply, fetchDetail]
  )

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#8A8A85',
          fontSize: '14px',
        }}
      >
        Loading inbox...
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: 'calc(100vh - 120px)',
        overflow: 'hidden',
        margin: '-24px -20px',
      }}
    >
      <InboxList items={items} selectedId={selectedId} onSelect={handleSelect} />
      <InboxDetail
        item={selectedItem}
        reply={selectedReply}
        onApprove={handleApprove}
        onSkip={handleSkip}
        onRegenerate={handleRegenerate}
        onSaveEdit={handleSaveEdit}
        onGenerateDraft={handleGenerateDraft}
        isGenerating={isGenerating}
      />
    </div>
  )
}
