import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/inbox'

  if (code) {
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
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // ignore in Server Component context
            }
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const user = data.user

      // Determine permissions for this user
      const isOperator = user.email === 'lalie@cookin.io'
      const permissions = isOperator
        ? {
            role: 'operator',
            can_chat: true,
            can_manage_agents: true,
            can_view_analytics: true,
            can_manage_team: true,
            can_launch: true,
          }
        : {
            role: 'member',
            can_chat: true,
            can_manage_agents: false,
            can_view_analytics: false,
            can_manage_team: false,
            can_launch: false,
          }

      // Auto-insert into growth_users if not already present
      await supabase
        .from('growth_users')
        .upsert(
          {
            id: user.id,
            email: user.email,
            created_at: new Date().toISOString(),
            ...permissions,
          },
          { onConflict: 'id', ignoreDuplicates: true }
        )

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to login on error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
