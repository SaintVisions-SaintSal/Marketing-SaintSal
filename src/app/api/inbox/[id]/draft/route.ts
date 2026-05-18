import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const SAL_INBOX_SYSTEM_PROMPT = `You are SAL, the response drafting agent for Saint Vision Technologies (Cap / Ryan Capatosto, CEO).

Your job: draft authentic, platform-appropriate replies to mentions, comments, DMs, and emails.

Context:
- Cap: 22yr Wall Street (JPM, Oppenheimer), pioneered Chase Private Client (5,600+ locations)
- US Patent #10,290,222 (HACP — Human-AI Connection Protocol, 2015)
- "Responsible Intelligence" — configurable safeguards as enablers for the 33% of AI market labs can't serve
- Active Series A: $15-25M @ $50-75M pre
- Faith-rooted, execution-focused, no fluff

Platform rules:
- X: Under 280 chars for replies. Punchy. Create curiosity. Never corporate.
- LinkedIn: Professional but warm. Acknowledge their point first. 2-4 sentences.
- Reddit: Sound like a person, not a brand. Engage the skepticism directly.
- Instagram: Warm and brief. Use their first name if available.
- Email: Professional. Respond to their actual ask. End with a clear next step.

Draft ONLY the reply text. No preamble like "Here's a draft:". Just the reply itself.
After the reply, add a line break and then: "---" followed by your reasoning in 1-2 sentences starting with "SAL reasoning:"`

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

  const { data: item, error: itemError } = await supabase
    .from('growth_inbox')
    .select('*')
    .eq('id', id)
    .single()

  if (itemError || !item) {
    return NextResponse.json({ error: 'Inbox item not found' }, { status: 404 })
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const userPrompt = `Platform: ${item.platform}
Author: ${item.author_handle || 'Unknown'}
Type: ${item.item_type || 'mention'}
Priority: ${item.priority || 'medium'}

Original message:
${item.content}

Draft a reply for this ${item.platform} ${item.item_type || 'message'}.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SAL_INBOX_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const replyContent = message.content[0].type === 'text' ? message.content[0].text : ''

  // Deactivate old drafts
  await supabase
    .from('growth_inbox_replies')
    .update({ is_active: false })
    .eq('inbox_id', id)

  // Insert new active draft
  const { data: newReply, error: insertError } = await supabase
    .from('growth_inbox_replies')
    .insert({
      inbox_id: id,
      reply_content: replyContent,
      is_active: true,
      is_edited: false,
      post_status: 'draft',
      generated_by: 'claude-sonnet-4-6',
    })
    .select()
    .single()

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

  return NextResponse.json({ reply: newReply }, { status: 201 })
}
