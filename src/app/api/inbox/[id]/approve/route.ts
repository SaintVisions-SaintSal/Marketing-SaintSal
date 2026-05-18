import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const { error: inboxError } = await supabase
    .from('growth_inbox')
    .update({ status: 'approved' })
    .eq('id', id)

  if (inboxError) return NextResponse.json({ error: inboxError.message }, { status: 500 })

  const { error: replyError } = await supabase
    .from('growth_inbox_replies')
    .update({ post_status: 'queued' })
    .eq('inbox_id', id)
    .eq('is_active', true)

  if (replyError) return NextResponse.json({ error: replyError.message }, { status: 500 })

  // OpenClaw integration stub — queue for authenticated Chrome posting
  // TODO: emit event to OpenClaw worker

  return NextResponse.json({ success: true, status: 'approved' })
}
