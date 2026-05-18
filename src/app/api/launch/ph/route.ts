import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('growth_ph_launches')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (!data) {
    // Create a seed row if none exists
    const { data: created, error: createError } = await supabase
      .from('growth_ph_launches')
      .insert({
        launch_date: null,
        checklist: {},
      })
      .select()
      .single()

    if (createError) return NextResponse.json({ error: createError.message }, { status: 500 })
    return NextResponse.json({ record: created })
  }

  return NextResponse.json({ record: data })
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  // Get the latest row id
  const { data: latest, error: fetchError } = await supabase
    .from('growth_ph_launches')
    .select('id')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

  if (!latest) {
    return NextResponse.json({ error: 'No launch record found' }, { status: 404 })
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (body.checklist !== undefined) updates.checklist = body.checklist
  if (body.launch_date !== undefined) updates.launch_date = body.launch_date

  const { data, error } = await supabase
    .from('growth_ph_launches')
    .update(updates)
    .eq('id', latest.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ record: data })
}
