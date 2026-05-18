import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getAgent } from '@/lib/agents'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sessionId, agentId, message } = await request.json()

  const agent = getAgent(agentId)
  if (!agent) return NextResponse.json({ error: 'Unknown agent' }, { status: 400 })

  // Load session history (last 50 messages)
  let historyMessages: Array<{ role: 'user' | 'assistant'; content: string }> = []

  let resolvedSessionId = sessionId

  if (sessionId) {
    const { data: msgs } = await supabase
      .from('growth_chat_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(50)
    historyMessages = (msgs || []) as typeof historyMessages
  } else {
    // Create new session
    const { data: session } = await supabase
      .from('growth_chat_sessions')
      .insert({
        user_id: user.id,
        agent_id: agentId,
        title: message.slice(0, 60),
      })
      .select()
      .single()
    resolvedSessionId = session?.id
  }

  // Save user message
  await supabase.from('growth_chat_messages').insert({
    session_id: resolvedSessionId,
    user_id: user.id,
    agent_id: agentId,
    role: 'user',
    content: message,
  })

  // Call Claude
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const modelMap: Record<string, string> = {
    'Claude Opus 4.7': 'claude-opus-4-7',
    'Claude Sonnet 4.6': 'claude-sonnet-4-6',
    'Claude Haiku 4.5': 'claude-haiku-4-5-20251001',
  }
  const model = modelMap[agent.engine] || 'claude-sonnet-4-6'

  const completion = await anthropic.messages.create({
    model,
    max_tokens: 1024,
    system: agent.systemPrompt,
    messages: [
      ...historyMessages,
      { role: 'user', content: message },
    ],
  })

  const assistantMessage =
    completion.content[0].type === 'text' ? completion.content[0].text : ''

  // Save assistant message
  await supabase.from('growth_chat_messages').insert({
    session_id: resolvedSessionId,
    user_id: user.id,
    agent_id: agentId,
    role: 'assistant',
    content: assistantMessage,
  })

  return NextResponse.json({
    message: assistantMessage,
    sessionId: resolvedSessionId,
  })
}
