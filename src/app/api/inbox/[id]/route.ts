import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const { data: item, error: itemError } = await supabase
    .from('growth_inbox')
    .select('*')
    .eq('id', id)
    .single()

  if (itemError) return NextResponse.json({ error: itemError.message }, { status: 404 })

  const { data: reply } = await supabase
    .from('growth_inbox_replies')
    .select('*')
    .eq('inbox_id', id)
    .eq('is_active', true)
    .single()

  return NextResponse.json({ item, reply: reply ?? null })
}
