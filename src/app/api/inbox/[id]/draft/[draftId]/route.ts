import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; draftId: string }> }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { draftId } = await params
  const { reply_content } = await request.json()

  if (!reply_content || typeof reply_content !== 'string') {
    return NextResponse.json({ error: 'reply_content is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('growth_inbox_replies')
    .update({ reply_content, is_edited: true })
    .eq('id', draftId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ reply: data })
}
