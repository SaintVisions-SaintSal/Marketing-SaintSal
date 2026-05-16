'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push('/inbox')
    router.refresh()
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#141414',
          border: '1px solid #2A2A2A',
          borderRadius: '12px',
          padding: '40px',
        }}
      >
        {/* Gold S Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#D4AF37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '24px',
              fontWeight: 700,
              color: '#0A0A0A',
              letterSpacing: '-0.5px',
            }}
          >
            S
          </div>
          <h1
            style={{
              color: '#D4AF37',
              fontSize: '20px',
              fontWeight: 600,
              margin: '0 0 8px',
              letterSpacing: '0.01em',
            }}
          >
            SaintSal Growth Command
          </h1>
          <p
            style={{
              color: '#8A8A85',
              fontSize: '12px',
              margin: 0,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Responsible Intelligence · Saint Vision Technologies
          </p>
        </div>

        {/* Sign-in form */}
        <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                color: '#8A8A85',
                fontSize: '12px',
                fontWeight: 500,
                marginBottom: '6px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: '100%',
                backgroundColor: '#1C1C1C',
                border: '1px solid #2A2A2A',
                borderRadius: '6px',
                padding: '10px 12px',
                color: '#F5F5F0',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#D4AF37')}
              onBlur={(e) => (e.target.style.borderColor = '#2A2A2A')}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                color: '#8A8A85',
                fontSize: '12px',
                fontWeight: 500,
                marginBottom: '6px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                backgroundColor: '#1C1C1C',
                border: '1px solid #2A2A2A',
                borderRadius: '6px',
                padding: '10px 12px',
                color: '#F5F5F0',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#D4AF37')}
              onBlur={(e) => (e.target.style.borderColor = '#2A2A2A')}
            />
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                padding: '10px 12px',
                color: '#F87171',
                fontSize: '13px',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#9A7E1F' : '#D4AF37',
              color: '#0A0A0A',
              border: 'none',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.02em',
              transition: 'background-color 0.15s',
              marginTop: '4px',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            color: '#8A8A85',
            fontSize: '11px',
            letterSpacing: '0.05em',
          }}
        >
          HACP™ · US Patent #10,290,222
        </div>
      </div>
    </div>
  )
}
