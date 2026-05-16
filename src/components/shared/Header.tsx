'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface HeaderProps {
  user: User | null
}

function getUserInitials(user: User | null): string {
  if (!user) return 'U'
  const email = user.email ?? ''
  const name = (user.user_metadata?.full_name as string | undefined) ?? ''
  if (name) {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return parts[0][0].toUpperCase()
  }
  return email.charAt(0).toUpperCase()
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initials = getUserInitials(user)

  return (
    <div>
      {/* Main header bar */}
      <header
        style={{
          height: '64px',
          backgroundColor: '#141414',
          borderBottom: '1px solid #2A2A2A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '20px',
          paddingRight: '20px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        {/* Left: Logo + Brand name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#D4AF37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 700,
              color: '#0A0A0A',
              flexShrink: 0,
            }}
          >
            S
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span
              style={{
                color: '#F5F5F0',
                fontWeight: 600,
                fontSize: '15px',
                letterSpacing: '0.01em',
                whiteSpace: 'nowrap',
              }}
            >
              SaintSal Growth Command
            </span>
            <span
              style={{
                color: '#8A8A85',
                fontSize: '11px',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
              }}
            >
              · Saint Vision Technologies · HACP™
            </span>
          </div>
        </div>

        {/* Right: SAL status + user avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className="pulse-dot"
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#22C55E',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: '#8A8A85',
                fontSize: '12px',
                letterSpacing: '0.03em',
                whiteSpace: 'nowrap',
              }}
            >
              SAL · 11 agents online
            </span>
          </div>

          {/* User avatar / sign out */}
          <button
            onClick={handleSignOut}
            title="Sign out"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#D4AF37',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              color: '#0A0A0A',
              flexShrink: 0,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.8')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
          >
            {initials}
          </button>
        </div>
      </header>

      {/* Gold gradient banner */}
      <div
        style={{
          backgroundColor: '#141414',
          borderBottom: '1px solid #2A2A2A',
          padding: '5px 20px',
          textAlign: 'center',
          position: 'sticky',
          top: '64px',
          zIndex: 49,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: 'linear-gradient(90deg, #9A7E1F, #D4AF37, #F4D03F, #D4AF37, #9A7E1F)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Responsible Intelligence · Configurable safeguards as enablers, not blockers
        </div>
      </div>
    </div>
  )
}
